import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { getErrorMessage } from "@/lib/api-errors";
import { getStoreBySlug } from "@/lib/data";
import { requestSchema } from "@/lib/schemas";
import { ProductModel } from "@/models/Product";
import { ProductRequestModel } from "@/models/ProductRequest";

export async function POST(request: Request) {
  try {
    const payload = requestSchema.parse(await request.json());
    await connectToDatabase();
    const store = await getStoreBySlug(payload.storeSlug);
    if (!store) return NextResponse.json({ error: "Store not found." }, { status: 404 });
    const product = await ProductModel.findOne({ _id: payload.productId, storeId: store._id }).lean();
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const saved = await ProductRequestModel.create({
      productId: new Types.ObjectId(payload.productId),
      sellerId: new Types.ObjectId(String(store.sellerId)),
      storefrontId: new Types.ObjectId(String(store._id)),
      customerPhone: payload.customerPhone,
      customerName: payload.customerName || undefined,
      note: payload.note || undefined,
      source: payload.source
    });

    return NextResponse.json({
      request: saved,
      message: "Your request was sent to the seller. The seller will contact you soon."
    });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Could not send your request.") }, { status: 400 });
  }
}
