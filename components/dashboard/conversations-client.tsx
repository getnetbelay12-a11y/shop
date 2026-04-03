"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Conversation = {
  _id: string;
  visitorName?: string;
  messages: Array<{ _id: string; role: string; content: string }>;
};

function bubbleClass(role: string) {
  if (role === "assistant") return "rounded-2xl bg-stone-100 p-3 text-sm";
  if (role === "seller") return "rounded-2xl bg-emerald-100 p-3 text-sm";
  return "rounded-2xl bg-[var(--primary)] p-3 text-sm text-white";
}

export function ConversationsClient({ initialConversations }: { initialConversations: Conversation[] }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);

  async function sendReply(conversationId: string) {
    const content = drafts[conversationId]?.trim();
    if (!content) return;
    setSendingId(conversationId);
    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    const data = await response.json();
    if (response.ok && data.message) {
      setConversations((current) =>
        current.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, { _id: data.message._id ?? `${Date.now()}`, role: data.message.role, content: data.message.content }]
              }
            : conversation
        )
      );
      setDrafts((current) => ({ ...current, [conversationId]: "" }));
    }
    setSendingId(null);
  }

  return (
    <Card className="p-6">
      <h1 className="text-3xl font-bold">Buyer conversations</h1>
      <p className="mt-2 text-sm text-stone-600">Reply directly to buyers here. AI messages and seller replies stay in the same conversation thread.</p>
      {!conversations.length ? <p className="mt-4 text-sm text-stone-600">No buyer conversations yet. Shopper chat history will appear here.</p> : null}
      <div className="mt-6 grid gap-4">
        {conversations.map((conversation) => (
          <div key={String(conversation._id)} className="rounded-2xl border border-[var(--border)] bg-white p-4">
            <h2 className="font-semibold">{conversation.visitorName ?? "Anonymous visitor"}</h2>
            <div className="mt-3 grid gap-2">
              {conversation.messages.map((message) => (
                <p key={String(message._id)} className={bubbleClass(message.role)}>
                  <span className="font-semibold">{message.role}:</span> {message.content}
                </p>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Reply to buyer..."
                value={drafts[conversation._id] ?? ""}
                onChange={(event) => setDrafts((current) => ({ ...current, [conversation._id]: event.target.value }))}
              />
              <Button onClick={() => sendReply(conversation._id)} disabled={sendingId === conversation._id}>
                {sendingId === conversation._id ? "Sending..." : "Send reply"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
