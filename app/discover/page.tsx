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
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Discover seller storefronts</h1>
          <p className="mt-2 text-stone-600">Each shop is seller-owned and ready to share across social channels.</p>
        </div>
        {!stores.length ? <Card className="p-6 text-sm text-stone-600">No active stores yet. Create a storefront or seed demo data to populate this page.</Card> : null}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stores.map((store) => (
            <Link key={String(store._id)} href={`/shop/${store.slug}`}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold">{store.storeName}</h2>
                <p className="mt-2 text-sm text-stone-600">{store.bio}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-500">/{store.slug}</p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </Shell>
  );
}
