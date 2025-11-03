import { Response, NextFunction } from "express";
import * as orderService from "../services/order.service";
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

