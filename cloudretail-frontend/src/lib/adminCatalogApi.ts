"use client";

import { apiFetch, CATALOG_URL } from "./api";

export type CatalogProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock?: number;
};

function normalizeProducts(res: any): CatalogProduct[] {
  // backend returns array for /products
  if (Array.isArray(res)) return res as CatalogProduct[];
  // if later you wrap it like { products: [] }
  if (res?.products && Array.isArray(res.products)) return res.products as CatalogProduct[];
  return [];
}

export async function adminGetProducts(): Promise<{ products: CatalogProduct[] }> {
  // your backend DOES have /products, but DOES NOT have /admin/products GET
  const res = await apiFetch(`${CATALOG_URL}/products`);
  return { products: normalizeProducts(res) };
}

export async function adminGetProductById(id: string): Promise<{ product: CatalogProduct | null }> {
  const res = await apiFetch(`${CATALOG_URL}/products/${id}`);
  // backend returns product object directly
  return { product: (res as CatalogProduct) ?? null };
}

export async function adminCreateProduct(payload: Partial<CatalogProduct>) {
  // backend: POST /admin/products (admin only)
  return apiFetch(`${CATALOG_URL}/admin/products`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adminUpdateProduct(id: string, payload: Partial<CatalogProduct>) {
  // backend: PUT /admin/products/:id (admin only)
  return apiFetch(`${CATALOG_URL}/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteProduct(id: string) {
  // backend: DELETE /admin/products/:id (admin only)
  return apiFetch(`${CATALOG_URL}/admin/products/${id}`, {
    method: "DELETE",
  });
}
