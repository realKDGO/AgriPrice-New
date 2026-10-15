import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login as loginService, restore } from "../services/portalAuth";

const publicEmailPattern =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;
const reservedEmailSuffixes = new Set([
  "example", "invalid", "local", "localhost", "test",
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

function Field({ label, children }) {
  return (
    <div className="field">
      <span>{label}</span>
      {children}
    </div>
  );
}

function TextField({ label, name, error, ...props }) {
  const errorId = `${name}-error`;
  return (
    <Field label={label}>
      <input
        name={name}
        aria-label={label}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      <ErrorText id={errorId}>{error}</ErrorText>
    </Field>
  );
}

function Password({ name, value, onChange, onBlur, error, label = "Password", autoComplete = "current-password" }) {
  const [show, setShow] = useState(false);
  const errorId = `${name}-error`;
  return (
    <Field label={label}>
      <div className="password-field">
        <input
          name={name}
          aria-label={label}
          type={show ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <ErrorText id={errorId}>{error}</ErrorText>
    </Field>
  );
}

/**
 * Admin Auth page — fully styled like farmer Auth but with Admin-specific branding.
 * Accepts mode="login" or mode="forgot".
 */
export default function Auth({ mode = "login", onSignedIn }) {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const isForgot = mode === "forgot";

  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const messageFor = (name, values = form) => {
    const value = values[name];
    if (name === "email") {
      if (!value.trim()) return "Email address is required.";
      if (!hasPublicEmailFormat(value))
        return "Enter an email address with a valid mail domain.";
    }
    if (name === "password" && !isForgot) {
      if (!value) return "Password is required.";
    }
    return "";
  };

  const relevantFields = () =>
    isForgot ? ["email"] : ["email", "password"];

  const setValue = (name, value) => {
    const next = { ...form, [name]: value };
    setForm(next);
    if (errors[name])
      setErrors((current) => ({ ...current, [name]: messageFor(name, next) }));
  };

  const validateField = (name) =>
    setErrors((current) => ({ ...current, [name]: messageFor(name) }));

  const focusField = (name) =>
    requestAnimationFrame(() =>
      formRef.current?.querySelector(`[name="${name}"]`)?.focus(),
    );

  const validateForm = () => {
    const next = Object.fromEntries(
      relevantFields().map((name) => [name, messageFor(name)]),
    );
    setErrors(next);
    const first = relevantFields().find((name) => next[name]);
    if (first) focusField(first);
    return !first;
  };

  const applyServerErrors = (error) => {
    const response = error.response;
    const next = {};
    if (!isForgot && response?.status === 401)
      next.password = "The email address or password is incorrect.";
    else if (!isForgot && response?.status === 403)
      next.email =
        response?.data?.message ||
        "Access denied. This portal is restricted to Admin accounts only.";
    else
      next.email =
        response?.data?.message || "Unable to continue. Try again.";
    setErrors((current) => ({ ...current, ...next }));
    const first = relevantFields().find((name) => next[name]);
    if (first) focusField(first);
  };

  async function submit(event) {
    event.preventDefault();
    if (!validateForm()) return;
    setBusy(true);
    try {
      if (isForgot) {
        // Placeholder: forgot password not yet implemented for admin
        setErrors({ email: "Password recovery is managed by a super-admin. Contact your system administrator." });
        return;
      }
      const user = await loginService(form.email.trim(), form.password, form.rememberMe);
      if (user) {
        onSignedIn(user);
        navigate("/", { replace: true });
      }
    } catch (error) {
      applyServerErrors(error);
    } finally {
      setBusy(false);
    }
  }

  const heading = isForgot ? "Forgot your password?" : "Admin Sign In";
  const description = isForgot
    ? "Enter the email address associated with your Admin account."
    : "Enter your administrator credentials to access the admin dashboard.";

  return (
    <div className="auth-shell">
      <aside className="auth-story admin-auth-story">
        <span className="auth-wordmark">AgriPrice</span>
        <div className="auth-story-copy">
          <h1>System Administration</h1>
          <p>
            Manage user accounts, system settings, security configurations, and
            monitor the AgriPrice platform.
          </p>
        </div>
        <blockquote className="auth-quote">
          <p>
            Administration access is restricted to authorized Admin accounts
            only. All login attempts are logged and monitored for security
            compliance.
          </p>
          <footer>AgriPrice Security & Compliance</footer>
        </blockquote>
      </aside>
      <section className="auth-form">
        <h1>{heading}</h1>
        <p className="muted auth-description">{description}</p>

        <form ref={formRef} onSubmit={submit} noValidate>
          <div className="form-stack">
            <TextField
              label="Admin Email Address"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@agriprice.ph"
              value={form.email}
              onChange={(event) => setValue("email", event.target.value)}
              onBlur={() => validateField("email")}
              error={errors.email}
            />
            {!isForgot && (
              <>
                <Password
                  name="password"
                  value={form.password}
                  onChange={(event) => setValue("password", event.target.value)}
                  onBlur={() => validateField("password")}
                  error={errors.password}
                  autoComplete="current-password"
                />
                <div className="auth-options">
                  <label className="auth-check">
                    <input
                      name="rememberMe"
                      type="checkbox"
                      checked={form.rememberMe}
                      onChange={(event) =>
                        setValue("rememberMe", event.target.checked)
                      }
                    />
                    <span>Remember me</span>
                  </label>
                  <Link className="text-link" to="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>
              </>
            )}
            <button disabled={busy} className="button w-full admin-auth-btn">
              {busy
                ? "Please wait…"
                : isForgot
                  ? "Check Recovery Options"
                  : "Sign In"}
            </button>
          </div>
        </form>
        {isForgot ? (
          <p className="auth-switch">
            <Link className="text-link" to="/login">
              Remember your password? Sign in
            </Link>
          </p>
        ) : null}
      </section>
    </div>
  );
}
