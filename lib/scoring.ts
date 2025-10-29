export const SECTION_WEIGHTS: Record<string, number> = {
  logoUsage: 0.25,
  colors: 0.25,
  accessibility: 0.25,
  fileQuality: 0.15,
  layoutComposition: 0.10,
};

// แนวคิด: sectionScore = (ผ่าน/ไม่ผ่านตาม weight ย่อย) → 0–100
// overall = sum(sectionScore * sectionWeight)

