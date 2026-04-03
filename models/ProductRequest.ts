import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const ProductRequestSchema = new Schema(
  {
    productId: { type: Types.ObjectId, ref: "Product", required: true, index: true },
    sellerId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    storefrontId: { type: Types.ObjectId, ref: "Storefront", required: true, index: true },
    customerPhone: { type: String, required: true, index: true },
    customerName: String,
    note: String,
    source: { type: String, enum: ["web", "mobile"], default: "web", index: true },
    status: { type: String, enum: ["new", "contacted", "completed", "canceled"], default: "new", index: true }
  },
  { timestamps: true }
);

export type ProductRequest = InferSchemaType<typeof ProductRequestSchema>;
export const ProductRequestModel = models.ProductRequest || model("ProductRequest", ProductRequestSchema);
