import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getMobileUserFromRequest } from "@/lib/mobile-auth";
import { OrderModel } from "@/models/Order";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getMobileUserFromRequest(request);
    const { id } = await params;
    await connectToDatabase();
    const order = await OrderModel.findOne({ _id: id, sellerId: user._id }).populate("productId").lean();
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getMobileUserFromRequest(request);
    const { id } = await params;
    const { status } = await request.json();
    await connectToDatabase();
    const order = await OrderModel.findOneAndUpdate(
      { _id: id, sellerId: user._id },
      { status },
      { new: true }
    );
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Could not update order." }, { status: 400 });
  }
}
