import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  LogOut,
  UserRound,
  LockKeyhole,
  Bell,
  Palette,
  Languages,
  Info,
} from "lucide-react";
import { PageHead, Panel, Field, Modal } from "../../components/common/UI";
import { QueryState, Pagination } from "../../components/common/Async";
import { toolsNav } from "../../routes/navigation";
import { useApp } from "../../hooks/useApp";
import { useQuery } from "../../hooks/useQuery";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import { notificationService } from "../../services/notificationService";
import { errorMessage } from "../../services/api";
export function More() {
  const { logout } = useApp();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <PageHead title="More" />
      <Panel>
        {[
          ...toolsNav,
          ["settings", "Settings", Palette],
          ["notifications", "Notifications", Bell],
        ].map(([path, label, Icon]) => (
          <Link key={path} className="menu-row" to={`/farmer/${path}`}>
            <Icon size={20} />
            <span>{label}</span>
            <ChevronRight />
          </Link>
        ))}
      </Panel>
      <button className="button secondary" onClick={() => setConfirm(true)}>
        <LogOut size={18} />
        Sign Out
      </button>
      {confirm && (
        <Modal title="Sign out of AgriPrice?" onClose={() => setConfirm(false)}>
          <p>You will need to sign in again to access your dashboard.</p>
          <button
            className="button"
            onClick={async () => {
              try {
                await logout();
                navigate("/");
              } catch {}
            }}
          >
            Sign Out
          </button>
        </Modal>
      )}
    </>
  );
}
const options = [
  ["Profile Information", UserRound, "Update your account details."],
  ["Change Password", LockKeyhole, "Change your password."],
  ["Notifications", Bell, "Choose which updates you receive."],
  ["Appearance", Palette, "Choose your theme and text size."],
  ["Language", Languages, "Choose your preferred language."],
  ["About", Info, "Learn about AgriPrice."],
];
export function Settings({ initial }) {
  const { session, data, preferences, setSession, notify, t } = useApp();
  const [open, setOpen] = useState(initial || ""),
    [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    firstName: session.firstName,
    lastName: session.lastName,
    email: session.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const p = data.settings.preferences;
  const set = (key, value) => setForm({ ...form, [key]: value });
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (open === "Change Password") {
        await authService.changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        });
        setSession(null);
        navigate("/login");
        notify("Password changed. Please sign in again.");
      } else {
        const u = await userService.profile({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          currentPassword: form.currentPassword,
        });
        setSession(u);
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
  async function pref(value) {
    try {
      await preferences(value);
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
                checked={!!p[key]}
                onChange={(e) => pref({ [key]: e.target.checked })}
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
                    checked={p[key] === value}
                    onChange={() => pref({ [key]: value })}
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
                checked={p.language === language}
                onChange={() => pref({ language })}
              />
            </label>
          ))}
        </div>
      );
    return (
      <>
        <img
          className="about-logo"
          src="/images/agriprice-white.png"
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
    <>
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
    </>
  );
}
export function Profile() {
  return <Settings initial="Profile Information" />;
}
export function Help() {
  return <Settings initial="About" />;
}
export function Notifications() {
  const [page, setPage] = useState(1);
  const { notify, refreshUnread } = useApp();
  const query = useQuery(
    () => notificationService.list({ page, limit: 25 }),
    [page],
  );
  async function read(id) {
    try {
      if (id) await notificationService.read(id);
      else await notificationService.readAll();
      query.reload();
      await refreshUnread();
    } catch (e) {
      notify(errorMessage(e));
    }
  }
  return (
    <>
      <PageHead
        title="Notifications"
        action={
          <button className="button secondary" onClick={() => read()}>
            Mark All as Read
          </button>
        }
      />
      <QueryState query={query}>
        <Panel>
          {query.data?.items.length ? (
            query.data.items.map((item) => (
              <button
                key={item.id}
                className={`notification-row ${item.isRead ? "" : "unread"}`}
                onClick={() => read(item.id)}
              >
                <Bell size={19} />
                <span>
                  <strong>
                    {item.title}
                    {!item.isRead ? " · Unread" : ""}
                  </strong>
                  <small>{item.message}</small>
                </span>
                <time>{new Date(item.createdAt).toLocaleDateString()}</time>
              </button>
            ))
          ) : (
            <p>No notifications yet.</p>
          )}
        </Panel>
        <Pagination data={query.data} onPage={setPage} />
      </QueryState>
    </>
  );
}
