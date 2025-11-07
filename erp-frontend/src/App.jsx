import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerList from "./features/customers/CustomerList.jsx";
import ProductList from "./features/products/ProductList.jsx";
import SupplierList from "./features/suppliers/SupplierList.jsx";
import PurchaseList from "./features/purchases/PurchaseList.jsx";
import SaleList from "./features/sales/SaleList.jsx";
import CompanySettings from "./features/company/CompanySettings.jsx";
import UserManagement from "./features/users/UserManagement.jsx";
import StockAlerts from "./features/stock/StockAlerts.jsx";
import Reports from "./features/reports/Reports.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <Layout>
                <SupplierList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <Layout>
                <PurchaseList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Layout>
                <SaleList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company"
          element={
            <ProtectedRoute>
              <Layout>
                <CompanySettings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stock-alerts"
          element={
            <ProtectedRoute>
              <Layout>
                <StockAlerts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
