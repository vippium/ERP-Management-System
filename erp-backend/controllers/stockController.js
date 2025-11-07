import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

/**
 * GET /api/stock/alerts
 * Returns all products whose stock ≤ reorderLevel.
 * Access: Admin only
 */
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const lowStock = await Product.find({
    $expr: { $lte: ["$stock", "$reorderLevel"] },
  }).select("title sku stock reorderLevel category price");

  res.json({
    count: lowStock.length,
    items: lowStock,
  });
});
