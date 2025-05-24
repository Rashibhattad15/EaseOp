import { Router } from "express";
import { notifyAdmins, subscribeToAdmin } from "../controllers/messagingController";

const router = Router();

router.post("/notify-admins", notifyAdmins);
router.post("/subscribe-admin", subscribeToAdmin);

export default router;
