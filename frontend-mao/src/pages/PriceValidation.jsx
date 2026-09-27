import React, { useState } from "react";
import agriLogo from "./AgriPrice_White.png";

import { TbLayoutDashboard, TbFileAnalytics, TbBell } from "react-icons/tb";
import { LuSprout, LuStore, LuTags, LuChartNoAxesCombined, LuSettings, LuLogOut } from "react-icons/lu";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";

export default function App() {
  const [activeTab, setActiveTab] = useState('Rejected');

  const pendingData = [
    { id: 1, crop: 'Tomato', market: 'Teresa Public Market', submitted: '₱65.00', source: 'Field submission', status: 'Pending' },
    { id: 2, crop: 'Rice', market: 'Antipolo Public Market', submitted: '₱47.00', source: 'Field submission', status: 'Pending' },
  ];

  const verifiedData = [
    { id: 1, crop: 'Rice', market: 'Antipolo Public Market', submitted: '₱45.00', source: 'MAO record', status: 'Verified' },
    { id: 2, crop: 'Rice', market: 'Cainta Public Market', submitted: '₱47.00', source: 'MAO record', status: 'Verified' },
    { id: 3, crop: 'Rice', market: 'Binangonan Public Market', submitted: '₱43.00', source: 'MAO record', status: 'Verified' },
    { id: 4, crop: 'Rice', market: 'Taytay Public Market', submitted: '₱48.00', source: 'MAO record', status: 'Verified' },
    { id: 5, crop: 'Rice', market: 'Angono Public Market', submitted: '₱44.00', source: 'MAO record', status: 'Verified' },
    { id: 6, crop: 'Rice', market: 'Rodriguez (Montalban) Market', submitted: '₱46.00', source: 'MAO record', status: 'Verified' },
    { id: 7, crop: 'Rice', market: 'Teresa Public Market', submitted: '₱49.00', source: 'MAO record', status: 'Verified' },
    { id: 8, crop: 'Tomato', market: 'Antipolo Public Market', submitted: '₱65.00', source: 'MAO record', status: 'Verified' },
    { id: 9, crop: 'Tomato', market: 'Cainta Public Market', submitted: '₱67.00', source: 'MAO record', status: 'Verified' },
  ];

  const rejectedData = [
    { id: 1, crop: 'Corn', market: 'Binangonan Public Market', submitted: '₱55.00', source: 'Field submission', status: 'Rejected' },
    { id: 2, crop: 'Onion', market: 'Taytay Public Market', submitted: '₱120.00', source: 'Field submission', status: 'Rejected' },
  ];

  const currentData = activeTab === 'Pending' ? pendingData : activeTab === 'Verified' ? verifiedData : rejectedData;

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
              <a href="#" style={styles.navLink}>
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
              <a href="#" style={styles.activeNavLink}>
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
          <h1 style={styles.headerTitle}>Price Validation</h1>
          <div style={styles.headerRight}>
            <button style={styles.notifBtn}>
              <TbBell size={18} color="#374151" />
            </button>
          </div>
        </header>

        <main style={styles.mainBody}>
          <p style={styles.bannerText}>Review crop quotations before they are shown to farmers.</p>

          <div style={styles.tabsContainer}>
            <span 
              style={activeTab === 'Pending' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setActiveTab('Pending')}
            >
              Pending
            </span>
            <span 
              style={activeTab === 'Verified' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setActiveTab('Verified')}
            >
              Verified
            </span>
            <span 
              style={activeTab === 'Rejected' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setActiveTab('Rejected')}
            >
              Rejected
            </span>
          </div>

          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.trHead}>
                  <th style={styles.th}>CROP</th>
                  <th style={styles.th}>MARKET</th>
                  <th style={styles.th}>SUBMITTED / KG</th>
                  <th style={styles.th}>SOURCE</th>
                  <th style={styles.th}>STATUS</th>
                  <th style={styles.thAction}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} style={index === currentData.length - 1 ? styles.trBodyLast : styles.trBody}>
                      <td style={{...styles.td, fontWeight: '500', color: '#111827'}}>{item.crop}</td>
                      <td style={styles.td}>{item.market}</td>
                      <td style={styles.td}>{item.submitted}</td>
                      <td style={styles.td}>{item.source}</td>
                      <td style={styles.td}>
                        <span style={
                          activeTab === 'Pending' ? styles.pendingBadge : 
                          activeTab === 'Verified' ? styles.verifiedBadge : 
                          styles.rejectedBadge
                        }>
                          {item.status}
                        </span>
                      </td>
                      <td style={styles.tdAction}>
                        <div style={styles.actionButtonsWrapper}>
                          <button style={styles.actionBtn}>
                            <span>{activeTab === 'Pending' ? 'Review' : 'View'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{...styles.td, textAlign: 'center', color: '#9ca3af'}}>
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
    gap: '20px',
  },
  bannerText: {
    fontSize: '14px',
    color: '#4b5563',
    margin: 0,
  },
  tabsContainer: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0px',
  },
  activeTab: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1b6b39',
    paddingBottom: '10px',
    borderBottom: '2px solid #1b6b39',
    cursor: 'pointer',
  },
  inactiveTab: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    paddingBottom: '10px',
    cursor: 'pointer',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px 24px 12px 24px',
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
    color: '#92400e',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '12px',
  },
  verifiedBadge: {
    backgroundColor: '#e6f4ea',
    color: '#137333',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '12px',
  },
  rejectedBadge: {
    backgroundColor: '#fce8e6',
    color: '#c5221f',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '12px',
  },
  actionButtonsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    color: '#374151',
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};import React, { useState } from "react";
import agriLogo from "./AgriPrice_White.png";

