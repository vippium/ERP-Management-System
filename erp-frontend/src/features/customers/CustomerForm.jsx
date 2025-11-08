import { useEffect, useState } from "react";
import api from "../../api/api.js";
import toast from "react-hot-toast";
import { IconUserPlus, IconEdit, IconX } from "@tabler/icons-react";
import "../../styles/forms.css";
import "../../styles/buttons.css";

const CustomerForm = ({ editing, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    gstNumber: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editing) setForm(editing);
    else
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        gstNumber: "",
      });
  }, [editing]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const action = editing
      ? api.put(`/customers/${editing._id}`, form)
      : api.post("/customers", form);

    toast.promise(action, {
      loading: editing ? "Updating customer..." : "Adding customer...",
      success: editing ? "Customer updated!" : "Customer added!",
      error: (err) => err.response?.data?.message || "Operation failed",
    });

    try {
      await action;
      onSuccess();
      onClose();
    } catch {
      /* handled by toast */
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {editing ? (
            <>
              <IconEdit size={20} /> Edit Customer
            </>
          ) : (
            <>
              <IconUserPlus size={20} /> Add New Customer
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
            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>GST Number</label>
            <input
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
            />
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

          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : editing ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
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

export default CustomerForm;
