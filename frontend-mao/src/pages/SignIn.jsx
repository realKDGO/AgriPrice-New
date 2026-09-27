import { useNavigate } from "react-router-dom";
import SharedLogin from "./SharedLogin";
import { login } from "../services/portalAuth";

export default function SignIn({ onSignedIn }) {
  const navigate = useNavigate();
  return (
    <SharedLogin
      portalLabel="MAO portal"
      onSubmit={async (email, password, rememberMe) => {
        const user = await login(email, password, rememberMe);
        onSignedIn(user);
        navigate("/", { replace: true });
      }}
    />
  );
}
