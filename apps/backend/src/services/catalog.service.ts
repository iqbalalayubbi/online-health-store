import { prisma } from "../lib/prisma";

export const listCategories = (shopId?: string) => {
  return prisma.category.findMany({
    where: shopId ? { shopId } : undefined,
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

export const listProducts = (filters: { categoryId?: string; shopId?: string }) => {
  return prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: filters.categoryId,
      shopId: filters.shopId,
    },
    include: {
      category: true,
      shop: true,
    },
    orderBy: {
      createdAt: "desc",
    },
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

