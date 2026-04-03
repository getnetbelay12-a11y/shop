import { NextResponse } from "next/server";
import { addSellerConversationMessage, getSellerConversationById } from "@/lib/data";
import { getErrorMessage } from "@/lib/api-errors";
import { getRequiredApiSession } from "@/lib/session";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getRequiredApiSession();
    const { id } = await params;
    const conversation = await getSellerConversationById(session.user.id, id);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }
    return NextResponse.json({ conversation });
  } catch (error) {
    const message = getErrorMessage(error, "Could not load conversation.");
    return NextResponse.json({ error: message }, { status: message === "Please log in to continue." ? 401 : 400 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getRequiredApiSession();
    const { id } = await params;
    const { content } = await request.json();
    if (!String(content ?? "").trim()) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }
    const message = await addSellerConversationMessage(session.user.id, id, String(content));
    return NextResponse.json({ ok: true, message });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Could not send message.") }, { status: 400 });
  }
}
