import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  LockKeyhole,
  Bell,
  Palette,
  Languages,
  Info,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import AdminHeader from "../../components/common/AdminHeader";
import { api } from "../../services/portalAuth";

const options = [
  ["Profile Information", UserRound, "Update your account details."],
  ["Change Password", LockKeyhole, "Change your password."],
  ["Notifications", Bell, "Choose which updates you receive."],
  ["Appearance", Palette, "Choose your theme and text size."],
  ["Language", Languages, "Choose your preferred language."],
  ["About", Info, "Learn about AgriPrice."],
];

export default function SystemSettings({ initial }) {
  const [open, setOpen] = useState(initial || "");
  const [busy, setBusy] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notice, setNotice] = useState("");
  const [prefs, setPrefs] = useState({
    price: true,
    forecast: true,
    market: true,
    theme: "light",
    textSize: "standard",
    language: "English",
  });
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Load current user profile & preferences
    api
      .get("/auth/me")
      .then((res) => {
        const u = res.data?.data?.user || res.data?.data;
        if (u) {
          setForm((prev) => ({
            ...prev,
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            email: u.email || "",
          }));
        }
      })
      .catch(() => {});

    api
      .get("/users/me/preferences")
      .then((res) => {
        if (res.data?.data) {
          setPrefs((prev) => ({ ...prev, ...res.data.data }));
        }
      })
      .catch(() => {});
  }, []);

  const notify = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  };

  const set = (key, value) => setForm({ ...form, [key]: value });

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (open === "Change Password") {
        await api.post("/auth/change-password", {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        });
        sessionStorage.removeItem("agriprice_admin_access_token");
        navigate("/login");
      } else {
        await api.patch("/users/me", {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          currentPassword: form.currentPassword,
        });
        notify("Profile updated successfully.");
        setOpen("");
      }
      set("currentPassword", "");
    } catch (e) {
      const msg =
        e.response?.data?.errors?.map((x) => x.message).join(" ") ||
        e.response?.data?.message ||
        "Unable to save changes. Please try again.";
      notify(msg);
    } finally {
      setBusy(false);
    }
  }

  async function updatePref(partial) {
    const next = { ...prefs, ...partial };
    setPrefs(next);
    try {
      await api.patch("/users/me/preferences", partial);
    } catch (e) {
      notify("Failed to update preferences.");
    }
  }

  function body() {
    if (open === "Profile Information")
      return (
        <form onSubmit={save} className="admin-modal-form">
          <div className="admin-form-group">
            <label className="admin-form-label">First Name</label>
            <input
              required
              type="text"
              className="admin-form-input"
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Last Name</label>
            <input
              required
              type="text"
              className="admin-form-input"
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Email Address</label>
            <input
              required
              type="email"
              className="admin-form-input"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Current Password</label>
            <input
              required
              type="password"
              className="admin-form-input"
              value={form.currentPassword}
              onChange={(e) => set("currentPassword", e.target.value)}
              placeholder="Confirm password to apply changes"
            />
          </div>
          <div className="admin-modal__actions">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setOpen("")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="admin-btn-primary"
            >
              {busy ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </form>
      );

    if (open === "Change Password")
      return (
        <form onSubmit={save} className="admin-modal-form">
          <div className="admin-form-group">
            <label className="admin-form-label">Current Password</label>
            <div className="admin-input-with-eye">
              <input
                required
                type={showCurrent ? "text" : "password"}
                className="admin-form-input"
                value={form.currentPassword}
                onChange={(e) => set("currentPassword", e.target.value)}
              />
              <button
                type="button"
                className="admin-eye-btn"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">New Password</label>
            <div className="admin-input-with-eye">
              <input
                required
                minLength={8}
                type={showNew ? "text" : "password"}
                className="admin-form-input"
                value={form.newPassword}
                onChange={(e) => set("newPassword", e.target.value)}
              />
              <button
                type="button"
                className="admin-eye-btn"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Confirm New Password</label>
            <div className="admin-input-with-eye">
              <input
                required
                minLength={8}
                type={showConfirm ? "text" : "password"}
                className="admin-form-input"
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
              />
              <button
                type="button"
                className="admin-eye-btn"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="admin-modal__actions">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setOpen("")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="admin-btn-primary"
            >
              {busy ? "Saving…" : "Change Password"}
            </button>
          </div>
        </form>
      );

    if (open === "Notifications")
      return (
        <div className="settings-options">
          {[
            ["price", "Crop Price Updates"],
            ["forecast", "Forecast Updates"],
            ["market", "Market Information Updates"],
          ].map(([key, label]) => (
            <label
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid var(--admin-card-border)",
              }}
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={!!prefs[key]}
                onChange={(e) => updatePref({ [key]: e.target.checked })}
              />
            </label>
          ))}
        </div>
      );

    if (open === "Appearance")
      return (
        <div className="settings-options">
          {[
            ["theme", ["light", "dark", "system"]],
            ["textSize", ["small", "standard", "large"]],
          ].map(([key, values]) => (
            <fieldset
              key={key}
              style={{
                border: "none",
                padding: "8px 0",
                margin: "0 0 12px 0",
              }}
            >
              <legend style={{ fontWeight: 600, marginBottom: "8px" }}>
                {key === "theme" ? "Theme" : "Text Size"}
              </legend>
              {values.map((value) => (
                <label
                  key={value}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                  }}
                >
                  <span>{value[0].toUpperCase() + value.slice(1)}</span>
                  <input
                    type="radio"
                    name={key}
                    checked={prefs[key] === value}
                    onChange={() => updatePref({ [key]: value })}
                  />
                </label>
              ))}
            </fieldset>
          ))}
        </div>
      );

    if (open === "Language")
      return (
        <div className="settings-options">
          <p style={{ color: "var(--admin-text-muted)", fontSize: "14px" }}>
            Navigation and common field labels follow your saved language.
            Agricultural records and source notes keep their original wording.
          </p>
          {["English", "Filipino"].map((language) => (
            <label
              key={language}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid var(--admin-card-border)",
              }}
            >
              <span>{language}</span>
              <input
                type="radio"
                name="language"
                checked={prefs.language === language}
                onChange={() => updatePref({ language })}
              />
            </label>
          ))}
        </div>
      );

    return (
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <img
          className="about-logo"
          src="/images/agriprice-logo.png"
          alt="AgriPrice logo"
          style={{ width: "56px", height: "56px", margin: "0 auto 12px" }}
        />
        <h2 style={{ fontSize: "1.4rem", margin: "4px 0" }}>AgriPrice</h2>
        <p style={{ color: "var(--admin-text-muted)" }}>
          Crop Price Forecasting and Market Decision Support System.
        </p>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "13px" }}>
          Version 2.0.0
        </p>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Settings"
        subtitle="Manage your profile, password, preferences, and display settings."
      />

      {notice && (
        <div
          style={{
            padding: "12px 18px",
            marginBottom: "20px",
            borderRadius: "10px",
            backgroundColor: "var(--badge-green-bg)",
            color: "var(--badge-green-text)",
            fontWeight: 500,
          }}
        >
          {notice}
        </div>
      )}

      <div className="settings-grid">
        {options.map(([title, Icon, text]) => (
          <button
            key={title}
            className="settings-card"
            onClick={() => {
              setOpen(title);
              set("currentPassword", "");
            }}
          >
            <span className="quick-icon">
              <Icon size={21} />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
            <ChevronRight />
          </button>
        ))}
      </div>

      {open && (
        <div
          className="admin-modal-overlay"
          onClick={() => setOpen("")}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: "560px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="admin-modal__title">{open}</h2>
            {body()}
          </div>
        </div>
      )}
    </div>
  );
}
