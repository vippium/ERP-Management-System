import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Loader from "../Loader.jsx";
import "./layout.css";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const globalLoading = useSelector((state) => state.ui.globalLoading);

  return (
    <div className={`layout-container ${collapsed ? "collapsed" : ""}`}>
      {globalLoading && <Loader />}

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="content-area">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
