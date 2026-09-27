import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "../styles/register.css";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../services/portalAuth";

export default function Login({ onSignedIn }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(email.trim(), password, rememberMe);
      onSignedIn(user);
      navigate("/", { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to sign in. Check your credentials and try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-left">
          <div className="signin-brand">
            <span className="signin-brand__logo">🌾</span>
            <span className="signin-brand__name">AgriPrice Admin</span>
          </div>
          <div className="signin-left__content">
            <h1 className="signin-left__heading">
              Welcome to the administration portal.
            </h1>
            <p className="signin-left__subtext">
              Sign in to manage accounts, security, system monitoring, and
              administrative records.
            </p>
          </div>
          <blockquote className="signin-quote">
            <p className="signin-quote__text">
              Administration access is restricted to authorized Admin accounts.
            </p>
          </blockquote>
        </div>

        <div className="signin-right">
          <div className="signin-right__content">
            <h2 className="signin-right__title">Admin Sign in</h2>
            <p className="signin-right__subtitle">
              Enter your Admin credentials to continue.
            </p>

            {error ? (
              <div className="signin-error" role="alert">
                {error}
              </div>
            ) : null}

            <form className="signin-form" onSubmit={handleSubmit}>
              <div className="signin-field">
                <label className="signin-label" htmlFor="email">
                  Email Address
                </label>
                <div className="signin-input-wrapper">
                  <FaEnvelope className="signin-input-icon" size={16} />
                  <input
                    id="email"
                    type="email"
                    className="signin-input"
                    placeholder="admin@agriprice.ph"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="signin-field">
                <label className="signin-label" htmlFor="password">
                  Password
                </label>
                <div className="signin-input-wrapper">
                  <FaLock className="signin-input-icon" size={16} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="signin-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="signin-input-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="signin-row">
                <label className="signin-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button disabled={busy} type="submit" className="signin-submit">
                {busy ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
