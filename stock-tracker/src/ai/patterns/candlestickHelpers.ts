import {
    bullishengulfingpattern,
    bearishengulfingpattern,
    doji,
    eveningstar,
    morningstar,
    threeblackcrows,
    threewhitesoldiers,
  } from "technicalindicators";
  
  interface CandleInput {
    open: number[];
    high: number[];
    low: number[];
    close: number[];
  }
  
  export const detectCandlestickPattern = (data: CandleInput): string => {
    const last2: CandleInput = {
      open: data.open.slice(-2),
      high: data.high.slice(-2),
      low: data.low.slice(-2),
      close: data.close.slice(-2),
    };
  
    const last3: CandleInput = {
      open: data.open.slice(-3),
      high: data.high.slice(-3),
      low: data.low.slice(-3),
      close: data.close.slice(-3),
    };
  
    if (bullishengulfingpattern(last2)) return "Bullish Engulfing";
    if (bearishengulfingpattern(last2)) return "Bearish Engulfing";
    if (doji(last3)) return "Doji";
    if (eveningstar(last3)) return "Evening Star";
    if (morningstar(last3)) return "Morning Star";
    if (threeblackcrows(last3)) return "Three Black Crows";
    if (threewhitesoldiers(last3)) return "Three White Soldiers";
  
    return "None";
  };
  