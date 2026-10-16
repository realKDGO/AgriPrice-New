import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Field } from "../../components/common/UI";
import { useApp } from "../../hooks/useApp";
import { authService } from "../../services/authService";

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

function Password({
  name,
  value,
  onChange,
  onBlur,
  error,
  label = "Password",
  autoComplete = "current-password",
}) {
  const [show, setShow] = useState(false);
  const errorId = `${name}-error`;
  return (
    <Field label={label}>
      <div className="password-field">
        <input
          name={name}
          aria-label={label}
          type={show ? "text" : "password"}
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

export default function Auth({ mode = "login", targetRole = "FARMER" }) {
  const { session, login, register, notify, bypass } = useApp();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const isMao = targetRole === "MAO";
  const isAdmin = targetRole === "ADMIN";
  const isFarmer = !isMao && !isAdmin;

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  const getDestination = () => {
    if (isMao) return "/mao";
    if (isAdmin) return "/admin";
    return "/farmer";
  };

  const getLoginPath = () => {
    if (isMao) return "/mao/login";
    if (isAdmin) return "/admin/login";
    return "/login";
  };

  const getRegisterPath = () => {
    if (isMao) return "/mao/register";
    return "/register";
  };

  const getForgotPath = () => {
    if (isMao) return "/mao/forgot-password";
    if (isAdmin) return "/admin/forgot-password";
    return "/forgot-password";
  };

  // If user already authenticated with the correct role, redirect to dashboard
  useEffect(() => {
    if (session && !isRegister && !isForgot) {
      if (session.role === targetRole) {
        navigate(getDestination(), { replace: true });
      }
    }
  }, [session, isRegister, isForgot, targetRole, navigate]);

  const handleBypass = async () => {
    setBusy(true);
    try {
      const user = await bypass(targetRole);
      if (user) {
        notify(`Signed in via presentation bypass (${targetRole}).`);
        navigate(getDestination());
      }
    } catch (error) {
      applyServerErrors(error);
    } finally {
      setBusy(false);
    }
  };

  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    rememberMe: false,
    acceptTerms: false,
  });

  const messageFor = (name, values = form) => {
    const value = values[name];
    if (name === "firstName" && !value.trim()) return "First name is required.";
    if (name === "lastName" && !value.trim()) return "Last name is required.";
    if (name === "email") {
      if (!value.trim()) return "Email address is required.";
      if (!hasPublicEmailFormat(value))
        return "Enter an email address with a valid mail domain.";
    }
    if (name === "password") {
      if (!value) return "Password is required.";
      if (isRegister && value.length < 8)
        return "Password must contain at least 8 characters.";
    }
    if (name === "confirm") {
      if (!value) return "Please confirm your password.";
      if (value !== values.password) return "Passwords do not match.";
    }
    if (name === "acceptTerms" && !value)
      return "You must agree to the Terms and acknowledge the Privacy Policy.";
    return "";
  };

  const relevantFields = () => [
    ...(isRegister ? ["firstName", "lastName"] : []),
    "email",
    ...(!isForgot ? ["password"] : []),
    ...(isRegister ? ["confirm", "acceptTerms"] : []),
  ];

  const setValue = (name, value) => {
    const next = { ...form, [name]: value };
    setForm(next);
    if (errors[name])
      setErrors((current) => ({ ...current, [name]: messageFor(name, next) }));
    if (name === "password" && errors.confirm)
      setErrors((current) => ({
        ...current,
        confirm: messageFor("confirm", next),
      }));
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
    for (const issue of response?.data?.errors || []) {
      const key = issue.field === "confirmPassword" ? "confirm" : issue.field;
      if (relevantFields().includes(key)) next[key] = issue.message;
    }
    if (!Object.keys(next).length) {
      if (isRegister && response?.status === 409)
        next.email = "An account with this email address already exists.";
      else if (!isRegister && !isForgot && response?.status === 401)
        next.password = "The email address or password is incorrect.";
      else if (!isRegister && !isForgot && response?.status === 403)
        next.email =
          response?.data?.message ||
          `Access denied. This portal is restricted to ${targetRole} accounts only.`;
      else
        next.email =
          response?.data?.message || "Unable to continue. Try again.";
    }
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
        if (isAdmin) {
          setErrors({
            email:
              "Password recovery for administrators is managed by system super-admins.",
          });
          return;
        }
        const result = await authService.forgot(form.email.trim());
        notify(result.message);
        return;
      }
      if (isRegister) {
        const user = await register({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
          confirmPassword: form.confirm,
          acceptTerms: form.acceptTerms,
          role: targetRole,
        });
        if (user) {
          if (isMao) {
            notify("MAO account created. Awaiting admin approval.");
            navigate("/mao/login");
          } else {
            notify("Account created successfully.");
            navigate(getDestination());
          }
        }
        return;
      }

      const user = await login(
        form.email.trim(),
        form.password,
        form.rememberMe,
        targetRole,
      );
      if (user) {
        notify("Signed in successfully.");
        navigate(getDestination());
      }
    } catch (error) {
      applyServerErrors(error);
    } finally {
      setBusy(false);
    }
  }

  // Titles and descriptions tailored to each role
  const heading = isRegister
    ? isMao
      ? "Create MAO account"
      : "Create your account"
    : isForgot
      ? "Forgot your password?"
      : isMao
        ? "MAO Sign In"
        : isAdmin
          ? "Admin Sign In"
          : "Sign in";

  const description = isRegister
    ? isMao
      ? "Register as a Municipal Agriculture Office officer to manage crop pricing and market data."
      : "Start making data-backed selling decisions today."
    : isForgot
      ? `Enter the email address associated with your ${isMao ? "MAO " : isAdmin ? "Admin " : ""}AgriPrice account.`
      : isMao
        ? "Enter your MAO credentials to access the officer dashboard."
        : isAdmin
          ? "Enter your administrator credentials to access the admin dashboard."
          : "Enter your credentials to access your dashboard.";

  return (
    <div className={`auth-shell ${isRegister ? "auth-register" : ""}`}>
      <aside className={`auth-story ${isAdmin ? "admin-auth-story" : ""}`}>
        <span className="auth-wordmark">AgriPrice</span>
        <img
          className="auth-hero-logo"
          src="/images/agriprice-white.png"
          alt=""
          aria-hidden="true"
        />
      </aside>

      <section className="auth-form">
        <div className="mobile-auth-brand">
          <span className="auth-wordmark">AgriPrice</span>
        </div>
        <h1>{heading}</h1>
        {isFarmer && <p className="muted auth-description">{description}</p>}

        <form ref={formRef} onSubmit={submit} noValidate>
          <div className="form-stack">
            {isRegister && (
              <div className="form-grid">
                <TextField
                  label="First Name"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  placeholder="Juan"
                  value={form.firstName}
                  onChange={(event) =>
                    setValue("firstName", event.target.value)
                  }
                  onBlur={() => validateField("firstName")}
                  error={errors.firstName}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  placeholder="Dela Cruz"
                  value={form.lastName}
                  onChange={(event) => setValue("lastName", event.target.value)}
                  onBlur={() => validateField("lastName")}
                  error={errors.lastName}
                />
              </div>
            )}
            <TextField
              label={
                isMao
                  ? "Official MAO Email"
                  : isAdmin
                    ? "Admin Email Address"
                    : "Email Address"
              }
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={
                isMao
                  ? "officer@mao.agriprice.ph"
                  : isAdmin
                    ? "admin@agriprice.ph"
                    : "you@email.com"
              }
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
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                />
                {isRegister && (
                  <Password
                    name="confirm"
                    label="Confirm Password"
                    value={form.confirm}
                    onChange={(event) =>
                      setValue("confirm", event.target.value)
                    }
                    onBlur={() => validateField("confirm")}
                    error={errors.confirm}
                    autoComplete="new-password"
                  />
                )}
                {!isRegister && (
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
                    <Link className="text-link" to={getForgotPath()}>
                      Forgot Password?
                    </Link>
                  </div>
                )}
              </>
            )}
            {isRegister && (
              <div className="consent-group">
                <label className="auth-check consent">
                  <input
                    name="acceptTerms"
                    type="checkbox"
                    required
                    checked={form.acceptTerms}
                    onChange={(event) =>
                      setValue("acceptTerms", event.target.checked)
                    }
                    onBlur={() => validateField("acceptTerms")}
                    aria-invalid={Boolean(errors.acceptTerms)}
                    aria-describedby={
                      errors.acceptTerms ? "acceptTerms-error" : undefined
                    }
                  />
                  <span>
                    I agree to the Terms and Conditions and acknowledge the Privacy Policy.
                  </span>
                </label>
                <ErrorText id="acceptTerms-error">
                  {errors.acceptTerms}
                </ErrorText>
              </div>
            )}
            <button
              disabled={busy}
              className={`button w-full ${isAdmin ? "admin-auth-btn" : ""}`}
            >
              {busy
                ? "Please wait…"
                : isRegister
                  ? isMao
                    ? "Register MAO Account"
                    : "Create Account"
                  : isForgot
                    ? "Check Recovery Options"
                    : isMao
                      ? "Sign In to MAO"
                      : isAdmin
                        ? "Sign In to Admin"
                        : "Sign In"}
            </button>
          </div>
        </form>

        <p className="auth-switch">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link className="text-link inline-flex" to={getLoginPath()}>
                Sign in
              </Link>
            </>
          ) : isForgot ? (
            <Link className="text-link" to={getLoginPath()}>
              Remember your password? Sign in
            </Link>
          ) : isMao ? (
            <>
              Don&apos;t have an MAO account?{" "}
              <Link className="text-link inline-flex" to={getRegisterPath()}>
                Request access
              </Link>
            </>
          ) : isAdmin ? null : (
            <>
              Don't have an account?{" "}
              <Link className="text-link inline-flex" to={getRegisterPath()}>
                Create one
              </Link>
            </>
          )}
        </p>
      </section>
    </div>
  );
}
