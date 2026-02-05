"use client";

import { getAccessToken } from "./auth";

export const AUTH_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:4001";

export const CATALOG_URL =
  process.env.NEXT_PUBLIC_CATALOG_URL || "http://localhost:4002";

export const ORDER_URL =
  process.env.NEXT_PUBLIC_ORDER_URL ||
  process.env.NEXT_PUBLIC_ORDER_API_URL ||
  "http://localhost:4003";

export async function apiFetch(url: string, init: RequestInit = {}) {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    ...(init.headers as any),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  if (init.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...init, headers });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = (data && data.message) || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
