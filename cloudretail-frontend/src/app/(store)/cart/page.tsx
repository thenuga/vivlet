"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cartTotals, readCart, removeItem, updateQty, type CartItem } from "@/lib/cart";
import { moneyLKR } from "@/lib/money";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = () => setItems(readCart());

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("cloudretail:cart", onChange);
    return () => window.removeEventListener("cloudretail:cart", onChange);
  }, []);

  const totals = useMemo(() => cartTotals(items), [items]);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="card p-6">
          <div className="text-xl font-extrabold">Shopping Cart</div>

          {items.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold">Your cart is empty.</div>
              <Link href="/products" className="btn-primary mt-4 inline-flex">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {items.map((it, idx) => (
                <div key={`${it.productId}-${idx}`} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-slate-100">
                      <Image
  src={it.imageUrl?.trim() ? it.imageUrl : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=60"}
  alt={it.name}
  fill
  className="object-cover"
/>

                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-bold">{it.name}</div>
                      <div className="mt-1 text-xs text-slate-600">
                        Color: {it.color ?? "-"} · Size: {it.size ?? "-"}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm font-extrabold text-orange-600">
                          {moneyLKR(it.price)}
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 p-2">
                          <button
                            type="button"
                            className="btn-ghost h-9 w-10"
                            onClick={() => {
                              updateQty(idx, it.qty - 1);
                              refresh();
                            }}
                          >
                            −
                          </button>
                          <div className="w-10 text-center text-sm font-bold">{it.qty}</div>
                          <button
                            type="button"
                            className="btn-ghost h-9 w-10"
                            onClick={() => {
                              updateQty(idx, it.qty + 1);
                              refresh();
                            }}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => {
                            removeItem(idx);
                            refresh();
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="card p-6">
          <div className="text-lg font-extrabold">Order Summary</div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Items</span>
            <span className="font-bold">{totals.totalQty}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-bold">{moneyLKR(totals.subtotal)}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-600">Shipping</span>
            <span className="font-bold">{moneyLKR(0)}</span>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4 flex items-center justify-between">
            <span className="text-sm font-bold">Total</span>
            <span className="text-lg font-extrabold text-orange-600">
              {moneyLKR(totals.subtotal)}
            </span>
          </div>

          <Link
            href="/checkout"
            className={`btn-primary mt-5 h-12 w-full ${items.length === 0 ? "pointer-events-none opacity-50" : ""}`}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
