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
import { logout, restore } from "./services/portalAuth";

function ProtectedAdmin({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN" || user.status !== "ACTIVE") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoutes({ user, onSignedIn }) {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
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
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    restore()
      .then((restoredUser) => setUser(restoredUser))
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  if (checkingSession) {
    return <div className="admin-session-loading">Checking your session...</div>;
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
