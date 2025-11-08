import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/reports", reportRoutes);

// Swagger docs Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.send("🚀 ERP Backend API is running..."));

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
  console.log(`📡 Visit: http://localhost:${PORT}/`);
  console.log(`📘 API Docs: http://localhost:${PORT}/api-docs`);
});
