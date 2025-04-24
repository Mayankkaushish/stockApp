// import React, { useEffect, useState } from "react";
// import { fetchStockData } from "./utils/fetchStockData";
// import { analyzeStock } from "./ai/aiAgent";
// import  testData  from "./ai/testData";

// const USE_DUMMY_DATA = true; // 🔀 Toggle this to true for testing dummy data
// const symbols = ["TSLA","IONQ","GOOG","NVDA"]; // Real stocks used when dummy data is off

// const App: React.FC = () => {
//   const [stocks, setStocks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (USE_DUMMY_DATA) {
//         const analysis = analyzeStock(testData);
//         setStocks([
//           {
//             symbol: testData.symbol,
//             latestPrice: testData.closePrices.at(-1),
//             analysis,
//           },
//         ]);
//         setLoading(false);
//       } else {
//         const results = await Promise.all(
//           symbols.map((symbol) => fetchStockData(symbol))
//         );
//         setStocks(results.filter((stock) => stock !== null));
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <p>Loading stock data...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">AI Stock Analysis</h1>
//       {stocks.map((stock) => (
//         <div
//           key={stock.symbol}
//           className={`border p-4 m-2 rounded shadow ${getColor(
//             stock.analysis.action
//           )}`}
//         >
//           <h2 className="text-xl">{stock.symbol}</h2>
//           <p>Price: ${stock.latestPrice}</p>
//           <p>
//             Action: {stock.analysis.action} ({stock.analysis.confidence}%)
//           </p>
//           <p>MACD: {stock.analysis?.macd?.MACD ?? "N/A"}</p>
//           <p>MACD Signal: {stock.analysis?.macd?.signal ?? "N/A"}</p>
//           <p>MACD Histogram: {stock.analysis?.macd?.histogram ?? "N/A"}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// const getColor = (action: string) => {
//   if (action === "Strong Buy") return "bg-green-500 text-white";
//   if (action === "Weak Buy") return "bg-green-300";
//   if (action === "Strong Sell") return "bg-red-500 text-white";
//   if (action === "Weak Sell") return "bg-red-300";
//   return "bg-gray-100";
// };

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TestMode from "./pages/TestMode";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/test" element={<TestMode />} />
      </Routes>
    </Router>
  );
};

export default App;
