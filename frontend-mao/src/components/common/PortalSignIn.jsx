import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Brand from "./Brand";
import ActionButton from "./ActionButton";

function PortalSignIn({
  portalName,
  title,
  description,
  emailPlaceholder,
  error,
  onSubmit,
}) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await onSubmit?.(email.trim(), password, rememberMe);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <Brand subtitle={portalName} />
        </div>
        <h1>{title}</h1>
        <p className="auth-description">{description}</p>
        {error ? (
          <div className="auth-error" role="alert">
            {error}
          </div>
        ) : null}
        <form onSubmit={handleSubmit}>
          <label className="form-group">
            <span className="form-label">Email Address</span>
            <input
              className="form-control"
              type="email"
              placeholder={emailPlaceholder}
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="form-group">
            <span className="form-label">Password</span>
            <span className="password-wrap">
              <input
                className="form-control"
                type={visible ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setVisible((value) => !value)}
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <FiEyeOff /> : <FiEye />}
              </button>
            </span>
          </label>
          <label className="form-check">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <ActionButton className="auth-submit" type="submit" disabled={busy}>
            {busy ? "Signing In..." : "Sign In"}
          </ActionButton>
        </form>
      </section>
    </main>
  );
}

export default PortalSignIn;
