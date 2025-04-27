import axios from "axios";
import { analyzeStock, StockData } from "../ai/aiAgent";
import { SentimentData } from "../ai/sentiment/newsSentimentHelpers";
import { computeHedgeFundScore } from "../ai/fundamentals/hedgeFundHelpers";

export const fetchStockData = async (symbol: string) => {
  try {
    // ✅ Step 1: Fetch historical stock data
    const historyResponse = await axios.get(`http://localhost:5000/api/stock/${symbol}?history=true`);
    const historyData = historyResponse.data;
    if (!historyData || historyData.length === 0) return null;

    historyData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const openPrices = historyData.map((d: any) => parseFloat(d.open.toFixed(2)));
    const highPrices = historyData.map((d: any) => parseFloat(d.high.toFixed(2)));
    const lowPrices = historyData.map((d: any) => parseFloat(d.low.toFixed(2)));
    const closePrices = historyData.map((d: any) => parseFloat(d.close.toFixed(2)));

    // ✅ Step 2: Fetch latest real-time stock data
    const latestResponse = await axios.get(`http://localhost:5000/api/stock/${symbol}`);
    const latestData = latestResponse.data;
    if (!latestData || !latestData.latestPrice) return null;

    const lastIndex = closePrices.length - 1;
    openPrices[lastIndex] = latestData.open ?? openPrices[lastIndex];
    highPrices[lastIndex] = latestData.high ?? Math.max(highPrices[lastIndex], latestData.latestPrice);
    lowPrices[lastIndex] = latestData.low ?? Math.min(lowPrices[lastIndex], latestData.latestPrice);
    closePrices[lastIndex] = latestData.latestPrice;

    const recentOpenPrices = openPrices.slice(-6);
    const recentHighPrices = highPrices.slice(-6);
    const recentLowPrices = lowPrices.slice(-6);
    const recentClosePrices = closePrices.slice(-6);

    console.log(`✅ Extracted Candlestick Data for ${symbol}:`, {
      openPrices: recentOpenPrices,
      highPrices: recentHighPrices,
      lowPrices: recentLowPrices,
      closePrices: recentClosePrices,
    });

    // ✅ Step 3: Fetch fundamental data
    const fundamentalsResponse = await axios.get(`http://localhost:5000/api/fundamentals/${symbol}`);
    const fundamentals = fundamentalsResponse.data;

    // ✅ Step 4: Fetch sentiment from backend
    let sentiment: SentimentData = { label: "Neutral", confidence: 0 };
    try {
      const sentimentResponse = await axios.post("/api/sentiment", { symbol });
      sentiment = sentimentResponse.data;
    } catch (err: any) {
      console.warn("⚠️ Sentiment fetch failed, using default neutral sentiment.", err?.message || err);
    }

    // ✅ Step 5: Fetch hedge fund activity
    let hedgeFundScore = 0;
    try {
    const hfResponse = await axios.get("http://localhost:5000/api/hedge-fund-sentiment");
    const { score, date } = hfResponse.data;
    hedgeFundScore = computeHedgeFundScore(score, date);
    console.log("🏦 Hedge Fund Score (After Decay):", hedgeFundScore);
  } catch (err: any) {
    console.warn("⚠️ Hedge Fund fetch failed, using default score 0.", err?.message || err);
  }



    // ✅ Step 5: Analyze
    const stockData: StockData = {
      symbol,
      openPrices,
      highPrices,
      lowPrices,
      closePrices,
      fundamentals,
      sentiment,
      hedgeFundScore,
    };

    const analysis = analyzeStock(stockData);

    return {
      symbol,
      latestPrice: latestData.latestPrice,
      volume: latestData.volume || 0,
      timestamp: latestData.timestamp || Date.now(),
      analysis,
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return null;
  }
};
