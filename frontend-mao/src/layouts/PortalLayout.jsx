import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PortalSidebar from "../components/common/PortalSidebar";
import PortalTopbar from "../components/common/PortalTopbar";
import PortalSkeleton from "../components/common/PortalSkeleton";
function PortalLayout(){ const location=useLocation(); const [loading,setLoading]=useState(true); useEffect(()=>{setLoading(true);const timer=setTimeout(()=>setLoading(false),260);window.scrollTo(0,0);return()=>clearTimeout(timer)},[location.pathname]); if(loading)return <PortalSkeleton/>; return <div className="portal-shell"><PortalSidebar/><div className="portal-main"><PortalTopbar/><main className="portal-content"><Outlet/></main></div></div>; }
export default PortalLayout;
