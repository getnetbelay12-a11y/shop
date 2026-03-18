import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { apiRequest } from "@/lib/api";
import { getLanguage, t } from "@/lib/i18n";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/auth-provider";
import { Card, EmptyState, Heading, InfoBanner, Screen, StatusPill } from "@/components/ui";

export default function OrdersScreen() {
  const { token, store } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiRequest<{ orders: any[] }>("/api/mobile/orders", {}, token || undefined)
  });
  const language = getLanguage(store?.language);
  if (isLoading) return <Screen><Text style={{ color: colors.muted }}>Loading orders...</Text></Screen>;
  return (
    <Screen>
      <FlatList
        data={data?.orders || []}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View style={{ gap: 16, marginBottom: 16 }}>
            <Heading title={t(language, "ordersTitle")} subtitle={t(language, "ordersSubtitle")} />
            <InfoBanner eyebrow="Fast fulfillment" title="Stay responsive from your phone" description="Open an order to confirm it, move it into preparation, or mark it delivered while talking to customers." />
          </View>
        }
        ListEmptyComponent={<EmptyState title="No orders yet" subtitle="Orders from your storefront will show up here." />}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: "/(app)/order/[id]", params: { id: item._id } })}>
            <Card style={{ gap: 10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <View style={{ gap: 4, flex: 1 }}>
                  <Text style={{ fontWeight: "800", fontSize: 17, color: colors.text }}>{item.name}</Text>
                  <Text style={{ color: colors.muted }}>{item.city} • Qty {item.quantity}</Text>
                </View>
                <StatusPill label={item.status} tone={item.status === "delivered" ? "success" : item.status === "canceled" ? "warning" : "neutral"} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: colors.muted }}>{item.phone}</Text>
                <Text style={{ color: colors.text, fontWeight: "800" }}>{item.total} ETB</Text>
              </View>
            </Card>
          </Pressable>
        )}
        contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
      />
    </Screen>
  );
}
