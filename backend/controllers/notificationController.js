import asyncHandler from "express-async-handler";
import express from "express";

import Notification from "../models/notificationModel.js";

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ is_read: false });
  res.json({ notifications: notifications });
});

const readNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  notification.is_read = true;
  const readnotification = await notification.save();
  const notifications = await Notification.find({ is_read: false });
  res.json({ notifications: notifications });
});

export { getNotifications, readNotification };
