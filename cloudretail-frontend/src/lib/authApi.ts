// src/lib/authApi.ts
"use client";

import { apiFetch, AUTH_URL } from "./api";
import { setAccessToken } from "./auth";

export async function login(email: string, password: string) {
  const data = await apiFetch(`${AUTH_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // expected: { token, user }
  if (!data?.token) throw new Error("No token returned from auth service");

  // ✅ SAVE TOKEN HERE
  setAccessToken(String(data.token));

  return data;
}

export async function register(name: string, email: string, password: string, role?: "USER" | "ADMIN") {
  const data = await apiFetch(`${AUTH_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!data?.token) throw new Error("No token returned from auth service");

  // ✅ SAVE TOKEN HERE TOO
  setAccessToken(String(data.token));

  return data;
}
