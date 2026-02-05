"use client";

import { useEffect, useState } from "react";
import { getOrder, type Order } from "@/lib/orders";
import { moneyLKR } from "@/lib/money";

export default function OrderDetailClient({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    setOrder(getOrder(id));
    const onChange = () => setOrder(getOrder(id));
    window.addEventListener("cloudretail:orders", onChange);
    return () => window.removeEventListener("cloudretail:orders", onChange);
  }, [id]);

  if (!order) {
    return (
      <div className="card p-6">
        <div className="text-lg font-bold">Order not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-extrabold">Order {order.id}</div>
            <div className="mt-2 text-sm text-slate-600">
              Status: <b>{order.status}</b> · Placed:{" "}
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-600">Total</div>
            <div className="text-2xl font-extrabold text-orange-600">
              {moneyLKR(order.subtotal)}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="text-lg font-extrabold">Tracking Timeline</div>

        <div className="mt-4 grid gap-3">
          {order.history.map((h, i) => (
            <div
              key={`${h.status}-${h.timestamp}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="h-9 w-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-extrabold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{h.status}</div>
                <div className="text-xs text-slate-600">
                  {new Date(h.timestamp).toLocaleString()}
                  {h.note ? ` · ${h.note}` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="text-lg font-extrabold">Delivery Details</div>
        <div className="mt-3 text-sm text-slate-700 space-y-1">
          <div>
            <b>{order.customer.name}</b> ({order.customer.label})
          </div>
          <div>{order.customer.phone}</div>
          <div>
            {order.customer.addressLine1}
            {order.customer.addressLine2 ? `, ${order.customer.addressLine2}` : ""}
          </div>
          <div>
            {order.customer.city}, {order.customer.district}, {order.customer.province}
          </div>
        </div>
      </div>
    </div>
  );
}
