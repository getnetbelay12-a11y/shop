import { useMutation, useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Share, Text, View } from "react-native";
import { apiRequest } from "@/lib/api";
import { getLanguage, t } from "@/lib/i18n";
import { buildStorefrontUrl } from "@/lib/public-site";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/auth-provider";
import { AppButton, AppInput, Card, Heading, InfoBanner, Screen, SectionTitle } from "@/components/ui";

export default function SettingsScreen() {
  const { token, user, logout, refresh } = useAuth();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiRequest<{ store: any }>("/api/mobile/settings", {}, token || undefined)
  });
  const { data: healthData } = useQuery({
    queryKey: ["health"],
    queryFn: () => apiRequest<{ services: Array<{ key: string; label: string; mode: string; summary: string }> }>("/api/health")
  });
  const store = data?.store;
  const [storeName, setStoreName] = useState(store?.storeName ?? "");
  const [slug, setSlug] = useState(store?.slug ?? "");
  const [bio, setBio] = useState(store?.bio ?? "");
  const [phone, setPhone] = useState(store?.phone ?? user?.phoneNumber ?? "");
  const [logo, setLogo] = useState(store?.logo ?? "");
  const [banner, setBanner] = useState(store?.banner ?? "");
  const [language, setLanguage] = useState(store?.language ?? "EN");
  const [message, setMessage] = useState("");
  const appLanguage = getLanguage(language);
  const mutation = useMutation({
    mutationFn: () => apiRequest("/api/mobile/settings", {
      method: "PATCH",
      body: JSON.stringify({ storeName, slug, bio, phone, logo, banner, language })
    }, token || undefined),
    onSuccess: async () => {
      setMessage("Settings saved.");
      await refresh();
    },
    onError: (error: Error) => setMessage(error.message)
  });
  const shareUrl = slug ? buildStorefrontUrl(slug) : "";

  useEffect(() => {
    if (!store) return;
    setStoreName(store.storeName ?? "");
    setSlug(store.slug ?? "");
    setBio(store.bio ?? "");
    setPhone(store.phone ?? user?.phoneNumber ?? "");
    setLogo(store.logo ?? "");
    setBanner(store.banner ?? "");
    setLanguage(store.language ?? "EN");
  }, [store, user?.phoneNumber]);

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
          <Heading title={t(appLanguage, "settingsTitle")} subtitle={t(appLanguage, "settingsSubtitle")} />
          <InfoBanner eyebrow="Store trust" title="A clean storefront converts better" description="Use a clear store name, phone number, and banner so social traffic feels confident ordering from you." />
          <Card style={{ backgroundColor: "#f6f2ea" }}>
            <SectionTitle title={t(appLanguage, "languagePreference")} subtitle="Choose the seller language used across your app experience." />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <AppButton label={t(appLanguage, "english")} onPress={() => setLanguage("EN")} variant={language === "EN" ? "secondary" : "ghost"} />
              <AppButton label={t(appLanguage, "amharic")} onPress={() => setLanguage("AM")} variant={language === "AM" ? "secondary" : "ghost"} />
            </View>
            <Text style={{ color: colors.muted, lineHeight: 21 }}>
              {language === "AM"
                ? "አማርኛ የሻጭ መተግበሪያ ጽሑፎችን እና የቅንብር ልምድን ያቀይራል።"
                : "English will be used as the default seller language across the app and settings."}
            </Text>
          </Card>
          <Card>
            <SectionTitle title={t(appLanguage, "verifiedPhone")} subtitle="This phone number is used for seller login and account identity." />
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>{user?.phoneNumber}</Text>
          </Card>
          <Card>
            <SectionTitle title={t(appLanguage, "storeProfile")} subtitle="Keep your public store details complete and consistent." />
            <AppInput label="Store name" value={storeName} onChangeText={setStoreName} />
            <AppInput label="Slug" value={slug} onChangeText={setSlug} />
            <AppInput label="Bio" value={bio} onChangeText={setBio} multiline style={{ minHeight: 120, textAlignVertical: "top" }} />
            <AppInput label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <AppInput label="Logo URL" value={logo} onChangeText={setLogo} />
            <AppInput label="Banner URL" value={banner} onChangeText={setBanner} />
            {(logo || banner) ? (
              <View style={{ flexDirection: "row", gap: 12 }}>
                {logo ? <Image source={{ uri: logo }} style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: "#efe6d8" }} /> : null}
                {banner ? <Image source={{ uri: banner }} style={{ flex: 1, height: 72, borderRadius: 20, backgroundColor: "#efe6d8" }} /> : null}
              </View>
            ) : null}
            {message ? <Text style={{ color: message === "Settings saved." ? colors.success : colors.danger }}>{message}</Text> : null}
            <AppButton label={t(appLanguage, "saveSettings")} onPress={() => mutation.mutate()} loading={mutation.isPending} />
          </Card>
          <Card style={{ backgroundColor: "#fffaf2" }}>
            <SectionTitle title={t(appLanguage, "shareYourStore")} subtitle="Promote the same storefront link everywhere your customers already follow you." />
            <Text style={{ color: colors.text, lineHeight: 22 }}>{shareUrl || "Save a slug to create your public storefront link."}</Text>
            <AppButton label="Copy store link" onPress={() => Clipboard.setStringAsync(shareUrl)} variant="secondary" />
            <AppButton label={t(appLanguage, "shareStore")} onPress={() => Share.share({ message: shareUrl })} variant="soft" />
          </Card>
          <Card>
            <SectionTitle title="Service status" subtitle="Check what is live and what is still in fallback mode before a real demo." />
            <View style={{ gap: 10 }}>
              {(healthData?.services || []).map((service) => (
                <View key={service.key} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 14, gap: 6, backgroundColor: "#fff" }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <Text style={{ color: colors.text, fontWeight: "800", flex: 1 }}>{service.label}</Text>
                    <Text style={{
                      color: service.mode === "live" ? colors.success : service.mode === "fallback" ? colors.secondary : colors.danger,
                      fontSize: 12,
                      fontWeight: "800",
                      textTransform: "uppercase"
                    }}>
                      {service.mode}
                    </Text>
                  </View>
                  <Text style={{ color: colors.muted, lineHeight: 21 }}>{service.summary}</Text>
                </View>
              ))}
            </View>
          </Card>
          <AppButton label={t(appLanguage, "logout")} onPress={logout} variant="ghost" />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
