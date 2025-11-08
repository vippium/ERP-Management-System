import toast from "react-hot-toast";
import {
  IconFileSpreadsheet,
  IconFileDownload,
  IconReportAnalytics,
} from "@tabler/icons-react";
import "../../styles/buttons.css";
import "../../styles/forms.css";

const Reports = () => {
  const base = import.meta.env.VITE_API_BASE_URL;

  const download = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/reports/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}-report.csv`;
      link.click();
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded`
      );
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <IconReportAnalytics size={26} color="#7b6ef6" /> Reports & Exports
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.2rem",
          marginTop: "1.5rem",
        }}
      >
        {[
          {
            type: "sales",
            icon: IconFileSpreadsheet,
            label: "Sales Report (CSV)",
          },
          {
            type: "purchases",
            icon: IconFileSpreadsheet,
            label: "Purchases Report (CSV)",
          },
          {
            type: "stock",
            icon: IconFileDownload,
            label: "Stock Report (CSV)",
          },
        ].map(({ type, icon: Icon, label }) => (
          <div
            key={type}
            onClick={() => download(type)}
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius)",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
              transition: "var(--transition)",
            }}
            className="hover-card"
          >
            <Icon size={36} color="#7b6ef6" />
            <p style={{ marginTop: "0.5rem", fontWeight: 500 }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
