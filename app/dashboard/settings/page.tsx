export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/card";
import { StoreSetupForm } from "@/components/dashboard/store-setup-form";
import { getSellerStore } from "@/lib/data";
import { getServiceStatus } from "@/lib/service-status";
import { requireUser } from "@/lib/session";

export default async function SettingsPage() {
  const session = await requireUser();
  const [store, services] = await Promise.all([
    getSellerStore(session.user.id),
    getServiceStatus()
  ]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-3xl font-bold">Seller settings</h1>
        <p className="mt-2 text-sm text-stone-600">Manage your phone-first identity and storefront details.</p>
        <div className="mt-4 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
          <p className="font-semibold">Verified phone number</p>
          <p className="mt-1">{session.user.phoneNumber || store?.phone || "No phone on file"}</p>
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Store information</h2>
        <div className="mt-6">
          <StoreSetupForm
            setup={store ? {
              storeName: store.storeName,
              slug: store.slug,
              bio: store.bio,
              phone: store.phone,
              logo: store.logo,
              banner: store.banner,
              language: store.language
            } : { phone: session.user.phoneNumber }}
          />
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Service status</h2>
        <p className="mt-2 text-sm text-stone-600">Confirm what is fully live versus what is still using fallback behavior before a seller demo.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
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
    </div>
  );
}
