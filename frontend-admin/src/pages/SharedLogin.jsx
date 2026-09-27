import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const publicEmailPattern =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;
const reservedEmailSuffixes = new Set([
  "example",
  "invalid",
  "local",
  "localhost",
  "test",
]);

function hasPublicEmailFormat(value) {
  const email = value.trim();
  const suffix = email.split(".").at(-1)?.toLowerCase();
  return publicEmailPattern.test(email) && !reservedEmailSuffixes.has(suffix);
}

function ErrorText({ id, children }) {
  return children ? (
    <small id={id} className="auth-field-error" role="alert">
      {children}
    </small>
  ) : null;
}

export default function SharedLogin({ onSubmit }) {
  const formRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const validateForm = () => {
    const next = {};
    if (!email.trim()) next.email = "Email address is required.";
    else if (!hasPublicEmailFormat(email))
      next.email = "Enter an email address with a valid mail domain.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first)
      requestAnimationFrame(() =>
        formRef.current?.querySelector(`[name="${first}"]`)?.focus(),
      );
    return !first;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setBusy(true);
    setErrors({});
    try {
      await onSubmit(email.trim(), password, rememberMe);
    } catch (error) {
      const response = error.response;
      const next = {};
      if (response?.status === 401)
        next.password = "The email address or password is incorrect.";
      else
        next.email =
          response?.data?.message || "Unable to continue. Try again.";
      setErrors(next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <aside className="auth-story">
        <span className="auth-wordmark">AgriPrice</span>
        <img
          className="auth-hero-logo"
          src="/images/agriprice-white.png"
          alt=""
          aria-hidden="true"
        />
      </aside>
      <section className="auth-form">
        <h1>Sign in</h1>
        <p className="muted auth-description">
          Enter your credentials to access your dashboard.
        </p>
        <form ref={formRef} onSubmit={submit} noValidate>
          <div className="form-stack">
            <label className="field">
              <span>Email Address</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              <ErrorText id="email-error">{errors.email}</ErrorText>
            </label>
            <label className="field">
              <span>Password</span>
              <div className="password-field">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <ErrorText id="password-error">{errors.password}</ErrorText>
            </label>
            <div className="auth-options">
              <label className="auth-check">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link className="text-link" to="/login">
                Forgot Password?
              </Link>
            </div>
            <button disabled={busy} className="button w-full" type="submit">
              {busy ? "Please wait…" : "Sign In"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
