import express from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
} from "../controllers/purchaseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { downloadPurchaseInvoice } from "../controllers/purchaseController.js";

const router = express.Router();

router.route("/").get(protect, getPurchases).post(protect, createPurchase);
router.get("/:id/invoice", protect, downloadPurchaseInvoice);

router
  .route("/:id")
  .get(protect, getPurchaseById)
  .put(protect, updatePurchase)
  .delete(protect, deletePurchase);

export default router;
