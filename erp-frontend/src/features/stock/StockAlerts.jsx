import { useEffect, useState } from "react";
import api from "../../api/api.js";
import toast from "react-hot-toast";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import stockOk from "../../assets/stock_limit.png";
import "../../styles/buttons.css";
import "../../styles/tables.css";

const StockAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/stock/alerts");
      setAlerts(res.data.items || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load stock alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconAlertTriangle color="#e67e22" /> Low Stock Products
        </h1>
        <button className="btn btn-primary" onClick={loadAlerts}>
          <IconRefresh size={16} /> Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && <p>Checking Inventory...</p>}

      {/* No Alerts */}
      {!loading && alerts.length === 0 && (
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius)",
            padding: "2rem 1rem",
            textAlign: "center",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <img
            src={stockOk}
            alt="All stocks sufficient"
            style={{
              width: "460px",
              maxWidth: "80%",
              marginBottom: "1rem",
              opacity: 0.95,
            }}
          />
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "1.2rem",
              color: "#111827",
            }}
          >
            All Stocks are Sufficient
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.9rem",
              marginTop: "0.25rem",
            }}
          >
            Your inventory is healthy — no products below reorder level.
          </p>
        </div>
      )}

      {/* Alerts Present */}
      {!loading && alerts.length > 0 && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Stock</th>
                <th>Reorder Level</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((p) => (
                <tr key={p._id} style={{ background: "#fff8e1" }}>
                  <td>{p.title}</td>
                  <td>{p.sku}</td>
                  <td>{p.stock}</td>
                  <td>{p.reorderLevel}</td>
                  <td>{p.category || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockAlerts;
