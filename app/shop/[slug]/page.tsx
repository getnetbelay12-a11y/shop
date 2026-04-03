export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Shell } from "@/components/layout/shell";
import { AIChat } from "@/components/storefront/ai-chat";
import { ProductCard } from "@/components/product-card";
import { SearchFilters } from "@/components/storefront/search-filters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { connectToDatabase } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { recordAnalytics, searchStoreProducts } from "@/lib/data";
import { StorefrontModel } from "@/models/Storefront";

export default async function StorefrontPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { slug } = await params;
  const { q = "", category = "" } = await searchParams;
  await connectToDatabase();
  const store = (await StorefrontModel.findOne({ slug }).lean()) as any;
  if (!store || store.status !== "active") notFound();
  const products = (await searchStoreProducts(slug, q, category)) as any[];
  const categories = await ProductModel.distinct("category", { storeId: store._id });
  await recordAnalytics({ type: "store_view", storeId: String(store._id), sellerId: String(store.sellerId) });
  if (q) {
    await recordAnalytics({ type: "search", storeId: String(store._id), sellerId: String(store.sellerId), meta: { q } });
  }

  return (
    <Shell>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
        <Card className="overflow-hidden">
          <div className="relative h-64 w-full bg-stone-100 sm:h-72">
            {store.banner ? <Image src={store.banner} alt={store.storeName} fill className="object-cover" /> : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-5 text-white sm:p-7">
              <div className="max-w-3xl">
                <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur">Seller storefront</p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{store.storeName}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">{store.bio}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 p-4 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Products</p>
                <p className="mt-2 text-2xl font-bold">{products.length}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Language</p>
                <p className="mt-2 text-2xl font-bold">{store.language}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Contact</p>
                <p className="mt-2 text-base font-semibold">{store.phone}</p>
              </Card>
            </div>
            <SearchFilters categories={categories} />
            {q ? <p className="text-sm text-stone-600">Results for "{q}"</p> : null}
            {!products.length ? <Card className="p-6 text-sm text-stone-600">No products matched your search. Try another keyword or category.</Card> : null}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={String(product._id)} storeSlug={slug} product={{ ...product, _id: String(product._id), stock: product.stock }} />
              ))}
            </div>
          </div>
        </Card>
        <AIChat storeSlug={slug} />
        <Card className="mt-6 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Buy flow</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">Browse freely. Share contact details only when you place an order.</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Open any product to order. The seller will receive your phone number, address, and quantity only when you decide to buy.</p>
            </div>
            {products[0] ? (
              <Link href={`/shop/${slug}/product/${String(products[0]._id)}`}>
                <Button>
                  Open a product
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            ) : null}
          </div>
        </Card>
      </main>
    </Shell>
  );
}
