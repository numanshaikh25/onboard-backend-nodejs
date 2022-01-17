import express from "express";
const router = express.Router();

import {
  getNotifications,
  readNotification,
} from "../controllers/notificationController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/getnotifications").get(protect, admin, getNotifications);
router.route("/readnotifications/:id").get(protect, admin, readNotification);

export default router;
