// src/ai/sentiment/newsSentimentHelpers.ts

export interface SentimentData {
    label: "Bullish" | "Bearish" | "Neutral" | "Unknown";
    confidence: number;
  }
  
  export const parseSentimentLabel = (label: string): SentimentData => {
    switch (label.toLowerCase()) {
      case "positive":
        return { label: "Bullish", confidence: 1 };
      case "negative":
        return { label: "Bearish", confidence: -1 };
      case "neutral":
        return { label: "Neutral", confidence: 0 };
      default:
        return { label: "Unknown", confidence: 0 };
    }
  };
  