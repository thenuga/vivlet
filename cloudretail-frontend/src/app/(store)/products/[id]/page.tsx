"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, type Product } from "@/lib/catalogApi";
import { addToCart } from "@/lib/cart";
import { moneyLKR } from "@/lib/money";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=60";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params?.id;

  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setErr(null);
        setLoading(true);

        // backend returns { product: {...} }
        const res = await getProductById(id);

        // IMPORTANT: take res.product (not res)
        setP(res.product ?? null);
      } catch (e: any) {
        setErr(e?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="card p-6 text-sm opacity-70">Loading...</div>;
  if (err) return <div className="card p-6 text-sm text-red-600">{err}</div>;
  if (!p) return <div className="card p-6 text-sm">Product not found.</div>;

  const img = p.imageUrl?.trim() ? p.imageUrl : FALLBACK_IMG;

  return (
    <div className="card p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={img}
            alt={p.name || "Product image"}   // ✅ fixes missing alt
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          <div className="text-2xl font-extrabold">{p.name}</div>
          <div className="mt-1 text-sm text-slate-600">{p.category || "General"}</div>

          <div className="mt-4 text-2xl font-extrabold text-orange-600">
            {moneyLKR(Number(p.price || 0))}
          </div>

          <div className="mt-4 text-sm text-slate-700 whitespace-pre-line">
            {p.description || "—"}
          </div>

          <button
            className="btn-primary mt-6"
            type="button"
            onClick={() => {
              // ✅ map backend product -> cart item shape
              addToCart({
                productId: p.id,                // THIS fixes missing id
                name: p.name,
                price: Number(p.price || 0),
                qty: 1,
                imageUrl: img,
                color: null,
                size: null,
              });

              router.push("/cart");
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
