import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { productSchema } from "@/lib/schemas";
import { connectToDatabase } from "@/lib/db";
import { getSellerStore, getSellerProducts } from "@/lib/data";
import { getErrorMessage } from "@/lib/api-errors";
import { getMobileUserFromRequest } from "@/lib/mobile-auth";
import { ProductModel } from "@/models/Product";

export async function GET(request: Request) {
  try {
    const user = await getMobileUserFromRequest(request);
    const products = await getSellerProducts(String(user._id));
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getMobileUserFromRequest(request);
    const payload = productSchema.parse(await request.json());
    const store = await getSellerStore(String(user._id));
    if (!store) return NextResponse.json({ error: "Complete store setup first." }, { status: 400 });
    await connectToDatabase();
    const product = await ProductModel.create({
      ...payload,
      sellerId: new Types.ObjectId(String(user._id)),
      storeId: store._id
    });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Could not create product.") }, { status: 400 });
  }
}
