import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { getErrorMessage } from "@/lib/api-errors";
import { connectToDatabase } from "@/lib/db";
import { getStoreBySlug, recordAnalytics } from "@/lib/data";
import { orderSchema } from "@/lib/schemas";
import { OrderModel } from "@/models/Order";
import { ProductModel } from "@/models/Product";

export async function POST(request: Request) {
  try {
    const payload = orderSchema.parse(await request.json());
    await connectToDatabase();
    const store = (await getStoreBySlug(payload.storeSlug)) as { _id: string; sellerId: string } | null;
    if (!store) return NextResponse.json({ error: "Store not found." }, { status: 404 });
    const product = await ProductModel.findOne({ _id: payload.productId, storeId: store._id });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    if (product.stock < payload.quantity) {
      return NextResponse.json({ error: `Only ${product.stock} item(s) left in stock.` }, { status: 400 });
    }
    const total = product.price * payload.quantity;
    const order = await OrderModel.create({
      sellerId: new Types.ObjectId(String(store.sellerId)),
      storeId: store._id,
      productId: product._id,
      name: payload.name,
      phone: payload.phone,
      telegram: payload.telegram,
      city: payload.city,
      address: payload.address,
      quantity: payload.quantity,
      total,
      status: "new"
    });
    await ProductModel.findByIdAndUpdate(product._id, { $inc: { stock: -payload.quantity } });
    await recordAnalytics({ type: "order", storeId: String(store._id), sellerId: String(store.sellerId), productId: String(product._id), meta: { total } });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Could not place order.") }, { status: 400 });
  }
}
