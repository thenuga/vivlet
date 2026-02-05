"use client";

import { useMemo, useState } from "react";
import { getAllProducts } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import { H1, Muted } from "@/components/ui";

export default function ProductsPage() {
  const [query, setQuery] = useState("");

  const items = useMemo(() => getAllProducts(), []);
  const q = query.trim().toLowerCase();

  const filtered = q
    ? items.filter((p) => p.name.toLowerCase().includes(q))
    : items;

  return (
    <div className="page grid gap-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <H1>Products</H1>
          <Muted>Search + filters are demo (API later).</Muted>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            className="input"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-slate-600">
          No products found.
        </div>
      ) : null}
    </div>
  );
}
