import { Schema, model, models, type InferSchemaType } from "mongoose";

const VerificationCodeSchema = new Schema(
  {
    phoneNumber: { type: String, required: true, index: true },
    code: { type: String, required: true },
    purpose: { type: String, enum: ["seller_login", "admin_login", "customer_login"], default: "seller_login", index: true },
    expiresAt: { type: Date, required: true, index: true },
    consumedAt: { type: Date }
  },
  { timestamps: true }
);

export type VerificationCode = InferSchemaType<typeof VerificationCodeSchema>;
export const VerificationCodeModel = models.VerificationCode || model("VerificationCode", VerificationCodeSchema);
