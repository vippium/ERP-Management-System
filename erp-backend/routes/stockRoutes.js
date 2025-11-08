import express from "express";
import { getLowStockProducts } from "../controllers/stockController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stock
 *   description: Manage and view stock alerts
 */

/**
 * @swagger
 * /api/stock/alerts:
 *   get:
 *     summary: Get products with low stock
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock product list
 */
router.get("/alerts", protect, adminOnly, getLowStockProducts);

export default router;
