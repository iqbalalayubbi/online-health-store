import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (_req: Request, res: Response, _next: NextFunction) => {
  void _next;
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found.",
  });
};


