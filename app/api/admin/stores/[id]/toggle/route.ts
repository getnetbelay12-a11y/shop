import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getRequiredAdminApiSession } from "@/lib/session";
import { StorefrontModel } from "@/models/Storefront";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getRequiredAdminApiSession();
    const { id } = await params;
    await connectToDatabase();
    const store = await StorefrontModel.findById(id);
    if (!store) return NextResponse.json({ error: "Store not found." }, { status: 404 });
    store.status = store.status === "active" ? "suspended" : "active";
    await store.save();
    return NextResponse.json({ ok: true, status: store.status });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}
