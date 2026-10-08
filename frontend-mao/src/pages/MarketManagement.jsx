import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import agriLogo from "../AgriPrice_White.png";

import { TbLayoutDashboard, TbFileAnalytics, TbBell } from "react-icons/tb";
import {
  LuSprout,
  LuStore,
  LuTags,
  LuChartNoAxesCombined,
  LuSettings,
  LuLogOut,
  LuEye,
  LuPencil,
  LuArchive,
  LuSearch,
  LuPlus,
  LuChevronDown,
} from "react-icons/lu";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";

const initialMarkets = [
  { id: 1, market: "Antipolo Public Market", location: "Antipolo City, Rizal", transport: "₱180.00", status: "Active" },
  { id: 2, market: "Cainta Public Market", location: "Cainta, Rizal", transport: "₱150.00", status: "Active" },
  { id: 3, market: "Binangonan Public Market", location: "Binangonan, Rizal", transport: "₱240.00", status: "Active" },
  { id: 4, market: "Taytay Public Market", location: "Taytay, Rizal", transport: "₱200.00", status: "Active" },
  { id: 5, market: "Angono Public Market", location: "Angono, Rizal", transport: "₱220.00", status: "Active" },
  { id: 6, market: "Rodriguez (Montalban) Market", location: "Rodriguez, Rizal", transport: "₱280.00", status: "Active" },
  { id: 7, market: "Teresa Public Market", location: "Teresa, Rizal", transport: "₱260.00", status: "Active" },
];

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: TbLayoutDashboard },
  { to: "/crop-management", label: "Crop Management", icon: LuSprout },
  { to: "/market-management", label: "Market Management", icon: LuStore, active: true },
  { to: "/crop-prices", label: "Crop Prices", icon: LuTags },
  { to: "/price-validation", label: "Price Validation", icon: VscWorkspaceTrusted },
  { to: "/historical-records", label: "Historical Records", icon: GoHistory },
  { to: "/forecast-information", label: "Forecast Information", icon: LuChartNoAxesCombined },
  { to: "/reports-analytics", label: "Reports & Analytics", icon: TbFileAnalytics },
];

