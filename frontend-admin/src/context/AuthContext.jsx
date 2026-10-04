import { createContext, useContext, useState } from "react";

const TEMP_BYPASS_LOGIN = true;

const DEMO_ADMIN_USER = {
  id: "demo-admin",
  email: "admin@example.org",
  role: "ADMIN",
  status: "ACTIVE",
  firstName: "Admin",
  lastName: "Demo",
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(TEMP_BYPASS_LOGIN ? DEMO_ADMIN_USER : null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }

  return context;
}

export default AuthContext;
