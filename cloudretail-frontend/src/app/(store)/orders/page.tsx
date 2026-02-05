"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/orderApi";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.orders || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load orders");
      }
    })();
  }, []);

  return (
    <div className="page space-y-4">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="text-sm opacity-70 mt-1">
          Track your order status updates.
        </p>

        {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}

        <div className="mt-4 grid gap-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/order/${o.id}`}
              className="block border border-black/10 rounded-xl p-4 hover:bg-black/5"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">Order #{o.id.slice(0, 8)}</div>
                <div className="text-sm opacity-80">{o.status}</div>
              </div>
              <div className="text-sm opacity-70 mt-1">
                Items: {o.items?.length || 0} • {new Date(o.createdAt).toLocaleString()}
              </div>
            </Link>
          ))}
          {!orders.length && !error ? (
            <div className="text-sm opacity-70">No orders yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
