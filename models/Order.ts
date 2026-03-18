import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const OrderSchema = new Schema(
  {
    sellerId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    storeId: { type: Types.ObjectId, ref: "Storefront", required: true, index: true },
    productId: { type: Types.ObjectId, ref: "Product", required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    telegram: String,
    city: { type: String, required: true },
    address: { type: String, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ["new", "confirmed", "preparing", "delivered", "canceled"], default: "new" }
  },
  { timestamps: true }
);

export type Order = InferSchemaType<typeof OrderSchema>;
export const OrderModel = models.Order || model("Order", OrderSchema);
