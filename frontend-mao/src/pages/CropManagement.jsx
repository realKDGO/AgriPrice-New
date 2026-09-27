import React from "react";
<img src={agriLogo} alt="AgriPrice Logo" style={styles.logoImage} />

import { TbLayoutDashboard, TbFileAnalytics, TbBell, TbArrowRight } from "react-icons/tb";
import { LuSprout, LuStore, LuTags, LuChartNoAxesCombined, LuSettings, LuLogOut, LuEye, LuPencil, LuArchive } from "react-icons/lu";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GoHistory } from "react-icons/go";

export default function App() {
  const cropData = [
    { id: 1, crop: 'Rice', category: 'Grain', unit: 'kg', status: 'Active' },
    { id: 2, crop: 'Tomato', category: 'Vegetable', unit: 'kg', status: 'Active' },
    { id: 3, crop: 'Eggplant', category: 'Vegetable', unit: 'kg', status: 'Active' },
    { id: 4, crop: 'Corn', category: 'Grain', unit: 'kg', status: 'Active' },
    { id: 5, crop: 'Onion', category: 'Vegetable', unit: 'kg', status: 'Active' },
    { id: 6, crop: 'Banana', category: 'Fruit', unit: 'kg', status: 'Active' },
    { id: 7, crop: 'Cabbage', category: 'Vegetable', unit: 'kg', status: 'Active' },
    { id: 8, crop: 'Garlic', category: 'Vegetable', unit: 'kg', status: 'Active' },
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
              <a href="#" style={styles.navLink}>
                <TbLayoutDashboard size={20} />
                <span>Dashboard</span>
              </a>
              <a href="#" style={styles.activeNavLink}>
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
          <h1 style={styles.headerTitle}>Crop Management</h1>
          <div style={styles.headerRight}>
            <button style={styles.notifBtn}>
              <TbBell size={18} color="#374151" />
            </button>
          </div>
        </header>

        <main style={styles.mainBody}>
          <div style={styles.banner}>
            <p style={styles.bannerText}>Maintain agricultural records used throughout AgriPrice.</p>
            <button style={styles.bannerBtn}>
              <span>+ Add crop</span>
            </button>
          </div>

          <div style={styles.filterCard}>
            <div style={styles.searchWrapper}>
              <input 
                type="text" 
                placeholder="Search records" 
                readOnly 
                style={styles.searchInput} 
              />
            </div>
            <div style={styles.filtersRight}>
              <div style={styles.filterGroup}>
                <span style={styles.filterLabel}>Status</span>
                <div style={styles.dropdownBox}>
                  <span>All Statuses</span>
                  <span style={styles.dropdownArrow}>▼</span>
                </div>
              </div>
              <div style={styles.filterGroup}>
                <span style={styles.filterLabel}>Category</span>
                <div style={styles.dropdownBox}>
                  <span>All categories</span>
                  <span style={styles.dropdownArrow}>▼</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.tableCard}>
            <div style={styles.tableHeaderContainer}>
              <h3 style={styles.tableSectionTitle}>8 records</h3>
              <span style={styles.tableSubTitle}>Current records</span>
            </div>

            <table style={styles.table}>
              <thead>
                <tr style={styles.trHead}>
                  <th style={styles.th}>CROP</th>
                  <th style={styles.th}>CATEGORY</th>
                  <th style={styles.th}>UNIT</th>
                  <th style={styles.th}>STATUS</th>
                  <th style={styles.thAction}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {cropData.map((item, index) => (
                  <tr key={item.id} style={index === cropData.length - 1 ? styles.trBodyLast : styles.trBody}>
                    <td style={{...styles.td, fontWeight: '500', color: '#111827'}}>{item.crop}</td>
                    <td style={styles.td}>{item.category}</td>
                    <td style={styles.td}>{item.unit}</td>
                    <td style={styles.td}>
                      <span style={styles.activeBadge}>{item.status}</span>
                    </td>
                    <td style={styles.tdAction}>
                      <div style={styles.actionButtonsWrapper}>
                        <button style={styles.actionBtn}>
                          <LuEye size={14} color="#4b5563" />
                          <span>View</span>
                        </button>
                        <button style={styles.actionBtn}>
                          <LuPencil size={14} color="#4b5563" />
                          <span>Edit</span>
                        </button>
                        <button style={styles.actionIconBtn}>
                          <LuArchive size={14} color="#4b5563" />
                        </button>
                      </div>
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
    gap: '20px',
  },
  banner: {
    backgroundColor: 'transparent',
    padding: '0',
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
  filterCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
  },
  searchWrapper: {
    flex: 1,
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#374151',
    outline: 'none',
  },
  filtersRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  filterLabel: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#6b7280',
  },
  dropdownBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '130px',
    cursor: 'pointer',
  },
  dropdownArrow: {
    fontSize: '10px',
    color: '#9ca3af',
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
  tableSubTitle: {
    fontSize: '12px',
    color: '#9ca3af',
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
  activeBadge: {
    backgroundColor: '#e6f4ea',
    color: '#137333',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '12px',
  },
  actionButtonsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  actionBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    color: '#374151',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
  },
  actionIconBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    color: '#374151',
    padding: '5px 8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
};