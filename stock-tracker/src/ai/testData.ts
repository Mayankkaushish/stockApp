// src/ai/testData.ts
import { StockData } from "./aiAgent";

const testData: StockData = {
  symbol: "TEST_MODE",
  openPrices: Array.from({ length: 60 }, (_, i) => 100 + Math.sin(i / 2) * 0.5),
  highPrices: Array.from({ length: 60 }, (_, i) => 101 + Math.sin(i / 2) * 0.5),
  lowPrices: Array.from({ length: 60 }, (_, i) => 99 + Math.sin(i / 2) * 0.5),
  closePrices: [
    ...Array(50).fill(100.1),
    100.5, 100.8, 101.1, 101.3, 101.5,
    101.8, 102.0, 102.2, 102.5, 103.5,
  ],
  fundamentals: {
    earnings: {
      earningsPerShare: [0.2, 0.3, 0.4, 0.5],
      surprisePercentage: [5, 6, 7, 8],
    },
    revenue: {
      quarterlyRevenue: [10.5, 11.2, 12.1, 13],
    },
    margins: {
      marginData: [0.18, 0.21, 0.23, 0.25],
    },
    operatingMargin: {
      operatingMargin: 0.12,
    },
  },
  sentiment: {
    label: "Bullish", // options: Bullish, Bearish, Neutral, Unknown
    confidence: 10,   // strength of sentiment from 0–100
  },
};

export default testData;
