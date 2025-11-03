import { Router } from "express";
import { authRouter } from "./modules/auth.routes";
import { adminRouter } from "./modules/admin.routes";
import { sellerRouter } from "./modules/seller.routes";
import { customerRouter } from "./modules/customer.routes";
import { catalogRouter } from "./modules/catalog.routes";
import { orderRouter } from "./modules/order.routes";
import { feedbackRouter } from "./modules/feedback.routes";
import { guestBookRouter } from "./modules/guestbook.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/seller", sellerRouter);
router.use("/customer", customerRouter);
router.use("/catalog", catalogRouter);
router.use("/orders", orderRouter);
router.use("/feedback", feedbackRouter);
router.use("/guestbook", guestBookRouter);

export { router };

