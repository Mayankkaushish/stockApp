// src/ai/fundamentals/fundamentalHelpers.ts

export interface RevenueData {
    quarterlyRevenue: number[]; // Most recent quarters first (latest to oldest)
  }
  
  export const analyzeRevenueGrowth = (data: RevenueData): number => {
    const revenues = data.quarterlyRevenue;
    console.log("📊 Reversed Revenue for Analysis:", revenues);

  
    if (revenues.length < 2) return 0;
  
    let score = 0;
    let consistentGrowth = true;
  
    for (let i = 1; i < revenues.length; i++) {
      const change = (revenues[i - 1] - revenues[i]) / revenues[i];
  
      if (change > 0.05) consistentGrowth = false;
  
      if (change > 0.15) score -= 10;
      else if (change > 0.05) score -= 5;
      else if (change < -0.05) score += 10; // decline
      else score += 5; // small growth
    }
  
    if (consistentGrowth) {
      score += 10; // bonus for consistent growth with low fluctuation
    }
  
    return Math.max(-20, Math.min(score, 25)); // cap score between -20 and 25
  };
  