import express from "express";
import multer from "multer";
import path from "path";
import {
  getCompanyInfo,
  updateCompanyInfo,
} from "../controllers/companyController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Manage company details and logo
 */

/**
 * @swagger
 * /api/company:
 *   get:
 *     summary: Get company information
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company information fetched successfully
 *   put:
 *     summary: Update company information and logo
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Company info updated
 */
router
  .route("/")
  .get(protect, adminOnly, getCompanyInfo)
  .put(protect, adminOnly, upload.single("logo"), updateCompanyInfo);

export default router;
