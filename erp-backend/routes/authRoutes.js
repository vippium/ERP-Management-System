import express from "express";
import {
  loginUser,
  registerUser,
  getProfile,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

// ✅ Example admin-only test route
router.get("/admin-stats", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin 👑" });
});

export default router;
