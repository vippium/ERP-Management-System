import Purchase from "../models/purchaseModel.js";
import Product from "../models/productModel.js";
import { generateInvoice } from "../utils/generateInvoice.js";

/**
 * @route   POST /api/purchases
 * @desc    Create a new purchase order
 * @access  Protected
 */
export const createPurchase = async (req, res, next) => {
  try {
    const { supplier, items, totalAmount, notes, status } = req.body;

    if (!supplier || !items?.length) {
      res.status(400);
      throw new Error("Supplier and at least one item are required");
    }

    // Calculate subtotals and total
    const normalizedItems = items.map((it) => ({
      product: it.product,
      quantity: it.quantity,
      price: it.price,
      subtotal: it.quantity * it.price,
    }));

    const total = normalizedItems.reduce((sum, i) => sum + i.subtotal, 0);

    const purchase = await Purchase.create({
      supplier,
      items: normalizedItems,
      totalAmount: total,
      notes,
      status: status || "Pending",
      createdBy: req.user?._id,
    });

    // If marked completed, increase product stock
    if (purchase.status === "Completed") {
      for (const item of normalizedItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    res.status(201).json(purchase);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/purchases
 * @desc    Get all purchases (paginated)
 * @access  Protected
 */
export const getPurchases = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const total = await Purchase.countDocuments();
    const purchases = await Purchase.find()
      .populate("supplier", "name company email")
      .populate("items.product", "title sku price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: purchases,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/purchases/:id
 * @desc    Get single purchase
 * @access  Protected
 */
export const getPurchaseById = async (req, res, next) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier", "name company email phone")
      .populate("items.product", "title sku price stock")
      .lean();

    if (!purchase) {
      res.status(404);
      throw new Error("Purchase not found");
    }

    res.json(purchase);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PUT /api/purchases/:id
 * @desc    Update purchase (if status changed to Completed, update stock)
 * @access  Protected
 */
export const updatePurchase = async (req, res, next) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      res.status(404);
      throw new Error("Purchase not found");
    }

    const prevStatus = purchase.status;
    Object.assign(purchase, req.body);
    const updated = await purchase.save();

    // If status changed to Completed, increase stock
    if (prevStatus !== "Completed" && updated.status === "Completed") {
      for (const item of updated.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   DELETE /api/purchases/:id
 * @desc    Delete purchase
 * @access  Protected
 */
export const deletePurchase = async (req, res, next) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) {
      res.status(404);
      throw new Error("Purchase not found");
    }

    res.json({ message: "Purchase deleted" });
  } catch (err) {
    next(err);
  }
};

export const downloadPurchaseInvoice = async (req, res, next) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier", "name company email phone")
      .populate("items.product", "title price")
      .lean();

    if (!purchase) {
      res.status(404);
      throw new Error("Purchase not found");
    }

    generateInvoice(res, "purchase", purchase);
  } catch (err) {
    next(err);
  }
};
