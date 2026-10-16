import { useEffect, useLayoutEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import { Bell, LogOut, Menu } from "lucide-react";
import { Brand, Modal, PageSkeleton } from "../components/common/UI";
import {
  farmerNav,
  toolsNav,
  accountNav,
  maoNav,
  adminNav,
} from "../routes/navigation";
import { useApp } from "../hooks/useApp";

const farmerTitles = {
  "/farmer": "Dashboard",
  "/farmer/prices": "Crop Prices",
  "/farmer/historical": "Historical Prices",
  "/farmer/forecast": "Forecasting",
  "/farmer/markets": "Market Recommendation",
  "/farmer/profit": "Profit Estimation",
  "/farmer/reports": "Reports & Analytics",
  "/farmer/settings": "Settings",
  "/farmer/notifications": "Notifications",
  "/farmer/more": "More",
};
const managementTitles = {
  "/mao": "MAO Dashboard",
  "/mao/crops": "Crop Management",
  "/mao/markets": "Market Management",
  "/mao/prices": "Crop Price Management",
  "/mao/validation": "Price Validation",
  "/mao/history": "Historical Records",
  "/mao/forecast": "Forecast Information",
  "/mao/reports": "Reports & Analytics",
  "/admin": "Admin Dashboard",
  "/admin/users": "User Accounts",
  "/admin/mao-accounts": "MAO Accounts",
  "/admin/activity": "Activity & Audit Logs",
  "/admin/monitoring": "System Monitoring",
  "/admin/security": "Security",
  "/admin/backups": "Backup & Recovery",
  "/admin/settings": "Settings",
  "/admin/access": "Roles & Access",
  "/admin/reports": "Technical Reports",
  "/admin/contacts": "Contact Messages",
  "/admin/notifications": "Notifications",
  "/mao/settings": "Settings",
  "/mao/notifications": "Notifications",
};

function Navigation({ items, base, onClose, onNavigate }) {
  const { t } = useApp();
  const location = useLocation();
  return (
    <nav className="side-nav">
      {items.map(([path, label, Icon]) => {
        const isPricesActive =
          path === "prices" &&
          (location.pathname.startsWith(`${base}/prices`) ||
            location.pathname.startsWith(`${base}/historical`));
        return (
          <NavLink
            key={path}
            to={base + (path ? `/${path}` : "")}
            end={!path}
            className={({ isActive }) =>
              isActive || isPricesActive ? "active" : undefined
            }
            onClick={() => {
              onNavigate();
              onClose?.();
            }}
          >
            <Icon size={19} />
            <span>{t(label)}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function SharedLayout({ role = "FARMER" }) {
  const [drawer, setDrawer] = useState(false);
  const [drawerClosing, setDrawerClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const { logout, unread, t, loading: appLoading } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const farmer = role === "FARMER";
  const base = `/${role.toLowerCase()}`;
  const beginLoading = () => {};
  const openDrawer = () => {
    setDrawerClosing(false);
    setDrawer(true);
  };
  const closeDrawer = (afterClose) => {
    if (!drawer) {
      afterClose?.();
      return;
    }
    if (drawerClosing) return;
    setDrawerClosing(true);
    window.setTimeout(() => {
      setDrawer(false);
      setDrawerClosing(false);
      afterClose?.();
    }, 220);
  };
  const navGroups = farmer
    ? [
        ["OVERVIEW", [["", "Dashboard", farmerNav[0][2]]]],
        [
          "MARKET DATA",
          [
            ["prices", "Crop Prices", farmerNav[1][2]],
          ],
        ],
        [
          "DECISION SUPPORT",
          [
            ["forecast", "Forecasting", farmerNav[2][2]],
            ["markets", "Market Recommendation", farmerNav[3][2]],
            ...toolsNav,
          ],
        ],
        ["ACCOUNT", accountNav],
      ]
    : role === "MAO"
      ? [
          ["OVERVIEW", maoNav.filter((i) => i[0] !== "settings")],
          ["ACCOUNT", maoNav.filter((i) => i[0] === "settings")],
        ]
      : [["OVERVIEW", adminNav]];
  const pageTitle =
    farmerTitles[location.pathname] ||
    managementTitles[location.pathname] ||
    "AgriPrice";

  useLayoutEffect(() => {
    if (drawer) closeDrawer();
    window.scrollTo(0, 0);
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 220);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  const requestSignOut = () => {
    if (drawer) closeDrawer(() => setConfirmSignOut(true));
    else setConfirmSignOut(true);
  };
  const signOut = async () => {
    setConfirmSignOut(false);
    try {
      await logout();
      if (role === "MAO") navigate("/mao/login");
      else if (role === "ADMIN") navigate("/admin/login");
      else navigate("/");
    } catch {}
  };
  const nav = (
    <>
      {navGroups.map(([label, items]) => (
        <div key={label}>
          <div className="eyebrow nav-caption">{t(label)}</div>
          <Navigation
            items={items}
            base={base}
            onNavigate={beginLoading}
            onClose={closeDrawer}
          />
        </div>
      ))}
      <div className="sidebar-footer">
        <button className="sidebar-signout" onClick={requestSignOut}>
          <LogOut size={18} />
          {t("Sign Out")}
        </button>
      </div>
    </>
  );

  const dashboardDataLoading = farmer && location.pathname === "/farmer" && appLoading;
  if ((loading || dashboardDataLoading) && !drawerClosing)
    return (
      <div className={`app-shell ${farmer ? "farmer-shell" : "management-shell"} skeleton-shell`}>
        {/* Desktop sidebar skeleton — hidden on mobile via CSS */}
        <aside className="sidebar skeleton-sidebar">
          <div className="skeleton skeleton-brand-mark" />
          <div className="skeleton skeleton-brand-word" />
          {Array.from({ length: 8 }, (_, i) => (
            <div className="skeleton skeleton-nav-row" key={i} />
          ))}
        </aside>
        <div className="main-shell">
          {/* App header skeleton — visible on all screen sizes, adapts via CSS */}
          <header className="app-header skeleton-app-header">
            {!farmer && <div className="skeleton skeleton-icon skeleton-menu-icon" />}
            <div className="skeleton skeleton-heading skeleton-page-title-text" />
            <div className="skeleton skeleton-icon skeleton-bell-icon" />
          </header>
          <main className="page-container">
            <PageSkeleton variant={location.pathname} />
          </main>
        </div>
        {farmer && <div className="skeleton skeleton-bottom-nav" />}
      </div>
    );


  return (
    <div
      className={`app-shell ${farmer ? "farmer-shell" : "management-shell"}`}
    >
      <aside className="sidebar">
        <div className="sidebar-brand">
          {farmer ? <Brand /> : <Link className="brand" to={base} aria-label="AgriPrice dashboard"><img className="brand-logo" src="/images/agriprice-white.png" alt="" /><span>AgriPrice</span></Link>}
        </div>
        {nav}
      </aside>
      <div className="main-shell">
        <header className="app-header">
          {!farmer && (
            <button
              className="icon-button management-menu"
              onClick={openDrawer}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
          )}
          <p className="app-page-title">{t(pageTitle)}</p>
          <Link
            className="notification-bell"
            to={`${base}/notifications`}
            onClick={beginLoading}
            aria-label="Notifications"
          >
            <Bell size={21} />
            {unread > 0 && <i />}
          </Link>
        </header>
        <main id="main" className="page-container">
          {loading ? (
            <PageSkeleton variant={location.pathname} />
          ) : (
            <div key={location.pathname} className="route-content">
              <Outlet />
            </div>
          )}
        </main>
      </div>
      {farmer && (
        <nav className="bottom-nav" aria-label="Farmer navigation">
          {farmerNav.map(([path, item, Icon]) => {
            const isPricesActive =
              path === "prices" &&
              (location.pathname.startsWith(`${base}/prices`) ||
                location.pathname.startsWith(`${base}/historical`));
            return (
              <NavLink
                to={base + (path ? `/${path}` : "")}
                key={path}
                end={!path}
                className={({ isActive }) =>
                  isActive || isPricesActive ? "active" : undefined
                }
                onClick={beginLoading}
              >
                <Icon size={20} />
                <span>
                  {t(
                    item === "Crop Prices"
                      ? "Prices"
                      : item === "Market Recommendation"
                        ? "Markets"
                        : item,
                  )}
                </span>
              </NavLink>
            );
          })}
        </nav>
      )}
      {drawer && (
        <Modal
          drawer
          title="AgriPrice"
          closing={drawerClosing}
          onClose={closeDrawer}
        >
          {nav}
        </Modal>
      )}
      {confirmSignOut && (
        <Modal
          title="Sign out of AgriPrice?"
          onClose={() => setConfirmSignOut(false)}
        >
          <p className="muted">
            You’ll need to sign in again to access your dashboard.
          </p>
          <div className="confirmation-actions">
            <button
              className="button secondary"
              onClick={() => setConfirmSignOut(false)}
            >
              Cancel
            </button>
            <button className="button" onClick={signOut}>
              {t("Sign Out")}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
