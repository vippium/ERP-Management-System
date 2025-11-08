import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  downloadSaleInvoice,
} from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Manage sales orders and invoices
 */

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get all sales orders
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get sale by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update sale order
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/sales/{id}/invoice:
 *   get:
 *     summary: Download sale invoice by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sale invoice downloaded
 */
router.route("/").get(protect, getSales).post(protect, createSale);
router.get("/:id/invoice", protect, downloadSaleInvoice);
router
  .route("/:id")
  .get(protect, getSaleById)
  .put(protect, updateSale)
  .delete(protect, deleteSale);

export default router;
