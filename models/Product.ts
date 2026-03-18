import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const ProductSchema = new Schema(
  {
    sellerId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    storeId: { type: Types.ObjectId, ref: "Storefront", required: true, index: true },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    stock: { type: Number, required: true },
    tags: [{ type: String, index: true }],
    images: [String],
    attributes: { type: Map, of: String },
    titleAm: String,
    descriptionAm: String
  },
  { timestamps: true }
);

export type Product = InferSchemaType<typeof ProductSchema>;
export const ProductModel = models.Product || model("Product", ProductSchema);
