import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, Outlet } from "react-router-dom";
import PortalLayout from "./layouts/PortalLayout";
import Dashboard from "./pages/admin/Dashboard";
import UserAccounts from "./pages/admin/UserAccounts";
import MaoAccounts from "./pages/admin/MaoAccounts";
import AuditLogs from "./pages/admin/AuditLogs";
import SystemMonitoring from "./pages/admin/SystemMonitoring";
import Security from "./pages/admin/Security";
import BackupRecovery from "./pages/admin/BackupRecovery";
import SystemSettings from "./pages/admin/SystemSettings";
import Auth from "./pages/Auth";
import { login as loginService, bypass, restore } from "./services/portalAuth";

// Set to false to require real admin login.
const TEMP_BYPASS_LOGIN = false;

const DEMO_ADMIN_USER = {
  id: "demo-admin",
  email: "admin@example.org",
  role: "ADMIN",
  status: "ACTIVE",
  firstName: "Admin",
  lastName: "Demo",
};

/**
 * ProtectedAdmin — Only allows ADMIN role with ACTIVE status.
 * Normal users, MAO officers, or unauthenticated users get redirected.
 */
function ProtectedAdmin({ user }) {
  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "ADMIN" || user.status !== "ACTIVE") {
    return (
      <div className="auth-restriction-page">
        <div className="auth-restriction-card">
          <span className="auth-restriction-icon">🔒</span>
          <h1>Access Restricted</h1>
          <p>
            This portal is exclusively for system administrators. Your account
            does not have the required Admin role to access this portal.
          </p>
          <a href="/login" className="auth-restriction-btn">
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

function AdminRoutes({ user, onSignedIn, loading }) {
  if (loading) {
    return <div className="admin-session-loading">Loading Admin portal…</div>;
  }

  return (
    <Routes>
      {/* Login route */}
      <Route
        path="/login"
        element={
          user && user.role === "ADMIN" && user.status === "ACTIVE" ? (
            <Navigate to="/" replace />
          ) : (
            <Auth mode="login" onSignedIn={onSignedIn} />
          )
        }
      />

      {/* Forgot password route */}
      <Route
        path="/forgot-password"
        element={
          user && user.role === "ADMIN" && user.status === "ACTIVE" ? (
            <Navigate to="/" replace />
          ) : (
            <Auth mode="forgot" onSignedIn={onSignedIn} />
          )
        }
      />

      {/* Protected admin routes */}
      <Route element={<ProtectedAdmin user={user} />}>
        <Route element={<PortalLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/users" element={<UserAccounts />} />
          <Route path="/mao-accounts" element={<MaoAccounts />} />
          <Route path="/activity" element={<AuditLogs />} />
          <Route path="/monitoring" element={<SystemMonitoring />} />
          <Route path="/security" element={<Security />} />
          <Route path="/backups" element={<BackupRecovery />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      if (TEMP_BYPASS_LOGIN) {
        try {
          const loggedInUser = await loginService(
            "admin@example.org",
            "AgriPriceDemo2026!",
            true,
          );
          setUser(loggedInUser);
        } catch {
          try {
            const bypassedUser = await bypass("ADMIN");
            setUser(bypassedUser);
          } catch {
            setUser(DEMO_ADMIN_USER);
          }
        } finally {
          setLoading(false);
        }
        return;
      }

      // Real session restore
      try {
        const restored = await restore();
        if (restored && restored.role === "ADMIN" && restored.status === "ACTIVE") {
          setUser(restored);
        }
      } catch {
        // No active session — stay on login
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  return (
    <BrowserRouter>
      <AdminRoutes user={user} onSignedIn={setUser} loading={loading} />
    </BrowserRouter>
  );
}

export default App;