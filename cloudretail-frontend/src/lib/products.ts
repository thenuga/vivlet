import { readProducts } from "@/lib/adminProducts";
import { products } from "@/lib/mock";
import type { Product } from "@/lib/mock";

/**
 * Unified product source:
 * - If admin created products → use them
 * - Else → fallback to mock seed
 */
export function getAllProducts(): Product[] {
  const admin = readProducts();
  if (admin.length > 0) return admin as Product[];
  return products;
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}
