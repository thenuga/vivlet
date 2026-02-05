"use client";

import { addToCart } from "@/lib/cart";
import type { Product } from "@/lib/mock";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddToCartButton({
  product,
  qty,
  color,
  size,
}: {
  product: Product;
  qty: number;
  color?: string | null;
  size?: string | null;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  return (
    <button
      type="button"
      className="btn-primary h-12"
      disabled={adding}
      onClick={() => {
        setAdding(true);
        addToCart({ product, qty, color, size });
        router.push("/cart"); // go to cart after add
      }}
    >
      {adding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
