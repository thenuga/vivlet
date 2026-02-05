"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { getMyOrderById } from "@/lib/orderApi";

export default function OrderDetailPage() {
  const params = useParams();
  const search = useSearchParams();
  const id = useMemo(() => String(params.id || ""), [params]);

  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const success = search.get("success") === "1";

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getMyOrderById(id);
        setOrder(res.order);
      } catch (e: any) {
        setError(e?.message || "Failed to load order");
      }
    })();
  }, [id]);

  return (
    <div className="page space-y-4">
      {success ? (
        <div className="card p-6 border border-green-500/30">
          <div className="text-lg font-semibold text-green-700">
            ✅ Order placed successfully
          </div>
          <div className="text-sm opacity-70 mt-1">
            You can track status updates below.
          </div>
        </div>
      ) : null}

      <div className="card p-6">
        <h1 className="text-2xl font-semibold">Order Details</h1>

        {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}

        {order ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">#{order.id}</div>
              <div className="text-sm opacity-80">{order.status}</div>
            </div>

            <div className="text-sm opacity-70">
              Placed: {new Date(order.createdAt).toLocaleString()}
            </div>

            <div className="border-t border-black/10 pt-4">
              <div className="font-semibold">Billing</div>
              <div className="text-sm opacity-80 mt-1">
                {order.billingName || "-"} • {order.billingPhone || "-"}
              </div>
              <div className="text-sm opacity-70">
                {order.billingAddress || "-"}
              </div>
            </div>

            <div className="border-t border-black/10 pt-4">
              <div className="font-semibold">Items</div>
              <div className="mt-2 grid gap-2">
                {(order.items || []).map((it: any) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between border border-black/10 rounded-xl p-3"
                  >
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm opacity-70">
                        Rs. {it.price} × {it.qty}
                      </div>
                    </div>
                    <div className="font-semibold">Rs. {it.price * it.qty}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-black/10 pt-4">
              <div className="font-semibold">Tracking Timeline</div>
              <div className="mt-2 grid gap-2">
                {(order.timeline || [])
                  .slice()
                  .sort(
                    (a: any, b: any) =>
                      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                  )
                  .map((t: any) => (
                    <div
                      key={t.id}
                      className="border border-black/10 rounded-xl p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{t.status}</div>
                        <div className="text-xs opacity-70">
                          {new Date(t.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {t.note ? (
                        <div className="text-sm opacity-70 mt-1">{t.note}</div>
                      ) : null}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          !error && <div className="text-sm opacity-70 mt-4">Loading...</div>
        )}
      </div>
    </div>
  );
}
