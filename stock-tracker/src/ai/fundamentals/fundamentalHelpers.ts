
// src/ai/fundamentals/fundamentalHelpers.ts

export interface EarningsData {
    earningsPerShare: number[];  // Quarterly EPS history
    surprisePercentage: number[]; // Surprise % for each quarter
  }
  
  export const analyzeEarningsStrength = (data: EarningsData): number => {
    if (!data.earningsPerShare.length || !data.surprisePercentage.length) {
      return 0;
    }
  
    const recentEPS = data.earningsPerShare.slice(-4); // Last 4 quarters
    const recentSurprise = data.surprisePercentage.slice(-4);
  
    let score = 0;
  
    // Check for positive EPS trend
    const epsGrowth = recentEPS.every((eps, i, arr) => i === 0 || eps >= arr[i - 1]);
    if (epsGrowth) score += 15;
  
    // Average surprise positive?
    const avgSurprise = recentSurprise.reduce((a, b) => a + b, 0) / recentSurprise.length;
    if (avgSurprise > 5) score += 10;
    else if (avgSurprise > 0) score += 5;
  
    return score;
  };
  