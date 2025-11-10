import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

/**
 * Payload standar token aplikasi ini.
 * - `sub` menyimpan id user
 * - `role` menyimpan peran (ADMIN | SELLER | CUSTOMER)
 */
interface JwtPayload {
  sub: string;
  role: string;
}

const jwtSecret: Secret = env.JWT_SECRET;
type ExpiresInValue = Exclude<SignOptions["expiresIn"], undefined>;

/**
 * Buat JWT dengan payload minimal (sub & role).
 * Secara default token berlaku 1 jam kalau expiresIn tidak diisi.
 */
export const signToken = (payload: JwtPayload, expiresIn?: SignOptions["expiresIn"]) => {
  const resolvedExpiresIn: ExpiresInValue =
    (expiresIn as ExpiresInValue | undefined) ?? ("1h" as ExpiresInValue);
  return jwt.sign(payload, jwtSecret, { expiresIn: resolvedExpiresIn });
};

/**
 * Verifikasi token dan kembalikan payload (throws kalau invalid / expired).
 */
export const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecret) as JwtPayload & jwt.JwtPayload;
};
