"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { adminDeleteProduct, adminGetProducts, type CatalogProduct } from "@/lib/adminCatalogApi";
import { moneyLKR } from "@/lib/money";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=60";

export default function AdminProducts() {
  const [items, setItems] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    try {
      setErr(null);
      setLoading(true);
      const res = await adminGetProducts();
      setItems(res.products || []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold">Products</div>
          <div className="mt-2 text-sm text-slate-600">Create / edit / delete products (DB).</div>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + New Product
        </Link>
      </div>

      {loading ? <div className="mt-6 text-sm opacity-70">Loading...</div> : null}
      {err ? <div className="mt-6 text-sm text-red-600">{err}</div> : null}

      <div className="mt-6 space-y-4">
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex gap-4">
              <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={p.imageUrl?.trim() ? p.imageUrl : FALLBACK_IMG}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="text-sm font-bold">{p.name}</div>
                <div className="mt-1 text-xs text-slate-600 line-clamp-2">{p.description}</div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-extrabold text-orange-600">{moneyLKR(p.price)}</div>

                  <div className="flex gap-2">
                    <Link className="btn-ghost" href={`/admin/products/${p.id}/edit`}>
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={async () => {
                        await adminDeleteProduct(p.id);
                        refresh();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-500">Stock: {p.stock ?? 0}</div>
              </div>
            </div>
          </div>
        ))}

        {!loading && !err && items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm">
            No products yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
