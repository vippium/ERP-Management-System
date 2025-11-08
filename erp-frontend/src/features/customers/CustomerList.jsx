import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "./customerSlice.js";
import {
  IconTrash,
  IconEdit,
  IconSearch,
  IconUserPlus,
  IconUpload,
  IconChevronLeft,
  IconChevronRight,
  IconUsers,
} from "@tabler/icons-react";
import api from "../../api/api.js";
import toast from "react-hot-toast";
import CustomerForm from "./CustomerForm.jsx";
import CSVImportModal from "../../components/CSVImportModal.jsx";
import useDebounce from "../../hooks/useDebounce.js";
import "../../styles/buttons.css";
import "../../styles/tables.css";

const CustomerList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, page, pages, total } = useSelector(
    (s) => s.customers
  );
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(
      fetchCustomers({ page: currentPage, limit: 10, search: debouncedSearch })
    );
  }, [dispatch, currentPage, debouncedSearch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    const p = api.delete(`/customers/${id}`);
    toast.promise(p, {
      loading: "Deleting...",
      success: "Deleted successfully",
      error: "Delete failed",
    });
    try {
      await p;
      const newPage =
        items.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(newPage);
      dispatch(
        fetchCustomers({ page: newPage, limit: 10, search: debouncedSearch })
      );
    } catch {}
  };

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
        <IconUsers size={30} color="#7b6ef6" />
        <div>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Customers</h2>
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>Total : {total}</p>
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
          className="search-input-group"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <IconSearch size={18} color="var(--color-text-muted)" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Customers..."
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              padding: "6px 100px",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <CSVImportModal
            endpoint="/customers/import"
            label="Import"
            icon={IconUpload}
            onDone={() =>
              dispatch(
                fetchCustomers({
                  page: currentPage,
                  limit: 10,
                  search: debouncedSearch,
                })
              )
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
            <IconUserPlus size={16} /> Add New
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        {error && <p className="error-message">{error}</p>}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  {loading ? "Loading..." : "No customers found"}
                </td>
              </tr>
            ) : (
              items.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.city}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn-icon"
                      onClick={() => {
                        setEditing(c);
                        setShowForm(true);
                      }}
                    >
                      <IconEdit size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDelete(c._id)}
                    >
                      <IconTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
          Page {page} of {pages} | Total {total}
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
        <CustomerForm
          editing={editing}
          onClose={() => setShowForm(false)}
          onSuccess={() =>
            dispatch(
              fetchCustomers({
                page: currentPage,
                limit: 10,
                search: debouncedSearch,
              })
            )
          }
        />
      )}
    </div>
  );
};

export default CustomerList;
