"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LeadCaptureForm({
  intent,
  source,
  storeSlug,
  title,
  description,
  ctaLabel,
  afterSubmit
}: {
  intent: "seller" | "buyer";
  source: string;
  storeSlug?: string;
  title: string;
  description: string;
  ctaLabel: string;
  afterSubmit?: () => void;
}) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit() {
    setPending(true);
    setMessage("");
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent, source, storeSlug, name, phoneNumber, email })
    });
    const data = await response.json();
    setPending(false);
    if (!response.ok) {
      setMessage(data.error || "Could not save your request.");
      return;
    }
    setMessage(intent === "seller" ? "Saved. Continue to sign in with phone OTP." : "Saved. A seller can follow up using your contact details.");
    afterSubmit?.();
  }

  return (
    <Card className="p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
      <div className="mt-4 grid gap-3">
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
        <Input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="Phone number" inputMode="tel" />
        <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" inputMode="email" />
        <Button onClick={submit} disabled={pending}>{pending ? "Saving..." : ctaLabel}</Button>
        {message ? <p className={`text-sm ${message.startsWith("Saved") ? "text-emerald-700" : "text-rose-600"}`}>{message}</p> : null}
      </div>
    </Card>
  );
}
