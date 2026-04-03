import Link from "next/link";
import { PackageCheck, Search, SlidersHorizontal, Sparkles, Store } from "lucide-react";
import { Shell } from "@/components/layout/shell";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getMarketplaceCategories, getMarketplaceProducts } from "@/lib/data";

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q = "", category = "", sort = "newest" } = await searchParams;
  const [products, categories] = await Promise.all([
    getMarketplaceProducts({ query: q, category, sort, limit: 36 }),
    getMarketplaceCategories()
  ]);

  const featuredProducts = products.slice(0, 12);
  const recentProducts = products.slice(12, 24);
  const valueProducts = [...products].sort((a: any, b: any) => a.price - b.price).slice(0, 10);
  const sideProducts = products.slice(0, 2);
  const isFiltered = Boolean(q || category);

  return (
    <Shell>
      <main className="mx-auto max-w-[1400px] px-4 py-3 sm:py-4">
        <section className="grid gap-3 lg:grid-cols-[250px_minmax(0,1fr)]">
          <Card className="hidden border-stone-200 p-4 lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Popular categories</p>
            <div className="mt-3 grid gap-2">
              <Link
                href="/"
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${!category ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"}`}
              >
                All products
              </Link>
              {categories.slice(0, 9).map((item) => (
                <Link
                  key={item}
                  href={`/?category=${encodeURIComponent(item)}`}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${category === item ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"}`}
                >
                  {item}
                </Link>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-semibold text-stone-900">Buy directly from sellers</p>
              <p className="mt-1 text-xs leading-5 text-stone-600">Browse products first, compare prices in ETB, then send a simple request when you are ready.</p>
            </div>
          </Card>

          <div className="space-y-3">
            <Card className="border-stone-200 p-3 sm:p-4">
              <form className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_150px_150px_104px]" action="/">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search products..."
                    className="h-11 w-full rounded-lg border border-stone-300 bg-white pl-10 pr-4 text-sm outline-none shadow-sm focus:border-[var(--primary)]"
                  />
                </div>
                <select
                  name="category"
                  defaultValue={category}
                  className="h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-700 shadow-sm"
                >
                  <option value="">All categories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <select
                  name="sort"
                  defaultValue={sort}
                  className="h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-700 shadow-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price low</option>
                  <option value="price-desc">Price high</option>
                </select>
                <Button className="h-11 gap-2 rounded-lg"><SlidersHorizontal className="size-4" />Search</Button>
              </form>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                <Link href="/"><Button variant={!category ? "secondary" : "outline"} className="h-8 shrink-0 rounded-full px-3.5 text-[11px]">All</Button></Link>
                {categories.slice(0, 10).map((item) => (
                  <Link key={item} href={`/?category=${encodeURIComponent(item)}`}>
                    <Button variant={category === item ? "secondary" : "outline"} className="h-8 shrink-0 rounded-full px-3.5 text-[11px]">{item}</Button>
                  </Link>
                ))}
              </div>
            </Card>

            {!isFiltered ? (
              <section className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                <Card className="border-stone-200 bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-5 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Marketplace picks</p>
                  <h1 className="mt-2 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">Clean product discovery for buyers. Fast request flow for sellers.</h1>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-200">Search, compare, and open product pages without login. Share your phone number only when you want the seller to contact you.</p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm">
                      <Store className="size-4" />
                      Storefront browsing
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm">
                      <PackageCheck className="size-4" />
                      Direct requests to sellers
                    </div>
                  </div>
                </Card>
                <div className="grid gap-3">
                  <Card className="border-stone-200 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Fresh this week</p>
                    <div className="mt-3 space-y-3">
                      {sideProducts.map((product: any) => (
                        <Link key={String(product._id)} href={`/product/${String(product._id)}`} className="flex items-center gap-3 rounded-lg border border-stone-200 p-2.5 transition hover:bg-stone-50">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={product.images?.[0] || ""} alt={product.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-semibold text-stone-900">{product.title}</p>
                            <p className="mt-1 text-sm font-bold text-stone-950">{formatCurrency(product.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Card>
                  <Card className="border-stone-200 p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-[var(--secondary)]" />
                      <p className="text-sm font-semibold text-stone-900">Fast browsing</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-600">Open products quickly, compare ETB prices, and message the seller from the product page when you need details.</p>
                  </Card>
                </div>
              </section>
            ) : null}
          </div>
        </section>

        <section className="mt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Featured</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">
                {q ? `Results for "${q}"` : category ? category : "Featured products"}
              </h2>
            </div>
            <p className="text-xs font-medium text-stone-500 sm:text-sm">{products.length} items</p>
          </div>
          {!products.length ? (
            <div className="rounded-xl border border-[var(--border)] bg-white p-6 text-sm text-stone-600">No products matched this search. Try another keyword or category.</div>
          ) : null}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {featuredProducts.map((product: any) => (
              <ProductCard
                key={String(product._id)}
                href={`/product/${String(product._id)}`}
                product={{
                  ...product,
                  _id: String(product._id),
                  stock: product.stock,
                  storeName: product.storeName
                }}
              />
            ))}
          </div>
        </section>

        {recentProducts.length ? (
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">New arrivals</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">Recently added</h2>
              </div>
              <Link href="/discover" className="text-sm font-medium text-[var(--primary)]">Browse stores</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {recentProducts.map((product: any) => (
                <ProductCard
                  key={String(product._id)}
                  href={`/product/${String(product._id)}`}
                  product={{
                    ...product,
                    _id: String(product._id),
                    stock: product.stock,
                    storeName: product.storeName
                  }}
                />
              ))}
            </div>
          </section>
        ) : null}

        {valueProducts.length ? (
          <section className="mt-6">
            <div className="mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Value picks</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">Affordable products</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {valueProducts.map((product: any) => (
                <ProductCard
                  key={`value-${String(product._id)}`}
                  href={`/product/${String(product._id)}`}
                  product={{
                    ...product,
                    _id: String(product._id),
                    stock: product.stock,
                    storeName: product.storeName
                  }}
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </Shell>
  );
}
