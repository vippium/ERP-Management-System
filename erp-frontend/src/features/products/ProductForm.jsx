import { useEffect, useState } from "react";
import api from "../../api/api.js";
import toast from "react-hot-toast";
import { IconPackage, IconEdit, IconX } from "@tabler/icons-react";
import "../../styles/forms.css";
import "../../styles/buttons.css";

const ProductForm = ({ editingProduct, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    sku: "",
    price: "",
    stock: "",
    reorderLevel: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.title,
        sku: editingProduct.sku,
        price: editingProduct.price,
        stock: editingProduct.stock,
        reorderLevel: editingProduct.reorderLevel,
        category: editingProduct.category || "",
        description: editingProduct.description || "",
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const action = editingProduct
      ? api.put(`/products/${editingProduct._id}`, formData)
      : api.post("/products", formData);

    toast.promise(action, {
      loading: editingProduct ? "Updating product..." : "Adding product...",
      success: editingProduct ? "Product updated!" : "Product added!",
      error: (err) => err.response?.data?.message || "Something went wrong",
    });

    try {
      await action;
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {editingProduct ? (
            <>
              <IconEdit size={18} /> Edit Product
            </>
          ) : (
            <>
              <IconPackage size={18} /> Add Product
            </>
          )}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="form-card form-horizontal"
          style={{ boxShadow: "none", padding: 0 }}
        >
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>SKU</label>
            <input
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Reorder Level</label>
            <input
              name="reorderLevel"
              type="number"
              value={formData.reorderLevel}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="modal-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : editingProduct ? "Update" : "Add"}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
            >
              <IconX size={16} /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
