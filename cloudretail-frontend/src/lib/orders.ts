import type { CartItem } from "@/lib/cart";

export type OrderStatus = "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type OrderStatusHistory = {
  status: OrderStatus;
  timestamp: string; // ISO
  note?: string;
};

export type Order = {
  id: string;
  createdAt: string; // ISO
  customer: {
    name: string;
    phone: string;
    province: string;
    district: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
    label: "HOME" | "OFFICE";
  };
  items: CartItem[];
  subtotal: number;
  status: OrderStatus;
  history: OrderStatusHistory[];
};

const KEY = "cloudretail_orders_v1";

function safeParse(raw: string | null): Order[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

function readRaw(): Order[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(KEY));
}

function writeRaw(orders: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("cloudretail:orders"));
}

export function listOrders(): Order[] {
  return readRaw().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getOrder(id: string): Order | null {
  return readRaw().find((o) => o.id === id) || null;
}

export function createOrder(input: {
  customer: Order["customer"];
  items: CartItem[];
  subtotal: number;
}): Order {
  const now = new Date().toISOString();
  const id = `CR-${Math.floor(Math.random() * 900000 + 100000)}`;

  const order: Order = {
    id,
    createdAt: now,
    customer: input.customer,
    items: input.items,
    subtotal: input.subtotal,
    status: "PLACED",
    history: [{ status: "PLACED", timestamp: now, note: "Order placed successfully" }],
  };

  const orders = readRaw();
  orders.push(order);
  writeRaw(orders);

  return order;
}

export function adminUpdateOrderStatus(id: string, status: OrderStatus) {
  const orders = readRaw();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return;

  const now = new Date().toISOString();
  orders[idx].status = status;
  orders[idx].history.push({
    status,
    timestamp: now,
    note: `Admin updated status to ${status}`,
  });

  writeRaw(orders);
}
