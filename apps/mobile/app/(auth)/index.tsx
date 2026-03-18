import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { AppButton, AppInput, Card, Heading, InfoBanner, Screen, SectionTitle } from "@/components/ui";
import { AppLanguage, getLanguage, t } from "@/lib/i18n";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/auth-provider";

export default function PhoneEntryScreen() {
  const { requestOtp } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("+251");
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<AppLanguage>("EN");

  async function handleContinue() {
    setLoading(true);
    setError("");
    try {
      const data = await requestOtp(phoneNumber);
      if (data.devCode) setDevCode(data.devCode);
      router.push({ pathname: "/(auth)/verify", params: { phoneNumber, devCode: data.devCode || "", language } });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 24 }}>
          <View style={{ gap: 18 }}>
            <View style={{ gap: 10 }}>
              <View style={{ alignSelf: "flex-start", backgroundColor: colors.primarySoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800", letterSpacing: 0.8 }}>{t(language, "authBadge")}</Text>
              </View>
              <Heading title={t(language, "authTitle")} subtitle={t(language, "authSubtitle")} />
            </View>
            <Card style={{ gap: 18 }}>
              <View style={{ gap: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>{t(language, "languageLabel")}</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <AppButton label="EN" onPress={() => setLanguage("EN")} variant={language === "EN" ? "secondary" : "ghost"} />
                  <AppButton label="አማ" onPress={() => setLanguage("AM")} variant={language === "AM" ? "secondary" : "ghost"} />
                </View>
              </View>
              <SectionTitle title={t(language, "phoneLogin")} subtitle={t(language, "phoneLoginSubtitle")} />
              <AppInput label={t(language, "phoneNumber")} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" autoCapitalize="none" autoCorrect={false} error={error} placeholder="+251911223344" />
              <AppButton label={t(language, "sendOtp")} onPress={handleContinue} loading={loading} />
              <InfoBanner eyebrow={t(language, "demoAccess")} title={t(language, "demoReady")} description={t(language, "demoReadySubtitle")} tone="success" />
              {devCode ? <Text style={{ color: colors.success, fontWeight: "800" }}>Dev OTP: {devCode}</Text> : null}
            </Card>
            <View style={{ gap: 8, paddingHorizontal: 6 }}>
              <Text style={{ color: colors.mutedSoft, fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.7 }}>{t(language, "whatYouCanDo")}</Text>
              <Text style={{ color: colors.text, fontSize: 15, lineHeight: 22 }}>{t(language, "whatYouCanDoSubtitle")}</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
