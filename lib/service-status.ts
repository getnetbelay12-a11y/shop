import { env } from "@/lib/env";
import { connectToDatabase } from "@/lib/db";

type ServiceMode = "live" | "fallback" | "disabled" | "error";

export type ServiceStatusItem = {
  key: "database" | "otp" | "ai" | "uploads" | "analytics";
  label: string;
  mode: ServiceMode;
  summary: string;
};

export async function getServiceStatus(): Promise<ServiceStatusItem[]> {
  const databaseStatus = await getDatabaseStatus();

  return [
    databaseStatus,
    {
      key: "otp",
      label: "Phone OTP",
      mode: env.OTP_PROVIDER && env.OTP_PROVIDER !== "dev" ? "live" : "fallback",
      summary: env.OTP_PROVIDER && env.OTP_PROVIDER !== "dev"
        ? `OTP provider is configured as ${env.OTP_PROVIDER}.`
        : "Dev OTP mode is active. Codes are generated locally for demos and testing."
    },
    {
      key: "ai",
      label: "AI assistant",
      mode: env.OPENAI_API_KEY ? "live" : "fallback",
      summary: env.OPENAI_API_KEY
        ? "OpenAI API is configured for live product writing and store Q&A."
        : "Grounded fallback AI is active. Responses are limited to store and product data."
    },
    {
      key: "uploads",
      label: "Image uploads",
      mode: env.CLOUDINARY ? "live" : "fallback",
      summary: env.CLOUDINARY
        ? "Cloudinary is configured for hosted image uploads."
        : "Image URLs are used directly until Cloudinary credentials are connected."
    },
    {
      key: "analytics",
      label: "Analytics jobs",
      mode: env.REDIS_URL ? "live" : "fallback",
      summary: env.REDIS_URL
        ? "Redis/BullMQ is configured for queued analytics events."
        : "Analytics write directly to MongoDB without the Redis queue."
    }
  ];
}

async function getDatabaseStatus(): Promise<ServiceStatusItem> {
  try {
    await connectToDatabase();
    return {
      key: "database",
      label: "MongoDB",
      mode: "live",
      summary: "MongoDB connection is healthy."
    };
  } catch (error) {
    return {
      key: "database",
      label: "MongoDB",
      mode: "error",
      summary: error instanceof Error ? error.message : "MongoDB connection failed."
    };
  }
}
