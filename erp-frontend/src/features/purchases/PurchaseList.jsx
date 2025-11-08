import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchases } from "./purchaseSlice.js";
import {
  IconPlus,
  IconSearch,
  IconShoppingBag,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import PurchaseForm from "./PurchaseForm.jsx";
import "../../styles/buttons.css";
import "../../styles/tables.css";

const PurchaseList = () => {
  const dispatch = useDispatch();
  const { items, page, pages, loading, error, total } = useSelector(
    (s) => s.purchases
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchPurchases({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* Header Summary */}
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
        <IconShoppingBag size={30} color="#7b6ef6" />
        <div>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Purchases</h2>
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
            Total {total ?? items?.length ?? 0}
          </p>
        </div>
      </div>

      {/* Controls */}
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
          <IconPlus size={16} /> Add Purchase
        </button>
      </div>

      {/* Table */}
      <div className="table-card">
        {loading && <p style={{ padding: "1rem" }}>Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Supplier</th>
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
                    No purchases found
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p._id}>
                    <td>{p.supplier?.name}</td>
                    <td>₹{p.totalAmount?.toFixed(2) ?? 0}</td>
                    <td
                      style={{
                        color:
                          p.status === "Completed"
                            ? "var(--color-success)"
                            : "var(--color-text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      {p.status}
                    </td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
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

      {/* Modal */}
      {showForm && (
        <PurchaseForm
          onClose={() => setShowForm(false)}
          onSuccess={() =>
            dispatch(fetchPurchases({ page: currentPage, limit: 10 }))
          }
        />
      )}
    </div>
  );
};

export default PurchaseList;
