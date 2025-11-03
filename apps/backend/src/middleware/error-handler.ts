import { NextFunction, Request, Response } from "express";

interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

// Centralized error handler to keep responses consistent
export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  void _next;
  const status = err.statusCode ?? 500;
  const payload = {
    error: err.name ?? "Error",
    message: err.message ?? "Unexpected server error",
    details: err.details,
  };

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json(payload);
};


