import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  sub: string;
  role: string;
}

export const signToken = (payload: JwtPayload, expiresIn = "1h") => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload & jwt.JwtPayload;
};

