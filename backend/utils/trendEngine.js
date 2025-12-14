export const computeTrends = (prev, curr) => {
  if (!prev) return null;

  const trend = {
    revenueChange: curr.analytics.totalRevenue - prev.analytics.totalRevenue,
    profitChange: curr.analytics.netProfit - prev.analytics.netProfit,
    marginChange: curr.analytics.netMargin - prev.analytics.netMargin
  };

  return trend;
};
