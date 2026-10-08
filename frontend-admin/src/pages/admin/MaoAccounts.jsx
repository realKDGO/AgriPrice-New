    import { useMemo, useState } from "react";
    import "../../styles/MaoAccounts.css";

    const INITIAL_ACCOUNTS = [
    {
        id: 1,
        name: "Elena Reyes",
        email: "elena@agriprice.local",
        role: "MAO",
        status: "Active",
        lastLogin: "2026-09-05 08:00",
    },
    {
        id: 2,
        name: "David Lopit",
        email: "dave.mao@agriprice.local",
        role: "MAO",
        status: "Active",
        lastLogin: "2026-08-21 09:34",
    },
    ];

    const STATUS_OPTIONS = ["All", "Active", "Inactive"];

    export default function MaoAccounts() {
    const [accounts] = useState(INITIAL_ACCOUNTS);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("Active");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return accounts.filter((a) => {
        const matchesStatus = status === "All" || a.status === status;
        const matchesQuery =
            !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
        return matchesStatus && matchesQuery;
        });
    }, [accounts, query, status]);

    const handleAdd = () => alert("Open 'Add account' form");
    const handleEdit = (account) => alert(`Edit account: ${account.name}`);

    return (
        <div className="mao-page">
        {/* Top bar */}
        <header className="mao-header">
            <h1>MAO Accounts</h1>
            <button className="mao-bell" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            </button>
        </header>

        <main className="mao-body">
            {/* Subtitle + Add button */}
            <div className="mao-intro">
            <p>Manage MAO account details and access.</p>
            <button className="mao-add" onClick={handleAdd}>
                <span aria-hidden="true">+</span> Add account
            </button>
            </div>

            {/* Filters */}
            <div className="mao-filters">
            <label className="mao-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                type="text"
                placeholder="Search name or email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                />
            </label>

            <div className="mao-status-filter">
                <label htmlFor="status">Status</label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                    {s}
                    </option>
                ))}
                </select>
            </div>
            </div>

            {/* Table */}
            <div className="mao-card">
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
                {filtered.length === 0 ? (
                    <tr>
                    <td colSpan={6} className="mao-empty">
                        No accounts match your search.
                    </td>
                    </tr>
                ) : (
                    filtered.map((a) => (
                    <tr key={a.id}>
                        <td>{a.name}</td>
                        <td>{a.email}</td>
                        <td>
                        <span className="badge badge-role">{a.role}</span>
                        </td>
                        <td>
                        <span className={`badge ${a.status === "Active" ? "badge-active" : "badge-inactive"}`}>
                            {a.status}
                        </span>
                        </td>
                        <td>{a.lastLogin}</td>
                        <td>
                        <button className="mao-edit" onClick={() => handleEdit(a)}>
                            Edit account
                        </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </main>
        </div>
    );
    }
