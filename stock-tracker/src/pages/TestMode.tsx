import React from "react";
import testData from "../ai/testData";
import { analyzeStock } from "../ai/aiAgent";

const TestMode: React.FC = () => {
  const analysis = analyzeStock(testData);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔬 Test Mode (Dummy Data)</h1>
      <div className={`border p-4 rounded shadow ${getColor(analysis.action)}`}>
        <h2 className="text-xl">{testData.symbol}</h2>
        <p>Close: ${testData.closePrices.at(-1)}</p>
        <p>Action: {analysis.action} ({analysis.confidence}%)</p>
      </div>
    </div>
  );
};

const getColor = (action: string) => {
  if (action === "Strong Buy") return "bg-green-500 text-white";
  if (action === "Weak Buy") return "bg-green-300";
  if (action === "Strong Sell") return "bg-red-500 text-white";
  if (action === "Weak Sell") return "bg-red-300";
  return "bg-gray-100";
};

export default TestMode;
