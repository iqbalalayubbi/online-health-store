import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { router } from "./routes";
import { notFoundHandler } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";
import { setupSwagger } from "./config/swagger";

const app = express();

app.use(
  cors({
    origin: env.NODE_ENV === "development" ? ["http://localhost:5173"] : undefined,
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API docs (Swagger UI) under /api/docs and spec at /api/openapi.json
setupSwagger(app);

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
