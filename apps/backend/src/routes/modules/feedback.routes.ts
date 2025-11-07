import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as feedbackController from "../../controllers/feedback.controller";

const router = Router({ mergeParams: true });

// Get which productIds the current user has already reviewed
router.get("/mine", authenticate(["CUSTOMER"]), feedbackController.listMyReviewedProductIds);
// List feedback for a specific product (keep param route AFTER specific paths)
router.get("/:productId", feedbackController.listFeedback);
// Only customers can create feedback, and additional checks are performed in the service
router.post("/", authenticate(["CUSTOMER"]), feedbackController.createFeedback);

export { router as feedbackRouter };
