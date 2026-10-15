import { translate } from "../context/translations";
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { cropService } from "../services/cropService";
import { marketService } from "../services/marketService";
import { notificationService } from "../services/notificationService";
import { errorMessage } from "../services/api";
const Context = createContext(null);
const defaultFarmerSession = {
  id: "presentation-farmer-id",
  email: "farmer@example.org",
  firstName: "Farmer",
  lastName: "Juan",
  name: "Farmer Juan",
  role: "FARMER",
  status: "ACTIVE",
};
const empty = {
  crops: [],
  markets: [],
  settings: {
    preferences: { userId: defaultFarmerSession.id },
    textSize: "standard",
  },
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
      .then((r) => {
        if (r.user && r.user.status === "ACTIVE") {
          setSession(r.user);
        } else {
          setSession(null);
        }
      })
      .catch(() => {
        setSession(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);
  async function reload() {
    if (!session) return;
    setLoading(true);
    setError("");
    try {
      const [prefs, crops, markets, count] = await Promise.all([
        userService
          .preferences()
          .catch(() => ({ preferences: {}, textSize: "standard", userId: session.id })),
        session.role === "ADMIN"
          ? Promise.resolve({ items: [] })
          : cropService.list({ limit: 100 }).catch(() => ({ items: [] })),
        session.role === "ADMIN"
          ? Promise.resolve({ items: [] })
          : marketService.list({ limit: 100 }).catch(() => ({ items: [] })),
        notificationService.count().catch(() => ({ count: 0 })),
      ]);
      const cropList = crops?.items || [];
      const marketList = markets?.items || [];
      setData({
        crops: cropList.map(adapt),
        markets: marketList.map(adapt),
        settings: {
          preferences: prefs || { userId: session.id },
          textSize: prefs?.textSize || "standard",
          defaultCrop: prefs?.defaultCrop || cropList[0]?.id,
        },
      });
      setUnread(count?.count || 0);
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
  async function login(email, password, rememberMe, expectedRole = "FARMER") {
    const u = await authService.login(email, password, rememberMe);
    if (expectedRole && u?.role !== expectedRole) {
      await authService.logout().catch(() => {});
      const error = new Error(
        `This account does not belong to the ${expectedRole} portal.`
      );
      error.response = {
        status: 403,
        data: {
          message: `This account has the ${u?.role || "different"} role. Please use your role's dedicated portal.`,
        },
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
      await authService.logout().catch(() => {});
      setSession(null);
    } catch (e) {
      setToast(errorMessage(e));
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
  async function bypass(role = "FARMER") {
    const u = await authService.bypass(role);
    setSession(u);
    return u;
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
    bypass,
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
