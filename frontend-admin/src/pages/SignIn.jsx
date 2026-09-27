import { useNavigate } from "react-router-dom";
import PortalSignIn from "../components/common/PortalSignIn";
function SignIn(){const navigate=useNavigate(); return <PortalSignIn portalName="Administration" title="Admin Sign In" description="Sign in to manage AgriPrice data and administrative functions." emailPlaceholder="admin@agriprice.ph" onSubmit={()=>navigate("/")}/>}
export default SignIn;
