import { NextResponse } from "next/server";
import { getMobileUserFromRequest } from "@/lib/mobile-auth";
import { getSellerConversations } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const user = await getMobileUserFromRequest(request);
    const conversations = await getSellerConversations(String(user._id));
    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
