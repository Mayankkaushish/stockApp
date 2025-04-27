export interface BollingerData {
  upper: number;
  lower: number;
}

export interface SqueezeResult {
  isSqueeze: boolean;
  squeezeWidth: number;
}

export const detectBollingerBandSqueeze = (bollingerData: BollingerData[]): SqueezeResult => {
  const widths = bollingerData.map(b => parseFloat((b.upper - b.lower).toFixed(4)));
  const avgWidth = parseFloat(
    (widths.reduce((sum, w) => sum + w, 0) / widths.length).toFixed(4)
  );
  const latestWidth = widths.at(-1) ?? 0;

  console.log("📏 Bollinger Widths:", widths.slice(-5));
  console.log("📉 Avg Width:", avgWidth);
  console.log("📌 Latest Width:", latestWidth);

  const isSqueeze = latestWidth < avgWidth * 0.5;

  return {
    isSqueeze,
    squeezeWidth: latestWidth,
  };
};
