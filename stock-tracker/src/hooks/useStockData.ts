import { useState, useEffect } from "react";
import { fetchStockData } from "../utils/fetchStockData";

export const useStockData = (symbol: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      console.log(`🔄 Fetching data for: ${symbol}`);  // Step 1: Log fetch start
      try {
        const stockData = await fetchStockData(symbol);
        console.log("📊 Data received in hook:", stockData);  // Step 2: Log received data
        setData(stockData);
        setError(null);
      } catch (err) {
        console.error("❌ Error in useStockData:", err);
        setError("Failed to fetch stock data");
      }
      setLoading(false);
    };

    getData();
    const interval = setInterval(getData, 30000);

    return () => clearInterval(interval);
  }, [symbol]);

  return { data, loading, error };
};
