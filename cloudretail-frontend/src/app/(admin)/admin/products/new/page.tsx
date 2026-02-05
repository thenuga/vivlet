"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminCreateProduct } from "@/lib/adminCatalogApi";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=60";

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(3990);
  const [stock, setStock] = useState<number>(50);
  const [imageUrl, setImageUrl] = useState(FALLBACK_IMG);
  const [description, setDescription] = useState("High quality product for daily use.");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSave = name.trim().length >= 2 && price > 0;

  async function onSave() {
    if (!canSave || loading) return;

    setErr(null);
    setLoading(true);
    try {
      await adminCreateProduct({
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        imageUrl: imageUrl.trim() || FALLBACK_IMG,
        description: description.trim(),
      });

      router.push("/admin/products");
    } catch (e: any) {
      setErr(e?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-6">
      <div className="text-2xl font-extrabold">New Product</div>
      <div className="mt-2 text-sm text-slate-600">Create a new catalog item (DB).</div>

      {err ? <div className="mt-4 text-sm text-red-600">{err}</div> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <div className="label">Name</div>
          <input
            className="input mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Polo T-Shirt"
          />
        </div>

        <div>
          <div className="label">Price (LKR)</div>
          <input
            className="input mt-2"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <div className="label">Stock</div>
          <input
            className="input mt-2"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </div>

        <div className="md:col-span-2">
          <div className="label">Image URL</div>
          <input
            className="input mt-2"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <div className="mt-2 text-xs text-slate-500">(Later we’ll replace this with S3 upload.)</div>
        </div>

        <div className="md:col-span-2">
          <div className="label">Description</div>
          <textarea
            className="input mt-2 min-h-[110px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          className={`btn-primary ${!canSave || loading ? "opacity-50 pointer-events-none" : ""}`}
          onClick={onSave}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>

        <button type="button" className="btn-ghost" onClick={() => router.push("/admin/products")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
