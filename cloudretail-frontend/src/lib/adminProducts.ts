import { products, type Product } from "@/lib/mock";

const KEY = "cloudretail_products_v1";

export function readProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) return products; // fallback seed
  try {
    return JSON.parse(raw) as Product[];
  } catch {
    return products;
  }
}

export function writeProducts(items: Product[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cloudretail:products"));
}

export function createProduct(p: Product) {
  const items = readProducts();
  items.unshift(p);
  writeProducts(items);
}

export function updateProduct(id: string, patch: Partial<Product>) {
  const items = readProducts();
  const idx = items.findIndex((x) => x.id === id);
  if (idx < 0) return;
  items[idx] = { ...items[idx], ...patch };
  writeProducts(items);
}

export function deleteProduct(id: string) {
  const items = readProducts().filter((x) => x.id !== id);
  writeProducts(items);
}
