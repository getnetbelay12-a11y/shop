import mongoose from "mongoose";
import { mongoUri } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const globalCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = globalCache;

export async function connectToDatabase() {
  if (globalCache.conn) return globalCache.conn;
  if (!mongoUri) {
    throw new Error("MongoDB connection string is not configured. Set MONGO_URI or MONGODB_URI.");
  }
  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(mongoUri, {
      dbName: "shop"
    });
  }
  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
