"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProductRecord = {
  _id?: string;
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  tags?: string[];
  images?: string[];
  attributes?: Record<string, string>;
};

export function ProductForm({ product }: { product?: ProductRecord }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [aiPending, setAiPending] = useState(false);
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [tags, setTags] = useState(product?.tags?.join(", ") ?? "");
  const [images, setImages] = useState(product?.images?.join(", ") ?? "");
  const [statusTone, setStatusTone] = useState<"neutral" | "success" | "error">("neutral");
  const formRef = useRef<HTMLFormElement>(null);

  function parseAttributes(raw: string) {
    return Object.fromEntries(
      raw
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
          const [key, value] = entry.split(":").map((part) => part.trim());
          return [key, value];
        })
        .filter(([key, value]) => key && value)
    );
  }

  function validateClient() {
    if (title.trim().length < 2) return "Title must be at least 2 characters.";
    if (description.trim().length < 20) return "Description must be at least 20 characters.";
    return "";
  }

  async function enhance(type: "rewrite" | "tags" | "bilingual") {
    if (!description.trim()) {
      setStatusTone("error");
      setMessage("Add a description before using AI tools.");
      return;
    }
    setAiPending(true);
    setStatusTone("neutral");
    const response = await fetch("/api/ai/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        title,
        description
      })
    });
    const data = await response.json();
    if (!response.ok) {
      setStatusTone("error");
      setMessage(data.error || "AI action failed.");
      setAiPending(false);
      return;
    }
    if (type === "rewrite" && data.result) setDescription(data.result);
    if (type === "tags" && Array.isArray(data.result)) setTags(data.result.join(", "));
    if (type === "bilingual" && data.result) {
      setTitle(data.result.titleEn ?? title);
      setDescription(data.result.descriptionEn);
    }
    setStatusTone("success");
    setMessage(type === "tags" ? "Suggested tags ready." : "AI content updated.");
    setAiPending(false);
  }

  async function submit(formData: FormData) {
    const clientError = validateClient();
    if (clientError) {
      setStatusTone("error");
      setMessage(clientError);
      return;
    }
    setPending(true);
    setMessage("");
    setStatusTone("neutral");
    const payload = {
      id: product?._id,
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      category: formData.get("category"),
      stock: Number(formData.get("stock")),
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      images: String(formData.get("images") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      attributes: parseAttributes(String(formData.get("attributes") ?? ""))
    };
    const response = await fetch("/api/products", {
      method: product?._id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setPending(false);
    const data = await response.json();
    if (!response.ok) {
      setStatusTone("error");
      setMessage(data.error || "Could not save product.");
      return;
    }
    setStatusTone("success");
    setMessage("Saved.");
    if (!product?._id) {
      formRef.current?.reset();
      setTitle("");
      setDescription("");
      setTags("");
      setImages("");
    }
    router.refresh();
  }

  return (
    <form ref={formRef} action={submit} className="grid gap-4">
      <Input name="title" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
      <Textarea name="description" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} required />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={aiPending} onClick={() => enhance("rewrite")}>AI rewrite</Button>
        <Button type="button" variant="outline" disabled={aiPending} onClick={() => enhance("bilingual")}>AI EN + AM</Button>
        <Button type="button" variant="outline" disabled={aiPending} onClick={() => enhance("tags")}>Suggest tags</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="price" type="number" placeholder="Price ETB" defaultValue={product?.price} min={1} required />
        <Input name="stock" type="number" placeholder="Stock" defaultValue={product?.stock} min={0} required />
      </div>
      <Input name="category" placeholder="Category" defaultValue={product?.category} required />
      <Input name="tags" placeholder="Tags, comma separated" value={tags} onChange={(event) => setTags(event.target.value)} />
      <Input name="images" placeholder="Image URLs, comma separated" value={images} onChange={(event) => setImages(event.target.value)} />
      <Input
        name="attributes"
        placeholder="Attributes like color:black, size:42"
        defaultValue={product?.attributes ? Object.entries(product.attributes).map(([key, value]) => `${key}:${value}`).join(", ") : ""}
      />
      <Button disabled={pending}>{pending ? "Saving..." : product?._id ? "Update product" : "Create product"}</Button>
      {message ? <p className={`text-sm ${statusTone === "error" ? "text-red-600" : statusTone === "success" ? "text-emerald-700" : "text-stone-600"}`}>{message}</p> : null}
    </form>
  );
}
