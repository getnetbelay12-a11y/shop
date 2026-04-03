import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { apiRequest } from "@/lib/api";
import { AppButton, AppInput, Card, Heading, Screen } from "@/components/ui";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/auth-provider";

type PublicProduct = {
  _id: string;
  title: string;
  price: number;
  category: string;
  images?: string[];
  storeName: string;
  storeSlug: string;
};

export default function IndexPage() {
  const { token, loading } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["public-products", query, category],
    queryFn: () => apiRequest<{ products: PublicProduct[]; categories: string[] }>(
      `/api/public/products?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`
    )
  });

  if (loading) return null;
  if (token) return <Redirect href="/(app)/(tabs)" />;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 40 }}>
        <Heading title="Products first" subtitle="Browse, search, and open items immediately. Ask for contact only when buying." />
        <Card>
          <AppInput value={query} onChangeText={setQuery} placeholder="Search products, category, tags..." />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            <AppButton label="All" onPress={() => setCategory("")} variant={category ? "ghost" : "secondary"} />
            {(data?.categories || []).slice(0, 8).map((item) => (
              <AppButton
                key={item}
                label={item}
                onPress={() => setCategory(item)}
                variant={category === item ? "secondary" : "ghost"}
              />
            ))}
          </ScrollView>
        </Card>
        {isLoading ? (
          <Card>
            <Text style={{ color: colors.muted }}>Loading products...</Text>
          </Card>
        ) : null}
        {(data?.products || []).map((product) => (
          <Card key={product._id} style={{ padding: 14 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              {product.images?.[0] ? (
                <Image source={{ uri: product.images[0] }} style={{ width: 116, height: 116, borderRadius: 20, backgroundColor: "#efe6d8" }} resizeMode="cover" />
              ) : (
                <View style={{ width: 116, height: 116, borderRadius: 20, backgroundColor: "#efe6d8", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: colors.muted }}>No image</Text>
                </View>
              )}
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={{ color: colors.mutedSoft, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.6 }}>
                  {product.storeName}
                </Text>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800", lineHeight: 21 }}>{product.title}</Text>
                <Text style={{ color: colors.muted, fontSize: 13 }}>{product.category}</Text>
                <Text style={{ color: colors.primary, fontSize: 20, fontWeight: "800" }}>{`ETB ${product.price.toLocaleString()}`}</Text>
                <AppButton label="Buy" onPress={() => router.push(`/product/${product._id}`)} />
              </View>
            </View>
          </Card>
        ))}
        <Card style={{ backgroundColor: "#fffaf2" }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: colors.text }}>Seller sign-in</Text>
          <Text style={{ color: colors.muted, lineHeight: 22 }}>Sellers can still sign in with phone OTP to manage products and requests.</Text>
          <AppButton label="Go to seller login" onPress={() => router.push("/(auth)")} variant="soft" />
        </Card>
      </ScrollView>
    </Screen>
  );
}
