
// src/ai/fundamentals/fundamentalHelpers.ts

export interface EarningsData {
    earningsPerShare: number[];  // Quarterly EPS history
    surprisePercentage: number[]; // Surprise % for each quarter
  }
  
  // src/ai/scoring/earningsHelpers.ts

export interface EarningsData {
  earningsPerShare: number[];
  surprisePercentage: number[];
}

export const analyzeEarningsStrength = (earnings: EarningsData): number => {
  const surprises = earnings.surprisePercentage.slice(-4); // Last 4 quarters
  const avgSurprise = surprises.reduce((sum, val) => sum + val, 0) / surprises.length;

  let score = 0;

  if (avgSurprise > 10) {
    score = 15;
  } else if (avgSurprise > 0) {
    score = 7;
  } else if (avgSurprise > -5) {
    score = -5;
  } else {
    score = -15;
  }

  console.log("💸 Earnings Surprise Avg %:", avgSurprise.toFixed(2));
  console.log("📈 Earnings Score:", score);

  return score;
};

  