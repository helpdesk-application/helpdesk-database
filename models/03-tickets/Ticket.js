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
  // Premium Roadmap Features
  happiness_rating: { type: Number, min: 1, max: 5 },
  customer_feedback: String,
  time_spent_minutes: { type: Number, default: 0 },
  // AI Features (formerly Zia)
  category: { type: String, default: 'General' },
  department: { type: String, default: 'General' },
  sentiment: { type: String, default: 'Neutral' },
});

module.exports = mongoose.model("Ticket", ticketSchema);
