"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OrderForm({ productId, storeSlug }: { productId: string; storeSlug: string }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(formData: FormData) {
    setPending(true);
    setMessage("");
    setStatus("idle");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        storeSlug,
        name: formData.get("name"),
        phone: formData.get("phone"),
        telegram: formData.get("telegram"),
        city: formData.get("city"),
        address: formData.get("address"),
        quantity: Number(formData.get("quantity"))
      })
    });
    const data = await response.json();
    setPending(false);
    if (response.ok) {
      formRef.current?.reset();
      setStatus("success");
      setMessage("Order received. Seller will contact you shortly.");
      return;
    }
    setStatus("error");
    setMessage(data.error || "Could not place order.");
  }

  return (
    <form ref={formRef} action={submit} className="space-y-3">
      <p className="text-sm text-stone-600">You only enter your phone and delivery details when you are ready to buy. The seller receives everything directly.</p>
      <Input name="name" placeholder="Your name" required />
      <Input name="phone" placeholder="Phone" inputMode="tel" required />
      <Input name="telegram" placeholder="Telegram username (optional)" />
      <Input name="city" placeholder="City" required />
      <Input name="address" placeholder="Address" required />
      <Input name="quantity" type="number" min={1} inputMode="numeric" defaultValue={1} required />
      <Button className="w-full" disabled={pending}>{pending ? "Submitting..." : "Place order"}</Button>
      {message ? <p className={`text-sm ${status === "error" ? "text-red-600" : status === "success" ? "text-emerald-700" : "text-stone-600"}`}>{message}</p> : null}
    </form>
  );
}
