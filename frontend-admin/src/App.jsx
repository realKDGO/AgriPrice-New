import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PortalLayout from "./layouts/PortalLayout";
import Dashboard from "./pages/admin/Dashboard";
import UserAccounts from "./pages/admin/UserAccounts";
import MaoAccounts from "./pages/admin/MaoAccounts";
import AuditLogs from "./pages/admin/AuditLogs";
import SystemMonitoring from "./pages/admin/SystemMonitoring";
import Security from "./pages/admin/Security";
import BackupRecovery from "./pages/admin/BackupRecovery";
import SystemSettings from "./pages/admin/SystemSettings";
import Login from "./pages/Login";
import { login } from "./services/portalAuth";

const TEMP_BYPASS_LOGIN = true;

const DEMO_ADMIN_USER = {
  id: "demo-admin",
  email: "admin@example.org",
  role: "ADMIN",
  status: "ACTIVE",
  firstName: "Admin",
  lastName: "Demo"
};

function ProtectedAdmin({ user, children }) {
  if (!user) return <Navigate to="/" replace />;

  if (user.role !== "ADMIN" || user.status !== "ACTIVE") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AdminRoutes({ user, onSignedIn }) {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          TEMP_BYPASS_LOGIN ? (
            <Navigate to="/" replace />
          ) : user ? (
            <Navigate to="/" replace />
          ) : (
            <Login onSignedIn={onSignedIn} />
          )
        }
      />

      <Route
        element={
          <ProtectedAdmin user={user}>
            <PortalLayout />
          </ProtectedAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/users" element={<UserAccounts />} />
        <Route path="/mao-accounts" element={<MaoAccounts />} />
        <Route path="/activity" element={<AuditLogs />} />
        <Route path="/monitoring" element={<SystemMonitoring />} />
        <Route path="/security" element={<Security />} />
        <Route path="/backups" element={<BackupRecovery />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [bypassLoading, setBypassLoading] = useState(TEMP_BYPASS_LOGIN);

  useEffect(() => {
    if (!TEMP_BYPASS_LOGIN) {
      setBypassLoading(false);
      return;
    }

    login("admin@example.org", "AgriPriceDemo2026!", true)
      .then((loggedInUser) => {
        setUser(loggedInUser);
      })
      .catch((error) => {
        console.error("Temporary Admin login bypass failed:", error);
        setUser(null);
      })
      .finally(() => {
        setBypassLoading(false);
      });
  }, []);

  if (bypassLoading) {
    return <div className="admin-session-loading">Loading Admin portal...</div>;
  }

  return (
    <BrowserRouter>
      <AdminRoutes
        user={user}
        onSignedIn={setUser}
      />
    </BrowserRouter>
  );
}

export default App;