import { macd } from "technicalindicators";

export const getMACDValues = (closePrices: number[]) => {
  return macd({
    values: closePrices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
};

export const getMACDHistogramTrend = (hist: number[]): "rising" | "falling" | "flat" => {
  const last = hist.slice(-4);
  if (last.length < 4) return "flat";
  const [a, b, c, d] = last;
  if (a < b && b < c && c < d) return "rising";
  if (a > b && b > c && c > d) return "falling";
  return "flat";
};
