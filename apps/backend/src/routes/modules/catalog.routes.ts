import { Router } from "express";
import * as catalogController from "../../controllers/catalog.controller";

const router = Router();

router.get("/categories", catalogController.listCategories);
router.get("/products", catalogController.listProducts);
router.get("/products/:productId", catalogController.getProduct);

export { router as catalogRouter };

