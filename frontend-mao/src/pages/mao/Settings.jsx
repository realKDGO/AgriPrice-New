import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserRound,
  LockKeyhole,
  Bell,
  Palette,
  Languages,
  Info,
  ChevronRight,
} from "lucide-react";
import { PageHead, Field, Modal } from "../../components/common/UI";
import { useApp } from "../../hooks/useApp";
import { api, errorMessage } from "../../services/api";

const options = [
  ["Profile Information", UserRound, "Update your account details."],
  ["Change Password", LockKeyhole, "Change your password."],
  ["Notifications", Bell, "Choose which updates you receive."],
  ["Appearance", Palette, "Choose your theme and text size."],
  ["Language", Languages, "Choose your preferred language."],
  ["About", Info, "Learn about AgriPrice."],
];

export default function Settings({ initial }) {
  const { session, logout, notify, t } = useApp();
  const [open, setOpen] = useState(initial || "");
  const [busy, setBusy] = useState(false);
  const [prefs, setPrefs] = useState({
    price: true,
    forecast: true,
    market: true,
    theme: "light",
    textSize: "standard",
    language: "English",
  });
  const [form, setForm] = useState({
    firstName: session?.firstName || "",
    lastName: session?.lastName || "",
    email: session?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (session) {
      setForm((prev) => ({
        ...prev,
        firstName: session.firstName || "",
        lastName: session.lastName || "",
        email: session.email || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    api
      .get("/users/me/preferences")
      .then((res) => {
        if (res.data?.data) {
          setPrefs((prev) => ({ ...prev, ...res.data.data }));
        }
      })
      .catch(() => {});
  }, []);

  const navigate = useNavigate();
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
        await logout();
        navigate("/login");
        notify("Password changed. Please sign in again.");
      } else {
        await api.patch("/users/me", {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          currentPassword: form.currentPassword,
        });
        notify("Profile updated.");
        setOpen("");
      }
      set("currentPassword", "");
    } catch (e) {
      notify(errorMessage(e));
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
      notify(errorMessage(e));
    }
  }

  function body() {
    if (["Profile Information", "Change Password"].includes(open))
      return (
        <form onSubmit={save} className="form-stack">
          {(open === "Profile Information"
            ? [
                ["First Name", "firstName", "text"],
                ["Last Name", "lastName", "text"],
                ["Email Address", "email", "email"],
                ["Current Password", "currentPassword", "password"],
              ]
            : [
                ["Current Password", "currentPassword", "password"],
                ["New Password", "newPassword", "password"],
                ["Confirm New Password", "confirmPassword", "password"],
              ]
          ).map(([label, key, type]) => (
            <Field key={key} label={label}>
              <input
                required
                type={type}
                autoComplete={
                  type === "password"
                    ? key === "currentPassword"
                      ? "current-password"
                      : "new-password"
                    : undefined
                }
                minLength={key === "newPassword" ? 8 : undefined}
                maxLength={type === "password" ? 72 : 254}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            </Field>
          ))}
          <button disabled={busy} className="button">
            {busy
              ? "Saving…"
              : open === "Change Password"
                ? "Change Password"
                : "Save Profile"}
          </button>
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
            <label key={key}>
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
            <fieldset key={key}>
              <legend>{key === "theme" ? "Theme" : "Text Size"}</legend>
              {values.map((value) => (
                <label key={value}>
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
          <p>
            Navigation and common field labels follow your saved language.
            Agricultural records and source notes keep their original wording.
          </p>
          {["English", "Filipino"].map((language) => (
            <label key={language}>
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
      <>
        <img
          className="about-logo"
          src="/images/agriprice-logo.png"
          alt="AgriPrice logo"
        />
        <h2>AgriPrice</h2>
        <p>Crop Price Forecasting and Market Decision Support System.</p>
        <p>Version 2.0.0</p>
        <p>
          <Link to="/privacy-policy">Privacy Policy</Link> ·{" "}
          <Link to="/terms">Terms</Link> ·{" "}
          <Link to="/cookie-policy">Cookie Policy</Link>
        </p>
      </>
    );
  }

  return (
    <div style={{ maxWidth: "1200px" }}>
      <PageHead title="Settings" />
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
              <strong>{t(title)}</strong>
              <small>{text}</small>
            </span>
            <ChevronRight />
          </button>
        ))}
      </div>
      {open && (
        <Modal title={open} onClose={() => setOpen("")}>
          {body()}
        </Modal>
      )}
    </div>
  );
}
