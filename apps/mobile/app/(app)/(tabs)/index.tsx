import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { Share, ScrollView, Text, View } from "react-native";
import { apiBaseUrl, apiRequest } from "@/lib/api";
import { getLanguage, t } from "@/lib/i18n";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/auth-provider";
import { AppButton, Card, Heading, InfoBanner, Screen, SectionTitle } from "@/components/ui";

export default function DashboardScreen() {
  const { token, store } = useAuth();
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiRequest<{ metrics: any }>("/api/mobile/dashboard", {}, token || undefined)
  });
  const metrics = data?.metrics;
  const storeLink = store?.slug ? `${apiBaseUrl}/shop/${store.slug}` : "";
  const language = getLanguage(store?.language);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.mutedSoft, fontSize: 12, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" }}>
            {store?.storeName || "Your shop"}
          </Text>
          <Heading title={t(language, "dashboardTitle")} subtitle={t(language, "dashboardSubtitle")} />
        </View>
        <InfoBanner
          eyebrow="Share and sell"
          title={storeLink ? "Your storefront is ready to share" : "Complete store settings to unlock your link"}
          description={storeLink ? `Use this link in TikTok, Telegram, and Instagram: ${storeLink}` : "Add your store details and slug from Settings to create a live storefront link."}
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }}>
          {[
            ["Products", metrics?.products ?? 0],
            ["New orders", metrics?.orders ?? 0],
            ["Low stock", metrics?.lowStock ?? 0],
            ["Chats", metrics?.conversations ?? 0]
          ].map(([label, value]) => (
            <Card key={label} style={{ width: "48%", gap: 8, paddingVertical: 20 }}>
              <Text style={{ fontSize: 13, color: colors.muted, fontWeight: "700" }}>{label}</Text>
              <Text style={{ fontSize: 30, fontWeight: "800", color: colors.text }}>{value}</Text>
              <Text style={{ color: colors.muted, lineHeight: 20 }}>
                {label === "Low stock" ? "Needs restock attention soon" : label === "Chats" ? "Recent shopper questions" : `Live ${label.toLowerCase()} view`}
              </Text>
            </Card>
          ))}
        </View>
        <Card>
          <SectionTitle title={t(language, "quickActions")} subtitle={t(language, "quickActionsSubtitle")} />
          <View style={{ gap: 10 }}>
            <AppButton label={t(language, "addProduct")} onPress={() => router.push("/(app)/product-form")} />
            <AppButton label={t(language, "viewOrders")} onPress={() => router.push("/(app)/(tabs)/orders")} variant="secondary" />
            <AppButton label={t(language, "shareStore")} onPress={() => Share.share({ message: storeLink || "Set up your shop first." })} variant="soft" />
          </View>
        </Card>
        <Card style={{ backgroundColor: "#fffaf2" }}>
          <SectionTitle title="Share your storefront" subtitle="Copy or send your shop link straight from your phone." />
          <Text style={{ color: colors.text, lineHeight: 22 }}>{storeLink || "Complete onboarding to get your public store link."}</Text>
          <View style={{ gap: 10 }}>
            <AppButton label="Copy store link" onPress={() => Clipboard.setStringAsync(storeLink)} variant="secondary" />
            <AppButton label="Open settings" onPress={() => router.push("/(app)/(tabs)/settings")} variant="ghost" />
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}
