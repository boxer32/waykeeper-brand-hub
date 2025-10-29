import OpenAI from "openai";
import sharp from "sharp";
import * as exifr from "exifr";
import { BRAND } from "@/lib/brand-config";
import { SECTION_WEIGHTS } from "@/lib/scoring";
import type { BrandImageReport } from "@/types/brand-image-report";

export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---------- Tools (function calling) ----------
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "calc_contrast_ratio",
      description: "Return WCAG contrast ratio between two hex colors.",
      parameters: {
        type: "object",
        properties: { fg: { type: "string" }, bg: { type: "string" } },
        required: ["fg", "bg"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "nearest_brand_color",
      description:
        "Given a hex color, return nearest brand color (by simple distance).",
      parameters: {
        type: "object",
        properties: { hex: { type: "string" } },
        required: ["hex"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "measure_logo_height",
      description:
        "Given [x,y,w,h] bbox of detected logo, return height (px) and pass/fail vs minHeight.",
      parameters: {
        type: "object",
        properties: {
          bbox: {
            type: "array",
            items: { type: "number" },
            description: "[x,y,w,h]",
          },
          minHeightPx: { type: "number" },
        },
        required: ["bbox", "minHeightPx"],
      },
    },
  },
];

function hexToLuminance(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const srgb = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  return L;
}

function contrastRatio(fg: string, bg: string) {
  const L1 = hexToLuminance(fg);
  const L2 = hexToLuminance(bg);
  const [a, b] = [L1, L2].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

function nearestBrandColor(hex: string) {
  const toRGB = (h: string) => {
    const c = h.replace("#", "");
    return {
      r: parseInt(c.slice(0, 2), 16),
      g: parseInt(c.slice(2, 4), 16),
      b: parseInt(c.slice(4, 6), 16),
    };
  };
  const t = toRGB(hex);
  let best = { name: "", hex: "", dist: Infinity };
  for (const p of BRAND.palette) {
    const q = toRGB(p.hex);
    const d =
      (t.r - q.r) ** 2 + (t.g - q.g) ** 2 + (t.b - q.b) ** 2; // Euclidean RGB
    if (d < best.dist) best = { name: p.name, hex: p.hex, dist: d };
  }
  return { nearest: best.name, hex: best.hex, distance: Math.sqrt(best.dist) };
}

function measureLogoHeight(bbox: number[], minHeightPx: number) {
  const h = Math.round(bbox[3]);
  return { heightPx: h, pass: h >= minHeightPx };
}

async function toolRouter(name: string, args: any) {
  if (name === "calc_contrast_ratio") {
    const ratio = contrastRatio(args.fg, args.bg);
    return {
      ratio,
      passNormal: ratio >= BRAND.wcag.normalRatio,
      passLarge: ratio >= BRAND.wcag.largeRatio,
    };
  }
  if (name === "nearest_brand_color") {
    return nearestBrandColor(args.hex);
  }
  if (name === "measure_logo_height") {
    return measureLogoHeight(args.bbox, args.minHeightPx);
  }
  return {};
}

// ---------- Read metadata from upload buffer ----------
async function readImageMeta(buf: Buffer) {
  const s = sharp(buf, { failOn: "none" });
  const meta = await s.metadata();
  // exif (บางไฟล์)
  let exif: any = undefined;
  try {
    exif = await exifr.parse(buf, { 
      translateValues: true,
      mergeOutput: false,
      tiff: true,
      xmp: true,
      icc: true,
      jfif: true,
      ihdr: true
    });
  } catch {}
  
  return {
    width: meta.width,
    height: meta.height,
    dpi: meta.density,
    iccProfile: meta.icc ? "present" : undefined,
    colorSpace: meta.space || exif?.ColorSpace || undefined,
    exif: exif
      ? {
        // ข้อมูลกล้อง
        cameraMake: exif.Make,
        cameraModel: exif.Model,
        lensModel: exif.LensModel,
        lensMake: exif.LensMake,
        
        // ข้อมูลการถ่ายภาพ
        dateTimeOriginal: exif.DateTimeOriginal?.toISOString?.() || undefined,
        dateTimeDigitized: exif.DateTimeDigitized?.toISOString?.() || undefined,
        dateTime: exif.DateTime?.toISOString?.() || undefined,
        
        // การตั้งค่ากล้อง
        fNumber: exif.FNumber,
        exposureTime: exif.ExposureTime,
        iso: exif.ISO,
        focalLength: exif.FocalLength,
        flash: exif.Flash,
        whiteBalance: exif.WhiteBalance,
        meteringMode: exif.MeteringMode,
        exposureMode: exif.ExposureMode,
        sceneCaptureType: exif.SceneCaptureType,
        
        // ข้อมูลภาพ
        orientation: exif.Orientation?.toString(),
        resolution: exif.XResolution ? `${exif.XResolution} x ${exif.YResolution}` : undefined,
        colorSpace: exif.ColorSpace,
        
        // ข้อมูล GPS
        gps: exif.latitude
          ? { 
              lat: exif.latitude, 
              lng: exif.longitude,
              altitude: exif.altitude,
              timestamp: exif.GPSTimestamp
            }
          : undefined,
          
        // ข้อมูลเพิ่มเติม
        software: exif.Software,
        artist: exif.Artist,
        copyright: exif.Copyright,
        imageDescription: exif.ImageDescription,
        
        // ข้อมูลเทคนิค
        compression: exif.Compression,
        photometricInterpretation: exif.PhotometricInterpretation,
        samplesPerPixel: exif.SamplesPerPixel,
        bitsPerSample: exif.BitsPerSample,
        planarConfiguration: exif.PlanarConfiguration,
        
        // ข้อมูลการประมวลผล
        contrast: exif.Contrast,
        saturation: exif.Saturation,
        sharpness: exif.Sharpness,
        brightness: exif.BrightnessValue,
        exposureBias: exif.ExposureBiasValue,
        
        // ข้อมูลเลนส์
        focalLengthIn35mm: exif.FocalLengthIn35mmFilm,
        maxApertureValue: exif.MaxApertureValue,
        
        // ข้อมูลแสง
        lightSource: exif.LightSource,
        flashEnergy: exif.FlashEnergy,
        subjectDistance: exif.SubjectDistance,
        
        // ข้อมูลการวัดแสง
        exposureProgram: exif.ExposureProgram,
        spectralSensitivity: exif.SpectralSensitivity,
        
        // ข้อมูลอื่นๆ
        subsecTime: exif.SubsecTime,
        subsecTimeOriginal: exif.SubsecTimeOriginal,
        subsecTimeDigitized: exif.SubsecTimeDigitized,
      }
      : undefined,
  };
}

// ---------- Score helper ----------
function scoreFromItems(items: any[]) {
  // ให้ 100 ถ้าผ่านทั้งหมด, 0 ถ้าตกทั้งหมด, เฉลี่ยถ่วงน้ำหนักย่อยถ้ามี
  const weighted = items.map((it) => {
    const w = typeof it.weight === "number" ? it.weight : 1;
    const v = it.pass === true ? 1 : it.pass === false ? 0 : 0.5;
    return { w, v };
  });
  const W = weighted.reduce((a, b) => a + b.w, 0) || 1;
  const V = weighted.reduce((a, b) => a + b.w * b.v, 0) / W;
  return Math.round(V * 100);
}

// ---------- Route ----------
export async function POST(req: Request) {
  try {
    // multipart/form-data (ไฟล์อัปโหลด) หรือ JSON { imageUrl, fileName? }
    const contentType = req.headers.get("content-type") || "";
    let fileName = "upload.png";
    let mime = "image/png";
    let sizeBytes: number | undefined;
    let buffer: Buffer;

    // ประกาศ clientMetadata ไว้นอก scope
    let clientMetadata = null;

    // Check if it's multipart/form-data (could be with boundary)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const metadataString = formData.get("metadata") as string;
      
      if (!file) return Response.json({ error: "Missing file" }, { status: 400 });
      fileName = file.name || fileName;
      mime = file.type || mime;
      sizeBytes = file.size;
      buffer = Buffer.from(await file.arrayBuffer());
      
      // อ่าน metadata ที่ส่งมาจากฝั่งเว็บ
      if (metadataString) {
        try {
          clientMetadata = JSON.parse(metadataString);
          console.log('📊 Client metadata received:', clientMetadata);
        } catch (error) {
          console.warn('Failed to parse client metadata:', error);
        }
      }
    } else {
      const { imageUrl, name } = await req.json();
      if (!imageUrl) return Response.json({ error: "Missing imageUrl" }, { status: 400 });
      const res = await fetch(imageUrl);
      buffer = Buffer.from(await res.arrayBuffer());
      fileName = name || imageUrl.split("/").pop() || fileName;
      // เดาว่าเป็น mime จาก header
      mime = res.headers.get("content-type") || mime;
      sizeBytes = Number(res.headers.get("content-length") || 0) || undefined;
    }

    // 1) อ่าน metadata ในเครื่อง (สำหรับข้อมูลเทคนิคที่จำเป็น)
    const meta = await readImageMeta(buffer);

    // 2) เตรียมภาพสำหรับ Vision API (resize ถ้าใหญ่เกินไป)
    let imageBuffer = buffer;
    if (buffer.length > 20 * 1024 * 1024) { // > 20MB
      imageBuffer = await sharp(buffer)
        .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
    }
    const base64 = `data:${mime};base64,${imageBuffer.toString("base64")}`;

    // 3) เรียก Vision + Tools (เน้นการวิเคราะห์ภาพ ไม่ใช่ metadata)
    let messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          `You are a Brand Compliance Auditor for Waykeeper. Analyze the IMAGE VISUALLY and return ONLY a JSON BrandImageReport according to the provided schema, after calling tools when numeric evidence is needed.
          
          Focus on VISUAL ANALYSIS:
          - Logo placement, size, and clear space
          - Color usage and brand palette compliance
          - Typography and text contrast
          - Layout composition and spacing
          - Overall design quality
          
          Return a JSON object with this structure:
          {
            "sections": [
              {
                "key": "logoUsage",
                "label": "Logo Usage",
                "score": 75,
                "summary": "brief summary",
                "items": [
                  {"id": "logo_placement", "label": "Logo placement correct", "pass": true, "evidence": "..."},
                  {"id": "logo_min_height", "label": "Logo ≥ 40px", "pass": false, "value": "32px", "suggestion": "เพิ่มเป็น ≥ 40px"}
                ]
              },
              {
                "key": "colors",
                "label": "Colors",
                "score": 88,
                "summary": "brief summary",
                "items": [...]
              },
              {
                "key": "accessibility",
                "label": "Accessibility",
                "score": 80,
                "summary": "brief summary",
                "items": [...]
              },
              {
                "key": "fileQuality",
                "label": "File Quality",
                "score": 70,
                "summary": "brief summary",
                "items": [...]
              },
              {
                "key": "layoutComposition",
                "label": "Layout & Composition",
                "score": 85,
                "summary": "brief summary",
                "items": [...]
              }
            ],
            "suggestions": {
              "visualFix": ["fix 1", "fix 2"],
              "formatFix": ["format fix 1", "format fix 2"],
              "seo": {
                "recommendedFileName": "waykeeper-xxx.webp",
                "altText": "description",
                "title": "Title",
                "urlSlugHint": "slug"
              }
            }
          }`,
      },
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: `Analyze this design for brand compliance. Brand rules: logo min height ${BRAND.logo.minHeightPx}px; WCAG AA ${BRAND.wcag.normalRatio}:1 normal; palette: ${BRAND.palette.map(p => `${p.name} ${p.hex}`).join(", ")}.
            
            FILE METADATA (read from client-side):
            - File: ${fileName}
            - Size: ${sizeBytes ? Math.round(sizeBytes / 1024) + ' KB' : 'unknown'}
            - Dimensions: ${meta.width} × ${meta.height} px
            - DPI: ${meta.dpi || 'unknown'}
            - Color Space: ${meta.colorSpace || 'unknown'}
            - ICC Profile: ${meta.iccProfile || 'none'}
            ${clientMetadata ? `
            CLIENT-SIDE METADATA:
            - Dimensions: ${clientMetadata.width} × ${clientMetadata.height} px
            - DPI (estimated): ${clientMetadata.dpi || 'unknown'}
            - Aspect Ratio: ${clientMetadata.aspectRatio || 'unknown'}:1
            - Megapixels: ${clientMetadata.megapixels || 'unknown'} MP
            - Color Space: ${clientMetadata.colorSpace || 'unknown'}
            ` : ''}
            
            ${meta.exif ? `
            EXIF DATA (from image file):
            ${meta.exif.cameraMake || meta.exif.cameraModel ? `- Camera: ${meta.exif.cameraMake || ''} ${meta.exif.cameraModel || ''}` : ''}
            ${meta.exif.lensMake || meta.exif.lensModel ? `- Lens: ${meta.exif.lensMake || ''} ${meta.exif.lensModel || ''}` : ''}
            ${meta.exif.fNumber ? `- Aperture: f/${meta.exif.fNumber}` : ''}
            ${meta.exif.exposureTime ? `- Shutter Speed: 1/${Math.round(1/meta.exif.exposureTime)}s` : ''}
            ${meta.exif.iso ? `- ISO: ${meta.exif.iso}` : ''}
            ${meta.exif.focalLength ? `- Focal Length: ${meta.exif.focalLength}mm${meta.exif.focalLengthIn35mm ? ` (${meta.exif.focalLengthIn35mm}mm equiv.)` : ''}` : ''}
            ${meta.exif.dateTimeOriginal ? `- Date Taken: ${meta.exif.dateTimeOriginal}` : ''}
            ${meta.exif.whiteBalance !== undefined ? `- White Balance: ${meta.exif.whiteBalance === 0 ? 'Auto' : meta.exif.whiteBalance === 1 ? 'Manual' : meta.exif.whiteBalance}` : ''}
            ${meta.exif.flash !== undefined ? `- Flash: ${meta.exif.flash === 0 ? 'Not used' : meta.exif.flash === 1 ? 'Used' : 'Unknown'}` : ''}
            ${meta.exif.exposureProgram !== undefined ? `- Exposure Program: ${meta.exif.exposureProgram}` : ''}
            ${meta.exif.meteringMode !== undefined ? `- Metering Mode: ${meta.exif.meteringMode}` : ''}
            ${meta.exif.gps ? `- GPS Location: ${meta.exif.gps.lat?.toFixed(6)}, ${meta.exif.gps.lng?.toFixed(6)}${meta.exif.gps.altitude ? ` (Altitude: ${meta.exif.gps.altitude}m)` : ''}` : ''}
            ${meta.exif.software ? `- Software: ${meta.exif.software}` : ''}
            ${meta.exif.artist ? `- Artist: ${meta.exif.artist}` : ''}
            ${meta.exif.copyright ? `- Copyright: ${meta.exif.copyright}` : ''}
            ${meta.exif.imageDescription ? `- Description: ${meta.exif.imageDescription}` : ''}
            ${meta.exif.compression !== undefined ? `- Compression: ${meta.exif.compression}` : ''}
            ${meta.exif.bitsPerSample !== undefined ? `- Bits per Sample: ${meta.exif.bitsPerSample}` : ''}
            ${meta.exif.samplesPerPixel !== undefined ? `- Samples per Pixel: ${meta.exif.samplesPerPixel}` : ''}
            ` : ''}
            
            Use this metadata (including EXIF data) to make more accurate assessments about file quality, resolution, technical compliance, and image authenticity. EXIF data can help identify:
            - Image source and authenticity
            - Professional vs consumer camera usage
            - Image editing history (software used)
            - Location and time context
            - Technical quality indicators` 
          },
          { 
            type: "image_url", 
            image_url: { 
              url: base64,
              detail: "high" // ใช้ high detail เพื่อวิเคราะห์ภาพได้ละเอียดขึ้น
            } 
          },
        ] as any,
      },
    ];

    // ให้โมเดลเรียก tools สูงสุด 4 รอบ
    for (let i = 0; i < 4; i++) {
      const resp = await client.chat.completions.create({
        model: "gpt-4o",
        temperature: 0,
        tools,
        response_format: { type: "json_object" },
        messages,
      });
      const msg = resp.choices[0].message;

      if (msg.tool_calls?.length) {
        for (const call of msg.tool_calls) {
          if (call.type === "function") {
            const result = await toolRouter(call.function.name, JSON.parse(call.function.arguments || "{}"));
            messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) as any });
          }
        }
        continue;
      }

      // 4) รวมเป็นรายงานขั้นสุดท้าย (ให้โมเดลส่ง core โครงไว้ แล้วเราคำนวณคะแนนรวมอีกชั้น)
      const draft: BrandImageReport = JSON.parse(msg.content || "{}");

      // เติม input meta ให้ครบ/เชื่อถือได้จากฝั่งเรา
      // ใช้ metadata จากฝั่งเว็บเป็นหลัก (แม่นยำกว่า) และ fallback ไปที่ server metadata
      draft.input = {
        source: contentType.startsWith("multipart/form-data") ? "upload" : "url",
        fileName,
        mime,
        sizeBytes,
        width: clientMetadata?.width || meta.width,
        height: clientMetadata?.height || meta.height,
        dpi: clientMetadata?.dpi || meta.dpi,
        colorSpace: clientMetadata?.colorSpace || meta.colorSpace,
        iccProfile: meta.iccProfile,
        exif: meta.exif,
      };

      // คำนวณคะแนนรายหมวด (ถ้าโมเดลให้ items มาแล้ว)
      for (const sec of draft.sections || []) {
        sec.score = typeof sec.score === "number" ? sec.score : scoreFromItems(sec.items || []);
      }

      // สรุปคะแนนรวมตามน้ำหนัก
      const weights = { ...SECTION_WEIGHTS };
      const totalWeight = Object.values(weights).reduce((a, b) => (a as number) + (b as number), 0);
      const overall = totalWeight > 0 
        ? (draft.sections || []).reduce((acc, s) => acc + (s.score || 0) * ((weights as any)[s.key] || 0), 0) / totalWeight
        : 0;

      draft.score = { overall: Math.round(overall), weights };

      // ปิดงาน
      return Response.json(draft, { status: 200 });
    }

    return Response.json({ error: "Tool loop exceeded" }, { status: 500 });
  } catch (e: any) {
    console.error('Brand Image Check API Error:', e);
    return Response.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}

