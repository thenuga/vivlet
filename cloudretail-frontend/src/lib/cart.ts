"use client";

export type CartItem = {
  productId: string;      // canonical key in cart
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
  color?: string | null;
  size?: string | null;
};

const KEY = "cloudretail_cart_v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const data = safeParse<CartItem[]>(localStorage.getItem(KEY));
  return Array.isArray(data) ? data : [];
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cloudretail:cart"));
}

export function clearCart() {
  writeCart([]);
}

export function cartCount(): number {
  return readCart().reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
}

export function cartTotals(items: CartItem[]) {
  const totalQty = items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
    0
  );
  return { totalQty, subtotal };
}

/**
 * Accepts either:
 *  - { id: "...", ... }  OR
 *  - { productId: "...", ... }
 */
export function addToCart(product: any) {
  const id = String(product?.productId || product?.id || "");

  if (!id) {
    // keep your same error text so you recognize it
    throw new Error("Invalid product (missing id)");
  }

  const item: CartItem = {
    productId: id,
    name: String(product?.name || "Product"),
    price: Number(product?.price || 0),
    qty: Number(product?.qty || 1),
    imageUrl: String(product?.imageUrl || ""),
    color: product?.color ?? null,
    size: product?.size ?? null,
  };

  const items = readCart();

  // merge same product (same productId + same variant)
  const idx = items.findIndex(
    (x) =>
      x.productId === item.productId &&
      (x.color ?? null) === (item.color ?? null) &&
      (x.size ?? null) === (item.size ?? null)
  );

  if (idx >= 0) {
    items[idx] = { ...items[idx], qty: items[idx].qty + item.qty };
  } else {
    items.unshift(item);
  }

  writeCart(items);
}

export function updateQty(index: number, qty: number) {
  const items = readCart();
  if (!items[index]) return;

  const nextQty = Math.max(1, Number(qty) || 1);
  items[index] = { ...items[index], qty: nextQty };
  writeCart(items);
}

export function removeItem(index: number) {
  const items = readCart();
  items.splice(index, 1);
  writeCart(items);
}
