import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { clearAuth, getStoredUser, getToken, setAuth } from './storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getToken());

  useEffect(() => {
    const t = getToken();
    const u = getStoredUser();
    setToken(t);
    setUser(u);
  }, []);

  const login = useCallback((auth) => {
    setAuth(auth.token, {
      email: auth.email,
      name: auth.name,
      userId: auth.userId,
    });
    setToken(auth.token);
    setUser({ email: auth.email, name: auth.name, userId: auth.userId });
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
