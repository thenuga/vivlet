# ---------- deps ----------
FROM node:20-bookworm-slim AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# ---------- build ----------
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ✅ Prisma client must be generated inside the Linux image
# (requires prisma/schema.prisma to exist in this service)
RUN npx prisma generate

# ✅ build TypeScript -> dist
RUN npm run build

# ---------- runner ----------
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# (keep full node_modules to avoid missing prisma engines)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

EXPOSE 4001

# ✅ your dist file is server.js (confirmed)
CMD ["node", "dist/server.js"]
