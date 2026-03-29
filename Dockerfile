# H2M - HTML to Markdown Converter
FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build stage
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production stage
FROM base AS release
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Run the server
CMD ["bun", "run", "dist/server.js"]