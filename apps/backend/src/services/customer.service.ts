import { Prisma, PaymentMethod, OrderStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { generateOrderNumber } from "../utils/order";
import { createHttpError } from "../utils/http-error";

export const getProfile = (userId: string) => {
  return prisma.customerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: { email: true, isActive: true, createdAt: true },
      },
    },
  });
};

const updateProfileSchema = z.object({
  fullName: z.string().min(3).optional(),
  phoneNumber: z.string().optional(),
  defaultCity: z.string().optional(),
  defaultState: z.string().optional(),
  defaultZip: z.string().optional(),
});

export const updateProfile = (userId: string, payload: unknown) => {
  const data = updateProfileSchema.parse(payload);
  return prisma.customerProfile.update({
    where: { userId },
    data,
  });
};

const ensureCart = async (customerId: string) => {
  const existing = await prisma.cart.findFirst({ where: { customerId } });
  if (existing) return existing;
  return prisma.cart.create({
    data: { customerId },
  });
};

export const getCart = async (customerId: string) => {
  const cart = await ensureCart(customerId);
  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export const addToCart = async (customerId: string, payload: unknown) => {
  const data = cartItemSchema.parse(payload);
  const cart = await ensureCart(customerId);

  const product = await prisma.product.findUnique({ where: { id: data.productId } });
  if (!product || !product.isActive) {
    throw createHttpError(404, "Product not available");
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId: data.productId },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + data.quantity },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: data.productId,
      quantity: data.quantity,
    },
  });
};

export const removeFromCart = async (customerId: string, cartItemId: string) => {
  const cart = await ensureCart(customerId);
  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cartId: cart.id },
  });
  if (!item) {
    throw createHttpError(404, "Cart item not found");
  }
  await prisma.cartItem.delete({ where: { id: cartItemId } });
};

const checkoutSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
  shippingName: z.string().min(3),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
  shippingState: z.string().min(2),
  shippingPostalCode: z.string().min(3),
  shippingCountry: z.string().min(2),
});

export const checkout = async (userId: string, payload: unknown) => {
  const data = checkoutSchema.parse(payload);
  const customer = await prisma.customerProfile.findUnique({
    where: { userId },
  });
  if (!customer) {
    throw createHttpError(404, "Customer profile not found");
  }

  const cart = await ensureCart(customer.id);
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: {
      product: true,
    },
  });

  if (cartItems.length === 0) {
    throw createHttpError(400, "Cart is empty");
  }

  return prisma.$transaction(async (tx) => {
    const total = cartItems.reduce((sum, item) => {
      return sum + item.quantity * Number(item.product.price);
    }, 0);

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        status: data.paymentMethod === "COD" ? OrderStatus.PENDING : OrderStatus.APPROVED,
        totalAmount: new Prisma.Decimal(total),
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingState: data.shippingState,
        shippingPostalCode: data.shippingPostalCode,
        shippingCountry: data.shippingCountry,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
        payment: {
          create: {
            method: data.paymentMethod,
            status: data.paymentMethod === "COD" ? "PENDING" : "COMPLETED",
            amount: new Prisma.Decimal(total),
          },
        },
      },
      include: {
        items: true,
        payment: true,
      },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  });
};

export const cancelOrder = async (userId: string, orderId: string) => {
  const customer = await prisma.customerProfile.findUnique({
    where: { userId },
  });
  if (!customer) {
    throw createHttpError(404, "Customer profile not found");
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: customer.id },
    include: {
      shipment: true,
    },
  });

  if (!order) {
    throw createHttpError(404, "Order not found");
  }

  if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
    throw createHttpError(400, "Order cannot be cancelled after shipping");
  }

  return prisma.order.update({
    where: { id: order.id },
    data: {
      status: OrderStatus.CANCELLED,
    },
  });
};



