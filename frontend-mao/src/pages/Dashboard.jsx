import React from "react";
import { Link } from "react-router-dom";
import agriLogo from "./AgriPrice_White.png";

import { TbLayoutDashboard, TbFileAnalytics, TbBell, TbTrendingUp, TbUsers } from "react-icons/tb";
import { LuSprout, LuStore, LuTags, LuChartNoAxesCombined, LuSettings, LuLogOut, LuArrowUpRight } from "react-icons/lu";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";

export default function Dashboard() {
  const statsData = [
    { title: 'Total Crops Tracked', value: '24', change: '+12% from last month', icon: <LuSprout size={20} color="#1b6b39" /> },
    { title: 'Active Markets', value: '18', change: '+4 new markets', icon: <LuStore size={20} color="#1b6b39" /> },
    { title: 'Pending Validations', value: '5', change: 'Requires review', icon: <VscWorkspaceTrusted size={20} color="#d97706" /> },
    { title: 'Registered Farmers', value: '1,420', change: '+85 this week', icon: <TbUsers size={20} color="#1b6b39" /> },
  ];

  const recentPrices = [
    { id: 1, crop: 'Rice (Well-Milled)', market: 'Antipolo Public Market', price: '₱45.00 /kg', trend: '+₱2.00', status: 'Verified' },
    { id: 2, crop: 'Tomato', market: 'Teresa Public Market', price: '₱65.00 /kg', trend: '-₱5.00', status: 'Pending' },
    { id: 3, crop: 'Eggplant', market: 'Cainta Public Market', price: '₱50.00 /kg', trend: '₱0.00', status: 'Verified' },
    { id: 4, crop: 'Corn (Yellow)', market: 'Binangonan Market', price: '₱38.00 /kg', trend: '+₱1.50', status: 'Verified' },
  ];

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
              <Link to="/dashboard" style={styles.activeNavLink}>
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
              <Link to="/forecast-information" style={styles.navLink}>
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
          <h1 style={styles.headerTitle}>Dashboard Overview</h1>
          <div style={styles.headerRight}>
            <button style={styles.notifBtn}>
              <TbBell size={18} color="#374151" />
            </button>
          </div>
        </header>

        <main style={styles.mainBody}>
          <div style={styles.welcomeBanner}>
            <div>
              <h2 style={styles.welcomeTitle}>Welcome back, Admin! 👋</h2>
              <p style={styles.bannerText}>Here's the latest agricultural market updates and price trends today.</p>
            </div>
            <Link to="/reports-analytics" style={styles.bannerBtn}>
              <TbTrendingUp size={16} />
              <span>View Analytics</span>
            </Link>
          </div>

          <div style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <div key={index} style={styles.statCard}>
                <div style={styles.statHeader}>
                  <span style={styles.statTitle}>{stat.title}</span>
                  <div style={styles.statIconWrapper}>{stat.icon}</div>
                </div>
                <div style={styles.statBody}>
                  <h3 style={styles.statValue}>{stat.value}</h3>
                  <span style={styles.statChange}>{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.tableCard}>
            <div style={styles.tableHeaderContainer}>
              <h3 style={styles.tableSectionTitle}>Recent Price Submissions</h3>
              <Link to="/crop-prices" style={styles.viewAllLink}>
                <span>View all</span>
                <LuArrowUpRight size={14} />
              </Link>
            </div>

            <table style={styles.table}>
              <thead>
                <tr style={styles.trHead}>
                  <th style={styles.th}>CROP</th>
                  <th style={styles.th}>MARKET</th>
                  <th style={styles.th}>CURRENT PRICE</th>
                  <th style={styles.th}>TREND</th>
                  <th style={styles.th}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentPrices.map((item, index) => (
                  <tr key={item.id} style={index === recentPrices.length - 1 ? styles.trBodyLast : styles.trBody}>
                    <td style={{...styles.td, fontWeight: '500', color: '#111827'}}>{item.crop}</td>
                    <td style={styles.td}>{item.market}</td>
                    <td style={styles.td}>{item.price}</td>
                    <td style={{...styles.td, color: item.trend.includes('+') ? '#137333' : item.trend.includes('-') ? '#c5221f' : '#5f7161'}}>
                      {item.trend}
                    </td>
                    <td style={styles.td}>
                      <span style={item.status === 'Verified' ? styles.verifiedBadge : styles.pendingBadge}>
                        {item.status}
                      </span>
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
    padding: '24px 32px 32px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  welcomeBanner: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 6px 0',
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
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statTitle: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
  },
  statIconWrapper: {
    backgroundColor: '#e6f4ea',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  statChange: {
    fontSize: '12px',
    color: '#0d9488',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px 24px 12px 24px',
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
  viewAllLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#1b6b39',
    textDecoration: 'none',
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
  verifiedBadge: {
    backgroundColor: '#e6f4ea',
    color: '#137333',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '12px',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '12px',
  },
};