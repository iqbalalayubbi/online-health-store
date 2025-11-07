import { prisma } from "../lib/prisma";
import { z } from "zod";
import { createHttpError } from "../utils/http-error";

const feedbackSchema = z.object({
  productId: z.string(),
  orderId: z.string(),
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

  // Ensure the specified order belongs to user, is DELIVERED, and contains the product
  const order = await prisma.order.findFirst({
    where: {
      id: data.orderId,
      status: "DELIVERED",
      customer: { userId },
      items: { some: { productId: data.productId } },
    },
    select: { id: true },
  });

  if (!order) {
    throw createHttpError(
      403,
      "Anda hanya dapat memberikan feedback untuk produk dalam pesanan Anda yang sudah selesai (DELIVERED)",
    );
  }

  // Prevent duplicate feedback for the same product within the same order by the same user
  const existing = await prisma.feedback.findFirst({
    where: { userId, productId: data.productId, orderId: data.orderId },
    select: { id: true },
  });

  if (existing) {
    throw createHttpError(409, "Anda sudah memberikan feedback untuk produk ini");
  }

  return prisma.feedback.create({
    data: {
      productId: data.productId,
      orderId: data.orderId,
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

export const listReviewedProductIdsForUserByOrders = async (userId: string, orderIds: string[]) => {
  if (orderIds.length === 0) return {} as Record<string, string[]>;
  const rows = await prisma.feedback.findMany({
    where: {
      userId,
      orderId: { in: orderIds },
    },
    select: { orderId: true, productId: true },
  });
  const map: Record<string, string[]> = {};
  for (const r of rows) {
    const oid = r.orderId!;
    if (!map[oid]) map[oid] = [];
    map[oid].push(r.productId);
  }
  for (const k of Object.keys(map)) {
    map[k] = Array.from(new Set(map[k]));
  }
  return map;
};
