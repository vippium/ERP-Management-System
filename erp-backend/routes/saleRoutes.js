import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
} from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { downloadSaleInvoice } from "../controllers/saleController.js";

const router = express.Router();

router.route("/").get(protect, getSales).post(protect, createSale);
router.get("/:id/invoice", protect, downloadSaleInvoice);

router
  .route("/:id")
  .get(protect, getSaleById)
  .put(protect, updateSale)
  .delete(protect, deleteSale);

export default router;
