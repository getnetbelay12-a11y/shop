import { NextResponse } from "next/server";
import { getMarketplaceCategories, getMarketplaceProducts } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  const [products, categories] = await Promise.all([
    getMarketplaceProducts({ query: q, category, sort, limit: 24 }),
    getMarketplaceCategories()
  ]);

  return NextResponse.json({
    products: products.map((product: any) => ({
      _id: String(product._id),
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      tags: product.tags ?? [],
      images: product.images ?? [],
      storeName: product.storeName,
      storeSlug: product.storeSlug
    })),
    categories
  });
}
