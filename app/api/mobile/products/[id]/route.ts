import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getErrorMessage } from "@/lib/api-errors";
import { getMobileUserFromRequest } from "@/lib/mobile-auth";
import { productSchema } from "@/lib/schemas";
import { ProductModel } from "@/models/Product";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getMobileUserFromRequest(request);
    const { id } = await params;
    await connectToDatabase();
    const product = await ProductModel.findOne({ _id: id, sellerId: user._id }).lean();
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getMobileUserFromRequest(request);
    const { id } = await params;
    const payload = productSchema.parse(await request.json());
    await connectToDatabase();
    const product = await ProductModel.findOneAndUpdate({ _id: id, sellerId: user._id }, payload, { new: true });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Could not update product.") }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getMobileUserFromRequest(request);
    const { id } = await params;
    await connectToDatabase();
    await ProductModel.findOneAndDelete({ _id: id, sellerId: user._id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
