import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, adminOnly, getUsers);

router
  .route("/:id")
  .get(protect, adminOnly, getUserById)
  .put(protect, adminOnly, updateUser)
  .delete(protect, adminOnly, deleteUser);

export default router;
