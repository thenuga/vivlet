"use client";

import { listOrders } from "@/lib/orders";
import { moneyLKR } from "@/lib/money";
import { useEffect, useMemo, useState } from "react";

export default function AdminHome() {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("cloudretail:orders", onChange);
    return () => window.removeEventListener("cloudretail:orders", onChange);
  }, []);

  // ⛔ Do NOT compute stats until mounted
  const stats = useMemo(() => {
    if (!mounted) {
      return { totalOrders: 0, totalRevenue: 0, pending: 0 };
    }

    const orders = listOrders();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + o.subtotal, 0);
    const pending = orders.filter(
      (o) => o.status === "PLACED" || o.status === "CONFIRMED"
    ).length;

    return { totalOrders, totalRevenue, pending };
  }, [mounted, tick]);

  if (!mounted) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-6">Loading...</div>
        <div className="card p-6">Loading...</div>
        <div className="card p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="card p-6">
        <div className="text-sm text-slate-600">Total Orders</div>
        <div className="mt-2 text-3xl font-extrabold">
          {stats.totalOrders}
        </div>
      </div>

      <div className="card p-6">
        <div className="text-sm text-slate-600">Total Revenue</div>
        <div className="mt-2 text-3xl font-extrabold text-orange-600">
          {moneyLKR(stats.totalRevenue)}
        </div>
      </div>

      <div className="card p-6">
        <div className="text-sm text-slate-600">Pending Orders</div>
        <div className="mt-2 text-3xl font-extrabold">
          {stats.pending}
        </div>
      </div>
    </div>
  );
}
