export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/card";
import { getSellerAnalytics } from "@/lib/data";
import { requireUser } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export default async function AnalyticsPage() {
  const session = await requireUser();
  const analytics = await getSellerAnalytics(session.user.id);
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Object.entries(analytics.grouped as Record<string, number>).map(([key, value]) => (
          <Card key={key} className="p-6">
            <p className="text-sm capitalize text-stone-500">{key.replace("_", " ")}</p>
            <p className="mt-2 text-4xl font-bold">{value}</p>
          </Card>
        ))}
        <Card className="p-6">
          <p className="text-sm text-stone-500">Revenue</p>
          <p className="mt-2 text-4xl font-bold">{formatCurrency(analytics.revenue)}</p>
        </Card>
      </div>
      <Card className="p-6">
        <h1 className="text-3xl font-bold">Recent events</h1>
        <div className="mt-6 grid gap-3">
          {analytics.recentEvents.map((event) => (
            <div key={String(event._id)} className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <p className="font-semibold capitalize">{event.type.replace("_", " ")}</p>
              <p className="mt-1 text-sm text-stone-600">{new Date(String(event.createdAt)).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
