// src/ai/fundamentals/marginHelpers.ts

export interface MarginData {
    marginData: number[]; // Most recent first, values between 0 and 1
  }
  
  
  export const analyzeProfitMarginStrength = (data: MarginData): number => {
    if (!data.marginData.length) return 0;
  
    const recentMargins = data.marginData.slice(0, 4); // Last 4 quarters
    const avgMargin = recentMargins.reduce((a, b) => a + b, 0) / recentMargins.length;
    console.log("📊 Gross Margins Sent to Frontend:", recentMargins);

  
    let score = 0;
  
    if (avgMargin > 0.2) score += 15;
    else if (avgMargin > 0.1) score += 10;
    else if (avgMargin > 0.05) score += 5;
    else if (avgMargin < 0.02) score -= 10;
  
    return score;
  };
  