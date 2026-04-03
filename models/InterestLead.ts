import { Schema, model, models, type InferSchemaType } from "mongoose";

const InterestLeadSchema = new Schema(
  {
    intent: { type: String, enum: ["seller", "buyer"], required: true, index: true },
    phoneNumber: String,
    email: String,
    name: String,
    source: { type: String, default: "web" },
    storeSlug: String,
    note: String
  },
  { timestamps: true }
);

export type InterestLead = InferSchemaType<typeof InterestLeadSchema>;
export const InterestLeadModel = models.InterestLead || model("InterestLead", InterestLeadSchema);
