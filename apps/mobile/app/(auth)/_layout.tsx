import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/auth-provider";

export default function AuthLayout() {
  const { token, loading } = useAuth();

  if (loading) return null;
  if (token) return <Redirect href="/(app)/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
