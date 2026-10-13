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
import PublicLayout from "../layouts/PublicLayout";
import { useApp } from "../hooks/useApp";
import { Empty, PageSkeleton } from "../components/common/UI";
import Legal from "../pages/public/Legal";
import Home from "../pages/farmer/Home";
import Landing from "../pages/public/Landing";
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
function Guard({ role }) {
  const { authLoading, loading } = useApp();
  if (authLoading || loading) return <PageSkeleton chrome />;
  return <Outlet />;
}
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton chrome />}>
      <Routes>
        <Route path="/" element={<Navigate to="/farmer" replace />} />
        <Route path="/login" element={<Navigate to="/farmer" replace />} />
        <Route path="/register" element={<Navigate to="/farmer" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/farmer" replace />} />
        <Route element={<PublicLayout />}>
          <Route path="/landing" element={<Landing />} />
          {["privacy-policy", "terms", "cookie-policy"].map((kind) => (
            <Route
              key={kind}
              path={`/${kind}`}
              element={<Legal kind={kind} />}
            />
          ))}
        </Route>
        <Route element={<Guard role="FARMER" />}>
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
        <Route
          path="*"
          element={<Navigate to="/farmer" replace />}
        />
      </Routes>
    </Suspense>
  );
}
