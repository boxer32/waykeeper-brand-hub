export type CheckItem = {
  id: string;
  label: string;
  pass: boolean | null;
  value?: string | number;
  evidence?: string;
  suggestion?: string;
  weight?: number; // 0–1 (ถ้ามี)
};

export type SectionResult = {
  key:
    | "logoUsage"
    | "colors"
    | "accessibility"
    | "fileQuality"
    | "layoutComposition";
  label: string;
  score: number; // 0–100
  items: CheckItem[];
  summary: string;
};

export type SEOAdvice = {
  recommendedFileName: string; // ชื่อไฟล์ที่แนะนำ
  altText: string;             // คำอธิบายภาพ
  title: string;               // ชื่อ/หัวข้อภาพ
  urlSlugHint?: string;        // hint สำหรับ slug ถ้าจะใช้ภาพเป็นหน้า/บทความ
};

export type BrandImageReport = {
  input: {
    source: "upload" | "url";
    fileName: string;
    mime: string;
    sizeBytes?: number;
    width?: number;
    height?: number;
    dpi?: number;
    colorSpace?: string;
    iccProfile?: string;
    exif?: {
      // ข้อมูลกล้อง
      cameraMake?: string;
      cameraModel?: string;
      lensModel?: string;
      lensMake?: string;
      
      // ข้อมูลการถ่ายภาพ
      dateTimeOriginal?: string;
      dateTimeDigitized?: string;
      dateTime?: string;
      
      // การตั้งค่ากล้อง
      fNumber?: number;
      exposureTime?: number;
      iso?: number;
      focalLength?: number;
      flash?: number;
      whiteBalance?: number;
      meteringMode?: number;
      exposureMode?: number;
      sceneCaptureType?: number;
      
      // ข้อมูลภาพ
      orientation?: string;
      resolution?: string;
      colorSpace?: string;
      
      // ข้อมูล GPS
      gps?: { 
        lat?: number; 
        lng?: number;
        altitude?: number;
        timestamp?: string;
      };
      
      // ข้อมูลเพิ่มเติม
      software?: string;
      artist?: string;
      copyright?: string;
      imageDescription?: string;
      
      // ข้อมูลเทคนิค
      compression?: number;
      photometricInterpretation?: number;
      samplesPerPixel?: number;
      bitsPerSample?: number;
      planarConfiguration?: number;
      
      // ข้อมูลการประมวลผล
      contrast?: number;
      saturation?: number;
      sharpness?: number;
      brightness?: number;
      exposureBias?: number;
      
      // ข้อมูลเลนส์
      focalLengthIn35mm?: number;
      maxApertureValue?: number;
      
      // ข้อมูลแสง
      lightSource?: number;
      flashEnergy?: number;
      subjectDistance?: number;
      
      // ข้อมูลการวัดแสง
      exposureProgram?: number;
      spectralSensitivity?: string;
      
      // ข้อมูลอื่นๆ
      subsecTime?: string;
      subsecTimeOriginal?: string;
      subsecTimeDigitized?: string;
    };
  };
  sections: SectionResult[];
  score: {
    overall: number; // 0–100
    weights: Record<SectionResult["key"], number>; // น้ำหนักต่อหมวด
  };
  suggestions: {
    visualFix: string[];  // แก้ไขที่เกี่ยวกับภาพ/ดีไซน์
    formatFix: string[];  // รูปแบบไฟล์/ขนาด/บีบอัด/โปรไฟล์สี
    seo: SEOAdvice;
  };
};

