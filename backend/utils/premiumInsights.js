export const generatePremiumInsights = (analytics, inputs = {}) => {
  const insights = [];
  const totalRevenue = analytics.totalRevenue || 0;
  const cogs = analytics.cogs || 0;
  const totalExpenses = analytics.totalExpenses || 0;
  const netProfit = analytics.netProfit || 0;
  const netMargin = analytics.netMargin || 0;

  // ===== PROFIT QUALITY INDEX =====
  if (netMargin > 20) {
    analytics.pqi = "High (Very Healthy)";
    insights.push("Excellent! Your profit margin exceeds 20%, indicating very healthy profitability. This is well above industry averages for most small businesses.");
  } else if (netMargin > 15) {
    analytics.pqi = "Good (Healthy)";
    insights.push("Great performance! Your profit margin is above 15%, showing strong financial health. Consider strategies to maintain or improve this level.");
  } else if (netMargin > 10) {
    analytics.pqi = "Medium (Stable)";
    insights.push("Your profitability is stable with a margin above 10%. There's room for improvement through cost optimization and revenue growth strategies.");
  } else if (netMargin > 5) {
    analytics.pqi = "Low (Needs Attention)";
    insights.push("Your net profit margin is below 10%, which requires attention. Focus on reducing costs or increasing revenue to improve profitability.");
  } else if (netMargin > 0) {
    analytics.pqi = "Very Low (Critical)";
    insights.push("Warning: Your profit margin is very low. Immediate action is needed to reduce expenses or increase revenue to ensure business sustainability.");
  } else {
    analytics.pqi = "Negative (Loss)";
    insights.push("Critical: Your business is operating at a loss. Urgent review of expenses and revenue streams is necessary to return to profitability.");
  }

  // ===== EXPENSE HEALTH SCORE =====
  const expenseRatio = totalRevenue > 0 ? totalExpenses / totalRevenue : 1;
  
  if (expenseRatio <= 0.50) {
    analytics.expenseScore = 90;
    insights.push("Outstanding expense management! Your expenses are less than 50% of revenue, indicating excellent cost control.");
  } else if (expenseRatio <= 0.60) {
    analytics.expenseScore = 80;
    insights.push("Good expense control. Your expenses are well-managed relative to revenue.");
  } else if (expenseRatio <= 0.70) {
    analytics.expenseScore = 70;
    insights.push("Moderate expense levels. Consider reviewing and optimizing operational costs to improve margins.");
  } else if (expenseRatio <= 0.80) {
    analytics.expenseScore = 60;
    insights.push("Expenses are high relative to revenue. Focus on cost reduction strategies to improve profitability.");
  } else if (expenseRatio <= 0.90) {
    analytics.expenseScore = 50;
    insights.push("Warning: Expenses exceed 80% of revenue. Significant cost reduction is needed to maintain profitability.");
  } else {
    analytics.expenseScore = 30;
    insights.push("Critical: Expenses are consuming most of your revenue. Immediate cost-cutting measures are essential.");
  }

  // ===== GROSS PROFIT ANALYSIS =====
  const grossProfit = totalRevenue - cogs;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  if (grossMargin > 50) {
    insights.push("Excellent gross margin! Your cost of goods sold is well-controlled, leaving significant room for operating expenses.");
  } else if (grossMargin > 30) {
    insights.push("Good gross margin indicates effective pricing and cost management for your products/services.");
  } else if (grossMargin < 20) {
    insights.push("Low gross margin detected. Consider reviewing pricing strategies or negotiating better supplier terms to improve COGS.");
  }

  // ===== EXPENSE CATEGORY ANALYSIS =====
  const expenses = analytics.expenses || {};

  // Marketing spend analysis
  const marketingRatio = totalRevenue > 0 ? (expenses.marketing || 0) / totalRevenue : 0;
  if (marketingRatio > 0.20) {
    insights.push("Marketing spend exceeds 20% of revenue. Evaluate ROI on marketing campaigns to ensure they're generating sufficient returns.");
  } else if (marketingRatio < 0.05 && totalRevenue > 0) {
    insights.push("Consider increasing marketing investment if you're looking to grow. Current spend is below 5% of revenue.");
  }

  // Salary analysis
  const salaryRatio = totalRevenue > 0 ? (expenses.salaries || 0) / totalRevenue : 0;
  if (salaryRatio > 0.50) {
    insights.push("Salary costs exceed 50% of revenue. Review staffing levels and consider productivity improvements or automation.");
  }

  // Rent analysis
  const rentRatio = totalRevenue > 0 ? (expenses.rent || 0) / totalRevenue : 0;
  if (rentRatio > 0.15) {
    insights.push("Rent/lease costs are high relative to revenue. Consider renegotiating lease terms or exploring more cost-effective locations.");
  }

  // Utilities analysis
  const utilitiesRatio = totalRevenue > 0 ? (expenses.utilities || 0) / totalRevenue : 0;
  if (utilitiesRatio > 0.10) {
    insights.push("Utility expenses are elevated. Audit for energy efficiency opportunities or consider switching providers.");
  }

  // Interest analysis
  if ((expenses.interest || 0) > 0) {
    const interestRatio = totalRevenue > 0 ? expenses.interest / totalRevenue : 0;
    if (interestRatio > 0.10) {
      insights.push("High interest expenses detected. Consider refinancing options or debt consolidation to reduce financial charges.");
    }
  }

  // ===== REVENUE ANALYSIS =====
  const otherIncomeRatio = totalRevenue > 0 ? (inputs.otherIncome || 0) / totalRevenue : 0;
  if (otherIncomeRatio > 0.30) {
    insights.push("Significant portion of revenue comes from other income sources. Ensure these are sustainable and recurring.");
  }

  // ===== PROFITABILITY TRENDS =====
  if (netProfit > 0 && netMargin > 15) {
    insights.push("Strong profitability position! Focus on scaling operations while maintaining current efficiency levels.");
  }

  if (netProfit < 0) {
    insights.push("Operating at a loss. Prioritize: 1) Increase revenue through marketing/sales, 2) Reduce non-essential expenses, 3) Review pricing strategy.");
  }

  // ===== STRATEGIC RECOMMENDATIONS =====
  if (netMargin < 10) {
    insights.push("Strategic recommendation: Focus on improving net margin by either increasing prices (if market allows) or reducing variable costs.");
  }

  if (expenseRatio > 0.70) {
    insights.push("Strategic recommendation: Conduct a detailed expense audit. Identify and eliminate non-essential costs to improve bottom line.");
  }

  if (grossMargin > 40 && netMargin < 10) {
    insights.push("High gross margin but low net margin suggests operating expenses are too high. Focus on operational efficiency improvements.");
  }

  // ===== GENERAL BEST PRACTICES =====
  insights.push("Best practice: Regularly review and compare monthly performance to identify trends and make timely adjustments.");
  insights.push("Best practice: Maintain an emergency fund equivalent to 3-6 months of operating expenses for financial stability.");

  return insights;
};
