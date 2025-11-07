import { OrderStatus, Prisma } from "@prisma/client";
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
  return prisma.category.create({
    data: {
      name: data.name,
      shopId: data.shopId,
      description: data.description ?? null,
    },
  });
};

export const updateCategory = async (categoryId: string, payload: unknown) => {
  const data = categorySchema.partial().omit({ shopId: true }).parse(payload);
  const updateData: Prisma.CategoryUpdateInput = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description ?? null;
  return prisma.category.update({
    where: { id: categoryId },
    data: updateData,
  });
};

export const deleteCategory = (categoryId: string) => {
  return prisma.category.delete({
    where: { id: categoryId },
  });
};

// List all categories (admin view) including their shop for context
export const listCategories = () => {
  return prisma.category.findMany({
    include: {
      shop: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
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

export const listShops = () => {
  return prisma.shop.findMany({
    select: {
      id: true,
      name: true,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
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
            courier: payload.courier ?? null,
            trackingNumber: payload.trackingNumber ?? null,
            shippedAt: new Date(),
            address: order.shippingAddress,
            city: order.shippingCity,
            state: order.shippingState,
            postalCode: order.shippingPostalCode,
            country: order.shippingCountry,
          },
          update: {
            courier: payload.courier ?? null,
            trackingNumber: payload.trackingNumber ?? null,
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

export const markOrderAsDelivered = async (orderId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw createHttpError(404, "Order not found");
  }
  if (order.status === OrderStatus.CANCELLED) {
    throw createHttpError(400, "Cannot deliver a cancelled order");
  }
  if (order.status === OrderStatus.DELIVERED) {
    return order; // already delivered
  }
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.DELIVERED,
      shipment: {
        upsert: {
          create: {
            courier: null,
            trackingNumber: null,
            shippedAt: null,
            deliveredAt: new Date(),
            address: order.shippingAddress,
            city: order.shippingCity,
            state: order.shippingState,
            postalCode: order.shippingPostalCode,
            country: order.shippingCountry,
          },
          update: {
            deliveredAt: new Date(),
          },
        },
      },
    },
  });
};

// Orders for shipping management (PENDING & SHIPPED)
export const listOrdersForShipping = async () => {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: [OrderStatus.PENDING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
      },
    },
    include: {
      customer: { include: { user: true } },
      shipment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((o) => {
    const shippedAt = o.shipment?.shippedAt ?? undefined;
    // naive estimated delivery: shippedAt + 3 days
    const estimatedDelivery = shippedAt
      ? new Date(shippedAt.getTime() + 3 * 24 * 60 * 60 * 1000)
      : undefined;
    return {
      id: o.id,
      customerEmail: o.customer?.user?.email ?? "",
      totalPrice: Number(o.totalAmount),
      status: o.status,
      trackingNumber: o.shipment?.trackingNumber ?? undefined,
      estimatedDelivery: estimatedDelivery?.toISOString(),
    };
  });
};
