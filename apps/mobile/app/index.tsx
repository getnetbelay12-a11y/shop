import { Redirect } from "expo-router";
import { useAuth } from "@/providers/auth-provider";

export default function IndexPage() {
  const { token, loading } = useAuth();
  if (loading) return null;
  return <Redirect href={token ? "/(app)/(tabs)" : "/(auth)"} />;
}
