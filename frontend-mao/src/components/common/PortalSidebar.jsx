import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import Brand from "./Brand";
import { navigation } from "../../config/navigation";
function PortalSidebar() {
 const navigate = useNavigate();
 return <aside className="portal-sidebar"><div className="sidebar-brand"><Brand subtitle={navigation.portalLabel} /></div>{navigation.sections.map(section => <div key={section.label}><div className="sidebar-section">{section.label}</div><nav className="sidebar-nav">{section.items.map(({label,path,icon:Icon}) => <NavLink key={path} to={path} end={path === "/"} className={({isActive}) => `sidebar-link${isActive ? " active" : ""}`}><Icon/><span>{label}</span></NavLink>)}</nav></div>)}<div className="sidebar-footer"><button className="sidebar-link sidebar-logout" onClick={() => navigate("/login")}><FiLogOut/><span>Logout</span></button></div></aside>;
}
export default PortalSidebar;
