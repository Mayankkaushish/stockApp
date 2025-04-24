// src/ai/sentiment/sentimentScoring.ts

export interface SentimentData {
    label: "Bullish" | "Bearish" | "Neutral" | "Unknown";
    confidence: number; // 0 to 100
  }
  
  export const computeSentimentScore = (sentiment: SentimentData): number => {
    const baseScore =
      sentiment.label === "Bullish" ? 1 :
      sentiment.label === "Bearish" ? -1 :
      0;
  
    const scaledScore = baseScore * (sentiment.confidence / 100) * 20;
  
    return parseFloat(scaledScore.toFixed(2)); // Optional: limit decimals
  };
  