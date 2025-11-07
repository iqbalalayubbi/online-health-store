import { Response, NextFunction, Request } from "express";
import * as feedbackService from "../services/feedback.service";
import { AuthenticatedRequest } from "../middleware/auth";

export const createFeedback = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const feedback = await feedbackService.createFeedback(req.user.id, req.body);
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

export const listFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({ error: "Bad Request", message: "productId is required" });
    }
    const feedback = await feedbackService.listFeedbackForProduct(productId);
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

export const listMyReviewedProductIds = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // New behavior: accept orderIds to get reviewed productIds per order
    const rawOrderIds = typeof req.query.orderIds === "string" ? req.query.orderIds : "";
    const orderIds = rawOrderIds
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (orderIds.length === 0) {
      return res.json({ reviewedByOrder: {} });
    }
    const reviewedByOrder = await feedbackService.listReviewedProductIdsForUserByOrders(
      req.user.id,
      orderIds,
    );
    res.json({ reviewedByOrder });
  } catch (error) {
    next(error);
  }
};
