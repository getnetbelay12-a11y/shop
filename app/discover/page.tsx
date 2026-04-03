export const dynamic = "force-dynamic";

import Link from "next/link";
import { Shell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { connectToDatabase } from "@/lib/db";
import { StorefrontModel } from "@/models/Storefront";

export default async function DiscoverPage() {
  await connectToDatabase();
  const stores = await StorefrontModel.find({ status: "active" }).sort({ createdAt: -1 }).lean();
  return (
    <Shell>
      <main className="mx-auto max-w-[1400px] px-4 py-4 sm:py-5">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-stone-200 pb-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Stores</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Storefronts</h1>
          </div>
          <p className="text-xs font-medium text-stone-500 sm:text-sm">{stores.length} stores</p>
        </div>
        {!stores.length ? <Card className="p-6 text-sm text-stone-600">No active stores yet. Create a storefront or seed demo data to populate this page.</Card> : null}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {stores.map((store) => (
            <Link key={String(store._id)} href={`/shop/${store.slug}`}>
              <Card className="rounded-2xl border-stone-200 p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--surface-shadow-strong)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Seller storefront</p>
                <h2 className="mt-1.5 text-lg font-semibold tracking-tight">{store.storeName}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">{store.bio}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">/{store.slug}</p>
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-semibold text-stone-900">Open</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </Shell>
  );
}
