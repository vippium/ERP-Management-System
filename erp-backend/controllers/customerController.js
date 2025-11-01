import Customer from "../models/customerModel.js";

// @desc    Create customer
// @route   POST /api/customers
// @access  Protected
export const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      createdBy: req.user?._id,
    });
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all customers (with search + pagination)
// @route   GET /api/customers
export const getCustomers = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const search = req.query.search ? req.query.search.trim() : "";

    const filter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const total = await Customer.countDocuments(filter);
    const data = await Customer.find(filter)
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

// @desc    Get single customer
// @route   GET /api/customers/:id
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).lean();
    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
export const updateCustomer = async (req, res, next) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      res.status(404);
      throw new Error("Customer not found");
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
export const deleteCustomer = async (req, res, next) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404);
      throw new Error("Customer not found");
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    next(err);
  }
};
