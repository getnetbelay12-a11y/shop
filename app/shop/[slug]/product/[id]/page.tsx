export const dynamic = "force-dynamic";

import Image from "next/image";
import { notFound } from "next/navigation";
import { Shell } from "@/components/layout/shell";
import { AIChat } from "@/components/storefront/ai-chat";
import { OrderForm } from "@/components/storefront/order-form";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
                <Badge>{product.category}</Badge>
              </div>
              <p className="mt-4 text-2xl font-bold text-[var(--primary)]">{formatCurrency(product.price)}</p>
              <p className="mt-4 whitespace-pre-wrap text-stone-700">{product.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(product.tags ?? []).map((tag) => <Badge key={tag}>{tag}</Badge>)}
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-semibold">Order now</h2>
              <p className="mt-1 text-sm text-stone-600">Quick checkout for social buyers.</p>
              <div className="mt-4">
                <OrderForm productId={String(product._id)} storeSlug={slug} />
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-semibold">Ask AI about this item</h2>
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
