import mongoose from "mongoose";

const analysisRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    periodLabel: String,
    businessName: String,

    inputs: {},

    analytics: {
      totalRevenue: Number,
      cogs: Number,
      grossProfit: Number,
      totalExpenses: Number,
      netProfit: Number,
      netMargin: Number,
      pqi: String,
      expenseScore: Number,

      expenses: {}
    },

    insights: [String]
  },
  { timestamps: true }
);

export default mongoose.model("AnalysisRecord", analysisRecordSchema);
