// src/ai/scoring/technicalScoring.ts

export interface ScoringInputs {
  rsi: number;
  macdHistTrend: "rising" | "falling" | "flat";
  adx: number;
  candlestickPattern: string;
  isSqueeze: boolean;
  squeezeWidth?: number; // ✅ Added optional squeeze width for better scoring
}

/**
 * Computes a composite technical score based on multiple indicators.
 */
export const computeScore = (params: ScoringInputs): number => {
  let score = 0;
  let bullishSignals = 0;
  let bearishSignals = 0;

  // ✅ RSI scoring
  if (params.rsi > 50) {
    score += 5;
    bullishSignals++;
  } else if (params.rsi < 50) {
    score -= 5;
    bearishSignals++;
  }

  // ✅ MACD Histogram Trend
  if (params.macdHistTrend === "rising") {
    score += 5;
    bullishSignals++;
  } else if (params.macdHistTrend === "falling") {
    score -= 5;
    bearishSignals++;
  }

  // ✅ ADX Strength
  if (params.adx > 25) {
    score += 8;
    bullishSignals++;
  } else if (params.adx > 20) {
    score += 5;
  }

  // ✅ Candlestick Pattern
  if (params.candlestickPattern.includes("Bullish")) {
    score += 10;
    bullishSignals++;
  } else if (params.candlestickPattern.includes("Bearish")) {
    score -= 10;
    bearishSignals++;
  }

  // ✅ Bollinger Band Squeeze
  if (params.isSqueeze) {
    if (params.squeezeWidth && params.squeezeWidth < 0.05) {
      score += 8; // tight squeeze breakout
      bullishSignals++;
    } else {
      score += 5;
    }
  }

  // ✅ Alignment Bonus
  if (bullishSignals >= 3) {
    score += 10;
    console.log("📈 Strong Technical Alignment Bonus Applied (+10)");
  }

  // ✅ Conflict Penalty
  if (bullishSignals > 0 && bearishSignals > 1) {
    score -= 5;
    console.log("⚠️ Technical Conflict Penalty Applied (-5)");
  }

  console.log("📊 Technical Score Breakdown:", { ...params, bullishSignals, bearishSignals });
  console.log("✅ Final Technical Score:", score);

  return score;
};
