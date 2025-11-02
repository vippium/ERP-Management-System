import express from "express";
import { getAdminOverview } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, adminOnly, getAdminOverview);

export default router;
