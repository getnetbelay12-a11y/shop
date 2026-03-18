export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/card";
import { ProductForm } from "@/components/dashboard/product-form";
import { getSellerProducts } from "@/lib/data";
import { requireUser } from "@/lib/session";
import { DeleteProductButton } from "@/components/dashboard/delete-product-button";

export default async function ProductsPage() {
  const session = await requireUser();
  const products = await getSellerProducts(session.user.id);
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-sm text-stone-600">Create and manage your catalog.</p>
        <div className="mt-6">
          <ProductForm />
        </div>
      </Card>
      {!products.length ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold">No products yet</h2>
          <p className="mt-2 text-sm text-stone-600">Add your first product above to make this storefront ready for buyers.</p>
        </Card>
      ) : null}
      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={String(product._id)} className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{product.title}</h2>
                <p className="mt-1 text-sm text-stone-600">{product.category} • {product.price} ETB • stock {product.stock}</p>
              </div>
              <DeleteProductButton productId={String(product._id)} />
            </div>
            <div className="mt-6">
              <ProductForm
                product={{
                  _id: String(product._id),
                  title: product.title,
                  description: product.description,
                  price: product.price,
                  category: product.category,
                  stock: product.stock,
                  tags: product.tags,
                  images: product.images,
                  attributes: Object.fromEntries(Object.entries(product.attributes ?? {}))
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
