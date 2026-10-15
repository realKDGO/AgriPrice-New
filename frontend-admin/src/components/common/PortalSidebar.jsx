import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  UserCheck,
  FileText,
  Activity,
  Shield,
  Database,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "../../services/portalAuth";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutGrid },
  { label: "User Accounts", path: "/users", icon: Users },
  { label: "MAO Accounts", path: "/mao-accounts", icon: UserCheck },
  { label: "Audit Logs", path: "/activity", icon: FileText },
  { label: "System Monitoring", path: "/monitoring", icon: Activity },
  { label: "Security", path: "/security", icon: Shield },
  { label: "Backup & Recovery", path: "/backups", icon: Database },
  { label: "Settings", path: "/settings", icon: Settings },
];

function PortalSidebar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    navigate("/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      {/* Brand Logo */}
      <div className="admin-sidebar__logo">
        <img
          className="admin-sidebar__logo-img"
          src="/images/agriprice-logo.png"
          alt="AgriPrice"
        />
        <span className="admin-sidebar__brand-name">AgriPrice</span>
      </div>

      {/* Overview Section */}
      <div className="admin-sidebar__section-title">OVERVIEW</div>

      {/* Nav Links */}
      <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `admin-sidebar__link${isActive ? " active" : ""}`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Sign Out */}
      <div className="admin-sidebar__footer">
        <button
          type="button"
          className="admin-sidebar__signout-btn"
          onClick={handleSignOut}
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default PortalSidebar;
