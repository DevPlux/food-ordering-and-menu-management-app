// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from "../api/axiosClient";

export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MIN_SPLASH_MS = 1400;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const startedAt = Date.now();
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("user"),
        ]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.log("Auth bootstrap error", e);
      } finally {
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);
        setTimeout(() => setInitializing(false), remaining);
      }
    };
    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axiosClient.post("/auth/login", { email, password });
    const { token: t, user: u } = res.data;
    await AsyncStorage.setItem("token", t);
    await AsyncStorage.setItem("user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await axiosClient.post("/auth/register", {
      name,
      email,
      password,
    });
    const { token: t, user: u } = res.data;
    await AsyncStorage.setItem("token", t);
    await AsyncStorage.setItem("user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, initializing, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
