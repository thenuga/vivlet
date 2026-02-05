import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { PrismaClient, OrderStatus } from "@prisma/client";

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

const PORT = Number(process.env.PORT || 4003);
const JWT_SECRET = process.env.JWT_SECRET || "cloudretail_secret";

type JwtUser = {
  sub: string;
  email?: string;
  role?: "USER" | "ADMIN";
  name?: string;
};

/* ---------------- AUTH MIDDLEWARE ---------------- */

function requireAuth(req: any, res: any, next: any) {
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET) as JwtUser;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireAdmin(req: any, res: any, next: any) {
  const user = req.user as JwtUser | undefined;
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only" });
  }
  return next();
}

/* ---------------- HEALTH ---------------- */

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "orders" });
});

/* ---------------- USER ROUTES ---------------- */

// CREATE ORDER
app.post("/orders", requireAuth, async (req: any, res) => {
  const userId = req.user.sub;
  const { items, billing } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Items required" });
  }

  const order = await prisma.order.create({
    data: {
      userId,
      status: "PLACED",
      billingName: String(billing?.name || ""),
      billingPhone: String(billing?.phone || ""),
      billingAddress: String(billing?.address || ""),
      items: {
        create: items.map((it: any) => ({
          productId: String(it.productId),
          name: String(it.name),
          imageUrl: String(it.imageUrl || ""),
          price: Number(it.price),
          qty: Number(it.qty || 1),
        })),
      },
      timeline: {
        create: {
          status: "PLACED",
          note: "Order placed",
        },
      },
    },
    include: { items: true, timeline: true },
  });

  res.json({ order });
});

// MY ORDERS
app.get("/orders/my", requireAuth, async (req: any, res) => {
  const userId = req.user.sub;

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true, timeline: true },
  });

  res.json({ orders });
});

// ORDER DETAIL (OWN)
app.get("/orders/:id", requireAuth, async (req: any, res) => {
  const userId = req.user.sub;
  const id = String(req.params.id);

  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: { items: true, timeline: true },
  });

  if (!order) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json({ order });
});

/* ---------------- ADMIN ROUTES ---------------- */

// ALL ORDERS
app.get("/admin/orders", requireAuth, requireAdmin, async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, timeline: true },
  });

  res.json({ orders });
});

// UPDATE STATUS
app.patch(
  "/admin/orders/:id/status",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const id = String(req.params.id);
    const { status, note } = req.body || {};

    const allowed: OrderStatus[] = [
      "PLACED",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        timeline: {
          create: {
            status,
            note: String(note || ""),
          },
        },
      },
      include: { items: true, timeline: true },
    });

    res.json({ order });
  }
);

app.listen(PORT, () => {
  console.log(`order-service on http://localhost:${PORT}`);
});
