# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
# Use npm ci if lockfile exists, otherwise fallback to npm install
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi

# Build stage: generate Prisma Client and compile TypeScript
FROM deps AS build
COPY tsconfig.json ./tsconfig.json
COPY prisma.config.ts ./prisma.config.ts
COPY prisma ./prisma
# Provide a dummy DATABASE_URL so `prisma generate` can load prisma.config.ts
ARG DUMMY_DB_URL="mysql://user:pass@localhost:3306/dummy"
ENV DATABASE_URL=${DUMMY_DB_URL}
RUN npx prisma generate

COPY src ./src
RUN npm run build

# Runtime stage
FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy node_modules from build stage (contains generated Prisma Client)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY package.json ./package.json
COPY docker-entrypoint.sh ./docker-entrypoint.sh

EXPOSE 4000
ENTRYPOINT ["/bin/sh", "-c", "chmod +x ./docker-entrypoint.sh && ./docker-entrypoint.sh"]
