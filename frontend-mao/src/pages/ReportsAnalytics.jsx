import React, { useState } from "react";
import { Link } from "react-router-dom";
import agriLogo from "../AgriPrice_White.png";

import { TbLayoutDashboard, TbFileAnalytics, TbBell, TbChartBar } from "react-icons/tb";
import {
  LuSprout,
  LuStore,
  LuTags,
  LuChartNoAxesCombined,
  LuSettings,
  LuLogOut,
  LuTrendingUp,
  LuTrendingDown,
  LuDownload,
} from "react-icons/lu";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: TbLayoutDashboard },
  { to: "/crop-management", label: "Crop Management", icon: LuSprout },
  { to: "/market-management", label: "Market Management", icon: LuStore },
  { to: "/crop-prices", label: "Crop Prices", icon: LuTags },
  { to: "/price-validation", label: "Price Validation", icon: VscWorkspaceTrusted },
  { to: "/historical-records", label: "Historical Records", icon: GoHistory },
  { to: "/forecast-information", label: "Forecast Information", icon: LuChartNoAxesCombined },
  { to: "/reports-analytics", label: "Reports & Analytics", icon: TbFileAnalytics, active: true },
];

export default function ReportsAnalytics() {
  const [selectedCrop, setSelectedCrop] = useState("All crops");
  const [selectedMarket, setSelectedMarket] = useState("All markets");

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
          <h1 style={styles.headerTitle}>Reports & Analytics</h1>
          <button style={styles.notifBtn} aria-label="Notifications">
            <TbBell size={18} color="#374151" />
          </button>
        </header>

        <main style={styles.mainBody}>
          <div style={styles.topBannerRow}>
            <p style={styles.bannerText}>
              Review current crop-price records across monitored markets.
            </p>
            <button style={styles.exportBtn}>
              <LuDownload size={15} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* METRIC CARDS */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricIconWrapper}>
                <LuTrendingUp size={18} color="#111827" />
              </div>
              <div style={styles.metricValue}>₱134.00</div>
              <div style={styles.metricLabel}>Highest Price</div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricIconWrapper}>
                <LuTrendingDown size={18} color="#111827" />
              </div>
              <div style={styles.metricValue}>₱35.00</div>
              <div style={styles.metricLabel}>Lowest Price</div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricIconWrapper}>
                <TbChartBar size={18} color="#111827" />
              </div>
              <div style={styles.metricValue}>₱66.63</div>
              <div style={styles.metricLabel}>Average Price</div>
            </div>
          </div>

          {/* FILTER ROW */}
          <div style={styles.filterCard}>
            <div style={styles.filterRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Crop</label>
                <select
                  style={styles.select}
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                >
                  <option>All crops</option>
                  <option>Rice</option>
                  <option>Corn</option>
                  <option>Tomato</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Market</label>
                <select
                  style={styles.select}
                  value={selectedMarket}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                >
                  <option>All markets</option>
                  <option>Cainta Public Market</option>
                  <option>Taytay Public Market</option>
                  <option>Angono Public Market</option>
                  <option>Teresa Public Market</option>
                </select>
              </div>
            </div>
          </div>

          {/* CHART CARD */}
          <div style={styles.chartCard}>
            <h3 style={styles.cardTitle}>Crop Price Report</h3>
            <div style={styles.chartWrapper}>
              <div style={styles.yAxisLabels}>
                <span style={styles.yAxisLabelText}>₱150</span>
                <span style={styles.yAxisLabelText}>₱120</span>
                <span style={styles.yAxisLabelText}>₱90</span>
                <span style={styles.yAxisLabelText}>₱60</span>
                <span style={styles.yAxisLabelText}>₱30</span>
              </div>

              <div style={styles.chartArea}>
                <div style={styles.gridLinesContainer}>
                  <div style={styles.gridLine} />
                  <div style={styles.gridLine} />
                  <div style={styles.gridLine} />
                  <div style={styles.gridLine} />
                  <div style={styles.gridLine} />
                </div>

                <svg style={styles.svgContainer} viewBox="0 0 1100 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="reportsGreenFade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2f8f5b" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#2f8f5b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Eksaktong galing sa iyong Figma SVG export ang graph path coordinates */}
                  <path
                    d="M 20 135 L 75 138 L 130 132 L 185 115 L 240 100 L 295 105 L 350 100 L 405 125 L 460 145 L 515 142 L 570 65 L 625 68 L 680 130 L 735 35 L 790 32 L 845 32 L 900 35 L 955 30 L 1000 32 L 1000 160 L 20 160 Z"
                    fill="url(#reportsGreenFade)"
                  />
                  <path
                    d="M 20 135 L 75 138 L 130 132 L 185 115 L 240 100 L 295 105 L 350 100 L 405 125 L 460 145 L 515 142 L 570 65 L 625 68 L 680 130 L 735 35 L 790 32 L 845 32 L 900 35 L 955 30 L 1000 32"
                    fill="none"
                    stroke="#1f7a48"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <div style={styles.xAxisLabels}>
                  <span style={styles.xAxisLabelText}>Cainta Public Market</span>
                  <span style={styles.xAxisLabelText}>Taytay Public Market</span>
                  <span style={styles.xAxisLabelText}>Angono Public Market</span>
                  <span style={styles.xAxisLabelText}>Teresa Public Market</span>
                  <span style={styles.xAxisLabelText}>Antipolo Public Market</span>
                  <span style={styles.xAxisLabelText}>Binangonan Public Market</span>
                  <span style={styles.xAxisLabelText}>Teresa Public Market</span>
                </div>
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
  topBannerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerText: { fontSize: "12px", color: "#6b7280", margin: 0 },
  exportBtn: {
    backgroundColor: "#1f8a4c",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "7px 14px",
    fontSize: "12px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    width: "100%",
  },
  metricCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxSizing: "border-box",
  },
  metricIconWrapper: {
    marginBottom: "4px",
  },
  metricValue: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#111827",
  },
  metricLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 500,
  },
  filterCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px",
    width: "100%",
    boxSizing: "border-box",
  },
  filterRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: { fontSize: "11px", fontWeight: 500, color: "#374151" },
  select: {
    width: "100%",
    height: "36px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "0 10px",
    fontSize: "12px",
    color: "#374151",
    cursor: "pointer",
    outline: "none",
    boxSizing: "border-box",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  cardTitle: { fontSize: "14px", fontWeight: 600, color: "#111827", margin: "0 0 14px 0" },
  chartWrapper: {
    display: "flex",
    height: "240px",
    gap: "10px",
    position: "relative",
  },
  yAxisLabels: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: "22px",
    width: "40px",
    flexShrink: 0,
  },
  yAxisLabelText: { fontSize: "10px", color: "#6b7280" },
  chartArea: {
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  gridLinesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "22px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    pointerEvents: "none",
  },
  gridLine: { width: "100%", borderBottom: "1px solid #f1f2f0" },
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "22px",
    width: "100%",
    height: "calc(100% - 22px)",
    zIndex: 2,
  },
  xAxisLabels: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    zIndex: 3,
    overflow: "hidden",
  },
  xAxisLabelText: { fontSize: "9px", color: "#6b7280", whiteSpace: "nowrap" },
};