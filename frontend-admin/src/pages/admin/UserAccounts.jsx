import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import AdminHeader from "../../components/common/AdminHeader";

const DEFAULT_USERS = [
  {
    id: 1,
    name: "Juan dela Cruz",
    email: "juan@agriprice.local",
    role: "FARMER",
    status: "Active",
    lastLogin: "2026-09-05 08:20",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@agriprice.local",
    role: "FARMER",
    status: "Active",
    lastLogin: "2026-09-04 16:10",
  },
  {
    id: 3,
    name: "David Freat",
    email: "kdyy@agriprice.ph",
    role: "FARMER",
    status: "Active",
    lastLogin: "2026-09-06 07:13",
  },
];

export default function UserAccounts() {
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "Active",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "All" || u.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", status: "Active" });
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, status: user.status });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: formData.name, email: formData.email, status: formData.status }
            : u
        )
      );
    } else {
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: "FARMER",
        status: formData.status,
        lastLogin: new Date().toISOString().replace("T", " ").slice(0, 16),
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <AdminHeader
        title="User Accounts"
        subtitle="Manage Farmer account details and status."
      >
        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleOpenAdd}
        >
          <Plus size={16} strokeWidth={2.2} />
          <span>Add account</span>
        </button>
      </AdminHeader>

      {/* Filter Bar */}
      <div className="admin-filters-bar">
        <div className="admin-search-wrapper">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-select-group">
          <span className="admin-select-label">Status</span>
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="All">All</option>
          </select>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="admin-card admin-card--flush">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--admin-text-muted)" }}>
                    No matching farmer accounts found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 500 }}>{user.name}</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>{user.email}</td>
                    <td>
                      <span className="admin-pill admin-pill--role">
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-pill ${
                          user.status === "Active"
                            ? "admin-pill--active"
                            : "admin-pill--suspended"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--admin-text-muted)" }}>
                      {user.lastLogin}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-action-link"
                        onClick={() => handleOpenEdit(user)}
                      >
                        Edit account
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal__title">
              {editingUser ? "Edit Farmer Account" : "Add Farmer Account"}
            </h2>
            <form onSubmit={handleSave}>
              <div className="admin-form-group">
                <label className="admin-form-label">Full Name</label>
                <input
                  type="text"
                  className="admin-form-input"
                  required
                  placeholder="e.g. Juan dela Cruz"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Email Address</label>
                <input
                  type="email"
                  className="admin-form-input"
                  required
                  placeholder="e.g. juan@agriprice.local"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <select
                  className="admin-select"
                  style={{ width: "100%", maxWidth: "580px" }}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="admin-modal__actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingUser ? "Save changes" : "Create account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
