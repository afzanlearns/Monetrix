import AnalysisRecord from "../models/AnalysisRecord.js";
import { computeTrends } from "../utils/trendEngine.js";
import { generatePremiumInsights } from "../utils/premiumInsights.js";

export const createAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;
    const inputs = req.body;

    // ======= CORE CALCULATIONS =======
    const totalRevenue = (inputs.totalRevenue || 0) + (inputs.otherIncome || 0);

    const cogs = 
      (inputs.openingStock || 0) + 
      (inputs.purchases || 0) + 
      (inputs.directLabor || 0) - 
      (inputs.closingStock || 0);

    const totalExpenses =
      (inputs.rent || 0) +
      (inputs.salaries || 0) +
      (inputs.utilities || 0) +
      (inputs.marketing || 0) +
      (inputs.adminExpenses || 0) +
      (inputs.depreciation || 0) +
      (inputs.insurance || 0) +
      (inputs.professionalFees || 0) +
      (inputs.interest || 0);

    const grossProfit = totalRevenue - cogs;
    const netProfit = grossProfit - totalExpenses;
    const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const analytics = {
      totalRevenue,
      cogs,
      grossProfit,
      totalExpenses,
      netProfit,
      netMargin,
      expenses: {
        rent: inputs.rent || 0,
        salaries: inputs.salaries || 0,
        utilities: inputs.utilities || 0,
        marketing: inputs.marketing || 0,
        adminExpenses: inputs.adminExpenses || 0,
        depreciation: inputs.depreciation || 0,
        insurance: inputs.insurance || 0,
        professionalFees: inputs.professionalFees || 0,
        interest: inputs.interest || 0
      }
    };

    // ======= PREMIUM INSIGHTS =======
    const insights = generatePremiumInsights(analytics, inputs);

    // ======= SAVE TO DATABASE =======
    const record = await AnalysisRecord.create({
      userId,
      periodLabel: inputs.periodLabel,
      businessName: inputs.businessName,
      inputs,
      analytics,
      insights
    });

    res.json({ analytics, insights });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getLatest = async (req, res) => {
  try {
    const rec = await AnalysisRecord.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!rec) {
      return res.status(404).json({ message: "No analysis found" });
    }
    res.json(rec);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getHistory = async (req, res) => {
  try {
    const records = await AnalysisRecord.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20); // Limit to last 20 records

    res.json({ records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getComparison = async (req, res) => {
  try {
    const { periodId } = req.params;
    
    const currentRecord = await AnalysisRecord.findOne({ 
      _id: periodId, 
      userId: req.user._id 
    });

    if (!currentRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Get previous record
    const previousRecord = await AnalysisRecord.findOne({
      userId: req.user._id,
      createdAt: { $lt: currentRecord.createdAt }
    }).sort({ createdAt: -1 });

    if (!previousRecord) {
      return res.json({ 
        current: currentRecord,
        previous: null,
        trends: null
      });
    }

    const trends = computeTrends(previousRecord, currentRecord);

    res.json({
      current: currentRecord,
      previous: previousRecord,
      trends
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generatePDF = async (req, res) => {
  try {
    const analysisData = req.body;
    const analytics = analysisData.analytics || {};
    const insights = analysisData.insights || [];
    
    // Create a simple HTML-based report
    const insightsHtml = insights.length > 0 
      ? insights.map(insight => `<div class="insight">• ${insight}</div>`).join('')
      : '<p>No insights available.</p>';
    
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Monetrix Analysis Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    h1 { color: #38bdf8; text-align: center; }
    h2 { color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px; }
    .metric { margin: 10px 0; }
    .insight { margin: 5px 0; padding-left: 20px; }
  </style>
</head>
<body>
  <h1>Monetrix Financial Analysis</h1>
  <h2>Business Information</h2>
  <p><strong>Business:</strong> ${analysisData.businessName || 'N/A'}</p>
  <p><strong>Period:</strong> ${analysisData.periodLabel || 'N/A'}</p>
  <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
  
  <h2>Financial Metrics</h2>
  <div class="metric"><strong>Total Revenue:</strong> ₹${(analytics.totalRevenue || 0).toLocaleString()}</div>
  <div class="metric"><strong>COGS:</strong> ₹${(analytics.cogs || 0).toLocaleString()}</div>
  <div class="metric"><strong>Gross Profit:</strong> ₹${((analytics.totalRevenue || 0) - (analytics.cogs || 0)).toLocaleString()}</div>
  <div class="metric"><strong>Total Expenses:</strong> ₹${(analytics.totalExpenses || 0).toLocaleString()}</div>
  <div class="metric"><strong>Net Profit:</strong> ₹${(analytics.netProfit || 0).toLocaleString()}</div>
  <div class="metric"><strong>Net Margin:</strong> ${(analytics.netMargin || 0).toFixed(2)}%</div>
  
  <h2>AI Insights</h2>
  ${insightsHtml}
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename=monetrix-analysis-${new Date().toISOString().split('T')[0]}.html`);
    res.send(htmlContent);
    
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ 
      message: "PDF generation failed. Please use JSON export instead.",
      error: err.message 
    });
  }
};
