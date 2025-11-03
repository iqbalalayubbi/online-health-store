import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/auth";

export const listCustomers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await adminService.listCustomers();
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

export const setCustomerStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await adminService.setCustomerActiveState(
      req.params.customerId,
      req.body.isActive === true,
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const getGuestbookEntries = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const entries = await adminService.listGuestbookEntries();
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

export const deleteGuestbookEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminService.deleteGuestbookEntry(req.params.entryId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await adminService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await adminService.updateCategory(req.params.categoryId, req.body);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminService.deleteCategory(req.params.categoryId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const listShopRequests = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await adminService.listShopRequests();
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

export const reviewShopRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const adminProfile = await prisma.adminProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!adminProfile) {
      return res.status(403).json({ error: "Forbidden", message: "Admin profile not found" });
    }

    const decision = req.body.decision === "APPROVED" ? "APPROVED" : "REJECTED";
    const request = await adminService.reviewShopRequest(
      req.params.requestId,
      decision,
      adminProfile.id,
    );
    res.json(request);
  } catch (error) {
    next(error);
  }
};

export const markOrderAsShipped = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shipment = await adminService.markOrderAsShipped(req.params.orderId, req.body);
    res.json(shipment);
  } catch (error) {
    next(error);
  }
};

