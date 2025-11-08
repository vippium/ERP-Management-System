import { useState, useEffect } from "react";
import api from "../../api/api.js";
import toast from "react-hot-toast";
import { IconPlus, IconMinus, IconX, IconCash } from "@tabler/icons-react";
import "../../styles/forms.css";
import "../../styles/buttons.css";

const SaleForm = ({ onClose, onSuccess }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customer: "",
    items: [{ product: "", quantity: 1, price: 0 }],
    notes: "",
    status: "Pending",
  });

  useEffect(() => {
    const load = async () => {
      const [custRes, prodRes] = await Promise.all([
        api.get("/customers"),
        api.get("/products"),
      ]);
      setCustomers(custRes.data.data || custRes.data);
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
    await toast.promise(api.post("/sales", form), {
      loading: "Saving sale...",
      success: "Sale added successfully!",
      error: "Error creating sale",
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
          <IconCash size={20} /> Add Sale
        </h3>

        <form
          onSubmit={handleSubmit}
          className="form-card"
          style={{ boxShadow: "none", padding: 0 }}
        >
          <div className="form-group">
            <label>Customer</label>
            <select
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
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

export default SaleForm;
