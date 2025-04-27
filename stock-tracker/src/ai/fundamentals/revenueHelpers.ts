// src/ai/scoring/revenueHelpers.ts

export interface RevenueData {
  quarterlyRevenue: number[];
}

export const analyzeRevenueGrowth = (revenue: RevenueData): number => {
  const revenues = revenue.quarterlyRevenue.slice(-4); // Last 4 quarters
  const growthRates = [];

  for (let i = 1; i < revenues.length; i++) {
    if (revenues[i - 1] > 0) {
      const growth = ((revenues[i] - revenues[i - 1]) / revenues[i - 1]) * 100;
      growthRates.push(growth);
    }
  }

  const avgGrowth = growthRates.length > 0
    ? growthRates.reduce((sum, g) => sum + g, 0) / growthRates.length
    : 0;

  let score = 0;

  if (avgGrowth > 15) {
    score = 15;
  } else if (avgGrowth > 5) {
    score = 7;
  } else if (avgGrowth > 0) {
    score = 3;
  } else {
    score = -10;
  }

  console.log("📈 Revenue Growth Rates:", growthRates.map(g => g.toFixed(2)));
  console.log("📈 Avg Revenue Growth %:", avgGrowth.toFixed(2));
  console.log("📈 Revenue Growth Score:", score);

  return score;
};
