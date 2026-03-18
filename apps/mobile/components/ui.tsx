import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/lib/theme";

export function Screen({ children, padded = true }: { children: React.ReactNode; padded?: boolean }) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={[styles.screen, !padded && { paddingHorizontal: 0 }]}>{children}</View>
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.heading}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function AppButton({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "soft" | "danger";
  loading?: boolean;
  disabled?: boolean;
}) {
  const backgroundColor =
    variant === "primary"
      ? colors.primary
      : variant === "secondary"
        ? colors.secondary
        : variant === "soft"
          ? colors.primarySoft
          : variant === "danger"
            ? colors.danger
            : "#fff";
  const textColor = variant === "ghost" ? colors.text : variant === "soft" ? colors.primary : "#fff";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor, opacity: disabled || loading ? 0.6 : 1 },
        variant === "ghost" && styles.ghostButton,
        variant === "soft" && styles.softButton
      ]}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>}
    </Pressable>
  );
}

export function AppInput(props: React.ComponentProps<typeof TextInput> & { label?: string; error?: string }) {
  return (
    <View style={{ gap: 8 }}>
      {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
      <TextInput
        placeholderTextColor="#8b8b8b"
        {...props}
        style={[styles.input, props.style]}
      />
      {props.error ? <Text style={styles.error}>{props.error}</Text> : null}
    </View>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Card style={{ alignItems: "center", paddingVertical: 28 }}>
      <Text style={[styles.heading, { fontSize: 20 }]}>{title}</Text>
      <Text style={[styles.subtitle, { textAlign: "center" }]}>{subtitle}</Text>
    </Card>
  );
}

export function StatusPill({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "success" | "warning" }) {
  const backgroundColor = tone === "success" ? "#e8faf1" : tone === "warning" ? "#fff6e6" : "#f1f1f1";
  const color = tone === "success" ? colors.success : tone === "warning" ? colors.secondary : colors.text;
  return (
    <View style={{ backgroundColor, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 }}>
      <Text style={{ fontSize: 12, fontWeight: "700", color }}>{label}</Text>
    </View>
  );
}

export function InfoBanner({
  eyebrow,
  title,
  description,
  tone = "neutral"
}: {
  eyebrow?: string;
  title: string;
  description: string;
  tone?: "neutral" | "success" | "warning";
}) {
  const backgroundColor = tone === "success" ? "#edf9f4" : tone === "warning" ? "#fff8ec" : "#f7f4ee";
  const borderColor = tone === "success" ? "#cfeedd" : tone === "warning" ? "#f2d39b" : colors.border;
  return (
    <View style={[styles.banner, { backgroundColor, borderColor }]}>
      {eyebrow ? <Text style={styles.bannerEyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.bannerTitle}>{title}</Text>
      <Text style={styles.bannerDescription}>{description}</Text>
    </View>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 18, gap: 16 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    shadowColor: "#261a09",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  },
  heading: { fontSize: 28, fontWeight: "800", color: colors.text, letterSpacing: -0.8 },
  subtitle: { fontSize: 15, lineHeight: 22, color: colors.muted },
  label: { fontSize: 13, fontWeight: "700", color: colors.text },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },
  button: {
    minHeight: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18
  },
  ghostButton: {
    borderWidth: 1,
    borderColor: colors.border
  },
  softButton: {
    borderWidth: 1,
    borderColor: "#bee5df"
  },
  buttonText: { fontSize: 16, fontWeight: "800" },
  error: { color: colors.danger, fontSize: 13 },
  banner: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    gap: 6
  },
  bannerEyebrow: {
    color: colors.mutedSoft,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text
  },
  bannerDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted
  }
});
