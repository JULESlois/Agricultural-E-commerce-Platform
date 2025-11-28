import React, { createContext, useContext, useEffect, useState } from 'react';
import { marketLogin, marketMe } from '../api/market';

type User = any;

type AuthCtx = {
  user: User | null;
  token: string | null;
  role: number | null;
  login: (login_identifier: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<number | null>(Number(localStorage.getItem('user_type')) || null);

  useEffect(() => {
    if (!token) return;
    marketMe().then(r => {
      setUser(r?.data || null);
    }).catch(() => {});
  }, [token]);

  const login = async (login_identifier: string, password: string) => {
    const r = await marketLogin(login_identifier, password);
    const t = (r as any)?.data?.token;
    const u = (r as any)?.data?.user || (r as any)?.data?.user_info;
    setToken(t);
    setUser(u);
    setRole(u?.user_type ?? null);
    localStorage.setItem('token', t);
    if (u?.user_type != null) localStorage.setItem('user_type', String(u.user_type));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
  };

  return <Ctx.Provider value={{ user, token, role, login, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
