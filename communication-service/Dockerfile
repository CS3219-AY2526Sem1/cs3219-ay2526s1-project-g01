FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Create non-root user
RUN adduser -D -u 1001 appuser
USER appuser

# Expose the correct port (8080 for Cloud Run)
EXPOSE 8080

# Use environment variable for port
ENV PORT=8080
ENV NODE_ENV=production

# Health check using wget (more reliable)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start application
CMD ["node", "server.js"]