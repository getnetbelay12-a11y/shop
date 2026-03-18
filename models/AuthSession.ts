import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const AuthSessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

export type AuthSession = InferSchemaType<typeof AuthSessionSchema>;
export const AuthSessionModel = models.AuthSession || model("AuthSession", AuthSessionSchema);
