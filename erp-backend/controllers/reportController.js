import asyncHandler from "express-async-handler";
import Sale from "../models/saleModel.js";
import Purchase from "../models/purchaseModel.js";
import Product from "../models/productModel.js";
import { Parser } from "json2csv";

export const getSalesReport = asyncHandler(async (req, res) => {
  const sales = await Sale.find()
    .populate("customer", "name email")
    .populate("items.product", "title sku")
    .lean();

  const rows = sales.map((s) => ({
    InvoiceID: s._id,
    Customer: s.customer?.name || "N/A",
    Date: new Date(s.createdAt).toLocaleDateString(),
    TotalAmount: s.totalAmount,
    Status: s.status,
    Items: s.items
      .map((i) => `${i.product?.title || ""} (${i.quantity}x₹${i.price})`)
      .join("; "),
  }));

  const csv = new Parser().parse(rows);
  res.header("Content-Type", "text/csv");
  res.attachment("sales-report.csv");
  res.send(csv);
});

export const getPurchasesReport = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find()
    .populate("supplier", "name company")
    .populate("items.product", "title sku")
    .lean();

  const rows = purchases.map((p) => ({
    InvoiceID: p._id,
    Supplier: p.supplier?.name || "N/A",
    Date: new Date(p.createdAt).toLocaleDateString(),
    TotalAmount: p.totalAmount,
    Status: p.status,
    Items: p.items
      .map((i) => `${i.product?.title || ""} (${i.quantity}x₹${i.price})`)
      .join("; "),
  }));

  const csv = new Parser().parse(rows);
  res.header("Content-Type", "text/csv");
  res.attachment("purchases-report.csv");
  res.send(csv);
});

export const getStockReport = asyncHandler(async (req, res) => {
  const products = await Product.find().lean();

  const rows = products.map((p) => ({
    Product: p.title,
    SKU: p.sku,
    Category: p.category || "",
    Price: p.price,
    Stock: p.stock,
    ReorderLevel: p.reorderLevel,
  }));

  const csv = new Parser().parse(rows);
  res.header("Content-Type", "text/csv");
  res.attachment("stock-report.csv");
  res.send(csv);
});

// ✅ NEW: Revenue trend (for dashboard analytics)
export const getRevenueTrend = asyncHandler(async (req, res) => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);

  const result = await Sale.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = result.map((r) => ({
    month: months[r._id.month - 1],
    revenue: r.revenue,
  }));

  res.json(data);
});
