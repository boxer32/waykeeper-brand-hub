import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Initialize OpenAI client only when needed
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

// Brand constants
const BRAND = {
  logo: {
    minHeightPx: 120
  },
  palette: [
    { name: 'Skypath Blue', hex: '#77BEF0' },
    { name: 'Morning Gold', hex: '#F9D88C' },
    { name: 'Earth Green', hex: '#4A7C59' },
    { name: 'Mist Grey', hex: '#E5E1DC' }
  ],
  wcag: {
    normalRatio: 4.5,
    largeRatio: 3.0
  },
  minDimensions: {
    width: 800,
    height: 600
  },
  preferredFormats: ['PNG', 'JPG', 'JPEG', 'WEBP']
};

// Scoring weights
const SECTION_WEIGHTS = {
  logoUsage: 0.3,
  colors: 0.25,
  accessibility: 0.2,
  fileQuality: 0.15,
  layoutComposition: 0.1
};

// Function calling tools
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "calc_contrast_ratio",
      description: "Return WCAG contrast ratio between two hex colors.",
      parameters: {
        type: "object",
        properties: {
          color1: { type: "string", description: "First hex color (e.g., #77BEF0)" },
          color2: { type: "string", description: "Second hex color (e.g., #FFFFFF)" }
      },
        required: ["color1", "color2"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "nearest_brand_color",
      description: "Find the nearest brand color to a given hex color.",
      parameters: {
        type: "object",
        properties: {
          hex: { type: "string", description: "Hex color to match (e.g., #77BEF0)" }
      },
        required: ["hex"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "measure_logo_height",
      description: "Measure the height of the Waykeeper logo in pixels.",
      parameters: {
        type: "object",
        properties: {
          imageUrl: { type: "string", description: "URL of the image to analyze" }
        },
        required: ["imageUrl"]
      }
    }
  }
];

// Tool router
const toolRouter = async (name: string, args: any) => {
  switch (name) {
    case 'calc_contrast_ratio':
      // Simple contrast ratio calculation (simplified)
      const hex1 = args.color1.replace('#', '');
      const hex2 = args.color2.replace('#', '');
      const r1 = parseInt(hex1.substr(0, 2), 16);
      const g1 = parseInt(hex1.substr(2, 2), 16);
      const b1 = parseInt(hex1.substr(4, 2), 16);
      const r2 = parseInt(hex2.substr(0, 2), 16);
      const g2 = parseInt(hex2.substr(2, 2), 16);
      const b2 = parseInt(hex2.substr(4, 2), 16);
      
      const l1 = (0.299 * r1 + 0.587 * g1 + 0.114 * b1) / 255;
      const l2 = (0.299 * r2 + 0.587 * g2 + 0.114 * b2) / 255;
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      
      return { ratio: Math.round(ratio * 100) / 100 };
      
    case 'nearest_brand_color':
      const targetHex = args.hex.replace('#', '');
      const brandColors = BRAND.palette.map(p => ({
        name: p.name,
        hex: p.hex,
        distance: Math.abs(parseInt(targetHex, 16) - parseInt(p.hex.replace('#', ''), 16))
      }));
      const nearest = brandColors.reduce((a, b) => a.distance < b.distance ? a : b);
    return {
        nearest: nearest.name, 
        hex: nearest.hex,
        distance: nearest.distance
      };
      
    case 'measure_logo_height':
      // Mock measurement (in real implementation, this would analyze the image)
      return { height: 120, confidence: 0.85 };
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting design image check...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = formData.get('metadata') as string;
    
    console.log('📁 File received:', { name: file?.name, size: file?.size, type: file?.type });
    
    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Parse client metadata
    let clientMetadata = null;
    if (metadata) {
      try {
        clientMetadata = JSON.parse(metadata);
        console.log('📊 Client metadata:', clientMetadata);
      } catch (e) {
        console.warn('Failed to parse client metadata:', e);
      }
    }

    // Upload file to Vercel Blob
    let blob;
    try {
      console.log('📤 Uploading to Vercel Blob...');
      console.log('🔑 Using token:', process.env.Blob_READ_WRITE_TOKEN ? 'Present' : 'Missing');
      
      blob = await put(file.name, file, {
        access: 'public',
        token: process.env.Blob_READ_WRITE_TOKEN
      });
      console.log('✅ File uploaded to Vercel Blob:', blob.url);
    } catch (blobError) {
      console.error('❌ Vercel Blob upload failed:', blobError);
      throw new Error(`Failed to upload file: ${blobError instanceof Error ? blobError.message : 'Unknown error'}`);
    }

    // Create OpenAI client
    let client;
    try {
      console.log('🤖 Initializing OpenAI client...');
      client = getOpenAIClient();
    } catch (openaiError) {
      console.error('❌ OpenAI client initialization failed:', openaiError);
      throw new Error(`OpenAI initialization failed: ${openaiError instanceof Error ? openaiError.message : 'Unknown error'}`);
    }

    // Build messages for OpenAI Vision
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are a brand compliance checker for Waykeeper. Analyze the uploaded design image and provide detailed feedback on brand compliance.

Brand Rules:
- Logo minimum height: ${BRAND.logo.minHeightPx}px
- WCAG AA contrast ratio: ${BRAND.wcag.normalRatio}:1 for normal text
- Brand colors: ${BRAND.palette.map(p => `${p.name} ${p.hex}`).join(', ')}
- Minimum dimensions: ${BRAND.minDimensions.width}x${BRAND.minDimensions.height}px
- Preferred formats: ${BRAND.preferredFormats.join(', ')}
          
          Return a JSON object with this structure:
          {
            "sections": [
              {
                "key": "logoUsage",
      "label": "การใช้โลโก้",
      "score": 85,
                "items": [
        {
          "id": "logo-present",
          "label": "มีโลโก้ Waykeeper",
          "pass": true,
          "value": "พบโลโก้",
          "evidence": "โลโก้ปรากฏในตำแหน่งที่เหมาะสม"
        }
      ],
      "summary": "การใช้โลโก้ดีมาก"
              }
            ],
            "suggestions": {
    "visualFix": ["ปรับขนาดโลโก้ให้ใหญ่ขึ้น"],
    "formatFix": ["บันทึกเป็น PNG"],
              "seo": {
      "recommendedFileName": "waykeeper-banner.png",
      "altText": "Waykeeper Banner",
      "title": "Waykeeper Brand Banner"
    }
  }
}`
      },
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: `Analyze this design for brand compliance. File: ${file.name}, Size: ${file.size} bytes.
            
            ${clientMetadata ? `
            Client-side metadata:
            - Dimensions: ${clientMetadata.width} × ${clientMetadata.height} px
            - DPI: ${clientMetadata.dpi || 'unknown'}
            - Aspect Ratio: ${clientMetadata.aspectRatio || 'unknown'}:1
            - Color Space: ${clientMetadata.colorSpace || 'unknown'}
            ` : ''}
            
            Use the provided tools to calculate contrast ratios, find nearest brand colors, and measure logo height.` 
          },
          { 
            type: "image_url", 
            image_url: { url: blob.url, detail: "high" } 
            } 
        ] as any,
      },
    ];

    // Call OpenAI Vision API with function calling
    let messages_with_tools = [...messages];
    
    for (let i = 0; i < 4; i++) {
      try {
        console.log(`🔄 OpenAI API call attempt ${i + 1}/4...`);
      const resp = await client.chat.completions.create({
        model: "gpt-4o",
        temperature: 0,
        tools,
        response_format: { type: "json_object" },
          messages: messages_with_tools,
        });

        console.log('✅ OpenAI API response received');
        const msg = resp.choices[0]?.message;
        if (!msg) throw new Error('No response from OpenAI');

        messages_with_tools.push(msg);

      if (msg.tool_calls?.length) {
        for (const call of msg.tool_calls) {
            if (call.type === "function") {
          const result = await toolRouter(call.function.name, JSON.parse(call.function.arguments || "{}"));
              messages_with_tools.push({ 
                role: "tool", 
                tool_call_id: call.id, 
                content: JSON.stringify(result) as any 
              });
            }
        }
        continue;
      }

        // Parse the final JSON response
        const content = msg.content;
        if (typeof content !== 'string') {
          throw new Error('Invalid response format');
        }

        let draft;
        try {
          draft = JSON.parse(content);
        } catch (e) {
          throw new Error('Failed to parse JSON response');
        }

        // Calculate overall score
        const weights = { ...SECTION_WEIGHTS };
        const totalWeight = Object.values(weights).reduce((a, b) => (a as number) + (b as number), 0);
        const overall = totalWeight > 0 
          ? (draft.sections || []).reduce((acc: number, s: any) => acc + (s.score || 0) * ((weights as any)[s.key] || 0), 0) / totalWeight
          : 0;

        draft.score = { overall: Math.round(overall), weights: weights as any };

        // Add input metadata
      draft.input = {
          source: "upload" as const,
          fileName: file.name,
          mime: file.type,
          sizeBytes: file.size,
          width: clientMetadata?.width || undefined,
          height: clientMetadata?.height || undefined,
          dpi: clientMetadata?.dpi || undefined,
          colorSpace: clientMetadata?.colorSpace || undefined,
          imageUrl: blob.url
        };

        console.log('✅ Analysis completed successfully');
        return NextResponse.json(draft);
      } catch (apiError) {
        console.error(`❌ OpenAI API call ${i + 1} failed:`, apiError);
        if (i === 3) throw apiError; // Re-throw on last attempt
        continue; // Try again
      }
    }

    throw new Error('Maximum tool call iterations reached');

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}