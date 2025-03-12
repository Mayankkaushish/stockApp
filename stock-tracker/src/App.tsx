import { useEffect, useState } from "react";
import { fetchStockData } from "./utils/fetchStockData";

interface StockData {
  symbol: string;
  latestPrice: number | string;
  sma20: number | string;
  ema20: number | string;
  rsi14: number | string;
  rsiStatus: string;
  macd: { MACD: number | string; signal: number | string; histogram: number | string };
}

function App() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const symbol = "TSLA"; // Change this for other stocks

  useEffect(() => {
    const getStockData = async () => {
      setLoading(true);
      const data = await fetchStockData(symbol);
      if (data) setStockData(data);
      setLoading(false);
    };
    getStockData();
  }, []);

  useEffect(() => {
    if (stockData) {
      console.log("Stock Data:", stockData); // 🔍 Debugging
    }
  }, [stockData]);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Stock Data for {symbol}</h1>
        {loading ? (
          <p>Loading...</p>
        ) : stockData ? (
          <div>
            <p><strong>Latest Price:</strong> ${stockData.latestPrice}</p>
            <p><strong>20-day SMA:</strong> ${stockData.sma20}</p>
            <p><strong>20-day EMA:</strong> ${stockData.ema20}</p>
            <p><strong>14-day RSI:</strong> {stockData.rsi14} ({stockData.rsiStatus})</p>
            <p><strong>MACD:</strong> {stockData.macd.MACD}, Signal: {stockData.macd.signal}, Histogram: {stockData.macd.histogram}</p>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
}

export default App;
