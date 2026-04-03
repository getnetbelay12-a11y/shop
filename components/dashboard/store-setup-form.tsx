"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Setup = {
  storeName?: string;
  slug?: string;
  bio?: string;
  phone?: string;
  logo?: string;
  banner?: string;
  language?: "EN" | "AM";
};

export function StoreSetupForm({ setup }: { setup?: Setup }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [storeName, setStoreName] = useState(setup?.storeName ?? "");
  const [slug, setSlug] = useState(setup?.slug ?? "");
  const [bio, setBio] = useState(setup?.bio ?? "");
  const [phone, setPhone] = useState(setup?.phone ?? "");
  const [logo, setLogo] = useState(setup?.logo ?? "");
  const [banner, setBanner] = useState(setup?.banner ?? "");
  const [language, setLanguage] = useState<"EN" | "AM">(setup?.language ?? "EN");

  const slugPreview = useMemo(
    () =>
      slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    [slug]
  );

  async function submit(formData: FormData) {
    setPending(true);
    setMessage("");
    const response = await fetch("/api/storefront", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeName: formData.get("storeName"),
        slug: formData.get("slug"),
        bio: formData.get("bio"),
        phone: formData.get("phone"),
        logo: formData.get("logo"),
        banner: formData.get("banner"),
        language: formData.get("language")
      })
    });
    const data = await response.json();
    setPending(false);
    setMessage(response.ok ? "Store saved." : data.error || "Could not save store.");
    if (response.ok) router.refresh();
  }

  return (
    <form action={submit} className="grid gap-4">
      <div className="grid gap-2">
        <Input name="storeName" placeholder="Store name" value={storeName} onChange={(event) => setStoreName(event.target.value)} required />
        <p className="text-xs text-stone-500">Use the brand or creator name customers already recognize.</p>
      </div>
      <div className="grid gap-2">
        <Input name="slug" placeholder="shop-slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
        <p className="text-xs text-stone-500">Public URL preview: `/shop/{slugPreview || "your-shop"}`</p>
      </div>
      <div className="grid gap-2">
        <Textarea name="bio" placeholder="Short store bio" value={bio} onChange={(event) => setBio(event.target.value)} required />
        <p className="text-xs text-stone-500">{bio.length}/160 characters</p>
      </div>
      <Input name="phone" placeholder="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} required />
      <Input name="logo" placeholder="Logo URL" value={logo} onChange={(event) => setLogo(event.target.value)} />
      <Input name="banner" placeholder="Banner URL" value={banner} onChange={(event) => setBanner(event.target.value)} />
      <div className="rounded-[24px] border border-[var(--border)] bg-stone-50/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-stone-900">Language preference</p>
            <p className="mt-1 text-xs text-stone-500">Choose the default seller language for your console and mobile app.</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm">
            {language === "AM" ? "አማ" : "EN"}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setLanguage("EN")}
            className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition ${
              language === "EN"
                ? "bg-[linear-gradient(135deg,#0f766e,#115e59)] text-white shadow-[0_14px_30px_rgba(15,118,110,0.18)]"
                : "border border-[var(--border)] bg-white text-stone-700 hover:bg-stone-50"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage("AM")}
            className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition ${
              language === "AM"
                ? "bg-[linear-gradient(135deg,#0f766e,#115e59)] text-white shadow-[0_14px_30px_rgba(15,118,110,0.18)]"
                : "border border-[var(--border)] bg-white text-stone-700 hover:bg-stone-50"
            }`}
          >
            አማ
          </button>
        </div>
        <input type="hidden" name="language" value={language} />
      </div>
      <Button disabled={pending}>{pending ? "Saving store..." : "Save store"}</Button>
      {message ? <p className={`text-sm ${message === "Store saved." ? "text-emerald-700" : "text-red-600"}`}>{message}</p> : null}
    </form>
  );
}
