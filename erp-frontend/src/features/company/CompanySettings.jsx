import { useEffect, useState } from "react";
import api from "../../api/api.js";
import toast from "react-hot-toast";
import {
  IconUpload,
  IconDeviceFloppy,
  IconBuildingSkyscraper,
  IconTrash,
} from "@tabler/icons-react";
import placeholderLogo from "../../assets/empty_image.png";
import "../../styles/forms.css";
import "../../styles/buttons.css";
import "./company.css";

const CompanySettings = () => {
  const [form, setForm] = useState({
    name: "",
    gstin: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
  });
  const [logoPreview, setLogoPreview] = useState(placeholderLogo);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const loadCompany = async () => {
    try {
      const res = await api.get("/company");
      const data = res.data;
      setForm(data);

      if (data.logo) {
        const base = import.meta.env.VITE_API_BASE_URL;
        const normalized =
          data.logo.startsWith("http") || data.logo.startsWith("data:")
            ? data.logo
            : `${base}${
                data.logo.startsWith("/") ? data.logo : `/${data.logo}`
              }`;
        setLogoPreview(normalized);
      } else {
        setLogoPreview(placeholderLogo);
      }
    } catch (err) {
      toast.error("Failed to load company info");
      setLogoPreview(placeholderLogo);
    }
  };

  useEffect(() => {
    loadCompany();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setLogoPreview(URL.createObjectURL(f));
    }
  };

  const handleRemoveLogo = async () => {
    if (!form.logo && logoPreview === placeholderLogo) {
      toast("No logo to remove.");
      return;
    }

    if (!window.confirm("Are you sure you want to remove the current logo?"))
      return;

    try {
      setRemoving(true);
      await api.put("/company", { ...form, logo: "" });
      setFile(null);
      setLogoPreview(placeholderLogo);
      toast.success("Logo removed successfully!");
      await loadCompany();
    } catch (err) {
      toast.error("Failed to remove logo");
    } finally {
      setRemoving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    for (const key in form) fd.append(key, form[key]);
    if (file) fd.append("logo", file);

    try {
      setLoading(true);
      await api.put("/company", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Company details updated!");
      await loadCompany();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-page">
      <div className="company-card-modern">
        <header className="company-header-modern">
          <div className="header-left">
            <IconBuildingSkyscraper size={28} color="#7b6ef6" />
            <h2>Company Settings</h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary compact"
            onClick={loadCompany}
            disabled={loading}
          >
            Refresh
          </button>
        </header>

        <form onSubmit={handleSubmit} className="form-card compact">
          <div className="form-row">
            <div className="form-group">
              <label>Company Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your company name"
              />
            </div>
            <div className="form-group">
              <label>GSTIN</label>
              <input
                name="gstin"
                value={form.gstin}
                onChange={handleChange}
                placeholder="27ABCDE1234FZ1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contact@company.com"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="City, State, ZIP"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Company Logo</label>
            <div className="logo-upload-container">
              <div className="logo-preview-wrapper">
                <img
                  src={logoPreview || placeholderLogo}
                  alt="Company Logo"
                  className="logo-preview"
                  onError={(e) => (e.target.src = placeholderLogo)}
                />
              </div>

              <div className="logo-actions-vertical">
                <label className="icon-btn upload-btn" title="Upload Logo">
                  <IconUpload size={16} />
                  <input type="file" hidden onChange={handleFile} />
                </label>

                <button
                  type="button"
                  className="icon-btn remove-btn"
                  title="Remove Logo"
                  onClick={handleRemoveLogo}
                  disabled={removing}
                >
                  <IconTrash size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <IconDeviceFloppy size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySettings;
