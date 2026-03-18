import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const StorefrontSchema = new Schema(
  {
    sellerId: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    storeName: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    bio: { type: String, required: true },
    phone: { type: String, required: true },
    logo: String,
    banner: String,
    language: { type: String, enum: ["EN", "AM"], default: "EN" },
    status: { type: String, enum: ["active", "suspended"], default: "active" }
  },
  { timestamps: true }
);

export type Storefront = InferSchemaType<typeof StorefrontSchema>;
export const StorefrontModel = models.Storefront || model("Storefront", StorefrontSchema);
