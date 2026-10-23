# Universal Production Dockerfile for Node.js LMS Backend
# Compatible with Koyeb, Render, Railway, Fly.io, or self-hosted VPS

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/
COPY scripts ./scripts/
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies only
COPY package*.json ./
COPY prisma ./prisma/
COPY scripts ./scripts/
RUN npm ci --only=production
RUN node scripts/setup-db.js

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Create upload directory
RUN mkdir -p uploads/secure

EXPOSE 5000

CMD ["node", "dist/src/server.js"]
