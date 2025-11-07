import express from "express";
import { getLowStockProducts } from "../controllers/stockController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/alerts", protect, adminOnly, getLowStockProducts);

export default router;
