import React, { useState } from "react";
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
} from "react-icons/lu";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: TbLayoutDashboard },
  { to: "/crop-management", label: "Crop Management", icon: LuSprout },
  { to: "/market-management", label: "Market Management", icon: LuStore },
  { to: "/crop-prices", label: "Crop Prices", icon: LuTags },
  { to: "/price-validation", label: "Price Validation", icon: VscWorkspaceTrusted, active: true },
  { to: "/historical-records", label: "Historical Records", icon: GoHistory },
  { to: "/forecast-information", label: "Forecast Information", icon: LuChartNoAxesCombined },
  { to: "/reports-analytics", label: "Reports & Analytics", icon: TbFileAnalytics },
];

export default function PriceValidation() {
  const [activeTab, setActiveTab] = useState("Pending");

  const pendingData = [
    { id: 1, crop: "Tomato", market: "Teresa Public Market", submitted: "₱65.00", source: "Field submission", status: "Pending" },
    { id: 2, crop: "Rice", market: "Antipolo Public Market", submitted: "₱47.00", source: "Field submission", status: "Pending" },
  ];

  const verifiedData = [
    { id: 1, crop: "Rice", market: "Antipolo Public Market", submitted: "₱45.00", source: "MAO record", status: "Verified" },
    { id: 2, crop: "Rice", market: "Cainta Public Market", submitted: "₱47.00", source: "MAO record", status: "Verified" },
    { id: 3, crop: "Rice", market: "Binangonan Public Market", submitted: "₱43.00", source: "MAO record", status: "Verified" },
    { id: 4, crop: "Rice", market: "Taytay Public Market", submitted: "₱48.00", source: "MAO record", status: "Verified" },
    { id: 5, crop: "Rice", market: "Angono Public Market", submitted: "₱44.00", source: "MAO record", status: "Verified" },
    { id: 6, crop: "Rice", market: "Rodriguez (Montalban) Market", submitted: "₱46.00", source: "MAO record", status: "Verified" },
    { id: 7, crop: "Rice", market: "Teresa Public Market", submitted: "₱49.00", source: "MAO record", status: "Verified" },
    { id: 8, crop: "Tomato", market: "Antipolo Public Market", submitted: "₱65.00", source: "MAO record", status: "Verified" },
    { id: 9, crop: "Tomato", market: "Cainta Public Market", submitted: "₱67.00", source: "MAO record", status: "Verified" },
  ];

  const rejectedData = [
    { id: 1, crop: "Corn", market: "Binangonan Public Market", submitted: "₱55.00", source: "Field submission", status: "Rejected" },
    { id: 2, crop: "Onion", market: "Taytay Public Market", submitted: "₱120.00", source: "Field submission", status: "Rejected" },
  ];

  const currentData = activeTab === "Pending" ? pendingData : activeTab === "Verified" ? verifiedData : rejectedData;

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
          <h1 style={styles.headerTitle}>Price Validation</h1>
          <button style={styles.notifBtn} aria-label="Notifications">
            <TbBell size={18} color="#374151" />
          </button>
        </header>

        <main style={styles.mainBody}>
          <p style={styles.bannerText}>Review crop quotations before they are shown to farmers.</p>

          {/* Tabs */}
          <div style={styles.tabsContainer}>
            <span
              style={activeTab === "Pending" ? styles.activeTab : styles.inactiveTab}
              onClick={() => setActiveTab("Pending")}
            >
              Pending
            </span>
            <span
              style={activeTab === "Verified" ? styles.activeTab : styles.inactiveTab}
              onClick={() => setActiveTab("Verified")}
            >
              Verified
            </span>
            <span
              style={activeTab === "Rejected" ? styles.activeTab : styles.inactiveTab}
              onClick={() => setActiveTab("Rejected")}
            >
              Rejected
            </span>
          </div>

          {/* Table Card */}
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <colgroup>
                <col style={{ width: "16%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "8%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={styles.th}>CROP</th>
                  <th style={styles.th}>MARKET</th>
                  <th style={styles.th}>SUBMITTED / KG</th>
                  <th style={styles.th}>SOURCE</th>
                  <th style={styles.th}>STATUS</th>
                  <th style={{ ...styles.th, ...styles.thAction }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr
                      key={item.id}
                      style={index === currentData.length - 1 ? styles.trBodyLast : styles.trBody}
                    >
                      <td style={{ ...styles.td, fontWeight: 500, color: "#111827" }}>{item.crop}</td>
                      <td style={styles.td}>{item.market}</td>
                      <td style={styles.td}>{item.submitted}</td>
                      <td style={styles.td}>{item.source}</td>
                      <td style={styles.td}>
                        <span
                          style={
                            activeTab === "Pending"
                              ? styles.pendingBadge
                              : activeTab === "Verified"
                              ? styles.verifiedBadge
                              : styles.rejectedBadge
                          }
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ ...styles.td, ...styles.tdAction }}>
                        <div style={styles.actionButtonsWrapper}>
                          <button style={styles.actionBtn}>
                            <span>{activeTab === "Pending" ? "Review" : "View"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ ...styles.td, textAlign: "center", color: "#9ca3af", padding: "30px" }}>
                      No records found.
                    </td>
                  </tr>
                )}
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
  bannerText: { fontSize: "12px", color: "#6b7280", margin: 0 },

  /* Tabs */
  tabsContainer: {
    display: "flex",
    gap: "24px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "0px",
  },
  activeTab: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#1f8a4c",
    paddingBottom: "8px",
    borderBottom: "2px solid #1f8a4c",
    cursor: "pointer",
  },
  inactiveTab: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#6b7280",
    paddingBottom: "8px",
    cursor: "pointer",
  },

  /* Table Card */
  tableCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px 18px 10px 18px",
  },
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
  pendingBadge: {
    display: "inline-block",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontSize: "9px",
    fontWeight: 500,
    padding: "3px 8px",
    borderRadius: "4px",
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
  rejectedBadge: {
    display: "inline-block",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    fontSize: "9px",
    fontWeight: 500,
    padding: "3px 8px",
    borderRadius: "4px",
  },
  actionButtonsWrapper: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  actionBtn: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    color: "#374151",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "10px",
    fontWeight: 500,
    cursor: "pointer",
  },
};