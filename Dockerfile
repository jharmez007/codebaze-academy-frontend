# -----------------------------
#   1) Build Stage
# -----------------------------
FROM node:18-alpine AS builder

WORKDIR /app

ENV NEXT_DISABLE_TURBOPACK=1
ENV NEXT_TELEMETRY_DISABLED=1
# Install deps needed for node-gyp (if required)
RUN apk add --no-cache python3 make g++

# Install deps (clean, deterministic)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy code
COPY . .

# Build Next.js
RUN npm run build


# -----------------------------
#   2) Production Runner
# -----------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only production output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
