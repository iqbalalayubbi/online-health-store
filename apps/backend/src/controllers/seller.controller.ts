import { Response, NextFunction } from "express";
import * as sellerService from "../services/seller.service";
import { prisma } from "../lib/prisma";
import { createHttpError } from "../utils/http-error";
import { AuthenticatedRequest } from "../middleware/auth";

const getSellerProfile = async (userId: string) => {
  const profile = await prisma.sellerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw createHttpError(404, "Seller profile not found");
  }
  return profile;
};

export const submitShopRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await getSellerProfile(req.user.id);
    const request = await sellerService.submitShopRequest(profile.id, req.body);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const listShops = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await getSellerProfile(req.user.id);
    const shops = await sellerService.listSellerShops(profile.id);
    res.json(shops);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await getSellerProfile(req.user.id);
    const product = await sellerService.createProduct(profile.id, req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await getSellerProfile(req.user.id);
    const product = await sellerService.updateProduct(profile.id, req.params.productId, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await getSellerProfile(req.user.id);
    await sellerService.deleteProduct(profile.id, req.params.productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const listProducts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await getSellerProfile(req.user.id);
    const products = await sellerService.listSellerProducts(profile.id);
    res.json(products);
  } catch (error) {
    next(error);
  }
};


