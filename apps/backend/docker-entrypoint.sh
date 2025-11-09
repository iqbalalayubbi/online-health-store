#!/bin/sh
set -e

# Expect DATABASE_URL, JWT_SECRET, HASH_SALT_ROUNDS already set via environment.

echo "[backend] Running database migrations..."
npx prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
  echo "[backend] Seeding database..."
  npm run db:seed || echo "[backend] Seed failed or skipped"
fi

echo "[backend] Starting server..."
node dist/server.js
