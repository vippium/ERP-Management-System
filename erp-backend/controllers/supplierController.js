import Supplier from "../models/supplierModel.js";

// @desc    Create supplier
// @route   POST /api/suppliers
// @access  Protected
export const createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create({
      ...req.body,
      createdBy: req.user?._id,
    });
    res.status(201).json(supplier);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all suppliers (with search + pagination)
// @route   GET /api/suppliers
export const getSuppliers = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const search = req.query.search ? req.query.search.trim() : "";

    const filter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { company: regex }, { email: regex }];
    }

    const total = await Supplier.countDocuments(filter);
    const data = await Supplier.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
export const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id).lean();
    if (!supplier) {
      res.status(404);
      throw new Error("Supplier not found");
    }
    res.json(supplier);
  } catch (err) {
    next(err);
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
export const updateSupplier = async (req, res, next) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      res.status(404);
      throw new Error("Supplier not found");
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
export const deleteSupplier = async (req, res, next) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404);
      throw new Error("Supplier not found");
    }
    res.json({ message: "Supplier deleted successfully" });
  } catch (err) {
    next(err);
  }
};
