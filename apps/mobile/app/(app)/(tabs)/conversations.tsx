import { useQuery } from "@tanstack/react-query";
import { FlatList, Text, View } from "react-native";
import { apiRequest } from "@/lib/api";
import { getLanguage, t } from "@/lib/i18n";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/auth-provider";
import { Card, EmptyState, Heading, InfoBanner, Screen, StatusPill } from "@/components/ui";

export default function ConversationsScreen() {
  const { token, store } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => apiRequest<{ conversations: any[] }>("/api/mobile/conversations", {}, token || undefined)
  });
  const language = getLanguage(store?.language);
  if (isLoading) return <Screen><Text style={{ color: colors.muted }}>Loading conversations...</Text></Screen>;
  return (
    <Screen>
      <FlatList
        data={data?.conversations || []}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View style={{ gap: 16, marginBottom: 16 }}>
            <Heading title={t(language, "conversationsTitle")} subtitle={t(language, "conversationsSubtitle")} />
            <InfoBanner eyebrow="Buyer intent" title="Use these chats to improve selling" description="Recurring questions usually show what shoppers still need: price clarity, size guidance, or cheaper alternatives." />
          </View>
        }
        ListEmptyComponent={<EmptyState title="No conversations yet" subtitle="AI and buyer conversations will appear here as visitors chat from the storefront." />}
        renderItem={({ item }) => (
          <Card style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <Text style={{ fontWeight: "800", fontSize: 17, color: colors.text, flex: 1 }}>{item.visitorName || "Anonymous shopper"}</Text>
              <StatusPill label={`${item.messages.length} msgs`} />
            </View>
            {item.messages.slice(-2).map((message: any) => (
              <View key={message._id} style={{ backgroundColor: message.role === "assistant" ? colors.primarySoft : "#f6f2ea", borderRadius: 18, padding: 12 }}>
                <Text style={{ color: colors.mutedSoft, fontSize: 12, fontWeight: "800", textTransform: "uppercase", marginBottom: 4 }}>{message.role}</Text>
                <Text style={{ color: colors.text, lineHeight: 21 }}>{message.content}</Text>
              </View>
            ))}
          </Card>
        )}
        contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
      />
    </Screen>
  );
}
