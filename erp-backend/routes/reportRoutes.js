import express from "express";
import {
  getSalesReport,
  getPurchasesReport,
  getStockReport,
  getRevenueTrend,
} from "../controllers/reportController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Admin analytics and report endpoints
 */

/**
 * @swagger
 * /api/reports/sales:
 *   get:
 *     summary: Get sales report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns aggregated sales data
 */

/**
 * @swagger
 * /api/reports/purchases:
 *   get:
 *     summary: Get purchases report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns purchase summary
 */

/**
 * @swagger
 * /api/reports/stock:
 *   get:
 *     summary: Get current stock report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns stock-level analytics
 */

/**
 * @swagger
 * /api/reports/revenue-trend:
 *   get:
 *     summary: Get revenue trend report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns time-based revenue trend
 */
router.get("/sales", protect, adminOnly, getSalesReport);
router.get("/purchases", protect, adminOnly, getPurchasesReport);
router.get("/stock", protect, adminOnly, getStockReport);
router.get("/revenue-trend", protect, adminOnly, getRevenueTrend);

export default router;
