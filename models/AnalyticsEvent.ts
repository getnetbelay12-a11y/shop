import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const AnalyticsEventSchema = new Schema(
  {
    storeId: { type: Types.ObjectId, ref: "Storefront", index: true },
    sellerId: { type: Types.ObjectId, ref: "User", index: true },
    productId: { type: Types.ObjectId, ref: "Product", index: true },
    type: {
      type: String,
      enum: ["store_view", "product_view", "search", "ai_chat", "order"],
      required: true,
      index: true
    },
    meta: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export type AnalyticsEvent = InferSchemaType<typeof AnalyticsEventSchema>;
export const AnalyticsEventModel = models.AnalyticsEvent || model("AnalyticsEvent", AnalyticsEventSchema);
