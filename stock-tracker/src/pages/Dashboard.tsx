import React from "react";
import StockCard from "../components/StockCard";

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StockCard symbol="TSLA" />
      <StockCard symbol="AAPL" />
      <StockCard symbol="GOOGL" />
    </div>
  );
};

export default Dashboard;
