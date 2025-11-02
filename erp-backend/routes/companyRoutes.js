import express from "express";
import multer from "multer";
import path from "path";
import {
  getCompanyInfo,
  updateCompanyInfo,
} from "../controllers/companyController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup for logo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

router
  .route("/")
  .get(protect, adminOnly, getCompanyInfo)
  .put(protect, adminOnly, upload.single("logo"), updateCompanyInfo);

export default router;
