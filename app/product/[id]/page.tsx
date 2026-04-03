export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquareMore, Store } from "lucide-react";
import { Shell } from "@/components/layout/shell";
import { AIChat } from "@/components/storefront/ai-chat";
import { BuyRequestModal } from "@/components/storefront/buy-request-modal";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getGlobalProductById, getSimilarProducts, recordAnalytics } from "@/lib/data";

export default async function GlobalProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getGlobalProductById(id);
  if (!product) notFound();
  const similar = await getSimilarProducts(String(product._id));
  await recordAnalytics({ type: "product_view", storeId: String(product.storeId), sellerId: String(product.sellerId), productId: String(product._id) });

  return (
    <Shell>
      <main className="mx-auto max-w-[1400px] px-4 py-4 sm:py-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden rounded-2xl p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {(product.images?.length ? product.images : [""]).map((image: string, index: number) => (
                <div key={`${image}-${index}`} className="relative aspect-square rounded-2xl bg-stone-100">
                  {image ? <Image src={image} alt={product.title} fill className="rounded-2xl object-cover" /> : null}
                </div>
              ))}
            </div>
          </Card>
          <div className="grid gap-3 lg:sticky lg:top-24 lg:self-start">
            <Card className="rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Product</p>
                  <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">{product.title}</h1>
                </div>
                <Badge>{product.category}</Badge>
              </div>
              <p className="mt-3 text-3xl font-bold text-stone-950">{formatCurrency(product.price)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700">
                  <Store className="size-4" />
                  {product.storeName}
                </span>
                <span className="inline-flex rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-stone-700">{product.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(product.tags ?? []).map((tag: string) => <Badge key={tag}>{tag}</Badge>)}
              </div>
            </Card>
            <Card className="rounded-2xl p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Buy fast</p>
              <h2 className="mt-1.5 text-xl font-bold tracking-tight">Request this item</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Share your phone number only when you are ready. The seller gets the request immediately.</p>
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs font-medium text-emerald-800">
                Fast response: your request goes straight to the seller dashboard.
              </div>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <BuyRequestModal productId={String(product._id)} storeSlug={product.storeSlug} triggerLabel="Buy / Request item" />
                <Link href={`/shop/${product.storeSlug}`}>
                  <Button variant="outline" className="w-full sm:w-auto">Open seller store</Button>
                </Link>
              </div>
            </Card>
            <Card className="rounded-2xl p-5">
              <div className="flex items-center gap-2">
                <MessageSquareMore className="size-5 text-[var(--primary)]" />
                <h2 className="text-xl font-semibold">Questions? Chat with the seller</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600">Start with a quick message here. AI can help instantly, and the seller can continue the conversation in the same thread.</p>
            </Card>
          </div>
        </div>
        <section className="mt-6">
          <h2 className="mb-3 text-xl font-bold">Related items</h2>
          {similar.length ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
              {similar.map((item: any) => (
                <ProductCard
                  key={String(item._id)}
                  href={`/product/${String(item._id)}`}
                  product={{ ...item, _id: String(item._id), stock: item.stock, storeName: product.storeName }}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-sm text-stone-600">No close alternatives yet for this item.</Card>
          )}
        </section>
        <AIChat storeSlug={product.storeSlug} />
      </main>
    </Shell>
  );
}
