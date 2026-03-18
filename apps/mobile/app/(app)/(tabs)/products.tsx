import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { apiRequest } from "@/lib/api";
import { getLanguage, t } from "@/lib/i18n";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/auth-provider";
import { AppButton, Card, EmptyState, Heading, InfoBanner, Screen, StatusPill } from "@/components/ui";

export default function ProductsScreen() {
  const { token, store } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiRequest<{ products: any[] }>("/api/mobile/products", {}, token || undefined)
  });
  const language = getLanguage(store?.language);

  if (isLoading) return <Screen><Text style={{ color: colors.muted }}>Loading products...</Text></Screen>;

  return (
    <Screen>
      <FlatList
        data={data?.products || []}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View style={{ gap: 16, marginBottom: 16 }}>
            <Heading title={t(language, "productsTitle")} subtitle={t(language, "productsSubtitle")} />
            <InfoBanner eyebrow="Catalog quality" title="Mobile-ready product management" description="Open any product to update stock, improve descriptions with AI, or refresh pricing before you share your storefront." />
            <AppButton label={t(language, "addProduct")} onPress={() => router.push("/(app)/product-form")} />
          </View>
        }
        ListEmptyComponent={<EmptyState title="No products yet" subtitle="Add your first product to start selling from your store link." />}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: "/(app)/product-form", params: { id: item._id } })}>
            <Card style={{ gap: 14 }}>
              <View style={{ flexDirection: "row", gap: 14 }}>
                <Image
                  source={{ uri: item.images?.[0] || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80" }}
                  style={{ width: 84, height: 84, borderRadius: 20, backgroundColor: "#eee7db" }}
                />
                <View style={{ flex: 1, gap: 8 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={{ fontSize: 17, fontWeight: "800", color: colors.text }}>{item.title}</Text>
                      <Text style={{ color: colors.muted }}>{item.category} • {item.price} ETB</Text>
                    </View>
                    <StatusPill label={item.stock > 0 ? `${item.stock} in stock` : "Sold out"} tone={item.stock > 0 ? "success" : "warning"} />
                  </View>
                  <Text style={{ color: colors.muted, lineHeight: 20 }} numberOfLines={3}>{item.description}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {(item.tags || []).slice(0, 3).map((tag: string) => (
                  <View key={tag} style={{ backgroundColor: colors.primarySoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 }}>
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "700" }}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </Pressable>
        )}
        contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
