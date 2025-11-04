import { Response, NextFunction } from "express";
import * as customerService from "../services/customer.service";
import * as orderService from "../services/order.service";
import * as pdfService from "../services/pdf.service";
import { prisma } from "../lib/prisma";
import { createHttpError } from "../utils/http-error";
import { AuthenticatedRequest } from "../middleware/auth";

const getCustomerProfileOrThrow = async (userId: string) => {
  const profile = await prisma.customerProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw createHttpError(404, "Customer profile not found");
  }
  return profile;
};

export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await customerService.getProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await customerService.updateProfile(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await getCustomerProfileOrThrow(req.user.id);
    const cart = await customerService.getCart(profile.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await getCustomerProfileOrThrow(req.user.id);
    const item = await customerService.addToCart(profile.id, req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await getCustomerProfileOrThrow(req.user.id);
    await customerService.removeFromCart(profile.id, req.params.cartItemId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const checkout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const order = await customerService.checkout(req.user.id, req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const order = await customerService.cancelOrder(req.user.id, req.params.orderId);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await getCustomerProfileOrThrow(req.user.id);
    const orders = await orderService.getOrdersForCustomer(profile.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const exportOrderPDF = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const profile = await getCustomerProfileOrThrow(req.user.id);
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Get order and verify it belongs to customer
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        shipment: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.customerId !== profile.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Generate PDF
    const pdfStream = await pdfService.generateOrderPDF(order);

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Invoice-${order.orderNumber}.pdf"`);

    // Pipe PDF stream to response
    pdfStream.pipe(res);
  } catch (error) {
    next(error);
  }
};
