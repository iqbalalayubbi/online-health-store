import "dotenv/config";
import { defineConfig } from "prisma/config";

// Gracefully handle missing DATABASE_URL during build (e.g. Docker image build on CI)
// Prisma's env() helper throws if the variable is absent; instead we provide a safe fallback
// so that `prisma generate` can still succeed and emit the client. At runtime the real
// DATABASE_URL must be supplied via environment variables.
const dbUrl =
  process.env.DATABASE_URL || process.env.DUMMY_DB_URL || "mysql://user:pass@localhost:3306/dummy"; // harmless placeholder for client generation

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: dbUrl,
  },
});
