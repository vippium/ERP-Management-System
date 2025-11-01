import Sale from "../models/saleModel.js";
import Product from "../models/productModel.js";
import { generateInvoice } from "../utils/generateInvoice.js";

/**
 * @route   POST /api/sales
 * @desc    Create a new sale
 * @access  Protected
 */
export const createSale = async (req, res, next) => {
  try {
    const { customer, items, totalAmount, notes, status } = req.body;

    if (!customer || !items?.length) {
      res.status(400);
      throw new Error("Customer and at least one item are required");
    }

    // Compute subtotals and total
    const normalizedItems = items.map((it) => ({
      product: it.product,
      quantity: it.quantity,
      price: it.price,
      subtotal: it.quantity * it.price,
    }));

    const total = normalizedItems.reduce((sum, i) => sum + i.subtotal, 0);

    const sale = await Sale.create({
      customer,
      items: normalizedItems,
      totalAmount: total,
      notes,
      status: status || "Pending",
      createdBy: req.user?._id,
    });

    // If completed, decrease product stock
    if (sale.status === "Completed") {
      for (const item of normalizedItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    res.status(201).json(sale);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/sales
 * @desc    List all sales (paginated)
 * @access  Protected
 */
export const getSales = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const total = await Sale.countDocuments();
    const sales = await Sale.find()
      .populate("customer", "name email phone")
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
      data: sales,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/sales/:id
 * @desc    Get sale by id
 * @access  Protected
 */
export const getSaleById = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("items.product", "title sku price stock")
      .lean();

    if (!sale) {
      res.status(404);
      throw new Error("Sale not found");
    }

    res.json(sale);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PUT /api/sales/:id
 * @desc    Update sale (if status changes to Completed, reduce stock)
 * @access  Protected
 */
export const updateSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      res.status(404);
      throw new Error("Sale not found");
    }

    const prevStatus = sale.status;
    Object.assign(sale, req.body);
    const updated = await sale.save();

    // If status changed to Completed, reduce stock
    if (prevStatus !== "Completed" && updated.status === "Completed") {
      for (const item of updated.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   DELETE /api/sales/:id
 * @desc    Delete sale
 * @access  Protected
 */
export const deleteSale = async (req, res, next) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      res.status(404);
      throw new Error("Sale not found");
    }

    res.json({ message: "Sale deleted" });
  } catch (err) {
    next(err);
  }
};

export const downloadSaleInvoice = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("items.product", "title price")
      .lean();

    if (!sale) {
      res.status(404);
      throw new Error("Sale not found");
    }

    generateInvoice(res, "sale", sale);
  } catch (err) {
    next(err);
  }
};
