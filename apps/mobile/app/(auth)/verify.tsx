import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { AppButton, AppInput, Card, Heading, InfoBanner, Screen, SectionTitle } from "@/components/ui";
import { getLanguage, t } from "@/lib/i18n";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/auth-provider";

export default function VerifyScreen() {
  const { phoneNumber = "", devCode = "", language: languageParam = "EN" } = useLocalSearchParams<{ phoneNumber: string; devCode: string; language: string }>();
  const { verifyOtp, requestOtp } = useAuth();
  const [otpCode, setOtpCode] = useState(devCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(devCode ? `Dev OTP: ${devCode}` : "");
  const language = getLanguage(languageParam);

  async function handleVerify() {
    setLoading(true);
    setError("");
    try {
      await verifyOtp(phoneNumber, otpCode);
      router.replace("/(app)/(tabs)");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not verify OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      const data = await requestOtp(phoneNumber);
      if (data.devCode) {
        setInfo(`Dev OTP: ${data.devCode}`);
        setOtpCode(data.devCode);
      } else {
        setInfo("OTP resent.");
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not resend OTP.");
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 24 }}>
          <View style={{ gap: 18 }}>
            <Heading title={t(language, "verifyTitle")} subtitle={`${t(language, "verifySubtitle")} ${phoneNumber}`} />
            <Card style={{ gap: 18 }}>
              <View style={{ gap: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>{t(language, "languageLabel")}</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <AppButton label="EN" onPress={() => router.replace({ pathname: "/(auth)/verify", params: { phoneNumber, devCode, language: "EN" } })} variant={language === "EN" ? "secondary" : "ghost"} />
                  <AppButton label="አማ" onPress={() => router.replace({ pathname: "/(auth)/verify", params: { phoneNumber, devCode, language: "AM" } })} variant={language === "AM" ? "secondary" : "ghost"} />
                </View>
              </View>
              <SectionTitle title={t(language, "otpTitle")} subtitle={t(language, "otpSubtitle")} />
              <AppInput label="6-digit code" value={otpCode} onChangeText={setOtpCode} keyboardType="number-pad" error={error} placeholder="123456" maxLength={6} />
              {info ? <InfoBanner eyebrow="OTP status" title="Code ready" description={info} tone="success" /> : null}
              <AppButton label={t(language, "verifyAndContinue")} onPress={handleVerify} loading={loading} />
              <AppButton label={t(language, "resendOtp")} onPress={handleResend} variant="ghost" />
            </Card>
            <View style={{ paddingHorizontal: 6 }}>
              <Text style={{ color: colors.muted, lineHeight: 22 }}>Using the wrong number is the most common login issue. Go back and confirm the phone number if verification fails.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
