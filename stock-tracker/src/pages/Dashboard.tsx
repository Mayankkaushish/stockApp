// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { fetchStockData } from "../utils/fetchStockData";
import { analyzeStock } from "../ai/aiAgent";
import testData from "../ai/testData";
import { USE_DUMMY_DATA } from "../config";

const Dashboard: React.FC = () => {
  const [symbolsInput, setSymbolsInput] = useState("TSLA, GOOG, NVDA");
  const [stocks, setStocks] = useState<any[]>([]);
  const [loadingSymbols, setLoadingSymbols] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleAnalyze = async () => {
    const symbols = symbolsInput
      .toUpperCase()
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    setLoadingSymbols(symbols);
    setStocks([]);

    if (USE_DUMMY_DATA) {
      const analysis = analyzeStock(testData);
      setStocks([
        {
          symbol: testData.symbol,
          latestPrice: testData.closePrices.at(-1),
          analysis,
        },
      ]);
    } else {
      const results = await Promise.all(
        symbols.map((symbol) => fetchStockData(symbol))
      );
      setStocks(results.filter((s) => s !== null));
    }

    setLoadingSymbols([]);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen py-6 px-4`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📊 AI Stock Dashboard</h1>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Light Mode"}
          </button>
        </div>
  
        <div className="mb-6 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={symbolsInput}
            onChange={(e) => setSymbolsInput(e.target.value)}
            placeholder="Enter symbols (comma separated)"
            className="flex-1 p-2 border rounded text-black"
          />
          <button
            onClick={handleAnalyze}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Analyze
          </button>
        </div>
  
        {loadingSymbols.length > 0 ? (
          <p>Loading: {loadingSymbols.join(", ")}...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className={`border p-4 rounded shadow transform transition duration-200 hover:scale-[1.02] hover:shadow-lg ${getColor(
                  stock.analysis.action,
                  darkMode
                )}`}
              >
                <h2 className="text-xl font-bold">{stock.symbol}</h2>
                <p>Price: ${stock.latestPrice}</p>
                <p>
                  Action: {stock.analysis.action} ({stock.analysis.confidence}%)
                </p>
                <p>MACD: {stock.analysis?.macd?.MACD ?? "N/A"}</p>
                <p>Signal: {stock.analysis?.macd?.signal ?? "N/A"}</p>
                <p>Histogram: {stock.analysis?.macd?.histogram ?? "N/A"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );  
};

const getColor = (action: string, darkMode: boolean) => {
  const base = darkMode ? "text-white" : "text-black";
  if (action === "Strong Buy") return `bg-green-600 ${base}`;
  if (action === "Weak Buy") return `bg-green-300 ${base}`;
  if (action === "Strong Sell") return `bg-red-600 ${base}`;
  if (action === "Weak Sell") return `bg-red-300 ${base}`;
  return darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black";
};

export default Dashboard;
