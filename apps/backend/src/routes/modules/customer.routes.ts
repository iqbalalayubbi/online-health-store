import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as customerController from "../../controllers/customer.controller";

const router = Router();

router.use(authenticate(["CUSTOMER"]));

router.get("/profile", customerController.getProfile);
router.put("/profile", customerController.updateProfile);

router.get("/cart", customerController.getCart);
router.post("/cart", customerController.addToCart);
router.delete("/cart/:cartItemId", customerController.removeFromCart);

router.get("/orders", customerController.listOrders);
router.post("/orders", customerController.checkout);
router.delete("/orders/:orderId", customerController.cancelOrder);

export { router as customerRouter };

