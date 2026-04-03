import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { StorefrontModel } from "@/models/Storefront";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  await connectToDatabase();
  const store = await StorefrontModel.findOne({ slug, status: "active" }).lean() as any;
  if (!store) {
    return NextResponse.json({ error: "Store not found." }, { status: 404 });
  }

  const products = await ProductModel.find({ storeId: store._id })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean() as any[];

  return NextResponse.json({
    store: {
      _id: String(store._id),
      storeName: store.storeName,
      slug: store.slug,
      bio: store.bio,
      phone: store.phone,
      language: store.language
    },
    products: products.map((product: any) => ({
      _id: String(product._id),
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      tags: product.tags ?? [],
      images: product.images ?? []
    }))
  });
}
