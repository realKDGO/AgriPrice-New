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
  LuArrowUpRight,
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
  { to: "/forecast-information", label: "Forecast Information", icon: LuChartNoAxesCombined, active: true },
  { to: "/reports-analytics", label: "Reports & Analytics", icon: TbFileAnalytics },
];

const PERIODS = ["1 Month", "3 Months", "6 Months"];

const forecastDataMap = {
  "3 Months": {
    periodLabel: "3 Months",
    predictedPrice: "₱47.43/kg",
    confidence: "82%",
    trend: "Increasing",
    percentage: "5.4% INCREASE",
    xAxis: ["Oct 1", "Nov 1", "Dec 1"],
    svgPath: "M 0 135 L 450 6 L 450 160 L 0 160 Z",
    svgLine: "M 0 135 L 450 6",
    axisLabels: ["₱47.5", "₱47", "₱46.5", "₱46", "₱45.5"],
    tableRows: [
      { date: "Oct 1, 2026", period: "Month 1", price: "₱45.81" },
      { date: "Nov 1, 2026", period: "Month 2", price: "₱46.50" },
      { date: "Dec 1, 2026", period: "Month 3", price: "₱47.43" },
    ],
  },
};

export default function ForecastInformation() {
  const [selectedPeriod, setSelectedPeriod] = useState("3 Months");
  const currentData = forecastDataMap[selectedPeriod];

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
          <h1 style={styles.headerTitle}>Forecast Information</h1>
          <button style={styles.notifBtn} aria-label="Notifications">
            <TbBell size={18} color="#374151" />
          </button>
        </header>

        <main style={styles.mainBody}>
          <p style={styles.bannerText}>
            Forecast values are estimates based on available historical data.
          </p>

          <div style={styles.topCard}>
            <div style={styles.selectionRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Crop</label>
                <select style={styles.select} defaultValue="Rice">
                  <option>Rice</option>
                </select>
              </div>

              <div style={styles.periodGroup}>
                <label style={styles.label}>Forecast Period</label>
                <div style={styles.periodPillsWrapper}>
                  {PERIODS.map((period) => {
                    const hasData = Boolean(forecastDataMap[period]);
                    const isActive = selectedPeriod === period;

                    return (
                      <div
                        key={period}
                        onClick={hasData ? () => setSelectedPeriod(period) : undefined}
                        aria-disabled={!hasData}
                        style={{
                          ...(isActive ? styles.periodPillActive : styles.periodPillInactive),
                          cursor: hasData ? "pointer" : "default",
                        }}
                      >
                        {period}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.middleGrid}>
            <div style={styles.chartCard}>
              <h3 style={styles.cardTitle}>Forecast Chart - Rice</h3>
              <div style={styles.chartWrapper}>
                <div style={styles.yAxisLabels}>
                  {currentData.axisLabels.map((label, idx) => (
                    <span key={idx} style={styles.yAxisLabelText}>{label}</span>
                  ))}
                </div>

                <div style={styles.chartArea}>
                  <div style={styles.gridLinesContainer}>
                    {currentData.axisLabels.map((_, idx) => (
                      <div key={idx} style={styles.gridLine} />
                    ))}
                  </div>

                  <svg style={styles.svgContainer} viewBox="0 0 450 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="greenFade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2f8f5b" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#2f8f5b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={currentData.svgPath} fill="url(#greenFade)" />
                    <path
                      d={currentData.svgLine}
                      fill="none"
                      stroke="#1f7a48"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  <div style={styles.xAxisLabels}>
                    {currentData.xAxis.map((xLabel, idx) => (
                      <span key={idx} style={styles.xAxisLabelText}>{xLabel}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <h3 style={styles.cardTitle}>Forecast Summary</h3>

              <div style={styles.summaryBoxGreen}>
                <span style={styles.summaryBoxLabel}>PREDICTED PRICE</span>
                <span style={styles.summaryBoxValue}>{currentData.predictedPrice}</span>
              </div>

              <div style={styles.summaryBoxOrange}>
                <span style={styles.summaryBoxLabel}>CONFIDENCE</span>
                <span style={styles.summaryBoxValue}>{currentData.confidence}</span>
              </div>

              <div style={styles.summaryBoxTan}>
                <span style={styles.summaryBoxLabel}>TREND DIRECTION</span>
                <span style={styles.summaryBoxValue}>{currentData.trend}</span>
                <div style={styles.trendSubText}>
                  <LuArrowUpRight size={11} />
                  <span>{currentData.percentage}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.tableCard}>
            <div style={styles.tableHeaderContainer}>
              <h3 style={styles.cardTitle}>Forecast Values</h3>
            </div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <colgroup>
                  <col style={{ width: "34%" }} />
                  <col style={{ width: "24%" }} />
                  <col style={{ width: "42%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={styles.th}>DATE</th>
                    <th style={styles.th}>PERIOD</th>
                    <th style={styles.th}>PREDICTED PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.tableRows.map((row, index) => (
                    <tr
                      key={index}
                      style={index === currentData.tableRows.length - 1 ? styles.trBodyLast : styles.trBody}
                    >
                      <td style={{ ...styles.td, fontWeight: 500, color: "#111827" }}>{row.date}</td>
                      <td style={styles.td}>{row.period}</td>
                      <td style={styles.td}>{row.price}</td>
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
  bannerText: { fontSize: "12px", color: "#6b7280", margin: 0 },

  /* Top Card / Selections */
  topCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px",
    width: "100%",
    boxSizing: "border-box",
  },
  selectionRow: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-end",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  periodGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flexShrink: 0,
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
  periodPillsWrapper: {
    display: "flex",
    backgroundColor: "#f3f4f1",
    borderRadius: "999px",
    padding: "3px",
    gap: "3px",
    height: "36px",
    boxSizing: "border-box",
    alignItems: "center",
  },
  periodPillInactive: {
    padding: "5px 12px",
    fontSize: "11px",
    color: "#374151",
    borderRadius: "999px",
    fontWeight: 500,
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  periodPillActive: {
    padding: "5px 12px",
    fontSize: "11px",
    color: "#ffffff",
    backgroundColor: "#1f8a4c",
    borderRadius: "999px",
    fontWeight: 600,
    userSelect: "none",
    whiteSpace: "nowrap",
  },

  /* Middle Grid */
  middleGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "16px",
    width: "100%",
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
    height: "220px",
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
  },
  xAxisLabelText: { fontSize: "10px", color: "#6b7280" },

  /* Summary Card */
  summaryCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxSizing: "border-box",
  },
  summaryBoxGreen: {
    backgroundColor: "#e1f1e5",
    border: "1px solid #cfe6d5",
    borderRadius: "8px",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  summaryBoxOrange: {
    backgroundColor: "#fdebd3",
    border: "1px solid #f9dfbd",
    borderRadius: "8px",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  summaryBoxTan: {
    backgroundColor: "#f1e8dc",
    border: "1px solid #e6dccd",
    borderRadius: "8px",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  summaryBoxLabel: { fontSize: "9px", fontWeight: 500, color: "#5f7161", letterSpacing: "0.3px" },
  summaryBoxValue: { fontSize: "17px", fontWeight: 700, color: "#0d2818" },
  trendSubText: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    fontSize: "10px",
    fontWeight: 500,
    color: "#374151",
    marginTop: "2px",
  },

  /* Table Card */
  tableCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px 18px 12px 18px",
    width: "100%",
    boxSizing: "border-box",
  },
  tableHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
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
    textAlign: "left",
  },
};