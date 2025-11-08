import express from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Manage supplier records
 */

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update supplier by ID
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete supplier by ID
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 */
router.route("/").get(protect, getSuppliers).post(protect, createSupplier);
router
  .route("/:id")
  .get(protect, getSupplierById)
  .put(protect, updateSupplier)
  .delete(protect, deleteSupplier);

export default router;
