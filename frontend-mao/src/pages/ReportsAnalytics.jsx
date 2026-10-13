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

const Y_MAX = 150;
const Y_MIN = 30;
const Y_TICKS = [150, 120, 90, 60, 30];
const CHART_WIDTH = 1000;
const CHART_HEIGHT = 160;

const MARKET_LABELS = [
  "Cainta Public Market",
  "Taytay Public Market",
  "Angono Public Market",
  "Teresa Public Market",
  "Antipolo Public Market",
  "Binangonan Public Market",
  "Teresa Public Market",
];

const PRICE_DATA = [
  44, 44, 46, 58, 64, 67, 62, 57, 53, 53.3,
  53, 40, 43, 35, 68, 90, 89, 92, 50, 48,
  48, 52, 50, 53, 56, 126, 127, 130, 134,
];

const round = (value) => Math.round(value * 100) / 100;
const formatPeso = (value) => `₱${value.toFixed(2)}`;

function buildSmoothPath(points) {
  const n = points.length;
  const dx = [];
  const slopes = [];
  const tangents = [];

  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1].x - points[i].x;
    slopes[i] = (points[i + 1].y - points[i].y) / dx[i];
  }

  tangents[0] = slopes[0];
  tangents[n - 1] = slopes[n - 2];
  for (let i = 1; i < n - 1; i++) {
    tangents[i] = slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2;
  }

  for (let i = 0; i < n - 1; i++) {
    if (slopes[i] === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
      continue;
    }
    const a = tangents[i] / slopes[i];
    const b = tangents[i + 1] / slopes[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      tangents[i] = t * a * slopes[i];
      tangents[i + 1] = t * b * slopes[i];
    }
  }

  let d = `M ${round(points[0].x)} ${round(points[0].y)}`;
  for (let i = 0; i < n - 1; i++) {
    const c1x = points[i].x + dx[i] / 3;
    const c1y = points[i].y + (tangents[i] * dx[i]) / 3;
    const c2x = points[i + 1].x - dx[i] / 3;
    const c2y = points[i + 1].y - (tangents[i + 1] * dx[i]) / 3;
    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(points[i + 1].x)} ${round(points[i + 1].y)}`;
  }
  return d;
}

const chartPoints = PRICE_DATA.map((price, i) => ({
  x: (i / (PRICE_DATA.length - 1)) * CHART_WIDTH,
  y: ((Y_MAX - price) / (Y_MAX - Y_MIN)) * CHART_HEIGHT,
}));

const linePath = buildSmoothPath(chartPoints);
const areaPath = `${linePath} L ${CHART_WIDTH} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`;

const highestPrice = Math.max(...PRICE_DATA);
const lowestPrice = Math.min(...PRICE_DATA);
const averagePrice = PRICE_DATA.reduce((sum, price) => sum + price, 0) / PRICE_DATA.length;

export default function ReportsAnalytics() {
  const [selectedCrop, setSelectedCrop] = useState("All crops");
  const [selectedMarket, setSelectedMarket] = useState("All markets");

  return (
    <div style={styles.container}>
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

          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricIconWrapper}>
                <LuTrendingUp size={18} color="#111827" />
              </div>
              <div style={styles.metricValue}>{formatPeso(highestPrice)}</div>
              <div style={styles.metricLabel}>Highest Price</div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricIconWrapper}>
                <LuTrendingDown size={18} color="#111827" />
              </div>
              <div style={styles.metricValue}>{formatPeso(lowestPrice)}</div>
              <div style={styles.metricLabel}>Lowest Price</div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricIconWrapper}>
                <TbChartBar size={18} color="#111827" />
              </div>
              <div style={styles.metricValue}>{formatPeso(averagePrice)}</div>
              <div style={styles.metricLabel}>Average Price</div>
            </div>
          </div>

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

          <div style={styles.chartCard}>
            <h3 style={styles.cardTitle}>Crop Price Report</h3>
            <div style={styles.chartWrapper}>
              <div style={styles.yAxisLabels}>
                {Y_TICKS.map((tick) => (
                  <span key={tick} style={styles.yAxisLabelText}>₱{tick}</span>
                ))}
              </div>

              <div style={styles.chartArea}>
                <div style={styles.gridLinesContainer}>
                  {Y_TICKS.map((tick) => (
                    <div key={tick} style={styles.gridLine} />
                  ))}
                </div>

                <svg
                  style={styles.svgContainer}
                  viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="reportsGreenFade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2f8f5b" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#2f8f5b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#reportsGreenFade)" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#1f7a48"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              <div style={styles.xAxisLabels}>
                {MARKET_LABELS.map((label, idx) => (
                  <span key={idx} style={styles.xAxisLabelText}>{label}</span>
                ))}
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
    padding: "20px 26px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    boxSizing: "border-box",
  },
  metricIconWrapper: {
    alignSelf: "flex-start",
    marginBottom: "4px",
  },
  metricValue: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#111827",
    textAlign: "center",
  },
  metricLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 500,
    textAlign: "center",
  },
  filterRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    width: "100%",
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