import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "./userSlice.js";
import api from "../../api/api.js";
import toast from "react-hot-toast";
import {
  IconShieldHalfFilled,
  IconTrash,
  IconRefresh,
  IconUsersGroup,
  IconAlertTriangle,
  IconUserPlus,
  IconX,
} from "@tabler/icons-react";
import "../../styles/buttons.css";
import "../../styles/tables.css";
import "../../styles/forms.css";
import "./users.css";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.users);

  const [refreshing, setRefreshing] = useState(false);
  const [confirmRoleChange, setConfirmRoleChange] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [switching, setSwitching] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleToggle = async (user) => {
    setSwitching((s) => ({ ...s, [user._id]: true }));
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      await api.put(`/users/${user._id}`, { role: newRole });
      toast.success(`${user.name} is now ${newRole}`);
      setConfirmRoleChange(null);
      await dispatch(fetchUsers());
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setSwitching((s) => ({ ...s, [user._id]: false }));
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await api.delete(`/users/${user._id}`);
      toast.success("User deleted successfully");
      setConfirmDelete(null);
      await dispatch(fetchUsers());
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchUsers());
    setRefreshing(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", newUser);
      toast.success("User created successfully!");
      setShowAddModal(false);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      await dispatch(fetchUsers());
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div className="users-header-card">
        <IconUsersGroup size={30} color="#7b6ef6" />
        <div>
          <h2 style={{ margin: 0 }}>User Management</h2>
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
            Manage system users and roles
          </p>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh users"
          >
            <IconRefresh size={16} /> Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            aria-label="Add user"
          >
            <IconUserPlus size={16} /> Add User
          </button>
        </div>
      </div>

      <div className="table-card">
        {loading && <p style={{ padding: "1rem" }}>Loading users...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`role-chip ${
                        user.role === "admin" ? "admin" : "user"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn-icon"
                      onClick={() => setConfirmRoleChange(user)}
                      disabled={!!switching[user._id]}
                      title="Switch role"
                      style={{ marginRight: 8 }}
                    >
                      <IconShieldHalfFilled size={16} />
                      <span style={{ marginLeft: 6, fontSize: 12 }}>
                        Switch
                      </span>
                    </button>

                    <button
                      className="btn-icon delete"
                      onClick={() => setConfirmDelete(user)}
                      title="Delete user"
                    >
                      <IconTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div className="popover-overlay" role="dialog" aria-modal="true">
          <div className="popover-box">
            <IconUserPlus size={28} color="#7b6ef6" />
            <h4>Add New User</h4>

            <form
              onSubmit={handleAddUser}
              className="form-card form-horizontal"
              style={{ boxShadow: "none", padding: 0, marginTop: "1rem" }}
            >
              <div className="form-group">
                <label htmlFor="u-name">Name</label>
                <input
                  id="u-name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((s) => ({ ...s, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="u-email">Email</label>
                <input
                  id="u-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((s) => ({ ...s, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="u-password">Password</label>
                <input
                  id="u-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((s) => ({ ...s, password: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="u-role">Role</label>
                <select
                  id="u-role"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser((s) => ({ ...s, role: e.target.value }))
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="popover-actions" style={{ marginTop: "0.75rem" }}>
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  <IconX size={14} /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmRoleChange && (
        <div className="popover-overlay" role="dialog" aria-modal="true">
          <div className="popover-box">
            <IconShieldHalfFilled size={28} color="#7b6ef6" />
            <h4>Confirm Role Change</h4>
            <p>
              Change role for <strong>{confirmRoleChange.name}</strong> from{" "}
              <em>{confirmRoleChange.role}</em> to{" "}
              <em>{confirmRoleChange.role === "admin" ? "user" : "admin"}</em>?
            </p>
            <div className="popover-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleRoleToggle(confirmRoleChange)}
              >
                Confirm
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmRoleChange(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="popover-overlay" role="dialog" aria-modal="true">
          <div className="popover-box">
            <IconAlertTriangle size={30} color="#e11d48" />
            <h4>Delete User?</h4>
            <p>
              Are you sure you want to permanently delete{" "}
              <strong>{confirmDelete.name}</strong>?
            </p>
            <div className="popover-actions">
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteUser(confirmDelete)}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
