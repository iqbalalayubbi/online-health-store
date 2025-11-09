import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().url({
    message: "DATABASE_URL must be a valid connection string",
  }),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  HASH_SALT_ROUNDS: z.string().default("10"),
  // Optional: set your deployed frontend origin (e.g., https://your-frontend.up.railway.app)
  FRONTEND_ORIGIN: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables", parsedEnv.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = {
  ...parsedEnv.data,
  port: Number(parsedEnv.data.PORT),
  hashSaltRounds: Number(parsedEnv.data.HASH_SALT_ROUNDS),
};
