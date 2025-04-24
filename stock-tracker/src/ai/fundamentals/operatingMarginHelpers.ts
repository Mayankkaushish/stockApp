// src/ai/fundamentals/operatingMarginHelpers.ts

export interface OperatingMarginData {
    operatingMargin: number | null; // Between 0 and 1
  }
  
  export const analyzeOperatingMarginStrength = (data: OperatingMarginData): number => {
    const margin = data.operatingMargin ?? 0;
    let score = 0;
  
    if (margin > 0.2) score += 15;
    else if (margin > 0.1) score += 10;
    else if (margin > 0.05) score += 5;
    else if (margin < 0.02) score -= 10;
  
    console.log("📈 Operating Margin Received:", margin);
    console.log("📊 Operating Margin Score:", score);
    return score;
  };
  