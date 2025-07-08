# Multi-stage build to reduce final image size

# Stage 1: Dependencies
FROM node:20.15-alpine3.19 AS deps
WORKDIR /app

# Install system dependencies for native modules
RUN apk add --no-cache python3 make g++ build-base sqlite

# Copy package files and install ALL dependencies (including dev)
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder  
FROM node:20.15-alpine3.19 AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production runtime
FROM node:20.15-alpine3.19 AS runner
WORKDIR /app

# Install only runtime system dependencies
RUN apk add --no-cache sqlite

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files and install ONLY production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create data directory for SQLite
RUN mkdir -p data && chown -R nextjs:nodejs data

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Change to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start the application directly with node (not npm)
CMD ["node", "server.js"]