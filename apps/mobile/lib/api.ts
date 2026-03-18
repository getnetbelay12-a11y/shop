import { Platform } from "react-native";

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

const apiBaseUrl =
  configuredBaseUrl ||
  (Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000");

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", headers.get("Content-Type") || "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data as T;
}

export { apiBaseUrl };
