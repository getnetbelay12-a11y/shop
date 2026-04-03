import { NextResponse } from "next/server";
import { addSellerConversationMessage, getSellerConversationById } from "@/lib/data";
import { getErrorMessage } from "@/lib/api-errors";
import { getMobileUserFromRequest } from "@/lib/mobile-auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getMobileUserFromRequest(request);
    const { id } = await params;
    const conversation = await getSellerConversationById(String(user._id), id);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }
    return NextResponse.json({ conversation });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getMobileUserFromRequest(request);
    const { id } = await params;
    const { content } = await request.json();
    if (!String(content ?? "").trim()) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }
    const message = await addSellerConversationMessage(String(user._id), id, String(content));
    return NextResponse.json({ ok: true, message });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Could not send message.") }, { status: 400 });
  }
}
