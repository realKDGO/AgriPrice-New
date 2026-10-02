import { translate } from "../context/translations";
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { cropService } from "../services/cropService";
import { marketService } from "../services/marketService";
import { notificationService } from "../services/notificationService";
import { errorMessage } from "../services/api";
const Context = createContext(null);
const empty = {
  crops: [],
  markets: [],
  settings: { preferences: {}, textSize: "standard" },
};
const title = (s) => (s ? s[0] + s.slice(1).toLowerCase() : s);
export const adapt = (r) => ({
  ...r,
  status: title(r.status),
  image: r.imageUrl,
  price: r.price !== undefined ? Number(r.price) : undefined,
  previous: Number(r.previousPrice),
  date: r.date?.slice(0, 10),
});
export function AppProvider({ children }) {
  const [session, setSession] = useState(null),
    [authLoading, setAuthLoading] = useState(true),
    [data, setData] = useState(empty),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [toast, setToast] = useState(""),
    [unread, setUnread] = useState(0);
  useEffect(() => {
    authService
      .restore()
      .then(async (r) => {
        if (r.user?.role !== "FARMER") {
          await authService.logout().catch(() => { });
          setSession(null);
          return;
        }
        setSession(r.user);
      })
      .catch(() => { })
      .finally(() => setAuthLoading(false));
    const end = () => {
      setSession(null);
      setData(empty);
    };
    window.addEventListener("agriprice:session-ended", end);
    return () => window.removeEventListener("agriprice:session-ended", end);
  }, []);
  async function reload() {
    if (!session) return;
    setLoading(true);
    setError("");
    try {
      const [prefs, crops, markets, count] = await Promise.all([
        userService.preferences(),
        session.role === "ADMIN"
          ? Promise.resolve({ items: [] })
          : cropService.list({ limit: 100 }),
        session.role === "ADMIN"
          ? Promise.resolve({ items: [] })
          : marketService.list({ limit: 100 }),
        notificationService.count(),
      ]);
      setData({
        crops: crops.items.map(adapt),
        markets: markets.items.map(adapt),
        settings: {
          preferences: prefs,
          textSize: prefs.textSize,
          defaultCrop: prefs.defaultCrop || crops.items[0]?.id,
        },
      });
      setUnread(count.count);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (session) reload();
    else setData(empty);
  }, [session?.id]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    const p = data.settings.preferences;
    document.documentElement.style.fontSize =
      p.textSize === "large"
        ? "18px"
        : p.textSize === "small"
          ? "15px"
          : "16px";
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () =>
    (document.documentElement.dataset.theme =
      p.theme === "dark" || (p.theme === "system" && media.matches)
        ? "dark"
        : "light");
    update();
    media.addEventListener("change", update);
    document.documentElement.lang = p.language === "Filipino" ? "fil" : "en";
    return () => media.removeEventListener("change", update);
  }, [data.settings.preferences]);
  async function login(email, password, rememberMe) {
    const u = await authService.login(email, password, rememberMe);
    if (u?.role !== "FARMER") {
      await authService.logout().catch(() => { });
      const error = new Error("This account does not belong to the Farmer portal.");
      error.response = {
        status: 403,
        data: { message: "This account belongs to a different AgriPrice portal. Use the correct portal to sign in." },
      };
      throw error;
    }
    setSession(u);
    return u;
  }
  async function register(body) {
    const u = await authService.register(body);
    setSession(u);
    return u;
  }
  async function logout() {
    try {
      await authService.logout();
      setSession(null);
      setData(empty);
    } catch (e) {
      setToast(errorMessage(e));
      throw e;
    }
  }
  async function preferences(values) {
    const p = await userService.savePreferences(values);
    setData((d) => ({
      ...d,
      settings: {
        ...d.settings,
        preferences: p,
        textSize: p.textSize,
        defaultCrop: p.defaultCrop || d.crops[0]?.id,
      },
    }));
  }
  const value = {
    t: (text) => translate(data.settings.preferences.language, text),
    session,
    authLoading,
    data,
    loading,
    error,
    reload,
    login,
    register,
    logout,
    notify: setToast,
    preferences,
    setSession,
    unread,
    refreshUnread: async () =>
      setUnread((await notificationService.count()).count),
  };
  return (
    <Context.Provider value={value}>
      {children}
      {toast && (
        <div className="toast" role="status" aria-live="polite" aria-atomic="true">
          {toast}
        </div>
      )}
    </Context.Provider>
  );
}
export const useApp = () => useContext(Context);
