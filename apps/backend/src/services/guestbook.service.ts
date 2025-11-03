import { prisma } from "../lib/prisma";
import { z } from "zod";

const guestBookSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  message: z.string().min(5),
});

export const createEntry = (userId: string | undefined, payload: unknown) => {
  const data = guestBookSchema.parse(payload);
  return prisma.guestBookEntry.create({
    data: {
      ...data,
      userId,
    },
  });
};

