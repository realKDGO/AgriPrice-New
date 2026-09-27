import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Users,
  UserCog,
  RefreshCw,
} from "lucide-react";
import { api } from "../../services/portalAuth";
import StatCard from "../../components/common/StatCard";
import ActionButton from "../../components/common/ActionButton";

function formatAction(action) {
  return String(action || "Activity")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function actorName(activity) {
  const actor = activity?.actor;
  if (!actor) return "System";
  return [actor.firstName, actor.lastName].filter(Boolean).join(" ") || "System";
}

function formatDate(value) {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadDashboard({ silent = false } = {}) {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/dashboard");
      setDashboard(response.data?.data ?? {});
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.response?.data?.error ||
        requestError.message ||
        "Unable to load the Admin Dashboard.";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="module-page">
        <header className="page-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-description">Loading system overview and account activity...</p>
          </div>
        </header>
        <div className="stats-grid">
          {[1, 2, 3, 4, 5].map((item) => (
            <article className="stat-card" key={item}>
              <div className="skeleton-block" style={{ height: 12, width: "55%" }} />
              <div className="skeleton-block" style={{ height: 28, width: "35%", marginTop: 14 }} />
              <div className="skeleton-block" style={{ height: 10, width: "65%", marginTop: 8 }} />
            </article>
          ))}
        </div>
      </section>
    );
  }

  const recent = Array.isArray(dashboard?.recent) ? dashboard.recent : [];

  return (
    <section className="module-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-description">
            Overview of AgriPrice system and account activity.
          </p>
        </div>
        <div className="page-actions">
          <ActionButton
            variant="secondary"
            icon={RefreshCw}
            onClick={() => loadDashboard({ silent: true })}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </ActionButton>
        </div>
      </header>

      {error ? (
        <div className="dashboard-error" role="alert">
          <AlertTriangle size={17} />
          <div>
            <strong>Unable to load dashboard data.</strong>
            <p>{error}</p>
          </div>
          <ActionButton variant="secondary" onClick={() => loadDashboard()}>
            Retry
          </ActionButton>
        </div>
      ) : null}

      <div className="stats-grid">
        <StatCard
          label="Total Users"
          value={dashboard?.total ?? 0}
          helper="All registered accounts"
          icon={Users}
        />
        <StatCard
          label="Active Farmers"
          value={dashboard?.activeFarmers ?? 0}
          helper="Active FARMER accounts"
          icon={Users}
        />
        <StatCard
          label="Active MAO"
          value={dashboard?.activeMao ?? 0}
          helper="Active MAO accounts"
          icon={UserCog}
        />
        <StatCard
          label="Suspended"
          value={dashboard?.suspended ?? 0}
          helper="Accounts currently suspended"
          icon={AlertTriangle}
        />
        <StatCard
          label="Login Failures"
          value={dashboard?.failures ?? 0}
          helper="Last 24 hours"
          icon={ShieldCheck}
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent Activity</h2>
            <span className="panel-meta">Latest 10 records</span>
          </div>
          <div className="panel-body">
            {recent.length ? (
              <div className="activity-list">
                {recent.map((activity) => (
                  <article className="activity-item" key={activity.id}>
                    <span className="activity-icon">
                      {activity.status === "FAILED" ? (
                        <AlertTriangle size={15} />
                      ) : (
                        <CheckCircle2 size={15} />
                      )}
                    </span>
                    <div>
                      <div className="activity-title">
                        {formatAction(activity.action)}
                      </div>
                      <div className="activity-detail">
                        {actorName(activity)} · {activity.entityType || "System"} · {formatDate(activity.createdAt)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">No recent activity records found.</div>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Administrative Overview</h2>
            <span className="panel-meta">Live database counts</span>
          </div>
          <div className="panel-body">
            <div className="quick-grid">
              <div className="quick-action">
                <span className="quick-icon"><Users size={15} /></span>
                <span>User accounts are connected to the shared database.</span>
              </div>
              <div className="quick-action">
                <span className="quick-icon"><UserCog size={15} /></span>
                <span>MAO accounts are managed through the Admin API.</span>
              </div>
              <div className="quick-action">
                <span className="quick-icon"><Activity size={15} /></span>
                <span>Recent audit activity is loaded from the database.</span>
              </div>
              <div className="quick-action">
                <span className="quick-icon"><ShieldCheck size={15} /></span>
                <span>Login failures are counted for the last 24 hours.</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Dashboard;
