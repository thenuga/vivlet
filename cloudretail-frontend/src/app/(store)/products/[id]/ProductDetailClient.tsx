"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { getProductById } from "@/lib/products";
import { moneyLKR } from "@/lib/money";
import AddToCartButton from "@/components/ui/AddToCartButton";


export default function ProductDetailClient({ id }: { id: string }) {
  const p = useMemo(() => getProductById(id), [id]);


  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState<string | null>(p?.colors?.[0] ?? null);
  const [size, setSize] = useState<string | null>(p?.sizes?.[0] ?? null);
  const [qty, setQty] = useState(1);

  if (!p) {
    return (
      <div className="card p-6">
        <div className="text-lg font-bold">Product not found</div>
      </div>
    );
  }

  const discount =
    p.oldPrice && p.oldPrice > p.price
      ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
      : null;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="card overflow-hidden">
          <div className="relative aspect-[4/3] bg-slate-100">
            <Image
              src={p.gallery[Math.min(activeImg, p.gallery.length - 1)]}
              alt={p.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          <div className="flex gap-2 overflow-auto p-3">
            {p.gallery.map((g, idx) => (
              <button 
                key={g}
                onClick={() => setActiveImg(idx)}
                className={`relative h-16 w-20 overflow-hidden rounded-xl ring-2 ${
                  idx === activeImg ? "ring-orange-500" : "ring-transparent"
                }`}
                type="button"
              >
                <Image src={g} alt={`${p.name} ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="card mt-6 p-6">
          <div className="text-lg font-extrabold">Description</div>
          <p className="mt-2 text-sm text-slate-700">{p.description}</p>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="card p-6">
          <div className="text-2xl font-extrabold">{p.name}</div>

          <div className="mt-2 text-sm text-slate-600">
            ⭐ {p.rating.toFixed(1)} · Ratings {p.ratingCount}
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <div className="text-3xl font-extrabold text-orange-600">
              {moneyLKR(p.price)}
            </div>
            {p.oldPrice ? (
              <div className="text-slate-400 line-through">{moneyLKR(p.oldPrice)}</div>
            ) : null}
            {discount !== null ? (
              <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                -{discount}%
              </div>
            ) : null}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="label">Color Family</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                      color === c
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                    type="button"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="label">Size</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-14 rounded-xl border px-3 py-2 text-sm font-semibold ${
                      size === s
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="label">Quantity</div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-slate-200 p-2">
                <button
                  className="btn-ghost h-9 w-10"
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  type="button"
                >
                  −
                </button>
                <div className="w-10 text-center text-sm font-bold">{qty}</div>
                <button
                  className="btn-ghost h-9 w-10"
                  onClick={() => setQty((v) => v + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
  <button
    type="button"
    className="btn-secondary h-12"
    onClick={() => alert("Demo: Buy Now (later we connect checkout)")}
  >
    Buy Now
  </button>

  <AddToCartButton product={p} qty={qty} color={color} size={size} />
</div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-bold">Cash on Delivery Available</div>
              <div className="mt-1 text-slate-600">
                Demo UI — later we connect real order flow.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
