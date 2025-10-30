// Multi-Category Deep Inspection Types for Brand Compliance Checker

export type SeverityLevel = "critical" | "high" | "medium" | "low" | "suggestion";

export type CategoryKey = 
  | "logo_usage"
  | "colors"
  | "typography"
  | "voice_tone"
  | "accessibility"
  | "file_quality"
  | "visual_hierarchy"
  | "whitespace"
  | "content_density"
  | "focal_point"
  | "brand_familiarity"
  | "layout_structure";

export type CheckItem = {
  id: string;
  label: string;
  pass: boolean | null;
  value?: string | number;
  evidence?: string;
  suggestion?: string;
  weight?: number;
  severity?: SeverityLevel;
  confidence?: number; // 0-1
};

export type SectionResult = {
  key: CategoryKey;
  label: string;
  score: number; // 0-100
  items: CheckItem[];
  summary: string;
  severity: SeverityLevel;
  confidence: number; // 0-1
};

export type SEOAdvice = {
  recommendedFileName: string;
  altText: string;
  title: string;
  urlSlugHint?: string;
  purpose: "banner" | "social" | "print" | "web" | "email" | "other";
  locale?: string;
  size?: string;
};

export type VisualSuggestion = {
  category: string;
  description: string;
  priority: SeverityLevel;
  implementation: string;
};

export type FormatSuggestion = {
  type: "file_format" | "compression" | "dimensions" | "dpi" | "colorspace";
  current: string;
  recommended: string;
  reason: string;
};

export type LayoutAnalysis = {
  margin_balance: number; // 0-100
  left_right_balance: number; // 0-100
  clutter_ratio: number; // 0-100 (higher = more cluttered)
  eye_flow_path: string[];
  focal_point_clarity: number; // 0-100
  rule_of_thirds_compliance: boolean;
  grid_alignment: number; // 0-100
};

export type ColorAnalysis = {
  contrast_ratios: Record<string, number>;
  brand_color_usage: number; // 0-100
  hue_shift: number; // degrees
  color_harmony: number; // 0-100
  accessibility_score: number; // 0-100
};

export type FileQualityAnalysis = {
  dpi_estimation: number;
  anti_aliasing_quality: number; // 0-100
  compression_artifacts: number; // 0-100 (lower = better)
  pixelation_score: number; // 0-100 (lower = better)
  sharpness_pattern: number; // 0-100
};

export type AccessibilityAnalysis = {
  text_contrast_score: number; // 0-100
  font_size_adequacy: number; // 0-100
  alt_text_suggestion: string;
  keyboard_focus_suggestion?: string;
  color_blind_friendly: boolean;
};

export type CognitiveLoadAnalysis = {
  visual_complexity: number; // 0-100
  information_density: number; // 0-100
  cognitive_load_estimate: "low" | "medium" | "high";
  readability_score: number; // 0-100
};

export type BrandFamiliarityAnalysis = {
  brand_consistency_score: number; // 0-100
  brand_voice_alignment: number; // 0-100
  brand_drift_warning: boolean;
  familiarity_index: number; // 0-100
  variation_detection: string[];
};

export type AIConfidence = {
  overall: number; // 0-1
  category_confidences: Record<CategoryKey, number>;
  uncertain_areas: string[];
  extracted_context: string[];
  detected_text: string[];
  detected_fonts: string[];
  color_palette: string[];
  dominant_hue: string;
  brand_risk: "low" | "medium" | "high";
};

export type BrandImageReport = {
  summary: {
    overall_score: number; // 0-100
    pass: boolean;
    severity: SeverityLevel;
    conclusion: string;
    brand_familiarity_index: number; // 0-100
  };
  
  category_scores: Record<CategoryKey, number>;
  
  sections: SectionResult[];
  
  issues: Array<{
    category: CategoryKey;
    severity: SeverityLevel;
    description: string;
    fix: string;
    confidence: number;
  }>;
  
  seo: SEOAdvice;
  
  visual_suggestions: VisualSuggestion[];
  
  format_suggestions: FormatSuggestion[];
  
  // Advanced Analysis
  layout_analysis: LayoutAnalysis;
  color_analysis: ColorAnalysis;
  file_quality_analysis: FileQualityAnalysis;
  accessibility_analysis: AccessibilityAnalysis;
  cognitive_load_analysis: CognitiveLoadAnalysis;
  brand_familiarity_analysis: BrandFamiliarityAnalysis;
  
  // AI Confidence & Metadata
  ai_confidence: AIConfidence;
  
  // Input metadata
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
    imageUrl?: string;
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
};
