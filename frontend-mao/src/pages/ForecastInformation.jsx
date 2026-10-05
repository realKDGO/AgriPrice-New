import React from "react";
import { Link } from "react-router-dom";
import agriLogo from "./AgriPrice_White.png";

import { TbLayoutDashboard, TbFileAnalytics, TbBell } from "react-icons/tb";
import { LuSprout, LuStore, LuTags, LuChartNoAxesCombined, LuSettings, LuLogOut, LuArrowUpRight } from "react-icons/lu";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";

export default function ForecastInformation() {
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
              <Link to="/dashboard" style={styles.navLink}>
                <TbLayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <Link to="/crop-management" style={styles.navLink}>
                <LuSprout size={20} />
                <span>Crop Management</span>
              </Link>
              <Link to="/market-management" style={styles.navLink}>
                <LuStore size={20} />
                <span>Market Management</span>
              </Link>
              <Link to="/crop-prices" style={styles.navLink}>
                <LuTags size={20} />
                <span>Crop Prices</span>
              </Link>
              <Link to="/price-validation" style={styles.navLink}>
                <VscWorkspaceTrusted size={20} />
                <span>Price Validation</span>
              </Link>
              <Link to="/historical-records" style={styles.navLink}>
                <GoHistory size={20} />
                <span>Historical Records</span>
              </Link>
              <Link to="/forecast-information" style={styles.activeNavLink}>
                <LuChartNoAxesCombined size={20} />
                <span>Forecast Information</span>
              </Link>
              <Link to="/reports-analytics" style={styles.navLink}>
                <TbFileAnalytics size={20} />
                <span>Reports & Analytics</span>
              </Link>
            </nav>
          </div>

          <div style={styles.navSection}>
            <span style={styles.sectionTitle}>ACCOUNT</span>
            <nav style={styles.nav}>
              <Link to="/settings" style={styles.navLink}>
                <LuSettings size={20} />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>

        <div style={styles.sidebarBottom}>
          <Link to="/" style={styles.logoutLink}>
            <LuLogOut size={20} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Forecast Information</h1>
          <div style={styles.headerRight}>
            <button style={styles.notifBtn} tabIndex={-1}>
              <TbBell size={18} color="#374151" />
            </button>
          </div>
        </header>

        <main style={styles.mainBody}>
          <p style={styles.bannerText}>
            Forecast values are estimates based on available historical data.
          </p>

          <div style={styles.topCard}>
            <div style={styles.selectionRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Crop</label>
                <div style={styles.nonInteractableSelect}>
                  <span>Rice</span>
                  <span style={styles.dropdownArrow}>▼</span>
                </div>
              </div>

              <div style={styles.periodGroup}>
                <label style={styles.label}>Forecast Period</label>
                <div style={styles.periodPillsWrapper}>
                  <div style={styles.periodPillInactive}>1 Month</div>
                  <div style={styles.periodPillActive}>3 Months</div>
                  <div style={styles.periodPillInactive}>6 Months</div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.middleGrid}>
            <div style={styles.chartCard}>
              <h3 style={styles.cardTitle}>Forecast Chart - Rice</h3>
              <div style={styles.chartContainer}>
                <div style={styles.chartLinesBg}>
                  <span style={styles.axisLabel}>₱47.5</span>
                  <span style={styles.axisLabel}>₱47</span>
                  <span style={styles.axisLabel}>₱46.5</span>
                  <span style={styles.axisLabel}>₱46</span>
                  <span style={styles.axisLabel}>₱45.5</span>
                </div>
                <svg style={styles.svgLine} viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="greenFade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1b6b39" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#1b6b39" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 15 135 L 485 45 L 485 185 L 15 185 Z"
                    fill="url(#greenFade)"
                  />
                  <path
                    d="M 15 135 L 485 45"
                    fill="none"
                    stroke="#1b6b39"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />
                </svg>
                <div style={styles.chartXAxis}>
                  <span>Oct 1</span>
                  <span>Nov 1</span>
                  <span>Dec 1</span>
                </div>
              </div>
            </div>

            <div style={styles.summaryCardWrapper}>
              <h3 style={styles.cardTitle}>Forecast Summary</h3>
              
              <div style={styles.summaryBoxGreen}>
                <span style={styles.summaryBoxLabel}>PREDICTED PRICE</span>
                <span style={styles.summaryBoxValueGreen}>₱47.43/kg</span>
              </div>

              <div style={styles.summaryBoxOrange}>
                <span style={styles.summaryBoxLabel}>CONFIDENCE</span>
                <span style={styles.summaryBoxValueDark}>82%</span>
              </div>

              <div style={styles.summaryBoxLight}>
                <span style={styles.summaryBoxLabel}>TREND DIRECTION</span>
                <div style={styles.trendRow}>
                  <span style={styles.summaryBoxValueDark}>Increasing</span>
                </div>
                <div style={styles.trendSubText}>
                  <LuArrowUpRight size={15} style={{ marginRight: '2px', strokeWidth: 2.5 }} />
                  <span>5.4% INCREASE</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.tableCard}>
            <h3 style={styles.cardTitle}>Forecast Values</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.trHead}>
                  <th style={styles.th}>DATE</th>
                  <th style={styles.th}>PERIOD</th>
                  <th style={styles.th}>PREDICTED PRICE</th>
                </tr>
              </thead>
              <tbody>
                <tr style={styles.trBody}>
                  <td style={styles.td}>Oct 1, 2026</td>
                  <td style={styles.td}>Week 1</td>
                  <td style={styles.td}>₱45.81</td>
                </tr>
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
    display: 'flex',
    height: '100vh',
    backgroundColor: '#fbf9f6',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#0d2818',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: '#ffffff',
    height: '100vh',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  topContent: {
    overflowY: 'auto',
    flex: 1,
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 20px 20px 20px',
  },
  logoImage: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  brandText: {
    fontWeight: 'bold',
    fontSize: '20px',
    color: '#ffffff',
  },
  navSection: {
    padding: '0 16px',
    marginTop: '12px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#8fa89b',
    letterSpacing: '1px',
    paddingLeft: '12px',
    marginBottom: '8px',
    display: 'block',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    color: '#c2d1c9',
    textDecoration: 'none',
    fontSize: '14px',
  },
  activeNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: '#236042',
    color: '#ffffff',
    fontWeight: '500',
    textDecoration: 'none',
    fontSize: '14px',
  },
  sidebarBottom: {
    padding: '16px 20px 24px 20px',
    marginTop: 'auto',
  },
  logoutLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    color: '#c2d1c9',
    textDecoration: 'none',
    fontSize: '14px',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  notifBtn: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    cursor: 'default',
  },
  mainBody: {
    padding: '24px 32px 32px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  bannerText: {
    fontSize: '14px',
    color: '#4b5563',
    margin: 0,
  },
  topCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px 24px',
  },
  selectionRow: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-end',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  periodGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
  },
  nonInteractableSelect: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#111827',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'none',
    cursor: 'default',
  },
  dropdownArrow: {
    fontSize: '10px',
    color: '#6b7280',
  },
  periodPillsWrapper: {
    display: 'flex',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '4px',
    gap: '4px',
    pointerEvents: 'none',
    cursor: 'default',
  },
  periodPillInactive: {
    padding: '6px 14px',
    fontSize: '13px',
    color: '#4b5563',
    borderRadius: '6px',
    fontWeight: '500',
  },
  periodPillActive: {
    padding: '6px 14px',
    fontSize: '13px',
    color: '#ffffff',
    backgroundColor: '#1b6b39',
    borderRadius: '6px',
    fontWeight: '500',
  },
  middleGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 16px 0',
  },
  chartContainer: {
    position: 'relative',
    height: '220px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  chartLinesBg: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    borderBottom: '1px solid #e5e7eb',
  },
  axisLabel: {
    fontSize: '11px',
    color: '#9ca3af',
    borderBottom: '1px dashed #f3f4f6',
    paddingBottom: '4px',
  },
  svgLine: {
    position: 'absolute',
    top: '10px',
    left: '30px',
    width: 'calc(100% - 40px)',
    height: '160px',
    zIndex: 2,
  },
  chartXAxis: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#9ca3af',
    marginTop: 'auto',
    paddingTop: '8px',
    zIndex: 3,
  },
  summaryCardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  summaryBoxGreen: {
    backgroundColor: '#e6f4ea',
    border: '1px solid #ceead6',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryBoxOrange: {
    backgroundColor: '#fef3e2',
    border: '1px solid #fce8c8',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryBoxLight: {
    backgroundColor: '#f8f6f0',
    border: '1px solid #e5e2db',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryBoxLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#5f7161',
    letterSpacing: '0.5px',
  },
  summaryBoxValueGreen: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#137333',
  },
  summaryBoxValueDark: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
  },
  trendRow: {
    display: 'flex',
    alignItems: 'baseline',
  },
  trendSubText: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1b6b39',
    marginTop: '2px',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px 24px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  trHead: {
    backgroundColor: '#f7f8f6',
    borderBottom: '1px solid #e5e7eb',
  },
  th: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#5f7161',
    padding: '12px 16px',
    letterSpacing: '0.5px',
  },
  trBody: {
    borderBottom: 'none',
  },
  td: {
    fontSize: '13px',
    color: '#374151',
    padding: '16px',
  },
};