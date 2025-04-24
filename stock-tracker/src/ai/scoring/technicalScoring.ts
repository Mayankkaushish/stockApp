// src/ai/scoring/scoring.ts

export interface ScoringInputs {
    rsi: number;
    macdHistTrend: "rising" | "falling" | "flat";
    adx: number;
    candlestickPattern: string;
    isSqueeze: boolean;
  }
  
  /**
   * Computes a composite score based on various technical indicators.
   * This score can be used for ranking or evaluating signal strength.
   * Future features (e.g., fundamentals, sentiment) can extend this logic.
   */
  export const computeScore = (params: ScoringInputs): number => {
    let score = 0;
  
    // RSI scoring
    if (params.rsi < 30) score += 15;
    else if (params.rsi > 70) score -= 15;
    else score += 5;
  
    // MACD Histogram Trend
    if (params.macdHistTrend === "rising") score += 10;
    else if (params.macdHistTrend === "falling") score -= 10;
  
    // ADX strength
    if (params.adx > 25) score += 10;
    else if (params.adx > 20) score += 5;
  
    // Candlestick patterns
    if (params.candlestickPattern.includes("Bullish")) score += 10;
    else if (params.candlestickPattern.includes("Bearish")) score -= 10;
  
    // Bollinger Band Squeeze
    if (params.isSqueeze) score += 10;
  
    console.log("📊 Score Breakdown:", params);
    console.log("✅ Total Score:", score);
  
    return score;
  };
  