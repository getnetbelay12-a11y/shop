export const dynamic = "force-dynamic";

import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquareMore, Store } from "lucide-react";
import { Shell } from "@/components/layout/shell";
import { AIChat } from "@/components/storefront/ai-chat";
import { BuyRequestModal } from "@/components/storefront/buy-request-modal";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getProductById, getSimilarProducts, recordAnalytics } from "@/lib/data";

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const product = await getProductById(slug, id);
  if (!product) notFound();
  const similar = await getSimilarProducts(String(product._id));
  await recordAnalytics({ type: "product_view", storeId: String(product.storeId), sellerId: String(product.sellerId), productId: String(product._id) });

  return (
    <Shell>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden">
            <div className="grid gap-3 p-3 sm:grid-cols-2">
              {(product.images?.length ? product.images : [""]).map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-square rounded-3xl bg-stone-100">
                  {image ? <Image src={image} alt={product.title} fill className="rounded-3xl object-cover" /> : null}
                </div>
              ))}
            </div>
          </Card>
          <div className="grid gap-4">
            <Card className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Product</p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight">{product.title}</h1>
                </div>
                <Badge>{product.category}</Badge>
              </div>
              <p className="mt-4 text-3xl font-bold text-[var(--primary)]">{formatCurrency(product.price)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700">
                  <Store className="size-4" />
                  {product.storeName}
                </span>
                <span className="inline-flex rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-700">{product.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(product.tags ?? []).map((tag) => <Badge key={tag}>{tag}</Badge>)}
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold">Buy now</h2>
              <p className="mt-1 text-sm text-stone-600">Phone number only when you are ready. The seller receives your request directly.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <BuyRequestModal productId={String(product._id)} storeSlug={slug} triggerLabel="Buy / Request item" />
                <Link href={`/shop/${slug}`}>
                  <Button variant="outline" className="w-full sm:w-auto">Back to products</Button>
                </Link>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <MessageSquareMore className="size-5 text-[var(--primary)]" />
                <h2 className="text-xl font-semibold">Ask AI about this item</h2>
              </div>
              <p className="mt-1 text-sm text-stone-600">Use the AI chat button for questions about price, alternatives, size, or cheaper options.</p>
            </Card>
          </div>
        </div>
        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Similar items</h2>
          {similar.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {similar.map((item) => (
                <ProductCard key={String(item._id)} storeSlug={slug} product={{ ...item, _id: String(item._id), stock: item.stock }} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-sm text-stone-600">No close alternatives yet in this store.</Card>
          )}
        </section>
        <AIChat storeSlug={slug} />
      </main>
    </Shell>
  );
}
