"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllProducts, type Product } from "@/lib/catalogApi";
import { moneyLKR } from "@/lib/money";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=60";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const res = await getAllProducts();
        setProducts(res.products || []);
      } catch (e: any) {
        setErr(e?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => (p.name || "").toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div className="page space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm opacity-70">Best Selling Products</p>
        </div>

        <input
          className="input w-[260px]"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? <div className="card p-6 text-sm opacity-70">Loading...</div> : null}
      {err ? <div className="card p-6 text-sm text-red-600">{err}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const img = p.imageUrl?.trim() ? p.imageUrl : FALLBACK_IMG;

          return (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="card overflow-hidden hover:shadow-md transition"
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
                <div className="font-semibold line-clamp-2">{p.name}</div>
                <div className="text-sm opacity-70 mt-1">{p.category || "General"}</div>
                <div className="mt-3 font-bold text-orange-600">{moneyLKR(Number(p.price || 0))}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {!loading && !err && filtered.length === 0 ? (
        <div className="card p-6 text-sm opacity-70">No products found.</div>
      ) : null}
    </div>
  );
}
