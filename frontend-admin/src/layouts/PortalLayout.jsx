import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PortalSidebar from "../components/common/PortalSidebar";
import PortalSkeleton from "../components/common/PortalSkeleton";

function PortalLayout() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 260);
    window.scrollTo(0, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) return <PortalSkeleton />;

  return (
    <div className="admin-shell">
      <PortalSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default PortalLayout;
