import yahooFinance from "yahoo-finance2";
import { SMA, EMA, RSI, MACD } from "technicalindicators";
export const fetchStockData = async (symbol: string) => {
    try {
      const today = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(today.getMonth() - 3);
  
      const chartData = await yahooFinance.chart(symbol, {
        interval: "1d",
        period1: threeMonthsAgo.toISOString().split("T")[0],
        period2: today.toISOString().split("T")[0],
      });
  
      if (!chartData || !chartData.quotes || chartData.quotes.length === 0) {
        console.log("No historical data available.");
        return null;
      }
  
      const closingPrices: number[] = chartData.quotes
        .map((quote) => quote.close)
        .filter((price): price is number => price !== null);
  
      const sma20 = SMA.calculate({ period: 20, values: closingPrices });
      const ema20 = EMA.calculate({ period: 20, values: closingPrices });
      const rsi14Values = RSI.calculate({ period: 14, values: closingPrices });
  
      const latestRSI14 = rsi14Values[rsi14Values.length - 1] || "N/A";
      const rsiStatus =
        typeof latestRSI14 === "number"
          ? latestRSI14 > 70
            ? "Overbought"
            : latestRSI14 < 30
            ? "Oversold"
            : "Neutral"
          : "Data Unavailable";
  
      const macdResult = MACD.calculate({
        values: closingPrices,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      });
  
      // Ensure MACD values are never `undefined`
      const latestMACD = macdResult[macdResult.length - 1] || {};
      const macd = {
        MACD: latestMACD.MACD ?? "N/A",
        signal: latestMACD.signal ?? "N/A",
        histogram: latestMACD.histogram ?? "N/A",
      };
  
      return {
        symbol,
        latestPrice: closingPrices[closingPrices.length - 1] || "N/A",
        sma20: sma20[sma20.length - 1] || "N/A",
        ema20: ema20[ema20.length - 1] || "N/A",
        rsi14: latestRSI14,
        rsiStatus,
        macd,
      };
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return null;
    }
  };
  