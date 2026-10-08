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
  LuArrowRight,
  LuShieldCheck,
} from "react-icons/lu";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: TbLayoutDashboard, active: true },
  { to: "/crop-management", label: "Crop Management", icon: LuSprout },
  { to: "/market-management", label: "Market Management", icon: LuStore },
  { to: "/crop-prices", label: "Crop Prices", icon: LuTags },
  { to: "/price-validation", label: "Price Validation", icon: VscWorkspaceTrusted },
  { to: "/historical-records", label: "Historical Records", icon: GoHistory },
  { to: "/forecast-information", label: "Forecast Information", icon: LuChartNoAxesCombined },
  { to: "/reports-analytics", label: "Reports & Analytics", icon: TbFileAnalytics },
];

export default function Dashboard() {
  const statsData = [
    { title: "Active crops", value: "8", icon: <LuSprout size={16} color="#4b5563" /> },
    { title: "Monitored markets", value: "7", icon: <LuStore size={16} color="#4b5563" /> },
    { title: "Verified price records", value: "56", icon: <LuTags size={16} color="#4b5563" /> },
    { title: "Awaiting validation", value: "2", subtext: "Review before public display", icon: <LuShieldCheck size={16} color="#4b5563" /> },
  ];

  const pendingData = [
    { id: 1, crop: "Tomato", market: "Teresa Public Market", price: "₱65.00", status: "Pending" },
    { id: 2, crop: "Rice", market: "Antipolo Public Market", price: "₱47.00", status: "Pending" },
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

      {/* MAIN */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>MAO Dashboard</h1>
          <button style={styles.notifBtn} aria-label="Notifications">
            <TbBell size={18} color="#374151" />
          </button>
        </header>

        <main style={styles.mainBody}>
          {/* Banner */}
          <div style={styles.banner}>
            <p style={styles.bannerText}>Keep Jala-Jala's crop information accurate and up to date.</p>
            <Link to="/crop-prices" style={styles.bannerBtn}>
              <span>Record a price</span>
              <LuArrowRight size={14} />
            </Link>
          </div>

          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <div key={index} style={styles.statCard}>
                <div style={styles.statHeader}>
                  <span style={styles.statTitle}>{stat.title}</span>
                  <div style={styles.statIconWrapper}>{stat.icon}</div>
                </div>
                <div style={styles.statBody}>
                  <h3 style={styles.statValue}>{stat.value}</h3>
                  {stat.subtext && <span style={styles.statSubtext}>{stat.subtext}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Table card */}
          <div style={styles.tableCard}>
            <div style={styles.tableHeaderContainer}>
              <h3 style={styles.tableSectionTitle}>Prices needing attention</h3>
              <Link to="/price-validation" style={styles.viewAllLink}>
                <span>Review queue</span>
                <LuArrowRight size={14} />
              </Link>
            </div>

            <table style={styles.table}>
              <colgroup>
                <col style={{ width: "16%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={styles.th}>CROP</th>
                  <th style={styles.th}>MARKET</th>
                  <th style={styles.th}>SUBMITTED PRICE / KG</th>
                  <th style={styles.th}>STATUS</th>
                  <th style={{ ...styles.th, ...styles.thAction }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pendingData.map((item, index) => (
                  <tr
                    key={item.id}
                    style={index === pendingData.length - 1 ? styles.trBodyLast : styles.trBody}
                  >
                    <td style={{ ...styles.td, fontWeight: 500, color: "#111827" }}>{item.crop}</td>
                    <td style={styles.td}>{item.market}</td>
                    <td style={styles.td}>{item.price}</td>
                    <td style={styles.td}>
                      <span style={styles.pendingBadge}>{item.status}</span>
                    </td>
                    <td style={{ ...styles.td, ...styles.tdAction }}>
                      <Link to="/price-validation" style={styles.actionBtn}>
                        <span>Review</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Cards Grid */}
          <div style={styles.bottomCardsGrid}>
            <div style={styles.infoCard}>
              <h3 style={styles.infoCardTitle}>Maintain agricultural information</h3>
              <p style={styles.infoCardText}>
                Crop and market details are shared across the farmer tools.<br />
                New prices require validation before they appear publicly.
              </p>
              <Link to="/crop-management" style={styles.inlineLink}>
                <span>Manage crops</span>
                <LuArrowRight size={14} />
              </Link>
            </div>

            <div style={styles.infoCard}>
              <h3 style={styles.infoCardTitle}>Latest data activity</h3>
              <div style={styles.activityBox}>
                <p style={styles.activityTitle}>Reviewed price submissions</p>
                <p style={styles.activityMeta}>Elena Reyes · 2026-09-05 08:00</p>
              </div>
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
    textDecoration: "none",
    cursor: "pointer",
  },

  /* Stats Grid */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  statHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statTitle: { fontSize: "11px", fontWeight: 500, color: "#6b7280" },
  statIconWrapper: { display: "flex", alignItems: "center", justifyContent: "center" },
  statBody: { display: "flex", flexDirection: "column", gap: "2px" },
  statValue: { fontSize: "22px", fontWeight: 600, color: "#111827", margin: 0 },
  statSubtext: { fontSize: "10px", color: "#9ca3af" },

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
  viewAllLink: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#1f8a4c",
    textDecoration: "none",
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
    color: "#b45309",
    fontSize: "9px",
    fontWeight: 500,
    padding: "3px 8px",
    borderRadius: "4px",
  },
  actionBtn: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    color: "#374151",
    padding: "5px 9px",
    borderRadius: "5px",
    fontSize: "10px",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    cursor: "pointer",
  },

  /* Bottom Cards Grid */
  bottomCardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  infoCardTitle: { fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 },
  infoCardText: { fontSize: "11px", color: "#6b7280", margin: 0, lineHeight: 1.5 },
  inlineLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#1f8a4c",
    textDecoration: "none",
    marginTop: "4px",
  },
  activityBox: { display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px" },
  activityTitle: { fontSize: "11px", fontWeight: 500, color: "#374151", margin: 0 },
  activityMeta: { fontSize: "10px", color: "#9ca3af", margin: 0 },
};