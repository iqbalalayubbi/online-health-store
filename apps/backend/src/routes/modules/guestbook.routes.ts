import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as guestbookController from "../../controllers/guestbook.controller";
import * as adminController from "../../controllers/admin.controller";

const router = Router();

router.post("/", authenticate(["CUSTOMER", "SELLER", "ADMIN"]), guestbookController.createEntry);
router.post("/public", guestbookController.createEntry);

router.get("/", authenticate(["ADMIN"]), adminController.getGuestbookEntries);
router.delete("/:entryId", authenticate(["ADMIN"]), adminController.deleteGuestbookEntry);

export { router as guestBookRouter };

