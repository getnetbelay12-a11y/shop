import Link from "next/link";
import { APP_NAME } from "@/config/app";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/session";

export async function Shell({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(246,245,241,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e,#dd8d27)] text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,118,110,0.22)]">
              S
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight">{APP_NAME}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Social Commerce OS</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/discover" className="hidden rounded-full px-3 py-2 text-stone-600 transition hover:bg-white/70 sm:inline-block">Discover</Link>
            {session?.user ? (
              <Link href={session.user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login"><Button variant="ghost">Login</Button></Link>
                <Link href="/signup"><Button>Start selling</Button></Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <div className="pb-10">{children}</div>
    </div>
  );
}
