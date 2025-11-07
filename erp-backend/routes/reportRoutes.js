import express from "express";
import {
  getSalesReport,
  getPurchasesReport,
  getStockReport,
  getRevenueTrend,
} from "../controllers/reportController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/sales", protect, adminOnly, getSalesReport);
router.get("/purchases", protect, adminOnly, getPurchasesReport);
router.get("/stock", protect, adminOnly, getStockReport);
router.get("/revenue-trend", protect, adminOnly, getRevenueTrend);

export default router;
