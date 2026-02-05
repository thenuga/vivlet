"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/orderApi";
import { readCart, clearCart } from "@/lib/cart";
import { getUserFromToken } from "@/lib/auth";

export default function CheckoutPage() {
  const router = useRouter();

  // Cart snapshot (client-only)
  const cart = useMemo(() => readCart(), []);

  // Auth check (client-only)
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const u = getUserFromToken();
    if (!u) {
      router.replace("/auth/login?next=/checkout");
      return;
    }
    setUserId(u.id || null);
    setCheckingAuth(false);
  }, [router]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const total = useMemo(() => {
    return cart.reduce((sum: number, it: any) => sum + Number(it.price) * Number(it.qty), 0);
  }, [cart]);

  async function onPlaceOrder() {
    setError("");

    // If somehow userId isn't ready yet
    if (!userId) {
      setError("Not logged in");
      router.replace("/auth/login?next=/checkout");
      return;
    }

    if (!name || !phone || !address) {
      setError("Fill billing name, phone and address.");
      return;
    }

    if (!cart.length) {
      setError("Cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: cart.map((it: any) => ({
          productId: String(it.id || it.productId),
          name: String(it.name),
          price: Number(it.price),
          qty: Number(it.qty),
          imageUrl: String(it.imageUrl || ""),
        })),
        billing: {
          name,
          phone,
          address,
        },
      };

      const res = await createOrder(payload);

      clearCart();
      router.push(`/order/${res.order.id}?success=1`);
    } catch (e: any) {
      setError(e?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  // While redirecting, don't flash the page
  if (checkingAuth) {
    return (
      <div className="page">
        <div className="card p-6 text-sm opacity-70">Checking login...</div>
      </div>
    );
  }

  return (
    <div className="page space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm opacity-70 mt-1">
          Enter billing info and place your order.
        </p>

        <div className="mt-6 grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Full Name</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Eg: Awsaf"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Phone</span>
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Eg: 07X XXX XXXX"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Address</span>
            <textarea
              className="input min-h-[90px]"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Eg: Colombo"
            />
          </label>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <div className="flex items-center justify-between mt-2">
            <div className="text-sm  text-red-600">
              Total: <span className="font-bold text-sm text-red-600">Rs. {total}</span>
            </div>

            <button
  onClick={onPlaceOrder}
  disabled={loading}
  className="
    rounded-xl
    bg-orange-600
    px-6
    py-2.5
    text-lg
    font-semibold
    text-white
    transition
    hover:bg-orange-700
    active:scale-95
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
>
  {loading ? "Placing..." : "Place Order"}
</button>

          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Items</h2>
        <div className="mt-3 grid gap-2">
          {cart.map((it: any) => (
            <div
              key={it.id || it.productId}
              className="flex items-center justify-between border-b border-black/5 pb-2"
            >
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm opacity-70">
                  Rs. {it.price} × {it.qty}
                </div>
              </div>
              <div className="font-semibold">Rs. {Number(it.price) * Number(it.qty)}</div>
            </div>
          ))}
          {!cart.length ? <div className="text-sm opacity-70">No items.</div> : null}
        </div>
      </div>
    </div>
  );
}
