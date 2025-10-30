import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { 
  calculateOverallScore, 
  determineSeverity, 
  calculateBrandFamiliarityIndex,
  calculateCognitiveLoad,
  calculateContrastRatio,
  assessAccessibility,
  generateSEOFilename,
  calculateLayoutBalance,
  SECTION_WEIGHTS,
  BRAND_FAMILIARITY_THRESHOLDS
} from '../../../lib/scoring';

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

// Enhanced function calling tools for Multi-Category Deep Inspection
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "calc_contrast_ratio",
      description: "Calculate WCAG contrast ratio between two hex colors.",
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
      name: "analyze_layout_structure",
      description: "Analyze layout composition, balance, and visual hierarchy.",
      parameters: {
        type: "object",
        properties: {
          imageUrl: { type: "string", description: "URL of the image to analyze" },
          canvasWidth: { type: "number", description: "Canvas width in pixels" },
          canvasHeight: { type: "number", description: "Canvas height in pixels" }
        },
        required: ["imageUrl", "canvasWidth", "canvasHeight"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "assess_brand_familiarity",
      description: "Assess how well the design aligns with Waykeeper brand identity.",
      parameters: {
        type: "object",
        properties: {
          imageUrl: { type: "string", description: "URL of the image to analyze" },
          designType: { type: "string", description: "Type of design (banner, social, print, etc.)" }
        },
        required: ["imageUrl", "designType"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "analyze_color_harmony",
      description: "Analyze color usage, brand color compliance, and color harmony.",
      parameters: {
        type: "object",
        properties: {
          imageUrl: { type: "string", description: "URL of the image to analyze" },
          brandColors: { type: "array", items: { type: "string" }, description: "Array of brand color hex codes" }
        },
        required: ["imageUrl", "brandColors"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "evaluate_accessibility",
      description: "Evaluate accessibility compliance including contrast, font size, and color blind friendliness.",
      parameters: {
        type: "object",
        properties: {
          imageUrl: { type: "string", description: "URL of the image to analyze" },
          textElements: { type: "array", items: { type: "string" }, description: "Array of text content found in the image" }
        },
        required: ["imageUrl", "textElements"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "assess_file_quality",
      description: "Assess file quality including DPI, compression, and technical specifications.",
      parameters: {
        type: "object",
        properties: {
          imageUrl: { type: "string", description: "URL of the image to analyze" },
          fileSize: { type: "number", description: "File size in bytes" },
          dimensions: { type: "object", properties: { width: { type: "number" }, height: { type: "number" } } }
        },
        required: ["imageUrl", "fileSize", "dimensions"]
      }
    }
  }
];

// Enhanced tool router for Multi-Category Deep Inspection
const toolRouter = async (name: string, args: any) => {
  switch (name) {
    case 'calc_contrast_ratio':
      return { ratio: calculateContrastRatio(args.color1, args.color2) };
      
    case 'analyze_layout_structure':
      // Mock layout analysis - in production, use computer vision
      return {
        margin_balance: 75,
        left_right_balance: 80,
        clutter_ratio: 45,
        eye_flow_path: ["top-left", "center", "bottom-right"],
        focal_point_clarity: 70,
        rule_of_thirds_compliance: true,
        grid_alignment: 85
      };
      
    case 'assess_brand_familiarity':
      // Mock brand familiarity assessment
      return {
        brand_consistency_score: 78,
        brand_voice_alignment: 82,
        brand_drift_warning: false,
        familiarity_index: 80,
        variation_detection: ["color_scheme", "typography_style"]
      };
      
    case 'analyze_color_harmony':
      // Mock color analysis
      return {
        contrast_ratios: { "text_background": 4.2, "logo_background": 3.8 },
        brand_color_usage: 65,
        hue_shift: 5,
        color_harmony: 72,
        accessibility_score: 68
      };
      
    case 'evaluate_accessibility':
      // Mock accessibility evaluation
      return {
        text_contrast_score: 70,
        font_size_adequacy: 85,
        alt_text_suggestion: "Waykeeper travel banner with mountain landscape",
        keyboard_focus_suggestion: "Ensure CTA button has visible focus state",
        color_blind_friendly: true
      };
      
    case 'assess_file_quality':
      // Mock file quality assessment
      return {
        dpi_estimation: 72,
        anti_aliasing_quality: 80,
        compression_artifacts: 15,
        pixelation_score: 5,
        sharpness_pattern: 75
      };
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting Multi-Category Deep Inspection...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = formData.get('metadata') as string;
    const designType = formData.get('designType') as string || 'banner';
    
    console.log('📁 File received:', { 
      name: file?.name, 
      size: file?.size, 
      type: file?.type,
      designType 
    });
    
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
      blob = await put(file.name, file, {
        access: 'public',
        addRandomSuffix: true,
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

    // Build enhanced messages for Multi-Category Deep Inspection
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are an advanced Brand Compliance AI for Waykeeper. Perform Multi-Category Deep Inspection with the following capabilities:

BRAND RULES:
- Logo minimum height: ${BRAND.logo.minHeightPx}px
- WCAG AA contrast ratio: ${BRAND.wcag.normalRatio}:1 for normal text
- Brand colors: ${BRAND.palette.map(p => `${p.name} ${p.hex}`).join(', ')}
- Minimum dimensions: ${BRAND.minDimensions.width}x${BRAND.minDimensions.height}px
- Preferred formats: ${BRAND.preferredFormats.join(', ')}

INSPECTION CATEGORIES:
1. Logo Usage - Size, placement, visibility, brand compliance
2. Colors - Brand color usage, contrast, harmony, accessibility
3. Typography - Font choice, size, readability, brand consistency
4. Voice & Tone - Visual messaging alignment with brand voice
5. Accessibility - WCAG compliance, contrast, font size, color blind friendly
6. File Quality - DPI, compression, technical specifications
7. Visual Hierarchy - Information flow, focal points, emphasis
8. Whitespace - Balance, breathing room, content density
9. Content Density - Information overload, cognitive load
10. Focal Point - Clear visual focus, attention direction
11. Brand Familiarity - Consistency with brand identity
12. Layout Structure - Grid alignment, balance, composition

SEVERITY LEVELS:
- Critical ❌: Must fix immediately (brand violation, accessibility failure)
- High ⚠️: Affects brand recognition significantly
- Medium 🛠: Should fix for better quality
- Low 🧩: Minor improvements for polish
- Suggestion 💡: Optional enhancements

Return a comprehensive JSON response with detailed analysis across all categories.`
      },
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: `Perform Multi-Category Deep Inspection on this ${designType} design.

FILE METADATA:
- File: ${file.name}
- Size: ${file.size} bytes
- Dimensions: ${clientMetadata?.width || 'unknown'} × ${clientMetadata?.height || 'unknown'} px
- DPI: ${clientMetadata?.dpi || 'unknown'}
- Color Space: ${clientMetadata?.colorSpace || 'unknown'}

${clientMetadata ? `
CLIENT-SIDE METADATA:
- Dimensions: ${clientMetadata.width} × ${clientMetadata.height} px
- DPI (estimated): ${clientMetadata.dpi || 'unknown'}
- Aspect Ratio: ${clientMetadata.aspectRatio || 'unknown'}:1
- Megapixels: ${clientMetadata.megapixels || 'unknown'} MP
- Color Space: ${clientMetadata.colorSpace || 'unknown'}
` : ''}

Use the provided tools to perform comprehensive analysis across all categories. Focus on:
- Layout engineering (margin balance, eye flow, focal points)
- Color math (contrast ratios, brand color usage, hue analysis)
- File quality deep inspection (DPI, compression, artifacts)
- Accessibility compliance (WCAG, font size, color blind friendly)
- SEO optimization (purpose detection, filename suggestions)
- Brand familiarity index and consistency scoring
- Cognitive load assessment and visual complexity

Provide detailed scores, issues, and actionable suggestions for each category.` 
          },
          { 
            type: "image_url", 
            image_url: { url: blob.url, detail: "high" } 
          }
        ] as any,
      },
    ];

    // Call OpenAI Vision API with enhanced function calling
    let messages_with_tools = [...messages];
    let toolResults: any[] = [];
    
    for (let i = 0; i < 6; i++) {
      try {
        console.log(`🔄 OpenAI API call attempt ${i + 1}/6...`);
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
              toolResults.push({ tool: call.function.name, result });
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

        let analysisResult;
        try {
          analysisResult = JSON.parse(content);
        } catch (e) {
          throw new Error('Failed to parse JSON response');
        }

        // Calculate comprehensive scores
        const categoryScores = {
          logo_usage: analysisResult.logo_usage_score || 0,
          colors: analysisResult.colors_score || 0,
          typography: analysisResult.typography_score || 0,
          voice_tone: analysisResult.voice_tone_score || 0,
          accessibility: analysisResult.accessibility_score || 0,
          file_quality: analysisResult.file_quality_score || 0,
          visual_hierarchy: analysisResult.visual_hierarchy_score || 0,
          whitespace: analysisResult.whitespace_score || 0,
          content_density: analysisResult.content_density_score || 0,
          focal_point: analysisResult.focal_point_score || 0,
          brand_familiarity: analysisResult.brand_familiarity_score || 0,
          layout_structure: analysisResult.layout_structure_score || 0,
        };

        const overallScore = calculateOverallScore(categoryScores);
        const severity = determineSeverity(overallScore);
        const brandFamiliarityIndex = calculateBrandFamiliarityIndex(
          categoryScores.brand_familiarity,
          categoryScores.voice_tone,
          categoryScores.logo_usage
        );

        // Build comprehensive response
        const comprehensiveReport = {
          summary: {
            overall_score: overallScore,
            pass: overallScore >= 70,
            severity: severity,
            conclusion: analysisResult.conclusion || `คะแนนรวม ${overallScore}/100 - ${severity === 'critical' ? 'ต้องแก้ไขด่วน' : severity === 'high' ? 'ควรปรับปรุง' : severity === 'medium' ? 'ปรับปรุงได้' : 'ดีมาก'}`,
            brand_familiarity_index: brandFamiliarityIndex
          },
          
          category_scores: categoryScores,
          
          sections: Object.entries(categoryScores).map(([key, score]) => ({
            key,
            label: getCategoryLabel(key),
            score,
            items: analysisResult[`${key}_items`] || [],
            summary: analysisResult[`${key}_summary`] || `คะแนน ${score}/100`,
            severity: score >= 80 ? 'suggestion' : score >= 60 ? 'low' : score >= 40 ? 'medium' : score >= 20 ? 'high' : 'critical',
            confidence: 0.85
          })),
          
          issues: analysisResult.issues || [],
          
          seo: {
            recommendedFileName: generateSEOFilename('waykeeper', designType, 'design', 'th'),
            altText: analysisResult.alt_text || 'Waykeeper brand design',
            title: analysisResult.title || 'Waykeeper Brand Design',
            purpose: designType as any,
            locale: 'th'
          },
          
          visual_suggestions: analysisResult.visual_suggestions || [],
          format_suggestions: analysisResult.format_suggestions || [],
          
          // Advanced Analysis
          layout_analysis: toolResults.find(r => r.tool === 'analyze_layout_structure')?.result || {},
          color_analysis: toolResults.find(r => r.tool === 'analyze_color_harmony')?.result || {},
          file_quality_analysis: toolResults.find(r => r.tool === 'assess_file_quality')?.result || {},
          accessibility_analysis: toolResults.find(r => r.tool === 'evaluate_accessibility')?.result || {},
          cognitive_load_analysis: calculateCognitiveLoad(
            analysisResult.visual_complexity || 50,
            analysisResult.information_density || 50,
            analysisResult.clutter_ratio || 50
          ),
          brand_familiarity_analysis: toolResults.find(r => r.tool === 'assess_brand_familiarity')?.result || {},
          
          // AI Confidence & Metadata
          ai_confidence: {
            overall: 0.85,
            category_confidences: Object.keys(categoryScores).reduce((acc, key) => {
              acc[key] = 0.85;
              return acc;
            }, {} as any),
            uncertain_areas: analysisResult.uncertain_areas || [],
            extracted_context: analysisResult.extracted_context || [],
            detected_text: analysisResult.detected_text || [],
            detected_fonts: analysisResult.detected_fonts || [],
            color_palette: analysisResult.color_palette || [],
            dominant_hue: analysisResult.dominant_hue || 'blue',
            brand_risk: severity === 'critical' || severity === 'high' ? 'high' : severity === 'medium' ? 'medium' : 'low'
          },
          
          // Input metadata
          input: {
            source: "upload" as const,
            fileName: file.name,
            mime: file.type,
            sizeBytes: file.size,
            width: clientMetadata?.width || undefined,
            height: clientMetadata?.height || undefined,
            dpi: clientMetadata?.dpi || undefined,
            colorSpace: clientMetadata?.colorSpace || undefined,
            imageUrl: blob.url
          }
        };

        console.log('✅ Multi-Category Deep Inspection completed successfully');
        return NextResponse.json(comprehensiveReport);
      } catch (apiError) {
        console.error(`❌ OpenAI API call ${i + 1} failed:`, apiError);
        if (i === 5) throw apiError; // Re-throw on last attempt
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

function getCategoryLabel(key: string): string {
  const labels: Record<string, string> = {
    logo_usage: 'การใช้โลโก้',
    colors: 'การใช้สี',
    typography: 'การพิมพ์',
    voice_tone: 'เสียงและโทน',
    accessibility: 'การเข้าถึง',
    file_quality: 'คุณภาพไฟล์',
    visual_hierarchy: 'ลำดับชั้นภาพ',
    whitespace: 'พื้นที่ว่าง',
    content_density: 'ความหนาแน่นเนื้อหา',
    focal_point: 'จุดเด่น',
    brand_familiarity: 'ความคุ้นเคยแบรนด์',
    layout_structure: 'โครงสร้างเลย์เอาต์'
  };
  return labels[key] || key;
}