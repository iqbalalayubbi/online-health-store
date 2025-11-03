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
    const products = await catalogService.listProducts({
      categoryId: typeof req.query.categoryId === "string" ? req.query.categoryId : undefined,
      shopId: typeof req.query.shopId === "string" ? req.query.shopId : undefined,
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await catalogService.getProduct(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Not Found", message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

