import bcrypt from "bcrypt";
import { env } from "../config/env";

export const hashPassword = async (plain: string) => {
  return bcrypt.hash(plain, env.hashSaltRounds);
};

export const verifyPassword = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};

