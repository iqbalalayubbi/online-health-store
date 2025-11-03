import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as adminController from "../../controllers/admin.controller";
import * as orderController from "../../controllers/order.controller";

const router = Router();

router.use(authenticate(["ADMIN"]));

router.get("/customers", adminController.listCustomers);
router.patch("/customers/:customerId/status", adminController.setCustomerStatus);

router.get("/guestbook", adminController.getGuestbookEntries);
router.delete("/guestbook/:entryId", adminController.deleteGuestbookEntry);

router.post("/categories", adminController.createCategory);
router.put("/categories/:categoryId", adminController.updateCategory);
router.delete("/categories/:categoryId", adminController.deleteCategory);

router.get("/shop-requests", adminController.listShopRequests);
router.post("/shop-requests/:requestId/review", adminController.reviewShopRequest);

router.get("/orders", orderController.listOrders);
router.patch("/orders/:orderId/ship", adminController.markOrderAsShipped);

export { router as adminRouter };

