# syntax=docker.io/docker/dockerfile:1

# AI Assistance Disclosure:
# Tool: GitHub Copilot (Claude Sonnet 4), date: 2025-09-15
# Purpose: To create optimized multi-stage Docker configuration for Express.js user-service.
# Author Review: I validated security, performance, and production readiness of the setup.

# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy built application
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=expressjs:nodejs /app/server.js ./server.js
COPY --from=builder --chown=expressjs:nodejs /app/index.js ./index.js
COPY --from=builder --chown=expressjs:nodejs /app/controller ./controller
COPY --from=builder --chown=expressjs:nodejs /app/middleware ./middleware
COPY --from=builder --chown=expressjs:nodejs /app/model ./model
COPY --from=builder --chown=expressjs:nodejs /app/routes ./routes
COPY --from=builder --chown=expressjs:nodejs /app/utils ./utils

USER expressjs

EXPOSE 8080

# Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#     CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the server
CMD ["npm", "start"]