"use client";

import { useEffect, useState } from "react";
import { adminGetAllOrders, adminUpdateOrderStatus, type Order } from "@/lib/orderApi";
import { moneyLKR } from "@/lib/money";

const STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await adminGetAllOrders();
      setOrders(res.orders || []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load admin orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onChangeStatus(orderId: string, status: string) {
    setErr(null);
    try {
      await adminUpdateOrderStatus(orderId, { status, note: `Status updated to ${status}` });
      await load();
    } catch (e: any) {
      setErr(e?.message || "Failed to update status");
    }
  }

  return (
    <div className="page space-y-4">
      <div className="card p-6">
        <div className="text-2xl font-extrabold">Admin Orders</div>
        <div className="mt-2 text-sm text-slate-600">Manage orders and update status.</div>

        {loading ? <div className="mt-4 text-sm opacity-70">Loading...</div> : null}
        {err ? <div className="mt-4 text-sm text-red-600">{err}</div> : null}

        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold">#{o.id}</div>
                  <div className="mt-1 text-xs text-slate-600">User: {o.userId}</div>
                  <div className="mt-1 text-xs text-slate-600">
                    Billing: {o.billingName} · {o.billingPhone}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs rounded-full border px-3 py-1 font-semibold">
                    {o.status}
                  </div>

                  <select
                    className="input h-12"
                    value={o.status}
                    onChange={(e) => onChangeStatus(o.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 border-t border-slate-200 pt-3">
                <div className="text-sm font-semibold">Items</div>
                <div className="mt-2 space-y-2">
                  {o.items?.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="font-medium">{it.name}</div>
                      <div className="opacity-70">
                        {moneyLKR(it.price)} × {it.qty}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-sm font-semibold">Timeline</div>
                <div className="mt-2 space-y-2">
                  {o.timeline?.map((t, idx) => (
                    <div key={idx} className="text-xs text-slate-700">
                      <span className="font-bold">{t.status}</span> — {t.note || "-"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {!loading && orders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm">
              No orders yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
