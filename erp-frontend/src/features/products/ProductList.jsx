import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./productSlice.js";
import {
  IconTrash,
  IconEdit,
  IconSearch,
  IconPlus,
  IconPackage,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import api from "../../api/api.js";
import toast from "react-hot-toast";
import ProductForm from "./ProductForm.jsx";
import "../../styles/buttons.css";
import "../../styles/tables.css";

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, page, pages, total } = useSelector(
    (state) => state.products
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: 10, search }));
  }, [dispatch, currentPage, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const p = api.delete(`/products/${id}`);
    toast.promise(p, {
      loading: "Deleting...",
      success: "Deleted successfully",
      error: "Delete failed",
    });
    try {
      await p;
      dispatch(fetchProducts({ page: currentPage, limit: 10, search }));
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
        <IconPackage size={30} color="#7b6ef6" />
        <div>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Products</h2>
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
            Total : {total}
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
            placeholder="Search Products..."
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              padding: "6px 100px",
            }}
          />
        </div>

        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <IconPlus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="table-card">
        {loading && <p style={{ padding: "1rem" }}>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Reorder</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.sku}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock}</td>
                    <td>{p.reorderLevel}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-icon"
                        onClick={() => setEditingProduct(p)}
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(p._id)}
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
          Page {page} of {pages} | Total {total}
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
        <ProductForm
          editingProduct={editingProduct}
          onClose={() => setShowForm(false)}
          onSuccess={() =>
            dispatch(fetchProducts({ page: currentPage, limit: 10, search }))
          }
        />
      )}
    </div>
  );
};

export default ProductList;
