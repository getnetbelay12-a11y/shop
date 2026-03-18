export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/card";
import { StoreSetupForm } from "@/components/dashboard/store-setup-form";
import { getSellerStore } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function SetupPage() {
  const session = await requireUser();
  const store = await getSellerStore(session.user.id);
  return (
    <Card className="p-6">
      <h1 className="text-3xl font-bold">Seller setup</h1>
      <p className="mt-2 text-sm text-stone-600">Brand your storefront and choose the public shop slug.</p>
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
          } : undefined}
        />
      </div>
    </Card>
  );
}
