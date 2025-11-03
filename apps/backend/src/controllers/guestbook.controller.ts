import { Request, Response, NextFunction } from "express";
import * as guestbookService from "../services/guestbook.service";
import { AuthenticatedRequest } from "../middleware/auth";

export const createEntry = async (
  req: AuthenticatedRequest | Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = "user" in req && req.user ? req.user.id : undefined;
    const entry = await guestbookService.createEntry(userId, req.body);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

