import { navigation } from "../../config/navigation";
function PortalTopbar() { return <header className="portal-topbar"><div className="portal-topbar-title">{navigation.topbarTitle}</div><div className="user-pill"><span className="user-avatar">{navigation.userInitials}</span><span>{navigation.userLabel}</span></div></header>; }
export default PortalTopbar;
