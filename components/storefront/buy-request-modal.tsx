"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function BuyRequestModal({
  productId,
  storeSlug,
  triggerLabel = "Buy now"
}: {
  productId: string;
  storeSlug: string;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("I want this item.");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setPending(true);
    setError("");
    setMessage("");
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        storeSlug,
        customerPhone: phone,
        customerName: name,
        note,
        source: "web"
      })
    });
    const data = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(data.error || "Could not send your request.");
      return;
    }
    setMessage("Your request was sent to the seller. The seller will contact you soon.");
    setPhone("");
    setName("");
    setNote("I want this item.");
  }

  return (
    <>
      <Button className="w-full sm:w-auto" onClick={() => setOpen(true)}>{triggerLabel}</Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.2)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Quick request</p>
                <h3 className="mt-1.5 text-xl font-bold tracking-tight">Send your phone number</h3>
                <p className="mt-2 text-sm leading-5 text-stone-600">No signup. The seller will contact you soon.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-semibold text-stone-600"
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-2.5">
              <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" inputMode="tel" className="rounded-xl border-stone-200 bg-stone-50" />
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name (optional)" className="rounded-xl border-stone-200 bg-stone-50" />
              <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Message (optional)" className="min-h-20 rounded-xl border-stone-200 bg-stone-50" />
              <Button disabled={pending} onClick={submit} className="mt-1">{pending ? "Sending..." : "Send request"}</Button>
              <p className="text-[11px] leading-5 text-stone-500">By sending this request, you share your phone number only with the seller for this product inquiry.</p>
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
