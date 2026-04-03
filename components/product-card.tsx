import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  storeSlug?: string;
  href?: string;
  product: {
    _id: string;
    title: string;
    price: number;
    category: string;
    images?: string[];
    tags?: string[];
    stock: number;
    storeName?: string;
  };
};

export function ProductCard({ product, storeSlug, href }: ProductCardProps) {
  const productHref = href || `/shop/${storeSlug}/product/${product._id}`;
  return (
    <Link href={productHref} className="group block">
      <Card className="overflow-hidden rounded-xl border-stone-200 bg-white transition duration-200 group-hover:-translate-y-0.5 group-hover:border-stone-300 group-hover:shadow-[var(--surface-shadow-strong)]">
        <div className="relative aspect-[4/5] bg-stone-100">
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-500">No image</div>
          )}
          <div className="absolute left-3 top-3">
            <div className="inline-flex rounded-full border border-white/80 bg-white/92 px-2.5 py-1 text-[10px] font-semibold text-stone-800 shadow-sm">
              {product.stock > 0 ? "Ready" : "Sold out"}
            </div>
          </div>
        </div>
        <div className="space-y-2.5 p-3">
          <div className="flex items-start justify-between gap-2.5">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">{product.storeName || product.category}</p>
              <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-5 tracking-tight text-stone-900 sm:text-sm">{product.title}</h3>
              <p className="mt-1 line-clamp-1 text-[11px] text-stone-500">{product.category}</p>
            </div>
            <Badge className="shrink-0 text-[10px]">{product.stock > 0 ? "In stock" : "Sold out"}</Badge>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-950">{formatCurrency(product.price)}</span>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-stone-400">ETB price</p>
            </div>
            <span className="line-clamp-1 text-right text-[11px] text-stone-500">{product.tags?.slice(0, 2).join(" • ")}</span>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-stone-100 pt-2">
            <span className="line-clamp-1 text-[11px] font-medium text-stone-500">{product.storeName ? `Sold by ${product.storeName}` : "Open product"}</span>
            <span className="inline-flex h-8 items-center justify-center rounded-md bg-[var(--primary)] px-3 text-[11px] font-semibold text-white transition group-hover:bg-slate-950">
              View
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
