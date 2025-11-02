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

router.route("/").get(protect, getCustomers).post(protect, createCustomer);

router.route("/import").post(protect, upload.single("file"), importCustomers);

router
  .route("/:id")
  .get(protect, getCustomerById)
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

export default router;
