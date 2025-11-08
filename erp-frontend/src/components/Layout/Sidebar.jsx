import { Link, useLocation } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconUsers,
  IconBox,
  IconPackage,
  IconLogout,
  IconShoppingCart,
  IconReportAnalytics,
  IconAlertTriangle,
  IconMenu2,
  IconUsersGroup,
} from "@tabler/icons-react";
import "./layout.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const navItems = [
    {
      name: "Dashboard",
      icon: <IconLayoutDashboard size={18} />,
      path: "/dashboard",
    },
    { name: "Products", icon: <IconPackage size={18} />, path: "/products" },
    { name: "Customers", icon: <IconUsers size={18} />, path: "/customers" },
    { name: "Suppliers", icon: <IconBox size={18} />, path: "/suppliers" },
    {
      name: "Purchases",
      icon: <IconShoppingCart size={18} />,
      path: "/purchases",
    },
    { name: "Sales", icon: <IconReportAnalytics size={18} />, path: "/sales" },
  ];

  const adminItems = [
    {
      name: "Reports",
      icon: <IconReportAnalytics size={18} />,
      path: "/admin/reports",
    },
    {
      name: "Stock Alerts",
      icon: <IconAlertTriangle size={18} />,
      path: "/admin/stock-alerts",
    },
    {
      name: "Manage Users",
      icon: <IconUsersGroup size={18} />,
      path: "/admin/users",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="menu-btn"
          aria-label="Toggle sidebar"
        >
          <IconMenu2 size={20} />
        </button>
        {!collapsed && <h2>Main Menu</h2>}
      </div>

      <nav>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`nav-link ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => window.innerWidth < 768 && setCollapsed(true)}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}

        {user?.role === "admin" &&
          adminItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => window.innerWidth < 768 && setCollapsed(true)}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <IconLogout size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
