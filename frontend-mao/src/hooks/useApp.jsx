import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const Context = createContext(null);

// Set to false to enable real authentication. Set to true for demo/bypass mode.
const TEMP_BYPASS_LOGIN = false;

const DEMO_MAO_USER = {
  id: "demo-mao",
  email: "mao@example.org",
  role: "MAO",
  status: "ACTIVE",
  firstName: "MAO",
  lastName: "Demo",
};

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (TEMP_BYPASS_LOGIN) {
      setSession(DEMO_MAO_USER);
      setAuthLoading(false);
      return;
    }

    authService
      .restore()
      .then(async (r) => {
        if (r?.user?.role !== "MAO" || r?.user?.status !== "ACTIVE") {
          await authService.logout().catch(() => {});
          setSession(null);
          return;
        }
        setSession(r.user);
      })
      .catch(() => {
        setSession(null);
      })
      .finally(() => setAuthLoading(false));

    const end = () => setSession(null);
    window.addEventListener("agriprice:session-ended", end);
    return () => window.removeEventListener("agriprice:session-ended", end);
  }, []);

  async function login(email, password, rememberMe) {
    const u = await authService.login(email, password, rememberMe);
    if (u?.role !== "MAO" || u?.status !== "ACTIVE") {
      await authService.logout().catch(() => {});
      const e = new Error("This account does not belong to the MAO portal.");
      e.response = {
        status: 403,
        data: {
          message:
            "Access denied. This portal is restricted to MAO accounts only. Normal farmer or admin accounts cannot sign in here.",
        },
      };
      throw e;
    }
    setSession(u);
    return u;
  }

  async function logout() {
    await authService.logout().catch(() => {});
    setSession(null);
  }

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  return (
    <Context.Provider
      value={{
        session,
        authLoading,
        login,
        logout,
        notify,
        t: (x) => x,
      }}
    >
      {children}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </Context.Provider>
  );
}

export const useApp = () => useContext(Context);
