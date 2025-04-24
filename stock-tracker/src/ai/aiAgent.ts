// src/ai/aiAgent.ts
import { rsi, macd, sma, ema, bollingerbands, adx } from "technicalindicators";
import { getMACDHistogramTrend } from "./indicators/macdHelpers";
import { detectCandlestickPattern } from "./patterns/candlestickHelpers";
import { isBollingerBandSqueeze } from "./indicators/bollingerHelpers";
import { computeScore } from "./scoring/technicalScoring";
import { analyzeEarningsStrength, EarningsData } from "./fundamentals/fundamentalHelpers";
import { RevenueData, analyzeRevenueGrowth  } from "./fundamentals/revenueHelpers";
import { MarginData,analyzeProfitMarginStrength } from "./fundamentals/marginHelpers";
import { OperatingMarginData, analyzeOperatingMarginStrength } from "./fundamentals/operatingMarginHelpers";
import { SentimentData } from "./sentiment/newsSentimentHelpers";
import { computeSentimentScore } from "./sentiment/sentimentScoring";


export interface StockData {
  symbol: string;
  openPrices: number[];
  highPrices: number[];
  lowPrices: number[];
  closePrices: number[];
  fundamentals?: {
    earnings: EarningsData;
    revenue?: RevenueData;
    margins?: MarginData;
    operatingMargin?:OperatingMarginData;
}
  sentiment?: SentimentData;
};



export interface AIAnalysis {
  symbol: string;
  action: "Strong Buy" | "Weak Buy" | "Hold" | "Weak Sell" | "Strong Sell";
  confidence: number;
  macd: { MACD: number; signal: number; histogram: number };
  rsi: number;
  bollinger: { upper: number; middle: number; lower: number };
  adx: number;
  candlestickPattern: string;
  isBollingerSqueeze: boolean;
  score: number;
}

export const analyzeStock = (data: StockData): AIAnalysis => {
  const { symbol, openPrices, highPrices, lowPrices, closePrices, fundamentals } = data;

  if (closePrices.length < 50) {
    return {
      symbol,
      action: "Hold",
      confidence: 50,
      macd: { MACD: 0, signal: 0, histogram: 0 },
      rsi: 50,
      bollinger: { upper: 0, middle: 0, lower: 0 },
      adx: 0,
      candlestickPattern: "None",
      isBollingerSqueeze: false,
      score: 0,
    };
  }

  // === Indicators
  const rsiValues = rsi({ period: 14, values: closePrices });
  const macdValues = macd({
    values: closePrices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
  const sma50 = sma({ period: 50, values: closePrices });
  const ema20 = ema({ period: 20, values: closePrices });
  const adxValues = adx({ period: 14, close: closePrices, high: highPrices, low: lowPrices });
  const boll = bollingerbands({ period: 20, values: closePrices, stdDev: 2 });

  const latestClose = closePrices.at(-1) ?? 0;
  const latestRSI = parseFloat((rsiValues.at(-1) ?? 50).toFixed(2));
  const latestADX = parseFloat((adxValues.at(-1)?.adx ?? 0).toFixed(2));
  const latestMACDData = macdValues.at(-1) ?? { MACD: 0, signal: 0, histogram: 0 };
  const latestMACD = {
    MACD: parseFloat((latestMACDData.MACD ?? 0).toFixed(2)),
    signal: parseFloat((latestMACDData.signal ?? 0).toFixed(2)),
    histogram: parseFloat((latestMACDData.histogram ?? 0).toFixed(2)),
  };
  const latestBoll = boll.at(-1) ?? { upper: 0, middle: 0, lower: 0 };
  const isSqueeze = isBollingerBandSqueeze(boll.slice(-20));
  const histValues = macdValues.map((m) => m.histogram ?? 0);
  const macdHistTrend = getMACDHistogramTrend(histValues);

  const candlestickPattern = detectCandlestickPattern({
    open: openPrices,
    high: highPrices,
    low: lowPrices,
    close: closePrices,
  });

  // === Scoring
  const technicalScore = computeScore({
    rsi: latestRSI,
    macdHistTrend,
    adx: latestADX,
    candlestickPattern,
    isSqueeze,
  });

  const fundamentalScore = fundamentals?.earnings
    ? analyzeEarningsStrength(fundamentals.earnings)
    : 0;

  const revenueScore = fundamentals?.revenue
    ? analyzeRevenueGrowth(fundamentals.revenue)
    : 0;

    console.log("📉 Raw Margin Data Received in AI Agent:", fundamentals?.margins?.marginData);
  const marginScore = fundamentals?.margins
    ? analyzeProfitMarginStrength(fundamentals.margins)
    : 0;  

    const operatingMarginScore = fundamentals?.operatingMargin
  ? analyzeOperatingMarginStrength(fundamentals.operatingMargin)
  : 0;


  // === Sentiment Score (optional)
let sentimentScore = 0;
if (data.sentiment) {
  sentimentScore = computeSentimentScore(data.sentiment);
  console.log("📰 News Sentiment Score:", sentimentScore);
}


    
    // Final score
  const totalScore = technicalScore + fundamentalScore + revenueScore + marginScore + operatingMarginScore + sentimentScore;

  // === Logging
  // console.log(`📈 Close: ${latestClose}`);
  // console.log(`📉 SMA50: ${sma50.at(-1)}`);
  // console.log(`💡 RSI: ${latestRSI}`);
  // console.log(`📊 MACD: ${latestMACD.MACD}, Signal: ${latestMACD.signal}, Histogram: ${latestMACD.histogram}`);
  // console.log(`📉 ADX: ${latestADX}`);
  // console.log(`🌀 isSqueeze: ${isSqueeze}`);
  // console.log(`📈 MACD Histogram Trend: ${macdHistTrend}`);
  // console.log(`🕯️ Candlestick: ${candlestickPattern}`);
  console.log("📊 Technical Score:", technicalScore);
  console.log("💰 Fundamental (Earnings) Score:", fundamentalScore);
  console.log("📈 Revenue Score:", revenueScore);
  console.log("📈 Margin Score:", marginScore);
  console.log("📈 Operating Margin Score:", operatingMarginScore);
  console.log("🧠 Total Score (Tech + Earnings + Revenue + Margin + Operating + sentiment):", totalScore);

  // === Final Signal
  let action: AIAnalysis["action"] = "Hold";
  let confidence = 50;

  if (totalScore >= 80) {
    action = "Strong Buy";
    confidence = 95;
  } else if (totalScore >= 60) {
    action = "Weak Buy";
    confidence = 70 + Math.min((totalScore - 60) * 0.5, 10);
  } else if (totalScore <= -80) {
    action = "Strong Sell";
    confidence = 95;
  } else if (totalScore <= -60) {
    action = "Weak Sell";
    confidence = 70 + Math.min((-totalScore - 60) * 0.5, 10);
  }

  return {
    symbol,
    action,
    confidence,
    macd: latestMACD,
    rsi: latestRSI,
    bollinger: latestBoll,
    adx: latestADX,
    candlestickPattern,
    isBollingerSqueeze: isSqueeze,
    score: totalScore,
  };
};

