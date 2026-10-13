import { useState } from "react";
import { Bell, Eye, EyeOff } from "lucide-react";
import "../../styles/settings.css";

const TIMEOUT_KEY = "agriprice:session-timeout";
const MIN_PASSWORD_LENGTH = 8;

function readTimeout() {
  try {
    return localStorage.getItem(TIMEOUT_KEY) || "30";
  } catch {
    return "30";
  }
}

function PasswordField({ id, label, value, onChange, autoComplete }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="settings__field">
      <label className="settings__label settings__label--light" htmlFor={id}>
        {label}
      </label>
      <div className="settings__password">
        <input
          id={id}
          className="settings__input"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="settings__eye"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
        </button>
      </div>
    </div>
  );
}

export default function SystemSettings({
  municipality = "Jala-Jala, Rizal",
  dataSource = "Local application records",
  onSave,
  onChangePassword,
}) {
  const [timeout, setTimeoutValue] = useState(readTimeout);
  const [saveMessage, setSaveMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  const handleSave = () => {
    const minutes = Number(timeout);
    if (!Number.isFinite(minutes) || minutes < 1) {
      setSaveMessage("Enter a session timeout of at least 1 minute.");
      return;
    }
    try {
      localStorage.setItem(TIMEOUT_KEY, String(minutes));
    } catch {
      setSaveMessage("Could not save in this browser.");
      return;
    }
    if (onSave) onSave({ sessionTimeout: minutes });
    setSaveMessage("Configuration saved.");
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: "error", text: "Fill in all password fields." });
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordMessage({
        type: "error",
        text: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    try {
      if (onChangePassword) {
        await onChangePassword({ currentPassword, newPassword });
      }
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error && error.message ? error.message : "Could not change password.",
      });
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage({ type: "success", text: "Password changed." });
  };

  return (
    <section className="settings">
      <header className="settings__header">
        <h1 className="settings__title">System Settings</h1>
        <button type="button" className="settings__bell" aria-label="Notifications">
          <Bell size={16} strokeWidth={1.75} />
        </button>
      </header>

      <div className="settings__band">
        <p className="settings__subtitle">Configure technical system settings.</p>
      </div>

      <div className="settings__body">
        <div className="settings__card settings__card--overlap">
          <div className="settings__field">
            <label className="settings__label" htmlFor="session-timeout">
              Session timeout (minutes)
            </label>
            <input
              id="session-timeout"
              className="settings__input"
              type="number"
              min="1"
              value={timeout}
              onChange={(event) => setTimeoutValue(event.target.value)}
            />
            <p className="settings__hint">Set the preferred account session duration.</p>
          </div>

          <div className="settings__field">
            <label className="settings__label" htmlFor="study-municipality">
              Study municipality
            </label>
            <input
              id="study-municipality"
              className="settings__input settings__input--readonly"
              type="text"
              value={municipality}
              readOnly
            />
          </div>

          <div className="settings__field">
            <label className="settings__label" htmlFor="data-source">
              Data source
            </label>
            <input
              id="data-source"
              className="settings__input settings__input--readonly"
              type="text"
              value={dataSource}
              readOnly
            />
          </div>

          <button type="button" className="settings__button" onClick={handleSave}>
            Save configuration
          </button>
          {saveMessage && (
            <p className="settings__message" role="status">
              {saveMessage}
            </p>
          )}
        </div>

        <div className="settings__card">
          <h2 className="settings__card-title">Account Security</h2>

          <PasswordField
            id="current-password"
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            autoComplete="current-password"
          />
          <PasswordField
            id="new-password"
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            autoComplete="new-password"
          />
          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
          />

          <button
            type="button"
            className="settings__button settings__button--teal"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
          {passwordMessage.text && (
            <p
              className={`settings__message settings__message--${passwordMessage.type}`}
              role="status"
            >
              {passwordMessage.text}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
