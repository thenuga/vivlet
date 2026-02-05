"use client";

import { apiFetch, ORDER_URL } from "./api";

/** ===== Types ===== */
export type CreateOrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  imageUrl?: string;
};

export type CreateOrderPayload = {
  items: CreateOrderItem[];
  billing: {
    name: string;
    phone: string;
    address: string;
  };
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  imageUrl?: string;
};

export type OrderTimeline = {
  status: string;
  note?: string;
  createdAt?: string;
};

export type Order = {
  id: string;
  userId: string;
  status: string;
  billingName: string;
  billingPhone: string;
  billingAddress: string;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
  timeline?: OrderTimeline[];
};

/** ===== STORE (USER) ===== */

// Create order
export function createOrder(payload: CreateOrderPayload): Promise<{ order: Order }> {
  return apiFetch(`${ORDER_URL}/orders`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// My orders list
export function getMyOrders(): Promise<{ orders: Order[] }> {
  return apiFetch(`${ORDER_URL}/orders/my`);
}

// My order detail by id
export function getMyOrderById(id: string): Promise<{ order: Order }> {
  return apiFetch(`${ORDER_URL}/orders/${id}`);
}

/** ===== ADMIN ===== */

// Admin list all orders
export function adminGetAllOrders(): Promise<{ orders: Order[] }> {
  return apiFetch(`${ORDER_URL}/admin/orders`);
}

// Admin update order status
export function adminUpdateOrderStatus(
  id: string,
  payload: { status: string; note?: string }
): Promise<{ order: Order }> {
  return apiFetch(`${ORDER_URL}/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
