export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { Shell } from "@/components/layout/shell";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { requireUser } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser();
  if (session.user.role === "admin") redirect("/admin");

  return (
    <Shell>
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr] lg:py-10">
        <DashboardSidebar />
        <section className="min-w-0">{children}</section>
      </main>
    </Shell>
  );
}
