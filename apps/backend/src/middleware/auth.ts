import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate =
  (roles: string[] = []) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized", message: "Missing token" });
    }

    try {
      const token = header.split(" ")[1];
      const payload = verifyToken(token);
      if (roles.length > 0 && !roles.includes(payload.role)) {
        return res.status(403).json({ error: "Forbidden", message: "Insufficient permissions" });
      }

      req.user = {
        id: payload.sub,
        role: payload.role,
      };

      return next();
    } catch {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
    }
  };

