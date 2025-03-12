import { useState, useEffect } from "react";
import { fetchStockData } from "../utils/fetchStockData";

export const useStockData = (symbol: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const stockData = await fetchStockData(symbol);
        setData(stockData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch stock data");
      }
      setLoading(false);
    };

    getData();
    const interval = setInterval(getData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [symbol]);

  return { data, loading, error };
};
