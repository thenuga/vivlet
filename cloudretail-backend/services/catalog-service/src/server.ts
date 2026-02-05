import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 4002);
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function requireAdmin(req: any, res: any, next: any) {
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin only" });
    }
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* PUBLIC — store */
app.get("/products", async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  // keep as array (so you don’t break your current store UI)
  return res.json(products);
});

app.get("/products/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: String(req.params.id) },
  });
  if (!product) return res.status(404).json({ message: "Not found" });
  return res.json(product);
});

/* ADMIN — list */
app.get("/admin/products", requireAdmin, async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  // return wrapped object to match your adminCatalogApi.ts
  return res.json({ products });
});

/* ADMIN — create */
app.post("/admin/products", requireAdmin, async (req, res) => {
  const { name, description, price, stock, imageUrl } = req.body || {};
  if (!name || price === undefined) {
    return res.status(400).json({ message: "name and price are required" });
  }

  const product = await prisma.product.create({
    data: {
      name: String(name),
      description: String(description || ""),
      price: Number(price),
      stock: Number(stock ?? 0),
      imageUrl: String(imageUrl || ""),
    },
  });

  return res.json({ product });
});

/* ADMIN — update (PATCH) */
app.patch("/admin/products/:id", requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const patch = req.body || {};

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(patch.name !== undefined ? { name: String(patch.name) } : {}),
      ...(patch.description !== undefined ? { description: String(patch.description) } : {}),
      ...(patch.price !== undefined ? { price: Number(patch.price) } : {}),
      ...(patch.stock !== undefined ? { stock: Number(patch.stock) } : {}),
      ...(patch.imageUrl !== undefined ? { imageUrl: String(patch.imageUrl) } : {}),
    },
  });

  return res.json({ product });
});

/* ADMIN — update (PUT) keep for compatibility */
app.put("/admin/products/:id", requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const product = await prisma.product.update({
    where: { id },
    data: req.body || {},
  });
  return res.json({ product });
});

/* ADMIN — delete */
app.delete("/admin/products/:id", requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  await prisma.product.delete({ where: { id } });
  return res.json({ ok: true });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "catalog" });
});

app.listen(PORT, () => {
  console.log(`catalog-service running on http://localhost:${PORT}`);
});
