export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/card";
import { getSellerConversations } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function ConversationsPage() {
  const session = await requireUser();
  const conversations = (await getSellerConversations(session.user.id)) as unknown as Array<{
    _id: string;
    visitorName?: string;
    messages: Array<{ _id: string; role: string; content: string }>;
  }>;
  return (
    <Card className="p-6">
      <h1 className="text-3xl font-bold">Conversations</h1>
      {!conversations.length ? <p className="mt-4 text-sm text-stone-600">No AI conversations yet. Shopper chat history will appear here.</p> : null}
      <div className="mt-6 grid gap-4">
        {conversations.map((conversation) => (
          <div key={String(conversation._id)} className="rounded-2xl border border-[var(--border)] bg-white p-4">
            <h2 className="font-semibold">{conversation.visitorName ?? "Anonymous visitor"}</h2>
            <div className="mt-3 grid gap-2">
              {conversation.messages.map((message) => (
                <p key={String(message._id)} className="rounded-2xl bg-stone-100 p-3 text-sm">
                  <span className="font-semibold">{message.role}:</span> {message.content}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
