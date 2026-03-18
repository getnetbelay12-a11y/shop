import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/api-errors";
import { getSellerStore } from "@/lib/data";
import { connectToDatabase } from "@/lib/db";
import { getRequiredApiSession } from "@/lib/session";
import { productSchema } from "@/lib/schemas";
import { ProductModel } from "@/models/Product";

export async function POST(request: Request) {
  try {
    const session = await getRequiredApiSession();
    const payload = productSchema.parse(await request.json());
    const store = (await getSellerStore(session.user.id)) as { _id: string } | null;
    if (!store) {
      return NextResponse.json({ error: "Set up your store first." }, { status: 400 });
    }
    await connectToDatabase();
    const product = await ProductModel.create({
      ...payload,
      sellerId: new Types.ObjectId(session.user.id),
      storeId: store._id
    });
    return NextResponse.json({ product });
  } catch (error) {
    const message = getErrorMessage(error, "Could not create product.");
    return NextResponse.json({ error: message }, { status: message === "Please log in to continue." ? 401 : 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getRequiredApiSession();
    const raw = await request.json();
    const payload = productSchema.parse(raw);
    await connectToDatabase();
    const product = await ProductModel.findOneAndUpdate(
      { _id: raw.id, sellerId: session.user.id },
      payload,
      { new: true }
    );
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    const message = getErrorMessage(error, "Could not update product.");
    return NextResponse.json({ error: message }, { status: message === "Please log in to continue." ? 401 : 400 });
  }
}
