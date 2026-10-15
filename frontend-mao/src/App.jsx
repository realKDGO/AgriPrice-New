import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./hooks/useApp";
import PortalLayout from "./layouts/PortalLayout";
import PortalSkeleton from "./components/common/PortalSkeleton";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/mao/Dashboard"));
const CropManagement = lazy(() => import("./pages/CropManagement"));
const MarketManagement = lazy(() => import("./pages/MarketManagement"));
const PriceManagement = lazy(() => import("./pages/PriceManagement"));
const PriceValidation = lazy(() => import("./pages/PriceValidation"));
const HistoricalRecords = lazy(() => import("./pages/HistoricalRecords"));
const ForecastInformation = lazy(() => import("./pages/ForecastInformation"));
const ReportsAnalytics = lazy(() => import("./pages/ReportsAnalytics"));
const Settings = lazy(() => import("./pages/mao/Settings"));
const Auth = lazy(() => import("./pages/public/Auth"));

/**
 * MaoGuard — only allows users with role=MAO and status=ACTIVE through.
 * Normal farmers, admins, or unauthenticated users are redirected to /login.
 */
function MaoGuard() {
  const { session, authLoading } = useApp();

  if (authLoading) return <PortalSkeleton />;

  if (!session) return <Navigate to="/login" replace />;

  // Restrict: only MAO role can access this portal
  if (session.role !== "MAO" || session.status !== "ACTIVE") {
    return (
      <div className="auth-restriction-page">
        <div className="auth-restriction-card">
          <span className="auth-restriction-icon">🔒</span>
          <h1>Access Restricted</h1>
          <p>
            This portal is exclusively for Municipal Agriculture Office (MAO)
            personnel. Your account does not have the required role to access
            this portal.
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

/**
 * PublicGuard — redirects already-authenticated MAO users away from login/register.
 */
function PublicGuard({ children }) {
  const { session, authLoading } = useApp();
  if (authLoading) return <PortalSkeleton />;
  if (session && session.role === "MAO" && session.status === "ACTIVE") {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PortalSkeleton />}>
      <Routes>
        {/* Public auth routes — only accessible when NOT logged in as MAO */}
        <Route
          path="/login"
          element={
            <PublicGuard>
              <Auth mode="login" />
            </PublicGuard>
          }
        />
        <Route
          path="/register"
          element={
            <PublicGuard>
              <Auth mode="register" />
            </PublicGuard>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicGuard>
              <Auth mode="forgot" />
            </PublicGuard>
          }
        />

        {/* Protected MAO-only routes */}
        <Route element={<MaoGuard />}>
          <Route element={<PortalLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crop-management" element={<CropManagement />} />
            <Route path="/market-management" element={<MarketManagement />} />
            <Route path="/crop-prices" element={<PriceManagement />} />
            <Route path="/price-validation" element={<PriceValidation />} />
            <Route path="/historical-records" element={<HistoricalRecords />} />
            <Route
              path="/forecast-information"
              element={<ForecastInformation />}
            />
            <Route path="/reports-analytics" element={<ReportsAnalytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all — redirect to dashboard (which will further redirect to login if needed) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}