import { prisma } from "../lib/prisma";
import { z } from "zod";
import { createHttpError } from "../utils/http-error";

const feedbackSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const createFeedback = async (userId: string, payload: unknown) => {
  const data = feedbackSchema.parse(payload);

  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  return prisma.feedback.create({
    data: {
      productId: data.productId,
      userId,
      rating: data.rating,
      comment: data.comment,
    },
  });
};

export const listFeedbackForProduct = (productId: string) => {
  return prisma.feedback.findMany({
    where: { productId },
    include: {
      user: {
        select: { email: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


