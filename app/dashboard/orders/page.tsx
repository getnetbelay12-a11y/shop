export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getSellerOrders, getSellerRequests } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function OrdersPage() {
  const session = await requireUser();
  const [orders, requests] = await Promise.all([
    getSellerOrders(session.user.id),
    getSellerRequests(session.user.id)
  ]);
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-3xl font-bold">Requests</h1>
        <p className="mt-2 text-sm text-stone-600">These are the buyer requests coming from the low-friction Buy flow.</p>
        {!requests.length ? <p className="mt-4 text-sm text-stone-600">No requests yet. Buyer requests will appear here immediately after they tap Buy.</p> : null}
        <div className="mt-6 grid gap-4">
          {requests.map((request) => (
            <div key={String(request._id)} className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{request.productId?.title || "Product request"}</h2>
                  <p className="text-sm text-stone-600">{request.customerPhone} • {request.customerName || "Unnamed buyer"}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">{request.status}</span>
              </div>
              {request.note ? <p className="mt-2 text-sm text-stone-600">{request.note}</p> : null}
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-400">{request.source} request</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="text-2xl font-semibold">Confirmed orders</h2>
        {!orders.length ? <p className="mt-4 text-sm text-stone-600">No confirmed orders yet. Full orders from older flows still appear here.</p> : null}
        <div className="mt-6 grid gap-4">
          {orders.map((order) => (
            <div key={String(order._id)} className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{order.name}</h2>
                  <p className="text-sm text-stone-600">{order.city} • {order.phone}</p>
                </div>
                <p className="font-semibold">{formatCurrency(order.total)}</p>
              </div>
              <p className="mt-2 text-sm text-stone-600">Qty {order.quantity} • {order.address} • {order.status}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
