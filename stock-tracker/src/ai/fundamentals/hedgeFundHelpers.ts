export const computeHedgeFundScore = (leverageRatio: number, dataDate: string): number => {
    if (!leverageRatio || !dataDate) return 0;
  
    const now = new Date();
    const lastUpdate = new Date(dataDate);
    const diffDays = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
  
    console.log(`📅 Hedge Fund Data Age: ${diffDays} days`);
  
    // Max confidence if data is less than 45 days old
    let decayMultiplier = 1;
    if (diffDays > 90) decayMultiplier = 0;
    else if (diffDays > 45) decayMultiplier = 0.5;
  
    // Base score logic
    let baseScore = 0;
    if (leverageRatio > 22) baseScore = 15;
    else if (leverageRatio > 18) baseScore = 10;
    else if (leverageRatio > 15) baseScore = 5;
    else if (leverageRatio > 12) baseScore = 0;
    else if (leverageRatio > 10) baseScore = -5;
    else baseScore = -10;
  
    return parseFloat((baseScore * decayMultiplier).toFixed(2));
  };
  