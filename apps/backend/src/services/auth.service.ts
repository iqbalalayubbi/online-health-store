import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { sanitizeUser } from "../utils/user";
import { createHttpError } from "../utils/http-error";

export const registerUser = async (payload: unknown) => {
  const data = registerSchema.parse(payload);
  const phoneNumber = data.phoneNumber ?? null;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw createHttpError(400, "Email is already registered");
  }

  const passwordHash = await hashPassword(data.password);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role,
      },
    });

    if (data.role === "SELLER") {
      await tx.sellerProfile.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
          phoneNumber,
        },
      });
    } else {
      await tx.customerProfile.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
          phoneNumber,
        },
      });
    }

    return {
      user: sanitizeUser(user),
      token: signToken({ sub: user.id, role: user.role }),
    };
  });
};

export const loginUser = async (payload: unknown) => {
  const data = loginSchema.parse(payload);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !user.isActive) {
    throw createHttpError(401, "Invalid credentials");
  }

  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) {
    throw createHttpError(401, "Invalid credentials");
  }

  return {
    user: sanitizeUser(user),
    token: signToken({ sub: user.id, role: user.role }),
  };
};

export const ensureAdminSeed = async (admin: { email: string; password: string; fullName: string }) => {
  const existing = await prisma.user.findFirst({
    where: { email: admin.email, role: "ADMIN" },
  });

  if (existing) {
    return existing;
  }

  const passwordHash = await hashPassword(admin.password);
  return prisma.user.create({
    data: {
      email: admin.email,
      passwordHash,
      role: "ADMIN",
      adminProfile: {
        create: {
          fullName: admin.fullName,
        },
      },
    },
    include: {
      adminProfile: true,
    },
  });
};

