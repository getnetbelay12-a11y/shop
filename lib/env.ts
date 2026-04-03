import { z } from "zod";

const envSchema = z.object({
  MONGO_URI: z.string().optional(),
  MONGODB_URI: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
  APP_URL: z.string().optional(),
  CLOUDINARY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),
  OTP_PROVIDER: z.string().optional(),
  OTP_DEV_DEFAULT_CODE: z.string().optional(),
  OTP_EXPIRY_MINUTES: z.string().optional(),
  OTP_REQUEST_COOLDOWN_SECONDS: z.string().optional(),
  EXPO_PUBLIC_API_BASE_URL: z.string().optional()
});

export const env = envSchema.parse({
  MONGO_URI: process.env.MONGO_URI,
  MONGODB_URI: process.env.MONGODB_URI,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  APP_URL: process.env.APP_URL,
  CLOUDINARY: process.env.CLOUDINARY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  REDIS_URL: process.env.REDIS_URL,
  OTP_PROVIDER: process.env.OTP_PROVIDER,
  OTP_DEV_DEFAULT_CODE: process.env.OTP_DEV_DEFAULT_CODE,
  OTP_EXPIRY_MINUTES: process.env.OTP_EXPIRY_MINUTES,
  OTP_REQUEST_COOLDOWN_SECONDS: process.env.OTP_REQUEST_COOLDOWN_SECONDS,
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL
});

export const mongoUri = env.MONGO_URI || env.MONGODB_URI;
