import { useEffect, useState } from "react";
import api from "../../api/api.js";
import toast from "react-hot-toast";
import { IconUserPlus, IconEdit, IconX } from "@tabler/icons-react";
import "../../styles/forms.css";
import "../../styles/buttons.css";

const SupplierForm = ({ editing, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    gstNumber: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const action = editing
      ? api.put(`/suppliers/${editing._id}`, form)
      : api.post("/suppliers", form);

    toast.promise(action, {
      loading: editing ? "Updating supplier..." : "Adding supplier...",
      success: editing ? "Supplier updated!" : "Supplier added!",
      error: (err) => err.response?.data?.message || "Operation failed",
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
          {editing ? (
            <>
              <IconEdit size={18} /> Edit Supplier
            </>
          ) : (
            <>
              <IconUserPlus size={18} /> Add Supplier
            </>
          )}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="form-card form-horizontal"
          style={{ boxShadow: "none", padding: 0 }}
        >
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>GST Number</label>
            <input
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : editing ? "Update" : "Add"}
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

export default SupplierForm;
