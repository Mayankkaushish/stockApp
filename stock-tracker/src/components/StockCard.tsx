import React from "react";
import { useStockData } from "../hooks/useStockData";

const StockCard: React.FC<{ symbol: string }> = ({ symbol }) => {
  const { data, loading, error } = useStockData(symbol);

  if (loading) return <p>Loading {symbol}...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available</p>;

  return (
    <div className="border border-gray-300 p-4 rounded-xl shadow-md w-80 bg-white">
      <h2 className="text-lg font-bold">{data.symbol}</h2>
      <p className="text-xl font-semibold text-blue-600">${data.latestPrice}</p>
      <p className="text-sm text-gray-500">20-day SMA: {data.sma20}</p>
      <p className="text-sm text-gray-500">20-day EMA: {data.ema20}</p>
      <p
        className={`text-sm ${
          data.rsi14.status === "Overbought"
            ? "text-red-500"
            : data.rsi14.status === "Oversold"
            ? "text-green-500"
            : "text-gray-500"
        }`}
      >
        RSI-14: {data.rsi14.value} ({data.rsi14.status})
      </p>
      <p className="text-sm text-gray-500">MACD: {data.macd.MACD}</p>
    </div>
  );
};

export default StockCard;
