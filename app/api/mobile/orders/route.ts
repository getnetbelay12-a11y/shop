import { NextResponse } from "next/server";
import { getMobileUserFromRequest } from "@/lib/mobile-auth";
import { getSellerOrders } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const user = await getMobileUserFromRequest(request);
    const orders = await getSellerOrders(String(user._id));
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
