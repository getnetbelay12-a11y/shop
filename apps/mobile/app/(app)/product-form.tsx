import { useMutation, useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { apiRequest } from "@/lib/api";
import { getLanguage, t } from "@/lib/i18n";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/auth-provider";
import { AppButton, AppInput, Card, Heading, InfoBanner, Screen, SectionTitle } from "@/components/ui";

export default function ProductFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { token, store } = useAuth();
  const editing = Boolean(id);
  const { data } = useQuery({
    queryKey: ["product", id],
    queryFn: () => apiRequest<{ product: any }>(`/api/mobile/products/${id}`, {}, token || undefined),
    enabled: editing
  });
  const existing = data?.product;
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [price, setPrice] = useState(existing?.price ? String(existing.price) : "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [stock, setStock] = useState(existing?.stock ? String(existing.stock) : "");
  const [tags, setTags] = useState(existing?.tags?.join(", ") ?? "");
  const [images, setImages] = useState(existing?.images?.join(", ") ?? "");
  const [attributes, setAttributes] = useState(existing?.attributes ? Object.entries(existing.attributes).map(([k, v]) => `${k}:${v}`).join(", ") : "");
  const [message, setMessage] = useState("");
  const language = getLanguage(store?.language);

  useEffect(() => {
    if (!existing) return;
    setTitle(existing.title ?? "");
    setDescription(existing.description ?? "");
    setPrice(existing.price ? String(existing.price) : "");
    setCategory(existing.category ?? "");
    setStock(existing.stock ? String(existing.stock) : "");
    setTags(existing.tags?.join(", ") ?? "");
    setImages(existing.images?.join(", ") ?? "");
    setAttributes(existing.attributes ? Object.entries(existing.attributes).map(([k, v]) => `${k}:${v}`).join(", ") : "");
  }, [existing]);
  const mutation = useMutation({
    mutationFn: (payload: any) =>
      apiRequest(editing ? `/api/mobile/products/${id}` : "/api/mobile/products", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload)
      }, token || undefined),
    onSuccess: () => router.replace("/(app)/(tabs)/products"),
    onError: (error: Error) => setMessage(error.message)
  });

  const aiMutation = useMutation({
    mutationFn: ({ type }: { type: "rewrite" | "bilingual" | "tags" }) =>
      apiRequest<{ result: any }>("/api/mobile/ai/product", {
        method: "POST",
        body: JSON.stringify({ type, title, description })
      }, token || undefined)
  });

  async function pickAndUpload() {
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8, base64: true });
    if (picked.canceled || !picked.assets[0]?.base64) return;
    try {
      const upload = await apiRequest<{ url: string }>("/api/uploads/image", {
        method: "POST",
        body: JSON.stringify({
          fileName: picked.assets[0].fileName || `shop-${Date.now()}.jpg`,
          dataUri: `data:image/jpeg;base64,${picked.assets[0].base64}`
        })
      }, token || undefined);
      setImages((current: string) => current ? `${current}, ${upload.url}` : upload.url);
    } catch (error) {
      Alert.alert("Upload unavailable", error instanceof Error ? error.message : "Use an image URL instead.");
    }
  }

  function payload() {
    return {
      title,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      tags: tags.split(",").map((item: string) => item.trim()).filter(Boolean),
      images: images.split(",").map((item: string) => item.trim()).filter(Boolean),
      attributes: Object.fromEntries(attributes.split(",").map((pair: string) => pair.trim()).filter(Boolean).map((pair: string) => {
        const [key, value] = pair.split(":").map((item: string) => item.trim());
        return [key, value];
      }).filter(([key, value]) => key && value))
    };
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
          <Heading title={editing ? t(language, "editProduct") : t(language, "newProduct")} subtitle={t(language, "productFormSubtitle")} />
          <InfoBanner eyebrow="Product quality" title="Make listings easier to trust" description="Clear titles, useful descriptions, and realistic pricing help sellers convert more buyers from social traffic." />
          <Card>
            <SectionTitle title="Core details" subtitle="Start with the basics customers notice first." />
            <AppInput label="Title" value={title} onChangeText={setTitle} />
            <AppInput label="Description" value={description} onChangeText={setDescription} multiline style={{ minHeight: 120, textAlignVertical: "top" }} />
            <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
              <AppButton label="Rewrite" onPress={async () => {
                const result = await aiMutation.mutateAsync({ type: "rewrite" });
                setDescription(result.result);
              }} variant="soft" />
              <AppButton label="Bilingual" onPress={async () => {
                const result = await aiMutation.mutateAsync({ type: "bilingual" });
                setDescription(result.result.descriptionEn);
              }} variant="soft" />
              <AppButton label="Tags" onPress={async () => {
                const result = await aiMutation.mutateAsync({ type: "tags" });
                setTags(result.result.join(", "));
              }} variant="soft" />
            </View>
            <AppInput label="Price (ETB)" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <AppInput label="Category" value={category} onChangeText={setCategory} />
            <AppInput label="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
            <AppInput label="Tags" value={tags} onChangeText={setTags} />
          </Card>
          <Card>
            <SectionTitle title="Images and variants" subtitle="Upload a photo or paste image URLs, then add color and size attributes." />
            {images ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {images.split(",").map((item: string) => item.trim()).filter(Boolean).slice(0, 4).map((imageUrl: string) => (
                  <Image key={imageUrl} source={{ uri: imageUrl }} style={{ width: 96, height: 96, borderRadius: 20, backgroundColor: "#efe9db" }} />
                ))}
              </ScrollView>
            ) : null}
            <AppInput label="Images" value={images} onChangeText={setImages} multiline style={{ minHeight: 90, textAlignVertical: "top" }} />
            <AppButton label="Pick image and upload" onPress={pickAndUpload} variant="secondary" />
            <AppInput label="Colors and sizes" value={attributes} onChangeText={setAttributes} placeholder="color:black, size:M" />
          </Card>
          <Card>
            <SectionTitle title="Save changes" subtitle="Review your details and publish them to your storefront." />
            {message ? <Text style={{ color: message.includes("saved") ? colors.success : colors.danger }}>{message}</Text> : null}
            <AppButton label={editing ? "Save changes" : "Create product"} onPress={() => mutation.mutate(payload())} loading={mutation.isPending} />
            {editing ? <AppButton label="Delete product" onPress={async () => {
              await apiRequest(`/api/mobile/products/${id}`, { method: "DELETE" }, token || undefined);
              router.replace("/(app)/(tabs)/products");
            }} variant="danger" /> : null}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
