// models/Ticket.js
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  subject: String,
  description: String,
  priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
  status: {
    type: String,
    enum: ["OPEN", "IN_PROGRESS", "WAITING_FOR_CUSTOMER", "RESOLVED", "CLOSED"],
    default: "OPEN",
  },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assigned_agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
