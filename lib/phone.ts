export function normalizePhoneNumber(input: string) {
  const raw = input.replace(/[^\d+]/g, "").trim();
  if (!raw) return "";
  if (raw.startsWith("+")) return raw;
  if (raw.startsWith("251")) return `+${raw}`;
  if (raw.startsWith("0")) return `+251${raw.slice(1)}`;
  return `+${raw}`;
}

export function isValidPhoneNumber(input: string) {
  return /^\+\d{10,15}$/.test(normalizePhoneNumber(input));
}
