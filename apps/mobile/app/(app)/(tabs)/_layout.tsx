import { Tabs } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { colors } from "@/lib/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          height: 78,
          paddingTop: 10,
          paddingBottom: 12,
          backgroundColor: "#fffdf8",
          borderTopColor: colors.border,
          borderTopWidth: 1
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700"
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <Ionicons name="home" size={20} color={color} /> }} />
      <Tabs.Screen name="products" options={{ title: "Products", tabBarIcon: ({ color }) => <Ionicons name="cube" size={20} color={color} /> }} />
      <Tabs.Screen name="orders" options={{ title: "Orders", tabBarIcon: ({ color }) => <Ionicons name="receipt" size={20} color={color} /> }} />
      <Tabs.Screen name="conversations" options={{ title: "Chats", tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={20} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color }) => <FontAwesome5 name="store" size={18} color={color} /> }} />
    </Tabs>
  );
}
