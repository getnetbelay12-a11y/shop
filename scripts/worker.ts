import { Worker } from "bullmq";
import { connectToDatabase } from "@/lib/db";
import { env } from "@/lib/env";
import { AnalyticsEventModel } from "@/models/AnalyticsEvent";

if (!env.REDIS_URL) {
  console.error("REDIS_URL is required for worker mode.");
  process.exit(1);
}

const worker = new Worker(
  "analytics",
  async (job) => {
    await connectToDatabase();
    await AnalyticsEventModel.create(job.data);
  },
  { connection: { url: env.REDIS_URL } as never }
);

worker.on("completed", (job) => {
  console.log(`Processed analytics job ${job.id}`);
});
