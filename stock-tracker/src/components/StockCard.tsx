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
      <p className="text-xl font-semibold text-blue-600">${data.latestPrice.toFixed(2)}</p>
      <p className="text-sm text-gray-500">Action: {data.analysis.action} ({data.analysis.confidence}%)</p>

      <p className="text-sm text-gray-500">MACD: {data.analysis.macd.MACD.toFixed(2)}</p>
      <p className="text-sm text-gray-500">MACD Signal: {data.analysis.macd.signal.toFixed(2)}</p>
      <p className="text-sm text-gray-500">MACD Histogram: {data.analysis.macd.histogram.toFixed(2)}</p>

      {/* ✅ Add Candlestick Pattern Display */}
      <p className={`text-sm font-bold ${data.analysis.candlestickPattern !== "None" ? "text-green-500" : "text-gray-500"}`}>
        Candlestick Pattern: {data.analysis.candlestickPattern}
      </p>
    </div>
  );
};

export default StockCard;