export default function MarketManagement() {
  const [markets, setMarkets] = useState(initialMarkets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return markets.filter((m) => {
      const matchesStatus = statusFilter === "All" || m.status === statusFilter;
      const matchesSearch =
        !q || m.market.toLowerCase().includes(q) || m.location.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [markets, search, statusFilter]);

  const toggleArchive = (id) => {
    setMarkets((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === "Active" ? "Archived" : "Active" } : m
      )
    );
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.topContent}>
          <div style={styles.brandContainer}>
            <img src={agriLogo} alt="AgriPrice Logo" style={styles.logoImage} />
            <span style={styles.brandText}>AgriPrice</span>
          </div>

          <div style={styles.navSection}>
            <span style={styles.sectionTitle}>OVERVIEW</span>
            <nav style={styles.nav}>
              {navItems.map(({ to, label, icon: Icon, active }) => (
                <Link key={to} to={to} style={active ? styles.activeNavLink : styles.navLink}>
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div style={styles.navSection}>
            <span style={styles.sectionTitle}>ACCOUNT</span>
            <nav style={styles.nav}>
              <Link to="/settings" style={styles.navLink}>
                <LuSettings size={18} />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>

        <div style={styles.sidebarBottom}>
          <Link to="/" style={styles.logoutLink}>
            <LuLogOut size={18} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Market Management</h1>
          <button style={styles.notifBtn} aria-label="Notifications">
            <TbBell size={18} color="#374151" />
          </button>
        </header>

        <main style={styles.mainBody}>
          {/* Banner */}
          <div style={styles.banner}>
            <p style={styles.bannerText}>Maintain agricultural records used throughout AgriPrice.</p>
            <button style={styles.bannerBtn}>
              <LuPlus size={14} />
              <span>Add market</span>
            </button>
          </div>

          {/* Filters (no card wrapper, same as the design) */}
          <div style={styles.filterRow}>
            <div style={styles.searchWrapper}>
              <LuSearch size={15} color="#6b7280" style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search records"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <span style={styles.filterLabel}>Status</span>
              <div style={styles.selectWrapper}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={styles.select}
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                  <option value="All">All</option>
                </select>
                <LuChevronDown size={14} color="#6b7280" style={styles.selectIcon} />
              </div>
            </div>
          </div>

          {/* Table card */}
          <div style={styles.tableCard}>
            <div style={styles.tableHeaderContainer}>
              <h3 style={styles.tableSectionTitle}>
                {filtered.length} {filtered.length === 1 ? "record" : "records"}
              </h3>
              <span style={styles.tableSubTitle}>
                {statusFilter === "Archived" ? "Archived records" : "Current records"}
              </span>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: "28%" }}>MARKET</th>
                  <th style={{ ...styles.th, width: "24%" }}>LOCATION</th>
                  <th style={{ ...styles.th, width: "18%" }}>TRANSPORT / 100 KG</th>
                  <th style={{ ...styles.th, width: "12%" }}>STATUS</th>
                  <th style={{ ...styles.th, ...styles.thAction }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={styles.emptyCell}>
                      No records found.
                    </td>
                  </tr>
                )}
                {filtered.map((item, index) => (
                  <tr
                    key={item.id}
                    style={index === filtered.length - 1 ? styles.trBodyLast : styles.trBody}
                  >
                    <td style={{ ...styles.td, fontWeight: 500, color: "#111827" }}>{item.market}</td>
                    <td style={styles.td}>{item.location}</td>
                    <td style={styles.td}>{item.transport}</td>
                    <td style={styles.td}>
                      <span
                        style={item.status === "Active" ? styles.activeBadge : styles.archivedBadge}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ ...styles.td, ...styles.tdAction }}>
                      <div style={styles.actionButtonsWrapper}>
                        <button style={styles.actionBtn}>
                          <LuEye size={14} color="#4b5563" />
                          <span>View</span>
                        </button>
                        <button style={styles.actionBtn}>
                          <LuPencil size={14} color="#4b5563" />
                          <span>Edit</span>
                        </button>
                        <button
                          style={styles.actionIconBtn}
                          onClick={() => toggleArchive(item.id)}
                          title={item.status === "Active" ? "Archive" : "Restore"}
                          aria-label={item.status === "Active" ? "Archive" : "Restore"}
                        >
                          <LuArchive size={14} color="#4b5563" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100%",
    margin: 0,
    backgroundColor: "#f5f4f0",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflow: "hidden",
  },

  sidebar: {
    width: "260px",
    backgroundColor: "#0d3b27",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#ffffff",
    height: "100vh",
    boxSizing: "border-box",
    flexShrink: 0,
  },
  topContent: { overflowY: "auto", flex: 1 },
  brandContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "22px 20px 18px 20px",
  },
  logoImage: { width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" },
  brandText: { fontWeight: 700, fontSize: "17px", color: "#ffffff" },
  navSection: { padding: "0 14px", marginTop: "14px" },
  sectionTitle: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#8fb3a0",
    letterSpacing: "1px",
    paddingLeft: "10px",
    marginBottom: "8px",
    display: "block",
  },
  nav: { display: "flex", flexDirection: "column", gap: "2px" },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 10px",
    borderRadius: "6px",
    color: "#d3e3da",
    textDecoration: "none",
    fontSize: "13px",
  },
  activeNavLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 10px",
    borderRadius: "6px",
    backgroundColor: "#1f8a4c",
    color: "#ffffff",
    fontWeight: 500,
    textDecoration: "none",
    fontSize: "13px",
  },
  sidebarBottom: { padding: "16px 14px 22px 14px", marginTop: "auto" },
  logoutLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 10px",
    borderRadius: "6px",
    color: "#d3e3da",
    textDecoration: "none",
    fontSize: "13px",
  },

  /* Main */
  mainContent: { flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", minWidth: 0 },
  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    flexShrink: 0,
  },
  headerTitle: { fontSize: "15px", fontWeight: 600, color: "#111827", margin: 0 },
  notifBtn: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
  },
  mainBody: {
    padding: "20px 28px 32px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  /* Banner */
  banner: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  bannerText: { fontSize: "12px", color: "#6b7280", margin: 0 },
  bannerBtn: {
    backgroundColor: "#1f8a4c",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "9px 16px",
    fontSize: "12px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },

  /* Filters */
  filterRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "16px",
  },
  searchWrapper: { position: "relative", flex: 1 },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    height: "36px",
    padding: "0 12px 0 34px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#374151",
    outline: "none",
  },
  filterGroup: { display: "flex", flexDirection: "column", gap: "6px", width: "150px", flexShrink: 0 },
  filterLabel: { fontSize: "11px", fontWeight: 500, color: "#374151" },
  selectWrapper: { position: "relative", width: "100%" },
  select: {
    width: "100%",
    boxSizing: "border-box",
    height: "36px",
    padding: "0 30px 0 12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#374151",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    cursor: "pointer",
  },
  selectIcon: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },

  /* Table */
  tableCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px 18px 10px 18px",
  },
  tableHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  tableSectionTitle: { fontSize: "14px", fontWeight: 600, color: "#111827", margin: 0 },
  tableSubTitle: { fontSize: "12px", color: "#6b7280" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left", tableLayout: "fixed" },
  th: {
    fontSize: "9px",
    fontWeight: 500,
    color: "#6b7a6e",
    padding: "10px 12px",
    letterSpacing: "0.5px",
    backgroundColor: "#f3f4f1",
    textAlign: "left",
  },
  thAction: { textAlign: "right", paddingRight: "12px" },
  trBody: { borderBottom: "1px solid #f1f2f0" },
  trBodyLast: { borderBottom: "none" },
  td: {
    fontSize: "11px",
    color: "#374151",
    padding: "15px 12px",
    verticalAlign: "middle",
  },
  tdAction: { textAlign: "right" },
  emptyCell: {
    textAlign: "center",
    padding: "32px 12px",
    fontSize: "12px",
    color: "#9ca3af",
  },
  activeBadge: {
    display: "inline-block",
    backgroundColor: "#e3f4e8",
    color: "#1d7a3e",
    fontSize: "9px",
    fontWeight: 500,
    padding: "3px 8px",
    borderRadius: "4px",
  },
  archivedBadge: {
    display: "inline-block",
    backgroundColor: "#f1f2f0",
    color: "#6b7280",
    fontSize: "9px",
    fontWeight: 500,
    padding: "3px 8px",
    borderRadius: "4px",
  },
  actionButtonsWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "6px",
  },
  actionBtn: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    color: "#374151",
    padding: "5px 9px",
    borderRadius: "5px",
    fontSize: "10px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
  },
  actionIconBtn: {
    backgroundColor: "transparent",
    border: "none",
    padding: "5px 6px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
};