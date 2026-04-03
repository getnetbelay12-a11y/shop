export const dynamic = "force-dynamic";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardMetrics, getSellerRequests } from "@/lib/data";
import { getServiceStatus } from "@/lib/service-status";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireUser();
  const [metrics, services, requests] = await Promise.all([
    getDashboardMetrics(session.user.id),
    getServiceStatus(),
    getSellerRequests(session.user.id)
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller overview</h1>
          <p className="mt-1 text-sm text-stone-600">Products and incoming buyer requests come first.</p>
        </div>
        <Link href="/dashboard/products"><Button>Add product</Button></Link>
      </div>
      {!metrics ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Set up your store first</h2>
          <p className="mt-2 text-sm text-stone-600">Create your seller storefront before adding products.</p>
          <Link href="/dashboard/setup" className="mt-4 inline-block"><Button>Open setup</Button></Link>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
            ["New requests", metrics.requests],
            ["Products", metrics.products],
            ["Orders", metrics.orders],
            ["Low stock", metrics.lowStock],
            ["Visits", metrics.visits]
            ].map(([label, value]) => (
              <Card key={label} className="p-6">
                <p className="text-sm text-stone-500">{label}</p>
                <p className="mt-3 text-4xl font-bold tracking-tight">{value}</p>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold">Recent buyer requests</h2>
              {!requests.length ? <p className="mt-2 text-sm text-stone-600">No requests yet. New customer requests will appear here as soon as buyers tap Buy.</p> : null}
              <div className="mt-4 grid gap-3">
                {requests.slice(0, 4).map((request) => (
                  <div key={String(request._id)} className="rounded-2xl border border-[var(--border)] bg-white/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{request.productId?.title || "Product request"}</p>
                        <p className="mt-1 text-sm text-stone-600">{request.customerPhone} • {request.customerName || "Unnamed buyer"}</p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">{request.status}</span>
                    </div>
                    {request.note ? <p className="mt-2 text-sm text-stone-600">{request.note}</p> : null}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-semibold">Storefront</h2>
              <p className="mt-2 text-sm text-stone-600">/{metrics.store.slug}</p>
              <p className="mt-3 text-sm text-stone-600">{metrics.store.bio}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/shop/${metrics.store.slug}`}><Button variant="secondary">Open shop</Button></Link>
                <Link href="/dashboard/orders"><Button variant="outline">Open requests</Button></Link>
              </div>
            </Card>
          </div>
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Live services</h2>
                <p className="mt-2 text-sm text-stone-600">Operational status for the services powering your seller demo.</p>
              </div>
              <Link href="/api/health" className="text-sm font-semibold text-teal-700">Open health JSON</Link>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {services.map((service) => (
                <div key={service.key} className="rounded-2xl border border-[var(--border)] bg-white/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{service.label}</p>
                    <span className={
                      service.mode === "live"
                        ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                        : service.mode === "fallback"
                          ? "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700"
                          : service.mode === "disabled"
                            ? "rounded-full bg-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-700"
                            : "rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700"
                    }>
                      {service.mode}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{service.summary}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
