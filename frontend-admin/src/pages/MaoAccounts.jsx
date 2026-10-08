    import { useMemo, useState } from "react";
    import {
    Bell,
    Database,
    FileText,
    LayoutDashboard,
    LogOut,
    Plus,
    Search,
    Settings,
    ShieldCheck,
    Activity,
    UserCog,
    Users,
    } from "lucide-react";
    import "./MaoAccounts.css";

    const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "User Accounts", icon: Users },
    { label: "MAO Accounts", icon: UserCog },
    { label: "Audit Logs", icon: FileText },
    { label: "System Monitoring", icon: Activity },
    { label: "Security", icon: ShieldCheck },
    { label: "Backup & Recovery", icon: Database },
    { label: "System Settings", icon: Settings },
    ];

    const STATUS_OPTIONS = ["All", "Active", "Inactive"];

    const ACCOUNTS = [
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

    const TABLE_COLUMNS = ["Name", "Email address", "Role", "Status", "Last login", "Actions"];

    function Badge({ children }) {
    return <span className="badge">{children}</span>;
    }

    function Sidebar({ activeItem }) {
    return (
        <aside className="sidebar">
        <div className="sidebar__brand">
            <span className="sidebar__logo" aria-hidden="true">A</span>
            <span className="sidebar__brand-name">AgriPrice</span>
        </div>

        <p className="sidebar__section-title">Overview</p>

        <nav aria-label="Main navigation">
            <ul className="sidebar__list">
            {NAV_ITEMS.map(({ label, icon: Icon }) => (
                <li key={label}>
                <a
                    href="#"
                    className={`sidebar__link ${label === activeItem ? "is-active" : ""}`}
                    aria-current={label === activeItem ? "page" : undefined}
                >
                    <Icon size={15} />
                    {label}
                </a>
                </li>
            ))}
            </ul>
        </nav>

        <button type="button" className="sidebar__signout">
            <LogOut size={15} />
            Sign Out
        </button>
        </aside>
    );
    }

    function TopBar({ title }) {
    return (
        <header className="topbar">
        <h1 className="topbar__title">{title}</h1>
        <button type="button" className="icon-button" aria-label="Notifications">
            <Bell size={16} />
        </button>
        </header>
    );
    }

    function Toolbar({ search, onSearchChange, status, onStatusChange }) {
    return (
        <div className="toolbar">
        <label className="search">
            <Search size={14} className="search__icon" />
            <input
            type="text"
            placeholder="Search name or email"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            />
        </label>

        <div className="status-filter">
            <label htmlFor="status-filter">Status</label>
            <select
            id="status-filter"
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            >
            {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                {option === "All" ? "All statuses" : option}
                </option>
            ))}
            </select>
        </div>
        </div>
    );
    }

    function AccountsTable({ accounts, onEdit }) {
    return (
        <div className="card">
        <table className="table">
            <thead>
            <tr>
                {TABLE_COLUMNS.map((column) => (
                <th key={column} scope="col">{column}</th>
                ))}
            </tr>
            </thead>

            <tbody>
            {accounts.length === 0 && (
                <tr>
                <td colSpan={TABLE_COLUMNS.length} className="table__empty">
                    No accounts match your search.
                </td>
                </tr>
            )}

            {accounts.map((account) => (
                <tr key={account.id}>
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td><Badge>{account.role}</Badge></td>
                <td><Badge>{account.status}</Badge></td>
                <td>{account.lastLogin}</td>
                <td>
                    <button
                    type="button"
                    className="button button--outline"
                    onClick={() => onEdit(account)}
                    >
                    Edit account
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    }

    export default function MaoAccounts() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const visibleAccounts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return ACCOUNTS.filter((account) => {
        const matchesStatus = status === "All" || account.status === status;
        const matchesSearch =
            account.name.toLowerCase().includes(query) ||
            account.email.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
        });
    }, [search, status]);

    const handleAddAccount = () => {};

    const handleEditAccount = (account) => {};

    return (
        <div className="layout">
        <Sidebar activeItem="MAO Accounts" />

        <div className="main">
            <TopBar title="MAO Accounts" />

            <main className="content">
            <div className="content__intro">
                <p className="content__description">
                Manage MAO account details and access.
                </p>
                <button
                type="button"
                className="button button--primary"
                onClick={handleAddAccount}
                >
                <Plus size={14} />
                Add account
                </button>
            </div>

            <Toolbar
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={setStatus}
            />

            <AccountsTable accounts={visibleAccounts} onEdit={handleEditAccount} />
            </main>
        </div>
        </div>
    );
    }