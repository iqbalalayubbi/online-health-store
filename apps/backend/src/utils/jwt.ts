import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  sub: string;
  role: string;
}

const jwtSecret: Secret = env.JWT_SECRET;
type ExpiresInValue = Exclude<SignOptions["expiresIn"], undefined>;

export const signToken = (payload: JwtPayload, expiresIn?: SignOptions["expiresIn"]) => {
  const resolvedExpiresIn: ExpiresInValue =
    (expiresIn as ExpiresInValue | undefined) ?? ("1h" as ExpiresInValue);
  return jwt.sign(payload, jwtSecret, { expiresIn: resolvedExpiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecret) as JwtPayload & jwt.JwtPayload;
};

