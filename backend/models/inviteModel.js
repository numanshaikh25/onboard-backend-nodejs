import mongoose from "mongoose";

const inviteSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;
