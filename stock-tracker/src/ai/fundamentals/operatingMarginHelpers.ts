// src/ai/scoring/operatingMarginHelpers.ts

export interface OperatingMarginData {
  operatingMargin?: number; // optional
}

export const analyzeOperatingMarginStrength = (operatingMarginData: OperatingMarginData): number => {
  const margin = operatingMarginData.operatingMargin ?? 0; // 👈 Default to 0 if undefined

  let score = 0;

  if (margin >= 0.3) {
    score = 15;
  } else if (margin >= 0.2) {
    score = 10;
  } else if (margin >= 0.1) {
    score = 5;
  } else if (margin >= 0.05) {
    score = 0;
  } else if (margin >= 0) {
    score = -5;
  } else {
    score = -10;
  }

  console.log("📈 Operating Margin Received:", margin);
  console.log("📊 Operating Margin Score:", score);

  return score;
};
