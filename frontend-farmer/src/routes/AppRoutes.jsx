import {
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import FarmerLayout from "../layouts/FarmerLayout";
import MaoLayout from "../layouts/MaoLayout";
import AdminLayout from "../layouts/AdminLayout";
import PublicLayout from "../layouts/PublicLayout";
import { useApp } from "../hooks/useApp";
import { PageSkeleton } from "../components/common/UI";
import Legal from "../pages/public/Legal";
import Home from "../pages/farmer/Home";
import Landing from "../pages/public/Landing";

// Farmer Pages
const Prices = lazy(() => import("../pages/farmer/Prices"));
const CropDetail = lazy(() =>
  import("../pages/farmer/Prices").then((m) => ({ default: m.CropDetail })),
);
const Forecast = lazy(() => import("../pages/farmer/Forecast"));
const Markets = lazy(() => import("../pages/farmer/Markets"));
const Profit = lazy(() => import("../pages/farmer/Profit"));
const Reports = lazy(() => import("../pages/farmer/Reports"));
const Auth = lazy(() => import("../pages/public/Auth"));
import {
  More,
  Profile,
  Settings,
  Help,
  Notifications,
} from "../pages/farmer/Account";

// MAO Pages
const MaoDashboard = lazy(() => import("../pages/mao/Dashboard"));
const MaoManagement = lazy(() => import("../pages/mao/Management"));
const MaoValidation = lazy(() => import("../pages/mao/Validation"));
const MaoForecast = lazy(() => import("../pages/mao/Forecast"));
const MaoReports = lazy(() => import("../pages/mao/Reports"));
const MaoSettings = lazy(() => import("../pages/mao/Settings"));

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminAccounts = lazy(() => import("../pages/admin/Accounts"));

const AdminAudit = lazy(() =>
  import("../pages/admin/System").then((m) => ({ default: m.Audit })),
);
const AdminMonitoring = lazy(() =>
  import("../pages/admin/System").then((m) => ({ default: m.Monitoring })),
);
const AdminSecurity = lazy(() =>
  import("../pages/admin/System").then((m) => ({ default: m.Security })),
);
const AdminConfiguration = lazy(() =>
  import("../pages/admin/System").then((m) => ({ default: m.Configuration })),
);
const AdminBackups = lazy(() =>
  import("../pages/admin/System").then((m) => ({ default: m.Backups })),
);
const AdminAccess = lazy(() =>
  import("../pages/admin/System").then((m) => ({ default: m.Access })),
);
const AdminTechnicalReports = lazy(() =>
  import("../pages/admin/System").then((m) => ({ default: m.TechnicalReports })),
);
const AdminContacts = lazy(() =>
  import("../pages/admin/System").then((m) => ({ default: m.Contacts })),
);

/**
 * AccessRestrictionBanner: displays a clean, user-friendly restriction screen
 * when a user with one role tries to access another role's portal routes.
 */
function AccessRestricted({ portalRole, userRole }) {
  const getPortalInfo = () => {
    if (portalRole === "MAO") {
      return {
        title: "MAO Portal Access Restricted",
        desc: "This area is reserved for authorized Municipal Agriculture Office officers. Your account does not have access permissions for this section.",
        loginPath: "/mao/login",
      };
    }
    if (portalRole === "ADMIN") {
      return {
        title: "Administrator Access Restricted",
        desc: "This area is restricted to system administrators. Normal user and MAO accounts cannot access this administrative portal.",
        loginPath: "/admin/login",
      };
    }
    return {
      title: "Farmer Portal Access Restricted",
      desc: "This section is configured for Farmer accounts.",
      loginPath: "/login",
    };
  };

  const info = getPortalInfo();

  return (
    <div className="auth-restriction-page">
      <div className="auth-restriction-card">
        <span className="auth-restriction-icon">🔒</span>
        <h1>{info.title}</h1>
        <p>{info.desc}</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" className="auth-restriction-btn">
            Back to Home
          </Link>
          <Link
            to={info.loginPath}
            className="auth-restriction-btn"
            style={{ background: "#334155" }}
          >
            Sign in as {portalRole}
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Guard enforces strict role check:
 * - If not logged in -> redirect to that role's login page
 * - If logged in with WRONG role -> display AccessRestricted screen
 * - If logged in with MATCHING role -> render child routes via Outlet
 */
function RoleGuard({ requiredRole, loginUrl }) {
  const { session, authLoading } = useApp();

  if (authLoading) return <PageSkeleton chrome />;

  if (!session) {
    return <Navigate to={loginUrl} replace />;
  }

  if (session.role !== requiredRole || session.status !== "ACTIVE") {
    return <AccessRestricted portalRole={requiredRole} userRole={session.role} />;
  }

  return <Outlet />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton chrome />}>
      <Routes>
        {/* =======================================================
            1. LANDING & PUBLIC INFORMATION (Root = Landing page)
            ======================================================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          {["privacy-policy", "terms", "cookie-policy"].map((kind) => (
            <Route
              key={kind}
              path={`/${kind}`}
              element={<Legal kind={kind} />}
            />
          ))}
        </Route>

        {/* =======================================================
            2. FARMER AUTHENTICATION
            ======================================================= */}
        <Route
          path="/login"
          element={<Auth mode="login" targetRole="FARMER" />}
        />
        <Route
          path="/register"
          element={<Auth mode="register" targetRole="FARMER" />}
        />
        <Route
          path="/forgot-password"
          element={<Auth mode="forgot" targetRole="FARMER" />}
        />

        {/* =======================================================
            3. FARMER PORTAL (Protected by FARMER role)
            ======================================================= */}
        <Route
          element={<RoleGuard requiredRole="FARMER" loginUrl="/login" />}
        >
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index element={<Home />} />
            <Route path="prices" element={<Prices />} />
            <Route path="historical" element={<Prices />} />
            <Route path="prices/:cropId" element={<CropDetail />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="markets" element={<Markets />} />
            <Route path="profit" element={<Profit />} />
            <Route path="reports" element={<Reports />} />
            <Route path="more" element={<More />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="help" element={<Help />} />
          </Route>
        </Route>

        {/* =======================================================
            4. MAO AUTHENTICATION (Dedicated /mao URLs)
            ======================================================= */}
        <Route
          path="/mao/login"
          element={<Auth mode="login" targetRole="MAO" />}
        />
        <Route
          path="/mao/register"
          element={<Auth mode="register" targetRole="MAO" />}
        />
        <Route
          path="/mao/forgot-password"
          element={<Auth mode="forgot" targetRole="MAO" />}
        />

        {/* =======================================================
            5. MAO PORTAL (Protected by MAO role)
            ======================================================= */}
        <Route
          element={<RoleGuard requiredRole="MAO" loginUrl="/mao/login" />}
        >
          <Route path="/mao" element={<MaoLayout />}>
            <Route index element={<MaoDashboard />} />
            <Route path="crops" element={<MaoManagement kind="crops" />} />
            <Route path="markets" element={<MaoManagement kind="markets" />} />
            <Route path="prices" element={<MaoManagement kind="prices" />} />
            <Route path="validation" element={<MaoValidation />} />
            <Route path="history" element={<MaoManagement kind="history" />} />
            <Route path="forecast" element={<MaoForecast />} />
            <Route path="reports" element={<MaoReports />} />
            <Route path="settings" element={<MaoSettings />} />
          </Route>
        </Route>

        {/* =======================================================
            6. ADMIN AUTHENTICATION (Dedicated /admin URLs)
            ======================================================= */}
        <Route
          path="/admin/login"
          element={<Auth mode="login" targetRole="ADMIN" />}
        />
        <Route
          path="/admin/forgot-password"
          element={<Auth mode="forgot" targetRole="ADMIN" />}
        />

        {/* =======================================================
            7. ADMIN PORTAL (Protected by ADMIN role)
            ======================================================= */}
        <Route
          element={<RoleGuard requiredRole="ADMIN" loginUrl="/admin/login" />}
        >
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminAccounts mao={false} />} />
            <Route path="mao-accounts" element={<AdminAccounts mao={true} />} />
            <Route path="activity" element={<AdminAudit />} />
            <Route path="monitoring" element={<AdminMonitoring />} />
            <Route path="security" element={<AdminSecurity />} />
            <Route path="backups" element={<AdminBackups />} />
            <Route path="settings" element={<AdminConfiguration />} />
            <Route path="access" element={<AdminAccess />} />
            <Route path="reports" element={<AdminTechnicalReports />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
        </Route>

        {/* Catch-all: redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
