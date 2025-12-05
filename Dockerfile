# ---------- 1. Build Stage ----------
FROM node:20-slim AS builder

WORKDIR /app

# Install required OS packages for Next.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 g++ make && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build


# ---------- 2. Production Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
