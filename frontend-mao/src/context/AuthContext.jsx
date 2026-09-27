import { createContext, useContext, useState } from 'react';

/**
 * AuthContext — Manages authentication state globally.
 *
 * Usage (in any child component):
 *   const { user, login, logout } = useAuth();
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = not logged in

  /** Call this after a successful login API response */
  const login = (userData) => {
    setUser(userData);
    // TODO: persist token to localStorage
  };

  /** Clear session on logout */
  const logout = () => {
    setUser(null);
    // TODO: remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Convenience hook — use inside any component */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
}

export default AuthContext;
