# ─── Stage 1: Build ─────────────────────────────────────────────────────────
# Uses full devDependencies to compile TypeScript
FROM node:20-alpine AS builder
WORKDIR /app

# Install all deps (including dev) needed to build
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .
RUN npx prisma generate && npm run build

# ─── Stage 2: Production deps only ──────────────────────────────────────────
# Fresh install with only production packages — no devDep vulnerabilities
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --omit=dev && npx prisma generate

# ─── Stage 3: Runner ─────────────────────────────────────────────────────────
# Final minimal image with only what's needed to run
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy compiled output and clean prod deps only
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

USER nestjs

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/main"]
