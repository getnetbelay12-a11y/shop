import mongoose from "mongoose";
import { env } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const globalCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = globalCache;

export async function connectToDatabase() {
  if (globalCache.conn) return globalCache.conn;
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured.");
  }
  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(env.MONGO_URI, {
      dbName: "shop"
    });
  }
  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
