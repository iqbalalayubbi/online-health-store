import { prisma } from "../lib/prisma";

export const getOrdersForCustomer = (customerProfileId: string) => {
  return prisma.order.findMany({
    where: { customerId: customerProfileId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
      shipment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getOrdersForSeller = (sellerProfileId: string) => {
  return prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            sellerId: sellerProfileId,
          },
        },
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
      shipment: true,
      customer: {
        include: {
          user: {
            select: { email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAllOrders = () => {
  return prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
      shipment: true,
      customer: {
        include: {
          user: {
            select: { email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

