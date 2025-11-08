import express from "express";
import { getAdminOverview } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-specific management and overview APIs
 */

/**
 * @swagger
 * /api/admin/overview:
 *   get:
 *     summary: Get admin dashboard overview
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview data for admin dashboard
 */
router.get("/overview", protect, adminOnly, getAdminOverview);

export default router;
