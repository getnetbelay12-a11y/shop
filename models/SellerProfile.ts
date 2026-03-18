import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const SellerProfileSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    phone: { type: String, required: true },
    displayName: { type: String },
    languagePreference: { type: String, enum: ["EN", "AM"], default: "EN" }
  },
  { timestamps: true }
);

export type SellerProfile = InferSchemaType<typeof SellerProfileSchema>;
export const SellerProfileModel = models.SellerProfile || model("SellerProfile", SellerProfileSchema);
