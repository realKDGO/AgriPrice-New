import { useMemo, useState } from "react";
import "../../styles/user.css";

const INITIAL_USERS = [
  { id: 1, name: "Juan dela Cruz", email: "juan@agriprice.local", role: "Farmer", status: "Active", lastLogin: "2026-09-05 08:20" },
  { id: 2, name: "Maria Santos", email: "maria@agriprice.local", role: "Farmer", status: "Active", lastLogin: "2026-09-04 16:10" },
  { id: 3, name: "David Preat", email: "kdyy@agriprice.ph", role: "Farmer", status: "Active", lastLogin: "2026-09-08 07:13" },
];

const EMPTY_FORM = { name: "", email: "", status: "Active" };

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Active");
  const [editing, setEditing] = useState(null); // null | "new" | user object
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
    setEditing("new");
  };
  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, status: user.status });
    setEditing(user);
  };
  const close = () => setEditing(null);

  const save = (e) => {
    e.preventDefault();
    if (editing === "new") {
      setUsers((prev) => [
        ...prev,
        { id: Date.now(), role: "Farmer", lastLogin: "—", ...form },
      ]);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...form } : u)));
    }
    close();
  };

  return (
    <div className="admin">
      {/* TOP BAR: edit the title or contents here */}
      <header className="topbar">
        <h1 className="topbar__title">User Accounts</h1>
        <button className="icon-btn" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        </button>
      </header>

      <main className="content">
        <div className="intro">
          <p>Manage Farmer account details and status.</p>
          <button className="btn btn--primary" onClick={openAdd}>+ Add account</button>
        </div>

        <div className="filters">
          <label className="search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
              <option>All</option>
            </select>
          </label>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last login</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="badge badge--role">{u.role.toUpperCase()}</span></td>
                  <td>
                    <span className={`badge ${u.status === "Active" ? "badge--active" : "badge--inactive"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="nowrap">{u.lastLogin}</td>
                  <td className="td-actions">
                    <button className="btn btn--ghost" onClick={() => openEdit(u)}>
                      Edit account
                    </button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">No accounts match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {editing && (
        <div className="overlay" onClick={close}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h2>{editing === "new" ? "Add account" : "Edit account"}</h2>
            <label className="field field--stack">
              <span>Name</span>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="field field--stack">
              <span>Email address</span>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="field field--stack">
              <span>Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={close}>Cancel</button>
              <button type="submit" className="btn btn--primary">Save changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
