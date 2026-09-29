import { useMemo, useState } from "react";
import "../styles/home.css";
    const ICON_PATHS = {
    dashboard: (
        <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        </>
    ),
    users: (
        <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
        </>
    ),
    mao: (
        <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" />
        <path d="M17 11l1.8 1.8L22 9.5" />
        </>
    ),
    audit: (
        <>
        <path d="M4 3h16v18H4z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
        </>
    ),
    monitor: <path d="M3 12h4l3-8 4 16 3-8h4" />,
    security: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
    backup: (
        <>
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
        <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        </>
    ),
    settings: (
        <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
        </>
    ),
    signout: (
        <>
        <path d="M9 4H4v16h5" />
        <path d="M10 12h11M17 8l4 4-4 4" />
        </>
    ),
    bell: (
        <>
        <path d="M6 16V11a6 6 0 0112 0v5l2 2H4z" />
        <path d="M10 21h4" />
        </>
    ),
    search: (
        <>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
        </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    };

    function Icon({ name, size = 14 }) {
    return (
        <svg
        className="icon"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        >
        {ICON_PATHS[name]}
        </svg>
    );
    }

    const NAV_ITEMS = [
    { label: "Dashboard", icon: "dashboard" },
    { label: "User Accounts", icon: "users" },
    { label: "MAO Accounts", icon: "mao" },
    { label: "Audit Logs", icon: "audit" },
    { label: "System Monitoring", icon: "monitor" },
    { label: "Security", icon: "security" },
    { label: "Backup & Recovery", icon: "backup" },
    { label: "System Settings", icon: "settings" },
    ];

    const USERS = [
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
        name: "David Preat",
        email: "kdyy@agriprice.ph",
        role: "FARMER",
        status: "Active",
        lastLogin: "2026-09-08 07:13",
    },
    ];


    function Sidebar({ active, onSelect }) {
    return (
        <aside className="sidebar">
        <div className="brand">
            <span className="brand-logo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                d="M12 3L4 20h4l1.4-3.5h5.2L16 20h4L12 3zm-1.4 10.5L12 9.6l1.4 3.9h-2.8z"
                fill="#ffffff"
                />
            </svg>
            </span>
            <span className="brand-name">AgriPrice</span>
        </div>

        <p className="nav-heading">OVERVIEW</p>

        <nav className="nav">
            {NAV_ITEMS.map((item) => (
            <button
                key={item.label}
                type="button"
                className={`nav-item ${active === item.label ? "is-active" : ""}`}
                onClick={() => onSelect(item.label)}
            >
                <Icon name={item.icon} />
                <span>{item.label}</span>
            </button>
            ))}
        </nav>

        <button type="button" className="signout">
            <Icon name="signout" />
            <span>Sign Out</span>
        </button>
        </aside>
    );
    }

    function UsersTable({ users }) {
    return (
        <div className="table-card">
        <table className="table">
            <thead>
            <tr>
                <th>NAME</th>
                <th>EMAIL ADDRESS</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>LAST LOGIN</th>
                <th>ACTIONS</th>
            </tr>
            </thead>
            <tbody>
            {users.length === 0 ? (
                <tr>
                <td colSpan={6} className="empty">
                    No accounts match your search.
                </td>
                </tr>
            ) : (
                users.map((user) => (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                    <span className="badge badge-role">{user.role}</span>
                    </td>
                    <td>
                    <span className="badge badge-status">{user.status}</span>
                    </td>
                    <td>{user.lastLogin}</td>
                    <td>
                    <button type="button" className="btn-edit">
                        Edit account
                    </button>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    );
    }

    export default function App() {
    const [activeNav, setActiveNav] = useState("User Accounts");
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("Active");

    const filteredUsers = useMemo(() => {
        const q = query.trim().toLowerCase();
        return USERS.filter((u) => {
        const matchesStatus = status === "All" || u.status === status;
        const matchesQuery =
            q === "" ||
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q);
        return matchesStatus && matchesQuery;
        });
    }, [query, status]);

    return (
        <div className="app">
        <Sidebar active={activeNav} onSelect={setActiveNav} />

        <div className="main">
            <header className="topbar">
            <h1 className="page-title">User Accounts</h1>
            <button type="button" className="icon-btn" aria-label="Notifications">
                <Icon name="bell" size={15} />
            </button>
            </header>

            <main className="content">
            <div className="content-head">
                <p className="subtitle">Manage Farmer account details and status.</p>
                <button type="button" className="btn-primary">
                <Icon name="plus" size={12} />
                <span>Add account</span>
                </button>
            </div>

            <div className="filters">
                <label className="search">
                <Icon name="search" size={13} />
                <input
                    type="text"
                    placeholder="Search name or email"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                </label>

                <div className="status-filter">
                <label htmlFor="status">Status</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="All">All</option>
                </select>
                </div>
            </div>

            <UsersTable users={filteredUsers} />
            </main>
        </div>
        </div>
    );
    }