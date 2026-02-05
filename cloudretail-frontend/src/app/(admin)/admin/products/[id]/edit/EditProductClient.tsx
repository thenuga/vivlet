"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminGetProductById, adminUpdateProduct } from "@/lib/adminCatalogApi";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=60";

export default function EditProductClient({ id }: { id: string }) {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const res = await adminGetProductById(id);
        const p = res.product;
        if (!p) {
          router.replace("/admin/products");
          return;
        }

        setName(p.name ?? "");
        setPrice(Number(p.price ?? 0));
        setStock(Number(p.stock ?? 0));
        setImageUrl((p.imageUrl ?? "").trim() || FALLBACK_IMG);
        setDescription(p.description ?? "");
        setLoaded(true);
      } catch (e: any) {
        setErr(e?.message || "Failed to load product");
      }
    })();
  }, [id, router]);

  if (!loaded) return <div className="card p-6">{err ? err : "Loading..."}</div>;

  const canSave = name.trim().length >= 2 && price > 0;

  async function onSave() {
    if (!canSave || saving) return;

    setErr(null);
    setSaving(true);
    try {
      await adminUpdateProduct(id, {
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        imageUrl: imageUrl.trim() || FALLBACK_IMG,
        description: description.trim(),
      });

      router.push("/admin/products");
    } catch (e: any) {
      setErr(e?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-6">
      <div className="text-2xl font-extrabold">Edit Product</div>
      <div className="mt-2 text-sm text-slate-600">
        Product ID: <b>{id}</b>
      </div>

      {err ? <div className="mt-4 text-sm text-red-600">{err}</div> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <div className="label">Name</div>
          <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} />
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
          <div className="mt-2 text-xs text-slate-500">If empty, we auto-use a fallback image.</div>
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
          className={`btn-primary ${!canSave || saving ? "opacity-50 pointer-events-none" : ""}`}
          onClick={onSave}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button type="button" className="btn-ghost" onClick={() => router.push("/admin/products")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
