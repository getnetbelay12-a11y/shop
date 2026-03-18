export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getSellerOrders } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function OrdersPage() {
  const session = await requireUser();
  const orders = await getSellerOrders(session.user.id);
  return (
    <Card className="p-6">
      <h1 className="text-3xl font-bold">Orders</h1>
      {!orders.length ? <p className="mt-4 text-sm text-stone-600">No orders yet. New storefront orders will appear here.</p> : null}
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
  );
}
