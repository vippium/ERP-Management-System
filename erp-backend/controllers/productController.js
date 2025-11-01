import Product from "../models/productModel.js";

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Protected
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      sku,
      price,
      stock,
      reorderLevel,
      description,
      category,
      images,
      unit,
    } = req.body;

    if (!title || !sku || price == null || stock == null) {
      res.status(400);
      throw new Error("title, sku, price, and stock are required");
    }

    const exists = await Product.findOne({ sku });
    if (exists) {
      res.status(400);
      throw new Error("Product with this SKU already exists");
    }

    const product = await Product.create({
      title,
      sku,
      description,
      price,
      stock,
      reorderLevel,
      category,
      images,
      unit,
      createdBy: req.user?._id,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/products
 * @desc    List products with pagination and search
 * @access  Protected
 * Query params: page, limit, search
 */
export const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const search = req.query.search ? req.query.search.trim() : "";

    const filter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { sku: regex }, { category: regex }];
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by id
 * @access  Protected
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Protected
 */
export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Protected
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};
