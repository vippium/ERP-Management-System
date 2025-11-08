import express from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
  downloadPurchaseInvoice,
} from "../controllers/purchaseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: Manage purchase orders and invoices
 */

/**
 * @swagger
 * /api/purchases:
 *   get:
 *     summary: Get all purchase orders
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a new purchase order
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/purchases/{id}:
 *   get:
 *     summary: Get purchase by ID
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update purchase order
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete purchase order
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/purchases/{id}/invoice:
 *   get:
 *     summary: Download purchase invoice by ID
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF invoice downloaded
 */
router.route("/").get(protect, getPurchases).post(protect, createPurchase);
router.get("/:id/invoice", protect, downloadPurchaseInvoice);
router
  .route("/:id")
  .get(protect, getPurchaseById)
  .put(protect, updatePurchase)
  .delete(protect, deletePurchase);

export default router;
