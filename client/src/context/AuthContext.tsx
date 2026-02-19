import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "VENDOR" | "CUSTOMER";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "VENDOR" | "CUSTOMER",
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { access_token, user: userData } = response.data;

    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setToken(access_token);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "VENDOR" | "CUSTOMER",
  ) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    const { access_token, user: userData } = response.data;

    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setToken(access_token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
