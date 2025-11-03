import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { router } from "./routes";
import { notFoundHandler } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";

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

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };

