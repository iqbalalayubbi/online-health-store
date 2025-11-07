import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const listCategories = (shopId?: string) => {
  return prisma.category.findMany({
    ...(shopId ? { where: { shopId } } : {}),
    include: {
      shop: {
        select: { name: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const listProducts = async (filters: { categoryId?: string; shopId?: string }) => {
  const where: Prisma.ProductWhereInput = { isActive: true };
  if (filters.categoryId !== undefined) where.categoryId = filters.categoryId;
  if (filters.shopId !== undefined) where.shopId = filters.shopId;

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      shop: true,
      feedbacks: {
        select: { rating: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Compute aggregated rating per product
  return products.map((p) => {
    const count = p.feedbacks.length;
    const sum = p.feedbacks.reduce((acc: number, f: { rating: number }) => acc + f.rating, 0);
    const averageRating = count === 0 ? null : Number((sum / count).toFixed(2));
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      isActive: p.isActive,
      categoryId: p.categoryId,
      shopId: p.shopId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      category: p.category,
      shop: p.shop,
      averageRating,
      feedbackCount: count,
    };
  });
};

export const getProduct = (productId: string) => {
  return prisma.product.findUnique({
    where: { id: productId, isActive: true },
    include: {
      category: true,
      shop: true,
      feedbacks: {
        include: {
          user: {
            select: { email: true },
          },
        },
      },
    },
  });
};
