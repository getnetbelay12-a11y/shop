import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getRequiredApiSession } from "@/lib/session";
import { ProductModel } from "@/models/Product";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getRequiredApiSession();
    const { id } = await params;
    await connectToDatabase();
    await ProductModel.findOneAndDelete({ _id: id, sellerId: session.user.id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}
