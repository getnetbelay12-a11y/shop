import crypto from "crypto";
import { env } from "@/lib/env";
import { connectToDatabase } from "@/lib/db";
import { normalizePhoneNumber, isValidPhoneNumber } from "@/lib/phone";
import { VerificationCodeModel } from "@/models/VerificationCode";

const expiryMinutes = Number(env.OTP_EXPIRY_MINUTES ?? "10");
const cooldownSeconds = Number(env.OTP_REQUEST_COOLDOWN_SECONDS ?? "45");

function generateOtpCode() {
  if (env.OTP_PROVIDER === "dev" && env.OTP_DEV_DEFAULT_CODE) return env.OTP_DEV_DEFAULT_CODE;
  return String(crypto.randomInt(100000, 999999));
}

async function sendOtpMessage(phoneNumber: string, code: string) {
  if (env.OTP_PROVIDER !== "dev") {
    console.log(`OTP provider placeholder: send ${code} to ${phoneNumber}`);
    return;
  }
  console.log(`[DEV OTP] ${phoneNumber} -> ${code}`);
}

export async function requestOtp(phoneInput: string, purpose: "seller_login" | "admin_login" | "customer_login" = "seller_login") {
  const phoneNumber = normalizePhoneNumber(phoneInput);
  if (!isValidPhoneNumber(phoneNumber)) throw new Error("Enter a valid phone number including country code.");
  await connectToDatabase();
  const latest = await VerificationCodeModel.findOne({ phoneNumber, purpose }).sort({ createdAt: -1 });
  if (latest && latest.createdAt && Date.now() - latest.createdAt.getTime() < cooldownSeconds * 1000) {
    throw new Error(`Please wait ${cooldownSeconds} seconds before requesting another OTP.`);
  }
  const code = generateOtpCode();
  const record = await VerificationCodeModel.create({
    phoneNumber,
    code,
    purpose,
    expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000)
  });
  await sendOtpMessage(phoneNumber, code);
  return { phoneNumber, expiresAt: record.expiresAt, devCode: env.OTP_PROVIDER === "dev" ? code : undefined };
}

export async function consumeOtp(phoneInput: string, code: string, purpose: "seller_login" | "admin_login" | "customer_login" = "seller_login") {
  const phoneNumber = normalizePhoneNumber(phoneInput);
  if (!isValidPhoneNumber(phoneNumber)) throw new Error("Enter a valid phone number.");
  await connectToDatabase();
  const otp = await VerificationCodeModel.findOne({
    phoneNumber,
    code: code.trim(),
    purpose,
    consumedAt: { $exists: false }
  }).sort({ createdAt: -1 });
  if (!otp) throw new Error("Invalid OTP code.");
  if (otp.expiresAt.getTime() < Date.now()) throw new Error("OTP has expired. Request a new code.");
  otp.consumedAt = new Date();
  await otp.save();
  return { phoneNumber };
}

export async function getLatestDevOtp(phoneInput: string) {
  const phoneNumber = normalizePhoneNumber(phoneInput);
  await connectToDatabase();
  return (await VerificationCodeModel.findOne({ phoneNumber }).sort({ createdAt: -1 }).lean()) as any;
}
