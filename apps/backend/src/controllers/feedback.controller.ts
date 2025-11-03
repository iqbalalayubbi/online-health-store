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
    const feedback = await feedbackService.listFeedbackForProduct(req.params.productId);
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};
