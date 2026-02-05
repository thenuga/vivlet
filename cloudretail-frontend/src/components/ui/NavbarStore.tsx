"use client";

import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function NavbarStore() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const isStore = useMemo(() => !pathname?.startsWith("/admin"), [pathname]);

  if (!isStore) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="container-app py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="">
  <Image
    src="/logo/velino.png"
    alt="Velino logo"
    width={48}
    height={48}
    className="object-contain"
    priority
  />
</div>

          </Link>

          <div className="ml-2 flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 ring-orange-200 focus-within:ring-4">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search products…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(`/products?q=${encodeURIComponent(q)}`);
              }}
            />
            <button
              className="btn-primary h-9 px-4"
              onClick={() => router.push(`/products?q=${encodeURIComponent(q)}`)}
            >
              Search
            </button>
          </div>

          <Link href="/cart" className="btn-ghost h-10 gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <Link href="/products" className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200">
            All Products
          </Link>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">
            Flash Sale (demo UI)
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            Free Delivery (mock)
          </span>
        </div>
      </div>
    </header>
  );
}
