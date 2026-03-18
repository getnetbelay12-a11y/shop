import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const MessageSchema = new Schema(
  {
    conversationId: { type: Types.ObjectId, ref: "Conversation", required: true, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export type Message = InferSchemaType<typeof MessageSchema>;
export const MessageModel = models.Message || model("Message", MessageSchema);
