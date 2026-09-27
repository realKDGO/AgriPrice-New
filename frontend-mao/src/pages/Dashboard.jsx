import React from "react";
import agriLogo from "./AgriPrice_White.png";

import { TbLayoutDashboard, TbFileAnalytics, TbBell, TbArrowRight } from "react-icons/tb";
import { LuSprout, LuStore, LuTags, LuChartNoAxesCombined, LuSettings, LuLogOut } from "react-icons/lu";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";

export default function Dashboard() {
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
              <a href="#" style={styles.activeNavLink}>
                <TbLayoutDashboard size={20} />
                <span>Dashboard</span>
              </a>
              <a href="#" style={styles.navLink}>
                <LuSprout size={20} />
                <span>Crop Management</span>
              </a>
              <a href="#" style={styles.navLink}>
                <LuStore size={20} />
                <span>Market Management</span>
              </a>
              <a href="#" style={styles.navLink}>
                <LuTags size={20} />
                <span>Crop Prices</span>
              </a>
              <a href="#" style={styles.navLink}>
                <VscWorkspaceTrusted size={20} />
                <span>Price Validation</span>
              </a>
              <a href="#" style={styles.navLink}>
                <GoHistory size={20} />
                <span>Historical Records</span>
              </a>
              <a href="#" style={styles.navLink}>
                <LuChartNoAxesCombined size={20} />
                <span>Forecast Information</span>
              </a>
              <a href="#" style={styles.navLink}>
                <TbFileAnalytics size={20} />
                <span>Reports & Analytics</span>
              </a>
            </nav>
          </div>

          <div style={styles.navSection}>
            <span style={styles.sectionTitle}>ACCOUNT</span>
            <nav style={styles.nav}>
              <a href="#" style={styles.navLink}>
                <LuSettings size={20} />
                <span>Settings</span>
              </a>
            </nav>
          </div>
        </div>

        <div style={styles.sidebarBottom}>
          <a href="#" style={styles.logoutLink}>
            <LuLogOut size={20} />
            <span>Sign Out</span>
          </a>
        </div>
      </aside>

      <div style={styles.mainContent}>

        <header style={styles.header}>
          <h1 style={styles.headerTitle}>MAO Dashboard</h1>
          <div style={styles.headerRight}>
            <button style={styles.notifBtn}>
              <TbBell size={18} color="#374151" />
            </button>
          </div>
        </header>

        <main style={styles.mainBody}>

          <div style={styles.banner}>
            <p style={styles.bannerText}>Keep Jala-Jala's crop information accurate and up to date.</p>
            <button style={styles.bannerBtn}>
              <span>Record a price</span>
              <TbArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          <div style={styles.rowGrid4}>
            <div style={styles.card}>
              <div style={styles.cardHeaderTop}>
                <span style={styles.cardTitle}>Active crops</span>
                <LuSprout size={18} color="#6b7280" />
              </div>
              <h3 style={styles.cardValue}>8</h3>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeaderTop}>
                <span style={styles.cardTitle}>Monitored markets</span>
                <LuStore size={18} color="#6b7280" />
              </div>
              <h3 style={styles.cardValue}>7</h3>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeaderTop}>
                <span style={styles.cardTitle}>Verified price records</span>
                <LuTags size={18} color="#6b7280" />
              </div>
              <h3 style={styles.cardValue}>56</h3>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeaderTop}>
                <span style={styles.cardTitle}>Awaiting validation</span>
                <VscWorkspaceTrusted size={18} color="#6b7280" />
              </div>
              <h3 style={styles.cardValue}>2</h3>
              <span style={styles.cardSubText}>Review before public display</span>
            </div>
          </div>

          <div style={styles.tableCard}>
            <div style={styles.tableHeaderContainer}>
              <h3 style={styles.tableSectionTitle}>Prices needing attention</h3>
              <a href="#" style={styles.reviewQueueLink}>
                <span>Review queue</span>
                <span style={styles.linkDivider}>
                  <TbArrowRight size={16} strokeWidth={2.5} />
                </span>
              </a>
            </div>

            <table style={styles.table}>
              <thead>
                <tr style={styles.trHead}>
                  <th style={styles.th}>CROP</th>
                  <th style={styles.th}>MARKET</th>
                  <th style={styles.th}>SUBMITTED PRICE / KG</th>
                  <th style={styles.th}>STATUS</th>
                  <th style={styles.thAction}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr style={styles.trBody}>
                  <td style={styles.td}>Tomato</td>
                  <td style={styles.td}>Teresa Public Market</td>
                  <td style={styles.td}>₱65.00</td>
                  <td style={styles.td}>
                    <span style={styles.pendingBadge}>Pending</span>
                  </td>
                  <td style={styles.tdAction}>
                    <button style={styles.reviewBtn}>Review</button>
                  </td>
                </tr>
                <tr style={styles.trBodyLast}>
                  <td style={styles.td}>Rice</td>
                  <td style={styles.td}>Antipolo Public Market</td>
                  <td style={styles.td}>₱47.00</td>
                  <td style={styles.td}>
                    <span style={styles.pendingBadge}>Pending</span>
                  </td>
                  <td style={styles.tdAction}>
                    <button style={styles.reviewBtn}>Review</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={styles.rowGrid2}>
            <div style={styles.infoCard}>
              <h3 style={styles.infoCardTitle}>Maintain agricultural information</h3>
              <p style={styles.infoCardText}>
                Crop and market details are shared across the farmer tools.<br />
                New prices require validation before they appear publicly.
              </p>
              <a href="#" style={styles.infoCardLink}>
                <span>Manage crops</span>
                <span style={styles.linkDivider}>
                  <TbArrowRight size={16} strokeWidth={2.5} />
                </span>
              </a>
            </div>

            <div style={styles.infoCard}>
              <h3 style={styles.infoCardTitle}>Latest data activity</h3>
              <p style={styles.infoCardSubtitle}>Reviewed price submissions</p>
              <p style={styles.infoCardMeta}>Elena Reyes · 2026-09-05 08:00</p>
            </div>
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
    cursor: 'pointer',
  },
  mainBody: {
    padding: '16px 32px 32px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  banner: {
    backgroundColor: 'transparent',
    padding: '4px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerText: {
    fontSize: '14px',
    color: '#4b5563',
    margin: 0,
  },
  bannerBtn: {
    backgroundColor: '#1b6b39',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  rowGrid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '90px',
  },
  cardHeaderTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '400',
    margin: 0,
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#111827',
    marginTop: '10px',
    marginBottom: 0,
  },
  cardSubText: {
    fontSize: '11px',
    color: '#9ca3af',
    marginTop: '4px',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px 24px 8px 24px',
  },
  tableHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  tableSectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  reviewQueueLink: {
    fontSize: '13px',
    color: '#1b6b39',
    textDecoration: 'none',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  linkDivider: {
    display: 'flex',
    alignItems: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  trHead: {
    backgroundColor: '#f7f8f6',
  },
  th: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#5f7161',
    padding: '12px 16px',
    letterSpacing: '0.5px',
  },
  thAction: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#5f7161',
    padding: '12px 24px 12px 16px',
    letterSpacing: '0.5px',
    textAlign: 'right',
  },
  trBody: {
    borderBottom: '1px solid #f3f4f6',
  },
  trBodyLast: {
    borderBottom: 'none',
  },
  td: {
    fontSize: '13px',
    color: '#374151',
    padding: '16px',
  },
  tdAction: {
    fontSize: '13px',
    color: '#374151',
    padding: '16px 24px 16px 16px',
    textAlign: 'right',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
    color: '#b45309',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '12px',
  },
  reviewBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    color: '#111827',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  rowGrid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  infoCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  infoCardText: {
    fontSize: '13px',
    color: '#4b5563',
    lineHeight: '1.5',
    margin: '0 0 16px 0',
  },
  infoCardSubtitle: {
    fontSize: '13px',
    color: '#4b5563',
    margin: '0 0 24px 0',
  },
  infoCardMeta: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  infoCardLink: {
    fontSize: '13px',
    color: '#1b6b39',
    textDecoration: 'none',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};