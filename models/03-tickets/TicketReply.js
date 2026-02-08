// models/TicketReply.js
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  is_internal: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TicketReply", replySchema);
