import { useMemo, useState } from "react";
import "../../styles/user.css";

const INITIAL_USERS = [
  { id: 1, name: "Juan dela Cruz", email: "juan@agriprice.local", role: "Farmer", status: "Active", lastLogin: "2026-09-05 08:20" },
  { id: 2, name: "Maria Santos", email: "maria@agriprice.local", role: "Farmer", status: "Active", lastLogin: "2026-09-04 16:10" },
  { id: 3, name: "David Preat", email: "kdyy@agriprice.ph", role: "Farmer", status: "Active", lastLogin: "2026-09-08 07:13" },
];

const EMPTY_FORM = { name: "", email: "", status: "Active" };

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
  </svg>
);

function AccountModal({ title, form, setForm, onSave, onCancel }) {
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email);

  return (
    <div className="ua-overlay" onClick={onCancel}>
      <div
        className="ua-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{title}</h2>

        <div className="ua-field">
          <label htmlFor="ua-name">Name</label>
          <input
            id="ua-name"
            className="ua-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="ua-field">
          <label htmlFor="ua-email">Email address</label>
          <input
            id="ua-email"
            type="email"
            className="ua-input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="ua-field">
          <label htmlFor="ua-status">Status</label>
          <select
            id="ua-status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="ua-actions">
          <button className="ua-btn" onClick={onCancel}>Cancel</button>
          <button className="ua-btn-primary" disabled={!valid} onClick={onSave}>
            Save account
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserAccounts() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Active");
  const [modal, setModal] = useState(null); // { mode: "add" | "edit", id? }
  const [form, setForm] = useState(EMPTY_FORM);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (status === "All" || u.status === status) &&
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    );
  }, [users, query, status]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: "add" });
  };

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, status: user.status });
    setModal({ mode: "edit", id: user.id });
  };

  const save = () => {
    if (modal.mode === "add") {
      setUsers((prev) => [...prev, { id: Date.now(), role: "Farmer", lastLogin: "—", ...form }]);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === modal.id ? { ...u, ...form } : u)));
    }
    setModal(null);
  };

  return (
    <div className="ua">

      <div className="ua-main">
        <div className="ua-top">
          <div className="ua-admin">
            <span className="ua-avatar">AU</span>
            Administrator
          </div>
        </div>

        <header className="ua-bar">
          <h1>User Accounts</h1>
          <button className="ua-bell" aria-label="Notifications">
            <BellIcon />
          </button>
        </header>

        <main className="ua-body">
          <div className="ua-intro">
            <p>Manage Farmer account details and status.</p>
            <button className="ua-btn-primary" onClick={openAdd}>+ Add account</button>
          </div>

          <div className="ua-filters">
            <label className="ua-search">
              <SearchIcon />
              <input
                placeholder="Search name or email"
                aria-label="Search name or email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <div className="ua-field">
              <label htmlFor="ua-status-filter">Status</label>
              <select
                id="ua-status-filter"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>All</option>
              </select>
            </div>
          </div>

          <section className="ua-card">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email address</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={6} className="ua-empty">No accounts match your search.</td>
                  </tr>
                )}
                {visible.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="ua-badge">{u.role}</span></td>
                    <td>
                      <span className={`ua-status${u.status === "Inactive" ? " ua-status--inactive" : ""}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>{u.lastLogin}</td>
                    <td>
                      <button className="ua-btn" onClick={() => openEdit(u)}>Edit account</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>

      {modal && (
        <AccountModal
          title={modal.mode === "add" ? "Add account" : "Edit account"}
          form={form}
          setForm={setForm}
          onSave={save}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
