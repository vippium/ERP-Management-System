import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, default: 0 },
    category: { type: String, default: "" },
    images: [{ type: String }],
    unit: { type: String, default: "pcs" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
