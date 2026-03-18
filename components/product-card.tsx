import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  storeSlug: string;
  product: {
    _id: string;
    title: string;
    price: number;
    category: string;
    images?: string[];
    tags?: string[];
    stock: number;
  };
};

export function ProductCard({ product, storeSlug }: ProductCardProps) {
  return (
    <Link href={`/shop/${storeSlug}/product/${product._id}`} className="group block">
      <Card className="overflow-hidden transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_55px_rgba(15,23,42,0.12)]">
        <div className="relative aspect-square bg-stone-100">
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-500">No image</div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-4">
            <div className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-800">
              {product.stock > 0 ? "Ready to order" : "Out of stock"}
            </div>
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">{product.title}</h3>
              <p className="mt-1 text-sm text-stone-500">{product.category}</p>
            </div>
            <Badge className="bg-stone-100/90">{product.stock > 0 ? "In stock" : "Sold out"}</Badge>
          </div>
          <div className="flex items-end justify-between gap-3">
            <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
            <span className="text-right text-xs text-stone-500">{product.tags?.slice(0, 2).join(" • ")}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
