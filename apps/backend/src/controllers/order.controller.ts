import { Response, NextFunction } from "express";
import * as orderService from "../services/order.service";
import * as pdfService from "../services/pdf.service";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/auth";

export const listOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.role === "CUSTOMER") {
      const customer = await prisma.customerProfile.findUnique({
        where: { userId: req.user.id },
      });
      if (!customer) {
        return res.status(404).json({ error: "Customer profile not found" });
      }
      const orders = await orderService.getOrdersForCustomer(customer.id);
      return res.json(orders);
    }

    if (req.user.role === "SELLER") {
      const seller = await prisma.sellerProfile.findUnique({
        where: { userId: req.user.id },
      });
      if (!seller) {
        return res.status(404).json({ error: "Seller profile not found" });
      }
      const orders = await orderService.getOrdersForSeller(seller.id);
      return res.json(orders);
    }

    const orders = await orderService.getAllOrders();
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
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ error: "Bad Request", message: "Order ID is required" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get order with all relations
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

    // Check authorization - customer can only get their own orders
    if (req.user.role === "CUSTOMER") {
      const customer = await prisma.customerProfile.findUnique({
        where: { userId: req.user.id },
      });
      if (!customer || order.customerId !== customer.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
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
