import Link from "next/link";
import Image from "next/image";
import { moneyLKR } from "@/lib/money";
import type { CatalogProduct } from "@/lib/catalogApi";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=60";

export default function ProductCard({ p }: { p: CatalogProduct }) {
  const img = p.imageUrl?.trim() ? p.imageUrl : FALLBACK_IMG;

  return (
    <Link
      href={`/products/${p.id}`}
      className="card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        <Image
          src={img}
          alt={p.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-4">
        <div className="line-clamp-2 text-sm font-semibold">{p.name}</div>
        <div className="mt-2 text-lg font-extrabold text-orange-600">
          {moneyLKR(Number(p.price || 0))}
        </div>
        {p.stock !== undefined ? (
          <div className="mt-2 text-xs text-slate-600">Stock: {p.stock}</div>
        ) : null}
      </div>
    </Link>
  );
}
