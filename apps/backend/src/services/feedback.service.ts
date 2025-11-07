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

  // Ensure the user has at least one DELIVERED order that contains this product
  const deliveredOrderWithProduct = await prisma.order.findFirst({
    where: {
      status: "DELIVERED",
      customer: {
        // CustomerProfile has a scalar userId
        userId: userId,
      },
      items: {
        some: {
          productId: data.productId,
        },
      },
    },
    select: { id: true },
  });

  if (!deliveredOrderWithProduct) {
    throw createHttpError(
      403,
      "Anda hanya dapat memberikan feedback untuk produk yang telah dibeli dan pesanan sudah selesai (DELIVERED)",
    );
  }

  // Prevent duplicate feedback for the same product by the same user
  const existing = await prisma.feedback.findFirst({
    where: { userId, productId: data.productId },
    select: { id: true },
  });

  if (existing) {
    throw createHttpError(409, "Anda sudah memberikan feedback untuk produk ini");
  }

  return prisma.feedback.create({
    data: {
      productId: data.productId,
      userId,
      rating: data.rating,
      comment: data.comment ?? null,
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

export const listReviewedProductIdsForUser = async (userId: string, productIds: string[]) => {
  if (productIds.length === 0) return [] as string[];
  const rows = await prisma.feedback.findMany({
    where: {
      userId,
      productId: { in: productIds },
    },
    select: { productId: true },
  });
  return Array.from(new Set(rows.map((r) => r.productId)));
};
