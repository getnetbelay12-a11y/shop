import { Schema, model, models, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, sparse: true, index: true },
    phoneNumber: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["seller", "admin"], default: "seller" }
    ,
    isPhoneVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema>;
export const UserModel = models.User || model("User", UserSchema);
