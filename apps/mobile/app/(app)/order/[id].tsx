import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { apiRequest } from "@/lib/api";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/auth-provider";
import { AppButton, Card, Heading, InfoBanner, Screen, SectionTitle, StatusPill } from "@/components/ui";

const statuses = ["new", "confirmed", "preparing", "delivered", "canceled"];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const { data, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: () => apiRequest<{ order: any }>(`/api/mobile/orders/${id}`, {}, token || undefined)
  });
  const mutation = useMutation({
    mutationFn: (status: string) => apiRequest(`/api/mobile/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }, token || undefined),
    onSuccess: () => refetch()
  });
  const order = data?.order;
  if (!order) return <Screen><Text style={{ color: colors.muted }}>Loading order...</Text></Screen>;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
        <Heading title={order.name} subtitle={`${order.phone} • ${order.city}`} />
        <InfoBanner eyebrow="Order summary" title={`${order.total} ETB total`} description={`Buyer requested quantity ${order.quantity}. Keep the status updated so your demo flow feels reliable and organized.`} />
        <Card>
          <SectionTitle title="Delivery details" subtitle="Reference this before confirming or dispatching the order." />
          <Text style={{ fontWeight: "800", color: colors.text }}>Delivery address</Text>
          <Text style={{ color: colors.muted, lineHeight: 22 }}>{order.address}</Text>
          <Text style={{ fontWeight: "800", color: colors.text }}>Order total</Text>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}>{order.total} ETB</Text>
          <StatusPill label={order.status} tone={order.status === "delivered" ? "success" : order.status === "canceled" ? "warning" : "neutral"} />
        </Card>
        <Card>
          <SectionTitle title="Update status" subtitle="Choose the current order stage. The latest state is shown to your team and in analytics." />
          <View style={{ gap: 10 }}>
            {statuses.map((status) => (
              <AppButton key={status} label={`Mark as ${status}`} onPress={() => mutation.mutate(status)} variant={order.status === status ? "secondary" : "ghost"} loading={mutation.isPending && mutation.variables === status} />
            ))}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}
