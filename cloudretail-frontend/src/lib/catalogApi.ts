// src/lib/catalogApi.ts
"use client";

import { apiFetch, CATALOG_URL } from "./api";

export type Product = {
  id: string;
  name: string;
  price: number;
  category?: string;
  stock?: number;
  imageUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

function normalizeProducts(data: any): Product[] {
  if (Array.isArray(data)) return data as Product[];
  if (data?.products && Array.isArray(data.products)) return data.products as Product[];
  return [];
}

function normalizeProduct(data: any): Product | null {
  if (!data) return null;
  // backend might return {product:{...}} or directly {...}
  if (data.product) return data.product as Product;
  if (data.id) return data as Product;
  return null;
}

export async function getAllProducts(): Promise<{ products: Product[] }> {
  const data = await apiFetch(`${CATALOG_URL}/products`);
  return { products: normalizeProducts(data) };
}

export async function getProductById(id: string): Promise<{ product: Product }> {
  const data = await apiFetch(`${CATALOG_URL}/products/${id}`);
  const p = normalizeProduct(data);
  if (!p) throw new Error("Product not found");
  return { product: p };
}
