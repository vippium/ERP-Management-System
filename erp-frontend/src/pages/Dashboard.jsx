import { useEffect, useState } from "react";
import api from "../api/api.js";
import toast from "react-hot-toast";
import {
  IconUsers,
  IconPackage,
  IconShoppingCart,
  IconFileSpreadsheet,
  IconBuilding,
  IconCurrencyRupee,
  IconSettings,
  IconReload,
  IconChartBar,
} from "@tabler/icons-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../styles/dashboard.css";
import "../styles/buttons.css";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="dashboard-card">
    <div className="dashboard-icon" style={{ background: color }}>
      <Icon size={22} color="#fff" />
    </div>
    <div className="dashboard-info">
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? "/admin/overview" : "/users/overview";
      const res = await api.get(endpoint);
      setStats(res.data);

      if (isAdmin) {
        const [chartRes, salesRes] = await Promise.all([
          api.get("/reports/revenue-trend"),
          api.get("/sales?limit=5"),
        ]);
        setSalesData(chartRes.data || []);
        setRecentSales(salesRes.data.data || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <div className="dashboard-loader">
        <IconReload size={32} className="spin" />
        <p>Loading dashboard...</p>
      </div>
    );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontFamily: "Poppins, sans-serif" }}>
            Welcome, {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p
            className="text-muted"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {isAdmin ? "System Overview & Insights" : "Your Recent Activity"}
          </p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-secondary" onClick={load}>
            <IconReload size={16} /> Refresh
          </button>
          {isAdmin && (
            <button
              className="btn btn-primary"
              onClick={() => (window.location.href = "/company")}
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 500,
              }}
            >
              <IconSettings size={16} /> Company Settings
            </button>
          )}
        </div>
      </div>

      {/* 📊 Stat Cards */}
      <div className="dashboard-grid">
        {isAdmin ? (
          <>
            <StatCard
              icon={IconPackage}
              label="Products"
              value={stats?.productsCount ?? 0}
              color="#a78bfa"
            />
            <StatCard
              icon={IconUsers}
              label="Customers"
              value={stats?.customersCount ?? 0}
              color="#7dd3fc"
            />
            <StatCard
              icon={IconBuilding}
              label="Suppliers"
              value={stats?.suppliersCount ?? 0}
              color="#6ee7b7"
            />
            <StatCard
              icon={IconShoppingCart}
              label="Purchases"
              value={stats?.purchasesCount ?? 0}
              color="#fca5a5"
            />
            <StatCard
              icon={IconFileSpreadsheet}
              label="Sales"
              value={stats?.salesCount ?? 0}
              color="#fde68a"
            />
            <StatCard
              icon={IconCurrencyRupee}
              label="Revenue"
              value={`₹${(stats?.totalRevenue ?? 0).toFixed(2)}`}
              color="#93c5fd"
            />
          </>
        ) : (
          <>
            <StatCard
              icon={IconFileSpreadsheet}
              label="Your Sales"
              value={stats?.mySales ?? 0}
              color="#a78bfa"
            />
            <StatCard
              icon={IconUsers}
              label="Your Customers"
              value={stats?.myCustomers ?? 0}
              color="#7dd3fc"
            />
            <StatCard
              icon={IconChartBar}
              label="Performance"
              value={`${stats?.performance ?? 0}%`}
              color="#fcd34d"
            />
          </>
        )}
      </div>

      {/* 📈 Charts & Recent Data */}
      <div className="dashboard-widgets">
        {isAdmin ? (
          <>
            <div className="widget-card" style={{ height: "320px" }}>
              <h3 style={{ fontFamily: "Poppins, sans-serif" }}>
                Revenue Trend
              </h3>
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#7b6ef6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted">No revenue data available</p>
              )}
            </div>

            <div className="widget-card">
              <h3 style={{ fontFamily: "Poppins, sans-serif" }}>
                Recent Sales
              </h3>
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.length > 0 ? (
                    recentSales.map((s) => (
                      <tr key={s._id}>
                        <td>{s.customer?.name}</td>
                        <td>₹{s.totalAmount}</td>
                        <td>{s.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-muted">
                        No recent sales
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="widget-card">
            <h3 style={{ fontFamily: "Poppins, sans-serif" }}>
              Recent Activity
            </h3>
            <p className="text-muted">
              Your latest sales and assigned customers will appear here soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
