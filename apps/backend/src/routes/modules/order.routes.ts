import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as orderController from "../../controllers/order.controller";

const router = Router();

router.use(authenticate(["CUSTOMER", "SELLER", "ADMIN"]));

router.get("/", orderController.listOrders);

export { router as orderRouter };

