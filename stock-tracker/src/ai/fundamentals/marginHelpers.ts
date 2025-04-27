// src/ai/scoring/marginHelpers.ts

export interface MarginData {
  marginData: number[];
}

export const analyzeProfitMarginStrength = (margins: MarginData): number => {
  const recentMargins = margins.marginData.slice(0, 4); // Most recent 4 quarters
  if (recentMargins.length === 0) return 0;

  const avgMargin = recentMargins.reduce((sum, m) => sum + m, 0) / recentMargins.length;

  let score = 0;

  if (avgMargin >= 0.25) {
    score = 15;
  } else if (avgMargin >= 0.15) {
    score = 8;
  } else if (avgMargin >= 0.05) {
    score = 3;
  } else if (avgMargin >= 0) {
    score = -5;
  } else {
    score = -10;
  }

  console.log("📉 Recent Margins:", recentMargins.map(m => m.toFixed(4)));
  console.log("📉 Avg Margin:", avgMargin.toFixed(4));
  console.log("📉 Profit Margin Score:", score);

  return score;
};
