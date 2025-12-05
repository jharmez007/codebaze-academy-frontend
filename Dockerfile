# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Install required build tools
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . ./
RUN npm run build


# ---- Production Stage ----
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only what's needed for running Next.js
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
