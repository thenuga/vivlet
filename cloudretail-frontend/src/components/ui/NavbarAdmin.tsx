"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Item = ({ href, label }: { href: string; label: string }) => {
  const p = usePathname();
  const active = p === href || p.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
        active ? "bg-orange-600 text-white" : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {label}
    </Link>
  );
};

export default function NavbarAdmin() {
  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-app py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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
          
          <div>
            <div className="text-sm font-extrabold">Velino Admin</div>
            <div className="text-xs text-slate-500">Dashboard</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Item href="/admin" label="Overview" />
          <Item href="/admin/products" label="Products" />
          <Item href="/admin/orders" label="Orders" />
        </div>
      </div>
    </div>
  );
}
