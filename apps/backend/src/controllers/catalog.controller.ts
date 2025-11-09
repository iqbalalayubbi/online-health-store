import { Request, Response, NextFunction } from "express";
import * as catalogService from "../services/catalog.service";

export const listCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await catalogService.listCategories(
      typeof req.query.shopId === "string" ? req.query.shopId : undefined,
    );
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
    const shopId = typeof req.query.shopId === "string" ? req.query.shopId : undefined;
    const filters: Parameters<typeof catalogService.listProducts>[0] = {
      ...(categoryId ? { categoryId } : {}),
      ...(shopId ? { shopId } : {}),
    };
    const products = await catalogService.listProducts(filters);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({ error: "Bad Request", message: "Product ID is required" });
    }
    const product = await catalogService.getProduct(productId);
    if (!product) {
      return res.status(404).json({ error: "Not Found", message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};
