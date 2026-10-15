import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import AdminHeader from "../../components/common/AdminHeader";
import { api } from "../../services/portalAuth";

export default function Security() {
  const [stats, setStats] = useState({
    activeAccounts: 10,
    suspendedAccounts: 0,
    roleAuthConnected: true,
    passHashConnected: true,
    rateLimitConnected: true,
  });

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => {
        const data = res.data?.data;
        if (data?.stats) {
          setStats((prev) => ({
            ...prev,
            activeAccounts: data.stats.totalUsers ?? prev.activeAccounts,
            suspendedAccounts: data.stats.suspendedUsers ?? prev.suspendedAccounts,
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <AdminHeader
        title="Security"
        subtitle="Account security information and integration status."
      />

      {/* Top 2 Cards */}
      <div className="admin-two-col">
        {/* Account status */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-header__title">Account status</h2>
          </div>

          <div className="admin-status-list">
            <div className="admin-status-row">
              <span className="admin-status-row__label">Active accounts</span>
              <span style={{ fontWeight: 600, fontSize: "14px" }}>
                {stats.activeAccounts}
              </span>
            </div>

            <div className="admin-status-row">
              <span className="admin-status-row__label">Suspended accounts</span>
              <span style={{ fontWeight: 600, fontSize: "14px" }}>
                {stats.suspendedAccounts}
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              fontSize: "12.5px",
              color: "var(--admin-text-muted)",
            }}
          >
            Use account management to suspend or reactivate accounts.
          </div>
        </div>

        {/* Production security controls */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-header__title">
              Production security controls
            </h2>
          </div>

          <div className="admin-status-list">
            <div className="admin-status-row">
              <span className="admin-status-row__label">
                Server-enforced role authorization
              </span>
              <span
                className={`admin-pill ${
                  stats.roleAuthConnected
                    ? "admin-pill--connected"
                    : "admin-pill--not-connected"
                }`}
              >
                {stats.roleAuthConnected ? "Connected" : "Not connected"}
              </span>
            </div>

            <div className="admin-status-row">
              <span className="admin-status-row__label">
                Password hashing and secure sessions
              </span>
              <span
                className={`admin-pill ${
                  stats.passHashConnected
                    ? "admin-pill--connected"
                    : "admin-pill--not-connected"
                }`}
              >
                {stats.passHashConnected ? "Connected" : "Not connected"}
              </span>
            </div>

            <div className="admin-status-row">
              <span className="admin-status-row__label">
                Rate limiting and security event collection
              </span>
              <span
                className={`admin-pill ${
                  stats.rateLimitConnected
                    ? "admin-pill--connected"
                    : "admin-pill--not-connected"
                }`}
              >
                {stats.rateLimitConnected ? "Connected" : "Not connected"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: Recorded security events */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ marginBottom: "24px" }}>
          <h2 className="admin-card-header__title">Recorded security events</h2>
        </div>

        <div className="admin-empty-state">
          <div className="admin-empty-state__icon-circle">
            <Search size={20} strokeWidth={2} />
          </div>
          <div className="admin-empty-state__title">No matching records</div>
          <div className="admin-empty-state__subtitle">
            Try changing your search or filters.
          </div>
        </div>
      </div>
    </div>
  );
}
