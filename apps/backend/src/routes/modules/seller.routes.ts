import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as sellerController from "../../controllers/seller.controller";
import * as orderController from "../../controllers/order.controller";

const router = Router();

router.use(authenticate(["SELLER"]));

router.post("/shop-requests", sellerController.submitShopRequest);
router.get("/shops", sellerController.listShops);

router.get("/products", sellerController.listProducts);
router.post("/products", sellerController.createProduct);
router.put("/products/:productId", sellerController.updateProduct);
router.delete("/products/:productId", sellerController.deleteProduct);

router.get("/orders", orderController.listOrders);

export { router as sellerRouter };

