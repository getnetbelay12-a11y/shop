import { NextResponse } from "next/server";
import { getGlobalProductById, getSimilarProducts } from "@/lib/data";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const product = await getGlobalProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const similar = await getSimilarProducts(String(product._id));
  return NextResponse.json({
    product: {
      ...product,
      _id: String(product._id),
      storeId: String(product.storeId)
    },
    similar: similar.map((item: any) => ({
      _id: String(item._id),
      title: item.title,
      price: item.price,
      category: item.category,
      stock: item.stock,
      tags: item.tags ?? [],
      images: item.images ?? [],
      storeSlug: product.storeSlug,
      storeName: product.storeName
    }))
  });
}
