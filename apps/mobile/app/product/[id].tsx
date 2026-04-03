import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Image, ScrollView, Text, View } from "react-native";
import { apiRequest } from "@/lib/api";
import { AppButton, AppInput, Card, Heading, Screen } from "@/components/ui";
import { colors } from "@/lib/theme";

export default function ProductDetailScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("I want this item.");
  const { data } = useQuery({
    queryKey: ["public-product", id],
    queryFn: () => apiRequest<any>(`/api/public/products/${id}`),
    enabled: Boolean(id)
  });
  const mutation = useMutation({
    mutationFn: () => apiRequest("/api/requests", {
      method: "POST",
      body: JSON.stringify({
        productId: id,
        storeSlug: data.product.storeSlug,
        customerPhone: phone,
        customerName: name,
        note,
        source: "mobile"
      })
    })
  });

  const product = data?.product;
  const similar = data?.similar || [];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
        <Heading title={product?.title || "Product"} subtitle={product?.storeName || "Loading product..."} />
        <Card style={{ padding: 12 }}>
          {product?.images?.[0] ? (
            <Image source={{ uri: product.images[0] }} style={{ width: "100%", height: 320, borderRadius: 22, backgroundColor: "#efe6d8" }} resizeMode="cover" />
          ) : null}
          <Text style={{ color: colors.primary, fontSize: 28, fontWeight: "800" }}>{product ? `ETB ${product.price.toLocaleString()}` : ""}</Text>
          <Text style={{ color: colors.text, lineHeight: 24 }}>{product?.description}</Text>
        </Card>
        <Card>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>Buy / Request item</Text>
          <Text style={{ color: colors.muted, lineHeight: 22 }}>Only your phone number is required. The seller will contact you soon.</Text>
          <AppInput label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <AppInput label="Name (optional)" value={name} onChangeText={setName} />
          <AppInput label="Note (optional)" value={note} onChangeText={setNote} multiline style={{ minHeight: 100, textAlignVertical: "top" }} />
          <AppButton label={mutation.isPending ? "Sending..." : "Send request"} onPress={() => mutation.mutate()} loading={mutation.isPending} />
          {mutation.isSuccess ? <Text style={{ color: colors.success }}>Your request was sent to the seller.</Text> : null}
          {mutation.isError ? <Text style={{ color: colors.danger }}>{(mutation.error as Error).message}</Text> : null}
        </Card>
        {!!similar.length && (
          <Card>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>Related items</Text>
            <View style={{ gap: 12 }}>
              {similar.slice(0, 4).map((item: any) => (
                <View key={item._id} style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "800" }}>{item.title}</Text>
                    <Text style={{ color: colors.muted }}>{`ETB ${item.price.toLocaleString()}`}</Text>
                  </View>
                  <AppButton label="Open" onPress={() => router.push(`/product/${item._id}`)} variant="ghost" />
                </View>
              ))}
            </View>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}
