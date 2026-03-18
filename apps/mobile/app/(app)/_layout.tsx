import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/auth-provider";

export default function AppLayout() {
  const { token, loading } = useAuth();

  if (loading) return null;
  if (!token) return <Redirect href="/(auth)" />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product-form" options={{ title: "Product" }} />
      <Stack.Screen name="order/[id]" options={{ title: "Order detail" }} />
    </Stack>
  );
}
