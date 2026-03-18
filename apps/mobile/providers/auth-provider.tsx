"use client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { apiRequest } from "@/lib/api";

type AuthContextValue = {
  token: string | null;
  user: any;
  store: any;
  loading: boolean;
  requestOtp: (phoneNumber: string) => Promise<{ devCode?: string }>;
  verifyOtp: (phoneNumber: string, otpCode: string) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "shop-mobile-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function refresh(nextToken = token) {
    if (!nextToken) {
      setUser(null);
      setStore(null);
      return;
    }
    const data = await apiRequest<{ user: any; store: any }>("/api/mobile/me", {}, nextToken);
    setUser(data.user);
    setStore(data.store);
  }

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(async (saved) => {
      if (saved) {
        setToken(saved);
        try {
          await refresh(saved);
        } catch {
          await AsyncStorage.removeItem(STORAGE_KEY);
          setToken(null);
        }
      }
      setLoading(false);
    });
  }, []);

  async function requestOtp(phoneNumber: string) {
    const data = await apiRequest<{ devCode?: string }>("/api/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, purpose: "seller_login" })
    });
    return data;
  }

  async function verifyOtp(phoneNumber: string, otpCode: string) {
    const data = await apiRequest<{ mobileToken: string }>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, otpCode, purpose: "seller_login" })
    });
    await AsyncStorage.setItem(STORAGE_KEY, data.mobileToken);
    setToken(data.mobileToken);
    await refresh(data.mobileToken);
  }

  async function logout() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
    setStore(null);
    router.replace("/(auth)");
  }

  const value = useMemo<AuthContextValue>(() => ({
    token,
    user,
    store,
    loading,
    requestOtp,
    verifyOtp,
    refresh: () => refresh(),
    logout
  }), [token, user, store, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