import { TbLayoutDashboard, TbFileAnalytics, TbBell } from "react-icons/tb";
import { LuSprout, LuStore, LuTags, LuChartNoAxesCombined, LuSettings, LuLogOut } from "react-icons/lu";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";

export default function App() {
  const [activeTab, setActiveTab] = useState('Rejected');

  const pendingData = [
    { id: 1, crop: 'Tomato', market: 'Teresa Public Market', submitted: '₱65.00', source: 'Field submission', status: 'Pending' },
    { id: 2, crop: 'Rice', market: 'Antipolo Public Market', submitted: '₱47.00', source: 'Field submission', status: 'Pending' },
  ];

  const verifiedData = [
    { id: 1, crop: 'Rice', market: 'Antipolo Public Market', submitted: '₱45.00', source: 'MAO record', status: 'Verified' },
    { id: 2, crop: 'Rice', market: 'Cainta Public Market', submitted: '₱47.00', source: 'MAO record', status: 'Verified' },
    { id: 3, crop: 'Rice', market: 'Binangonan Public Market', submitted: '₱43.00', source: 'MAO record', status: 'Verified' },
    { id: 4, crop: 'Rice', market: 'Taytay Public Market', submitted: '₱48.00', source: 'MAO record', status: 'Verified' },
    { id: 5, crop: 'Rice', market: 'Angono Public Market', submitted: '₱44.00', source: 'MAO record', status: 'Verified' },
    { id: 6, crop: 'Rice', market: 'Rodriguez (Montalban) Market', submitted: '₱46.00', source: 'MAO record', status: 'Verified' },
    { id: 7, crop: 'Rice', market: 'Teresa Public Market', submitted: '₱49.00', source: 'MAO record', status: 'Verified' },
    { id: 8, crop: 'Tomato', market: 'Antipolo Public Market', submitted: '₱65.00', source: 'MAO record', status: 'Verified' },
    { id: 9, crop: 'Tomato', market: 'Cainta Public Market', submitted: '₱67.00', source: 'MAO record', status: 'Verified' },
  ];

  const rejectedData = [
    { id: 1, crop: 'Corn', market: 'Binangonan Public Market', submitted: '₱55.00', source: 'Field submission', status: 'Rejected' },
    { id: 2, crop: 'Onion', market: 'Taytay Public Market', submitted: '₱120.00', source: 'Field submission', status: 'Rejected' },
  ];

  const currentData = activeTab === 'Pending' ? pendingData : activeTab === 'Verified' ? verifiedData : rejectedData;

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
              <a href="#" style={styles.navLink}>
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
              <a href="#" style={styles.activeNavLink}>
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
          <h1 style={styles.headerTitle}>Price Validation</h1>
          <div style={styles.headerRight}>
            <button style={styles.notifBtn}>
              <TbBell size={18} color="#374151" />
            </button>
          </div>
        </header>

        <main style={styles.mainBody}>
          <p style={styles.bannerText}>Review crop quotations before they are shown to farmers.</p>

          <div style={styles.tabsContainer}>
            <span 
              style={activeTab === 'Pending' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setActiveTab('Pending')}
            >
              Pending
            </span>
            <span 
              style={activeTab === 'Verified' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setActiveTab('Verified')}
            >
              Verified
            </span>
            <span 
              style={activeTab === 'Rejected' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setActiveTab('Rejected')}
            >
              Rejected
            </span>
          </div>

          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.trHead}>
                  <th style={styles.th}>CROP</th>
                  <th style={styles.th}>MARKET</th>
                  <th style={styles.th}>SUBMITTED / KG</th>
                  <th style={styles.th}>SOURCE</th>
                  <th style={styles.th}>STATUS</th>
                  <th style={styles.thAction}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} style={index === currentData.length - 1 ? styles.trBodyLast : styles.trBody}>
                      <td style={{...styles.td, fontWeight: '500', color: '#111827'}}>{item.crop}</td>
                      <td style={styles.td}>{item.market}</td>
                      <td style={styles.td}>{item.submitted}</td>
                      <td style={styles.td}>{item.source}</td>
                      <td style={styles.td}>
                        <span style={
                          activeTab === 'Pending' ? styles.pendingBadge : 
                          activeTab === 'Verified' ? styles.verifiedBadge : 
                          styles.rejectedBadge
                        }>
                          {item.status}
                        </span>
                      </td>
                      <td style={styles.tdAction}>
                        <div style={styles.actionButtonsWrapper}>
                          <button style={styles.actionBtn}>
                            <span>{activeTab === 'Pending' ? 'Review' : 'View'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{...styles.td, textAlign: 'center', color: '#9ca3af'}}>
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
    gap: '20px',
  },
  bannerText: {
    fontSize: '14px',
    color: '#4b5563',
    margin: 0,
  },
  tabsContainer: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0px',
  },
  activeTab: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1b6b39',
    paddingBottom: '10px',
    borderBottom: '2px solid #1b6b39',
    cursor: 'pointer',
  },
  inactiveTab: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    paddingBottom: '10px',
    cursor: 'pointer',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px 24px 12px 24px',
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
    color: '#92400e',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '12px',
  },
  verifiedBadge: {
    backgroundColor: '#e6f4ea',
    color: '#137333',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '12px',
  },
  rejectedBadge: {
    backgroundColor: '#fce8e6',
    color: '#c5221f',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '12px',
  },
  actionButtonsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    color: '#374151',
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};