import Link from "next/link";
import { Search } from "lucide-react";
import { APP_NAME } from "@/config/app";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/session";

export async function Shell({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  return (
    <div className="min-h-screen">
      <div className="border-b border-stone-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-2 text-[11px] font-medium">
          <p className="truncate text-slate-200">Browse first, compare products, and contact the seller only when you want to buy.</p>
          <Link href="/discover" className="hidden text-white/90 transition hover:text-white sm:inline-block">Browse stores</Link>
        </div>
      </div>
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/96 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#0f766e,#dd8d27)] text-sm font-bold text-white shadow-[0_10px_18px_rgba(15,118,110,0.16)]">
              S
            </span>
            <div className="min-w-0">
              <p className="text-lg font-semibold tracking-tight">{APP_NAME}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400">Marketplace</p>
            </div>
          </Link>
          <form action="/" className="order-3 w-full md:order-none md:flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <input
                name="q"
                placeholder="Search products..."
                className="h-11 w-full rounded-lg border border-stone-300 bg-stone-50 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--primary)] focus:bg-white"
              />
            </div>
          </form>
          <nav className="ml-auto flex items-center gap-1 text-sm">
            <Link href="/" className="hidden rounded-md px-3 py-2 text-stone-600 transition hover:bg-stone-100 sm:inline-block">Products</Link>
            <Link href="/discover" className="hidden rounded-md px-3 py-2 text-stone-600 transition hover:bg-stone-100 sm:inline-block">Stores</Link>
            {session?.user ? (
              <Link href={session.user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button className="rounded-lg">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login"><Button variant="ghost" className="rounded-lg">Sign in</Button></Link>
                <Link href="/signup"><Button className="rounded-lg">Sell on Shop</Button></Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <div className="pb-8">{children}</div>
    </div>
  );
}
