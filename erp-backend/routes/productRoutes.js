import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getProducts)
  .post(protect, createProduct);

router.route("/:id")
  .get(protect, getProductById)
  .put(protect, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router;
