import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { createAnalysis, getLatest, getHistory, getComparison, generatePDF } from "../controllers/analysisController.js";

const router = express.Router();

router.post("/create", auth, createAnalysis);
router.get("/latest", auth, getLatest);
router.get("/history", auth, getHistory);
router.get("/comparison/:periodId", auth, getComparison);
router.post("/pdf", auth, generatePDF);

export default router;
