import Product from "../models/productModel.js";
import Customer from "../models/customerModel.js";
import Supplier from "../models/supplierModel.js";
import Purchase from "../models/purchaseModel.js";
import Sale from "../models/saleModel.js";
import asyncHandler from "express-async-handler";

/**
 * GET /api/admin/overview
 * Admin-only: returns counts & simple revenue sum
 */
export const getAdminOverview = asyncHandler(async (req, res) => {
  const [
    productsCount,
    customersCount,
    suppliersCount,
    purchasesCount,
    salesCount,
  ] = await Promise.all([
    Product.countDocuments(),
    Customer.countDocuments(),
    Supplier.countDocuments(),
    Purchase.countDocuments(),
    Sale.countDocuments(),
  ]);

  // compute total revenue from sales (sum totalAmount)
  const revenueAgg = await Sale.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
  ]);
  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  // compute total purchase amount (expense)
  const purchaseAgg = await Purchase.aggregate([
    { $group: { _id: null, totalPurchases: { $sum: "$totalAmount" } } },
  ]);
  const totalPurchases = purchaseAgg[0]?.totalPurchases || 0;

  res.json({
    productsCount,
    customersCount,
    suppliersCount,
    purchasesCount,
    salesCount,
    totalRevenue,
    totalPurchases,
  });
});
