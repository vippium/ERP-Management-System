import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuppliers } from "./supplierSlice.js";
import {
  IconTrash,
  IconEdit,
  IconSearch,
  IconUserPlus,
  IconFileUpload,
  IconChevronLeft,
  IconChevronRight,
  IconTruck,
} from "@tabler/icons-react";
import api from "../../api/api.js";
import toast from "react-hot-toast";
import SupplierForm from "./SupplierForm.jsx";
import CSVImportModal from "../../components/CSVImportModal.jsx";
import "../../styles/buttons.css";
import "../../styles/tables.css";

const SupplierList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, page, pages, total } = useSelector(
    (s) => s.suppliers
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchSuppliers({ page: currentPage, limit: 10, search }));
  }, [dispatch, currentPage, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;
    const p = api.delete(`/suppliers/${id}`);
    toast.promise(p, {
      loading: "Deleting...",
      success: "Deleted",
      error: "Delete failed",
    });
    try {
      await p;
      dispatch(fetchSuppliers({ page: currentPage, limit: 10, search }));
    } catch {}
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* Header */}
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
        <IconTruck size={30} color="#7b6ef6" />
        <div>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Suppliers</h2>
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
            Total {total}
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconSearch size={18} color="var(--color-text-muted)" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Suppliers..."
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              padding: "6px 100px",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <CSVImportModal
            endpoint="/suppliers/import"
            label="Import"
            icon={IconFileUpload}
            onDone={() =>
              dispatch(fetchSuppliers({ page: currentPage, limit: 10, search }))
            }
            buttonClass="btn btn-secondary"
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            <IconUserPlus size={16} /> Add Supplier
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        {loading && <p style={{ padding: "1rem" }}>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>City</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    No suppliers found
                  </td>
                </tr>
              ) : (
                items.map((s) => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.company}</td>
                    <td>{s.email}</td>
                    <td>{s.city}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-icon"
                        onClick={() => {
                          setEditing(s);
                          setShowForm(true);
                        }}
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(s._id)}
                      >
                        <IconTrash size={16} />
                      </button>
                    </td>
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
            disabled={currentPage === 1}
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            className="btn-icon"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
            disabled={currentPage === pages}
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      </div>

      {showForm && (
        <SupplierForm
          editing={editing}
          onClose={() => setShowForm(false)}
          onSuccess={() =>
            dispatch(fetchSuppliers({ page: currentPage, limit: 10, search }))
          }
        />
      )}
    </div>
  );
};

export default SupplierList;
