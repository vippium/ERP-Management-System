import { useState, useEffect } from "react";
import api from "../../api/api.js";
import toast from "react-hot-toast";
import {
  IconX,
  IconPlus,
  IconMinus,
  IconShoppingBag,
} from "@tabler/icons-react";
import "../../styles/forms.css";
import "../../styles/buttons.css";

const PurchaseForm = ({ onClose, onSuccess }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    supplier: "",
    items: [{ product: "", quantity: 1, price: 0 }],
    notes: "",
    status: "Pending",
  });

  useEffect(() => {
    const load = async () => {
      const [supRes, prodRes] = await Promise.all([
        api.get("/suppliers"),
        api.get("/products"),
      ]);
      setSuppliers(supRes.data.data || supRes.data);
      setProducts(prodRes.data.data || prodRes.data);
    };
    load();
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];

    // If product changes, auto-fill its price
    if (field === "product") {
      const selected = products.find((p) => p._id === value);
      newItems[index].product = value;
      newItems[index].price = selected ? selected.price : 0;
    } else {
      newItems[index][field] = value;
    }

    setForm({ ...form, items: newItems });
  };

  const addItem = () =>
    setForm({
      ...form,
      items: [...form.items, { product: "", quantity: 1, price: 0 }],
    });

  const removeItem = (index) => {
    const newItems = [...form.items];
    newItems.splice(index, 1);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await toast.promise(api.post("/purchases", form), {
      loading: "Saving purchase...",
      success: "Purchase saved!",
      error: "Error saving purchase",
    });
    onSuccess();
    onClose();
  };

  const calcTotal = form.items.reduce(
    (sum, i) => sum + (i.quantity * i.price || 0),
    0
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconShoppingBag size={18} /> Add Purchase
        </h3>

        <form
          onSubmit={handleSubmit}
          className="form-card"
          style={{ boxShadow: "none", padding: 0 }}
        >
          <div className="form-group">
            <label>Supplier</label>
            <select
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <h4 className="form-section-title">Items</h4>
          {form.items.map((item, idx) => (
            <div key={idx} className="item-row">
              <select
                value={item.product}
                onChange={(e) =>
                  handleItemChange(idx, "product", e.target.value)
                }
                required
              >
                <option value="">Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="quantity-input"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(idx, "quantity", e.target.value)
                }
                min="1"
              />

              <button
                type="button"
                className="btn-icon"
                onClick={() => removeItem(idx)}
              >
                <IconMinus size={16} />
              </button>
            </div>
          ))}

          <button type="button" className="btn-add-item" onClick={addItem}>
            <IconPlus size={16} /> Add Item
          </button>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="total-footer">Total: ₹{calcTotal.toFixed(2)}</div>

          <div className="modal-actions">
            <button className="btn btn-primary" type="submit">
              Save
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

export default PurchaseForm;
