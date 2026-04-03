export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/card";
import { APP_NAME } from "@/config/app";
import { requireAdmin } from "@/lib/session";
import { getAdminData } from "@/lib/data";
import { getServiceStatus } from "@/lib/service-status";

export default async function AdminPage() {
  await requireAdmin();
  const [data, services] = await Promise.all([
    getAdminData(),
    getServiceStatus()
  ]);
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-4xl font-bold">Admin panel</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Sellers", data.sellers.length],
          ["Stores", data.stores.length],
          ["Products", data.products.length],
          ["Requests", data.requests.length]
        ].map(([label, value]) => (
          <Card key={label} className="p-6">
            <p className="text-sm text-stone-500">{label}</p>
            <p className="mt-3 text-4xl font-bold">{value}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-6 p-6">
        <h2 className="text-2xl font-semibold">Newest customer requests</h2>
        <div className="mt-4 grid gap-3">
          {!data.requests.length ? <p className="text-sm text-stone-600">No product requests yet.</p> : null}
          {data.requests.slice(0, 12).map((request) => (
            <div key={String(request._id)} className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{request.productId?.title || "Product request"}</p>
                  <p className="text-sm text-stone-600">
                    {request.customerPhone} • {request.customerName || "Unnamed buyer"} • {request.storefrontId?.storeName || "Store"}
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">{request.status}</span>
              </div>
              {request.note ? <p className="mt-2 text-sm text-stone-600">{request.note}</p> : null}
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-6 p-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {data.products.slice(0, 12).map((product) => (
            <div key={String(product._id)} className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <p className="font-semibold">{product.title}</p>
              <p className="mt-1 text-sm text-stone-600">{product.category} • {product.price} ETB • stock {product.stock}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">{APP_NAME} live services</h2>
            <p className="mt-2 text-sm text-stone-600">See which services are fully live and which ones are still running in fallback mode.</p>
          </div>
          <a href="/api/health" className="text-sm font-semibold text-teal-700">Open health JSON</a>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {services.map((service) => (
            <div key={service.key} className="rounded-2xl border border-[var(--border)] bg-white p-4">
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
      <Card className="mt-6 p-6">
        <h2 className="text-2xl font-semibold">Buyer and seller leads</h2>
        <div className="mt-4 grid gap-3">
          {!data.leads.length ? <p className="text-sm text-stone-600">No buyer or seller leads yet.</p> : null}
          {data.leads.map((lead) => (
            <div key={String(lead._id)} className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{lead.name || "Unnamed lead"}</p>
                  <p className="text-sm text-stone-600">{lead.intent} • {lead.phoneNumber || lead.email || "No contact"}</p>
                </div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase text-stone-700">{lead.source || "web"}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-6 p-6">
        <h2 className="text-2xl font-semibold">Stores</h2>
        <div className="mt-4 grid gap-3">
          {data.stores.map((store) => (
            <form key={String(store._id)} action={`/api/admin/stores/${store._id}/toggle`} method="post" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white p-4">
              <div>
                <p className="font-semibold">{store.storeName}</p>
                <p className="text-sm text-stone-600">/{store.slug} • {store.status}</p>
              </div>
              <button className="rounded-2xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white">
                {store.status === "active" ? "Suspend store" : "Activate store"}
              </button>
            </form>
          ))}
        </div>
      </Card>
    </main>
  );
}
