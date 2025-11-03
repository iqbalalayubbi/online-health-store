import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as feedbackController from "../../controllers/feedback.controller";

const router = Router({ mergeParams: true });

router.get("/:productId", feedbackController.listFeedback);
router.post("/", authenticate(["CUSTOMER", "SELLER", "ADMIN"]), feedbackController.createFeedback);

export { router as feedbackRouter };

