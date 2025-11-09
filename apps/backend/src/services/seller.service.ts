import { prisma } from "../lib/prisma";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { createHttpError } from "../utils/http-error";

const shopRequestSchema = z.object({
  proposedName: z.string().min(3),
  proposedDescription: z.string().optional(),
  details: z.string().optional(),
});

export const submitShopRequest = async (sellerProfileId: string, payload: unknown) => {
  const data = shopRequestSchema.parse(payload);

  const existingPending = await prisma.shopCreationRequest.findFirst({
    where: { sellerId: sellerProfileId, status: "PENDING" },
  });

  if (existingPending) {
    throw createHttpError(400, "You already have a pending shop creation request");
  }

  return prisma.shopCreationRequest.create({
    data: {
      sellerId: sellerProfileId,
      proposedName: data.proposedName,
      proposedDescription: data.proposedDescription ?? null,
      details: data.details ?? null,
    },
  });
};

export const listSellerShops = (sellerProfileId: string) => {
  return prisma.shop.findMany({
    where: { ownerId: sellerProfileId },
  });
};

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string(),
  shopId: z.string(),
  isActive: z.boolean().optional(),
});

export const createProduct = async (sellerProfileId: string, payload: unknown) => {
  const data = productSchema.parse(payload);

  const shop = await prisma.shop.findFirst({
    where: { id: data.shopId, ownerId: sellerProfileId },
  });

  if (!shop) {
    throw createHttpError(404, "Shop not found or you do not have access");
  }

  const { description, isActive, ...rest } = data;
  return prisma.product.create({
    data: {
      ...rest,
      sellerId: sellerProfileId,
      ...(description !== undefined ? { description } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
  });
};

export const updateProduct = async (
  sellerProfileId: string,
  productId: string,
  payload: unknown,
) => {
  const data = productSchema.partial().parse(payload);

  const product = await prisma.product.findFirst({
    where: { id: productId, sellerId: sellerProfileId },
  });

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  const updateData: Prisma.ProductUncheckedUpdateInput = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.shopId !== undefined) updateData.shopId = data.shopId;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return prisma.product.update({
    where: { id: productId },
    data: updateData,
  });
};

export const deleteProduct = async (sellerProfileId: string, productId: string) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, sellerId: sellerProfileId },
  });

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  await prisma.product.delete({ where: { id: productId } });
};

export const listSellerProducts = (sellerProfileId: string) => {
  return prisma.product.findMany({
    where: { sellerId: sellerProfileId },
    include: {
      category: true,
      shop: true,
    },
  });
};


