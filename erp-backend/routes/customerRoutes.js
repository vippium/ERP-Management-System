import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { importCustomers } from "../controllers/customerImportController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Manage customers and imports
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *   post:
 *     summary: Add a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created
 */

/**
 * @swagger
 * /api/customers/import:
 *   post:
 *     summary: Import customers from CSV file
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Customers imported
 */

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 */
router.route("/").get(protect, getCustomers).post(protect, createCustomer);
router.route("/import").post(protect, upload.single("file"), importCustomers);
router
  .route("/:id")
  .get(protect, getCustomerById)
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

export default router;
