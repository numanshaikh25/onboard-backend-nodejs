import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  is_read: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
