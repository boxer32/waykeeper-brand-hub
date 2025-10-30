// Multi-Category Deep Inspection Scoring System

export const SECTION_WEIGHTS: Record<string, number> = {
  logo_usage: 0.15,
  colors: 0.12,
  typography: 0.10,
  voice_tone: 0.08,
  accessibility: 0.15,
  file_quality: 0.10,
  visual_hierarchy: 0.12,
  whitespace: 0.08,
  content_density: 0.05,
  focal_point: 0.05,
  brand_familiarity: 0.10,
  layout_structure: 0.10,
};

export const SEVERITY_WEIGHTS: Record<string, number> = {
  critical: 1.0,
  high: 0.8,
  medium: 0.6,
  low: 0.4,
  suggestion: 0.2,
};

export const BRAND_FAMILIARITY_THRESHOLDS = {
  excellent: 85,
  good: 70,
  fair: 55,
  poor: 40,
  critical: 0,
};

export const ACCESSIBILITY_THRESHOLDS = {
  wcag_aa_normal: 4.5,
  wcag_aa_large: 3.0,
  wcag_aaa_normal: 7.0,
  wcag_aaa_large: 4.5,
};

export const FILE_QUALITY_THRESHOLDS = {
  min_dpi_web: 72,
  min_dpi_print: 300,
  max_file_size_web: 500, // KB
  max_file_size_print: 2000, // KB
  min_width: 800,
  min_height: 600,
};

export const LAYOUT_THRESHOLDS = {
  min_margin_ratio: 0.1, // 10% of canvas
  max_clutter_ratio: 0.7, // 70% content density
  min_focal_point_clarity: 60,
  min_balance_score: 60,
};

export function calculateOverallScore(categoryScores: Record<string, number>): number {
  const totalWeight = Object.values(SECTION_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  
  let weightedSum = 0;
  for (const [category, score] of Object.entries(categoryScores)) {
    const weight = SECTION_WEIGHTS[category] || 0;
    weightedSum += score * weight;
  }
  
  return Math.round(weightedSum / totalWeight);
}

export function determineSeverity(overallScore: number): string {
  if (overallScore >= 90) return "suggestion";
  if (overallScore >= 75) return "low";
  if (overallScore >= 60) return "medium";
  if (overallScore >= 40) return "high";
  return "critical";
}

export function calculateBrandFamiliarityIndex(
  brandConsistency: number,
  brandVoiceAlignment: number,
  familiarityScore: number
): number {
  return Math.round((brandConsistency * 0.4 + brandVoiceAlignment * 0.3 + familiarityScore * 0.3));
}

export function calculateCognitiveLoad(
  visualComplexity: number,
  informationDensity: number,
  clutterRatio: number
): { score: number; level: string } {
  const cognitiveScore = (visualComplexity * 0.4 + informationDensity * 0.3 + clutterRatio * 0.3);
  
  let level: string;
  if (cognitiveScore <= 30) level = "low";
  else if (cognitiveScore <= 60) level = "medium";
  else level = "high";
  
  return { score: Math.round(cognitiveScore), level };
}

export function calculateContrastRatio(color1: string, color2: string): number {
  // Simplified contrast ratio calculation
  // In production, use a proper color contrast library
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  const l1 = (0.299 * r1 + 0.587 * g1 + 0.114 * b1) / 255;
  const l2 = (0.299 * r2 + 0.587 * g2 + 0.114 * b2) / 255;
  
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

export function assessAccessibility(contrastRatio: number, fontSize: number, colorBlindFriendly: boolean): {
  score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 100;
  
  // Contrast check
  if (contrastRatio < ACCESSIBILITY_THRESHOLDS.wcag_aa_normal) {
    issues.push(`Contrast ratio ${contrastRatio}:1 ไม่ผ่าน WCAG AA (ต้องการ ${ACCESSIBILITY_THRESHOLDS.wcag_aa_normal}:1)`);
    score -= 30;
  }
  
  // Font size check
  if (fontSize < 14) {
    issues.push(`ขนาดฟอนต์ ${fontSize}px เล็กเกินไป (แนะนำ 14px+ สำหรับเว็บ)`);
    score -= 20;
  }
  
  // Color blind friendly check
  if (!colorBlindFriendly) {
    issues.push("สีที่ใช้ไม่เหมาะสำหรับผู้ที่มีปัญหาการมองเห็นสี");
    score -= 15;
  }
  
  return { score: Math.max(0, score), issues };
}

export function generateSEOFilename(
  brand: string,
  purpose: string,
  topic: string,
  locale: string = "th",
  size: string = "standard"
): string {
  const cleanBrand = brand.toLowerCase().replace(/\s+/g, '-');
  const cleanTopic = topic.toLowerCase().replace(/\s+/g, '-');
  const cleanPurpose = purpose.toLowerCase().replace(/\s+/g, '-');
  
  return `${cleanBrand}-${cleanTopic}-${cleanPurpose}-${locale}-${size}.png`;
}

export function calculateLayoutBalance(
  leftContent: number,
  rightContent: number,
  topMargin: number,
  bottomMargin: number,
  canvasWidth: number,
  canvasHeight: number
): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;
  
  // Left-right balance
  const horizontalBalance = Math.abs(leftContent - rightContent) / Math.max(leftContent, rightContent);
  if (horizontalBalance > 0.3) {
    issues.push("ความสมดุลซ้าย-ขวาไม่ดี");
    score -= 20;
  }
  
  // Vertical margin balance
  const verticalBalance = Math.abs(topMargin - bottomMargin) / Math.max(topMargin, bottomMargin);
  if (verticalBalance > 0.2) {
    issues.push("ระยะขอบบน-ล่างไม่สมดุล");
    score -= 15;
  }
  
  // Minimum margin check
  const minMarginRatio = Math.min(topMargin, bottomMargin) / canvasHeight;
  if (minMarginRatio < LAYOUT_THRESHOLDS.min_margin_ratio) {
    issues.push("ระยะขอบน้อยเกินไป");
    score -= 25;
  }
  
  return { score: Math.max(0, score), issues };
}
