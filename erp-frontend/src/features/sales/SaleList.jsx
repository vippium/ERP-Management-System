import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales } from "./saleSlice.js";
import {
  IconPlus,
  IconSearch,
  IconReceipt2,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import SaleForm from "./SaleForm.jsx";
import "../../styles/buttons.css";
import "../../styles/tables.css";

const SaleList = () => {
  const dispatch = useDispatch();
  const { items, page, pages, loading, error, total } = useSelector(
    (s) => s.sales
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchSales({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          background: "var(--color-surface)",
          borderRadius: "var(--radius)",
          padding: "1rem",
          boxShadow: "var(--shadow-sm)",
          marginBottom: "1rem",
        }}
      >
        <IconReceipt2 size={30} color="#7b6ef6" />
        <div>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Sales</h2>
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
            Total {total ?? 0}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: 0.6,
          }}
        >
          <IconSearch size={18} color="var(--color-text-muted)" />
          <input
            placeholder="Search (coming soon...)"
            disabled
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              padding: "6px 10px",
            }}
          />
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <IconPlus size={16} /> Add Sale
        </button>
      </div>

      <div className="table-card">
        {loading && <p style={{ padding: "1rem" }}>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    No sales found
                  </td>
                </tr>
              ) : (
                items.map((s) => (
                  <tr key={s._id}>
                    <td>{s.customer?.name}</td>
                    <td>₹{s.totalAmount}</td>
                    <td
                      style={{
                        color:
                          s.status === "Completed"
                            ? "var(--color-success)"
                            : "var(--color-text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      {s.status}
                    </td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          Page {page} of {pages}
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            className="btn-icon"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || loading}
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            className="btn-icon"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
            disabled={currentPage === pages || loading}
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      </div>

      {showForm && (
        <SaleForm
          onClose={() => setShowForm(false)}
          onSuccess={() =>
            dispatch(fetchSales({ page: currentPage, limit: 10 }))
          }
        />
      )}
    </div>
  );
};

export default SaleList;
