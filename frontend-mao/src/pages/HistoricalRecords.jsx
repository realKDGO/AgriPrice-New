import React from "react";
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
  LuPlus,
  LuSearch,
} from "react-icons/lu";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: TbLayoutDashboard },
  { to: "/crop-management", label: "Crop Management", icon: LuSprout },
  { to: "/market-management", label: "Market Management", icon: LuStore },
  { to: "/crop-prices", label: "Crop Prices", icon: LuTags },
  { to: "/price-validation", label: "Price Validation", icon: VscWorkspaceTrusted },
  { to: "/historical-records", label: "Historical Records", icon: GoHistory, active: true },
  { to: "/forecast-information", label: "Forecast Information", icon: LuChartNoAxesCombined },
  { to: "/reports-analytics", label: "Reports & Analytics", icon: TbFileAnalytics },
];

export default function HistoricalRecords() {
  const totalRecords = 96;

  const historicalData = [
    { id: 1, crop: "Rice", market: "Binangonan Public Market", price: "₱40.00", date: "Mar 1, 2026", status: "Verified" },
    { id: 2, crop: "Rice", market: "Taytay Public Market", price: "₱42.35", date: "Mar 15, 2026", status: "Verified" },
    { id: 3, crop: "Rice", market: "Angono Public Market", price: "₱41.43", date: "Apr 1, 2026", status: "Verified" },
    { id: 4, crop: "Rice", market: "Rodriguez (Montalban) Market", price: "₱39.40", date: "Apr 15, 2026", status: "Verified" },
    { id: 5, crop: "Rice", market: "Teresa Public Market", price: "₱40.26", date: "May 1, 2026", status: "Verified" },
    { id: 6, crop: "Rice", market: "Antipolo Public Market", price: "₱43.21", date: "May 15, 2026", status: "Verified" },
    { id: 7, crop: "Rice", market: "Cainta Public Market", price: "₱43.99", date: "Jun 1, 2026", status: "Verified" },
    { id: 8, crop: "Rice", market: "Binangonan Public Market", price: "₱41.93", date: "Jun 15, 2026", status: "Verified" },
  ];

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

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Historical Records</h1>
          <button style={styles.notifBtn} aria-label="Notifications">
            <TbBell size={18} color="#374151" />
          </button>
        </header>

        <main style={styles.mainBody}>
          <div style={styles.banner}>
            <p style={styles.bannerText}>Maintain agricultural records used throughout AgriPrice.</p>
            <button style={styles.bannerBtn}>
              <LuPlus size={15} />
              <span>Add record</span>
            </button>
          </div>

          {/* Filter Row */}
          <div style={styles.filterRow}>
            <div style={styles.searchWrapper}>
              <LuSearch size={15} color="#9ca3af" style={styles.searchIcon} />
              <input type="text" placeholder="Search records" style={styles.searchInput} />
            </div>
            <div style={styles.filtersRight}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Status</label>
                <select style={styles.select} defaultValue="Active">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Market</label>
                <select style={styles.selectWide} defaultValue="All markets">
                  <option>All markets</option>
                  <option>Binangonan Public Market</option>
                  <option>Taytay Public Market</option>
                  <option>Angono Public Market</option>
                  <option>Rodriguez (Montalban) Market</option>
                  <option>Teresa Public Market</option>
                  <option>Antipolo Public Market</option>
                  <option>Cainta Public Market</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div style={styles.tableCard}>
            <div style={styles.tableHeaderContainer}>
              <h3 style={styles.tableSectionTitle}>{totalRecords} records</h3>
              <span style={styles.tableSubTitle}>Current records</span>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <colgroup>
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "18%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={styles.th}>CROP</th>
                    <th style={styles.th}>MARKET</th>
                    <th style={styles.th}>PRICE / KG</th>
                    <th style={styles.th}>DATE</th>
                    <th style={styles.th}>STATUS</th>
                    <th style={{ ...styles.th, textAlign: "right", paddingRight: "12px" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalData.map((item, index) => (
                    <tr
                      key={item.id}
                      style={index === historicalData.length - 1 ? styles.trBodyLast : styles.trBody}
                    >
                      <td style={{ ...styles.td, fontWeight: 500, color: "#111827" }}>{item.crop}</td>
                      <td style={styles.td}>{item.market}</td>
                      <td style={styles.td}>{item.price}</td>
                      <td style={styles.td}>{item.date}</td>
                      <td style={styles.td}>
                        <span style={styles.verifiedBadge}>{item.status}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <div style={styles.actionButtonsWrapper}>
                          <button style={styles.actionBtn}>
                            <LuEye size={13} color="#4b5563" />
                            <span>View</span>
                          </button>
                          <button style={styles.actionBtn}>
                            <LuPencil size={13} color="#4b5563" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
  banner: {
    backgroundColor: "transparent",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  bannerText: { fontSize: "12px", color: "#6b7280", margin: 0 },
  bannerBtn: {
    backgroundColor: "#1f8a4c",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    flexShrink: 0,
  },

  /* Filters */
  filterRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "16px",
    width: "100%",
  },
  searchWrapper: { flex: 1, minWidth: "200px", position: "relative" },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    height: "36px",
    padding: "0 12px 0 34px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#374151",
    outline: "none",
    boxSizing: "border-box",
  },
  filtersRight: { display: "flex", alignItems: "flex-end", gap: "12px", flexShrink: 0 },
  filterGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  filterLabel: { fontSize: "11px", fontWeight: 500, color: "#374151" },
  select: {
    height: "36px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "0 10px",
    fontSize: "12px",
    color: "#374151",
    minWidth: "120px",
    cursor: "pointer",
    outline: "none",
    boxSizing: "border-box",
  },
  selectWide: {
    height: "36px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "0 10px",
    fontSize: "12px",
    color: "#374151",
    minWidth: "180px",
    cursor: "pointer",
    outline: "none",
    boxSizing: "border-box",
  },

  /* Table Card */
  tableCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px 18px 12px 18px",
  },
  tableHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  tableSectionTitle: { fontSize: "14px", fontWeight: 600, color: "#111827", margin: 0 },
  tableSubTitle: { fontSize: "12px", color: "#6b7280" },
  tableWrapper: { width: "100%", overflowX: "auto" },
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
  trBody: { borderBottom: "1px solid #f1f2f0" },
  trBodyLast: { borderBottom: "none" },
  td: {
    fontSize: "11px",
    color: "#374151",
    padding: "15px 12px",
    verticalAlign: "middle",
  },
  verifiedBadge: {
    display: "inline-block",
    backgroundColor: "#d1fae5",
    color: "#065f46",
    fontSize: "9px",
    fontWeight: 500,
    padding: "3px 8px",
    borderRadius: "4px",
  },
  actionButtonsWrapper: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "6px",
  },
  actionBtn: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    color: "#374151",
    padding: "4px 8px",
    borderRadius: "5px",
    fontSize: "10px",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
  },
};