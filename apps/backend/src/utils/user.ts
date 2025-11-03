import { User } from "@prisma/client";

export const sanitizeUser = <T extends User>(user: T) => {
  const { passwordHash, ...safeUser } = user;
  void passwordHash;
  return safeUser;
};

