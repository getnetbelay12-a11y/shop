"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Message = { role: "user" | "assistant"; content: string };

export function AIChat({ storeSlug }: { storeSlug: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ask about price, style, size, or similar items." }
  ]);
  const [pending, setPending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(`shop-chat-${storeSlug}`);
    if (saved) setConversationId(saved);
  }, [storeSlug]);

  async function ask(formData: FormData) {
    const question = String(formData.get("message") ?? "");
    if (!question.trim()) return;
    const nextMessages: Message[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setPending(true);
    const response = await fetch(`/api/stores/${storeSlug}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question, conversationId })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessages([...nextMessages, { role: "assistant", content: data.error ?? "Could not answer right now." }]);
      setPending(false);
      return;
    }
    if (data.conversationId) {
      setConversationId(data.conversationId);
      window.localStorage.setItem(`shop-chat-${storeSlug}`, data.conversationId);
    }
    setMessages([...nextMessages, { role: "assistant", content: data.answer ?? "No answer available." }]);
    formRef.current?.reset();
    setPending(false);
  }

  return (
    <>
      <Button className="fixed bottom-4 right-4 z-30 shadow-lg" onClick={() => setOpen((value) => !value)}>
        <MessageCircle className="mr-2 size-4" />
        AI chat
      </Button>
      {open ? (
        <Card className="fixed bottom-20 right-4 z-30 w-[calc(100vw-2rem)] max-w-sm p-4 sm:bottom-24">
          <div className="mb-3 max-h-[50vh] space-y-2 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={message.role === "assistant" ? "rounded-2xl bg-stone-100 p-3 text-sm" : "rounded-2xl bg-[var(--primary)] p-3 text-sm text-white"}
              >
                {message.content}
              </div>
            ))}
          </div>
          <form ref={formRef} action={ask} className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <Input name="message" placeholder="Do you have cheaper shoes?" />
            <Button disabled={pending} className="w-full sm:w-auto">{pending ? "..." : "Send"}</Button>
          </form>
        </Card>
      ) : null}
    </>
  );
}
