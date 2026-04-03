import Link from "next/link";
import { BarChart3, Boxes, MessagesSquare, PackageSearch, Settings, ShoppingBag, Store } from "lucide-react";

const items = [
  { href: "/dashboard/products", label: "Products", icon: Boxes },
  { href: "/dashboard/orders", label: "Requests", icon: ShoppingBag },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessagesSquare },
  { href: "/dashboard", label: "Overview", icon: Store },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/setup", label: "Store setup", icon: PackageSearch },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function DashboardSidebar() {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-[28px] border border-[var(--border)] bg-white/80 p-3 shadow-[var(--surface-shadow)] backdrop-blur">
        <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Seller workspace</p>
        <div className="grid gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100/80"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
                  <Icon className="size-4" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
