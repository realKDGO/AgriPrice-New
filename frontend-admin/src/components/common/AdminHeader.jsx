import { useState } from "react";
import { Bell } from "lucide-react";

export default function AdminHeader({ title, subtitle, children }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="admin-page-header">
      <div className="admin-page-header__left">
        <h1 className="admin-page-header__title">{title}</h1>
        {subtitle && (
          <p className="admin-page-header__subtitle">{subtitle}</p>
        )}
      </div>

      <div className="admin-page-header__right">
        {children}
        <button
          type="button"
          className="admin-bell-btn"
          aria-label="Notifications"
          onClick={() => setShowNotifications((v) => !v)}
        >
          <Bell size={18} strokeWidth={1.8} />
          <span className="admin-bell-badge" />
        </button>

        {showNotifications && (
          <div className="admin-notifications-dropdown">
            <div className="admin-notifications-dropdown__header">
              Recent Notifications
            </div>
            <div className="admin-notifications-dropdown__item">
              <strong>System online</strong> - Admin session active.
            </div>
            <div className="admin-notifications-dropdown__item">
              <strong>Database status</strong> - Postgres presentation instance connected.
            </div>
            <div className="admin-notifications-dropdown__item">
              <strong>Security check</strong> - All security controls active.
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
