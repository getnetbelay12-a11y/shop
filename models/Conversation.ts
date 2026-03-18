import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const ConversationSchema = new Schema(
  {
    storeId: { type: Types.ObjectId, ref: "Storefront", required: true, index: true },
    sellerId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    visitorName: String,
    language: { type: String, enum: ["EN", "AM"], default: "EN" }
  },
  { timestamps: true }
);

export type Conversation = InferSchemaType<typeof ConversationSchema>;
export const ConversationModel = models.Conversation || model("Conversation", ConversationSchema);
