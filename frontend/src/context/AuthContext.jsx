// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin, getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin')); } catch { return null; }
  });

  const signIn = useCallback(async (username, password) => {
    const res = await apiLogin({ username, password });
    const { token, admin: user } = res.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(user));
    setAdmin(user);
    return user;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, signIn, signOut, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
