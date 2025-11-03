import { OrderStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { createHttpError } from "../utils/http-error";

export const listCustomers = () => {
  return prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      customerProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const setCustomerActiveState = async (customerId: string, isActive: boolean) => {
  return prisma.user.update({
    where: { id: customerId, role: "CUSTOMER" },
    data: { isActive },
  });
};

export const listGuestbookEntries = () => {
  return prisma.guestBookEntry.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const deleteGuestbookEntry = (entryId: string) => {
  return prisma.guestBookEntry.delete({
    where: { id: entryId },
  });
};

const categorySchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  shopId: z.string(),
});

export const createCategory = async (payload: unknown) => {
  const data = categorySchema.parse(payload);
  return prisma.category.create({ data });
};

export const updateCategory = async (categoryId: string, payload: unknown) => {
  const data = categorySchema.partial().parse(payload);
  return prisma.category.update({
    where: { id: categoryId },
    data,
  });
};

export const deleteCategory = (categoryId: string) => {
  return prisma.category.delete({
    where: { id: categoryId },
  });
};

export const listShopRequests = () => {
  return prisma.shopCreationRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      seller: {
        include: {
          user: true,
        },
      },
      reviewer: true,
    },
  });
};

export const reviewShopRequest = async (
  requestId: string,
  decision: "APPROVED" | "REJECTED",
  reviewerId: string,
) => {
  const request = await prisma.shopCreationRequest.update({
    where: { id: requestId },
    data: {
      status: decision,
      reviewedAt: new Date(),
      reviewer: {
        connect: { id: reviewerId },
      },
    },
    include: {
      seller: true,
    },
  });

  if (decision === "APPROVED" && request.seller?.userId) {
    await prisma.shop.create({
      data: {
        name: request.proposedName,
        description: request.proposedDescription ?? request.details,
        ownerId: request.seller.id,
        managerId: request.seller.userId,
      },
    });
  }

  return request;
};

export const markOrderAsShipped = async (
  orderId: string,
  payload: { courier?: string; trackingNumber?: string },
) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw createHttpError(404, "Order not found");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.SHIPPED,
      shipment: {
        upsert: {
          create: {
            courier: payload.courier,
            trackingNumber: payload.trackingNumber,
            shippedAt: new Date(),
            address: order.shippingAddress,
            city: order.shippingCity,
            state: order.shippingState,
            postalCode: order.shippingPostalCode,
            country: order.shippingCountry,
          },
          update: {
            courier: payload.courier,
            trackingNumber: payload.trackingNumber,
            shippedAt: new Date(),
          },
        },
      },
    },
    include: {
      shipment: true,
    },
  });
};

