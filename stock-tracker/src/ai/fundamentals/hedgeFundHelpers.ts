export const analyzeHedgeFundSentiment = (score: number): number => {
    if (score >= 0.5) return 15; // Bullish
    if (score >= 0.3) return 5;  // Neutral
    return -10;                 // Bearish
  };
  