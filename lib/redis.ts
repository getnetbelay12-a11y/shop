import IORedis from "ioredis";
import { Queue } from "bullmq";
import { env } from "@/lib/env";

let redis: IORedis | null = null;

export function getRedis() {
  if (!env.REDIS_URL) return null;
  if (!redis) {
    redis = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null
    });
  }
  return redis;
}

export function getAnalyticsQueue() {
  if (!env.REDIS_URL) return null;
  return new Queue("analytics", { connection: { url: env.REDIS_URL } as never });
}
