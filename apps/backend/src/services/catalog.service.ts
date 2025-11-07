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

export const listProducts = async (filters: { categoryId?: string; shopId?: string }) => {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: filters.categoryId,
      shopId: filters.shopId,
    },
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
    const sum = p.feedbacks.reduce((acc, f) => acc + f.rating, 0);
    const averageRating = count === 0 ? null : Number((sum / count).toFixed(2));
    const anyProduct: any = { ...p, averageRating, feedbackCount: count };
    delete anyProduct.feedbacks;
    return anyProduct;
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
