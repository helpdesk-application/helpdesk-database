// models/SLATracking.js
const mongoose = require("mongoose");

const slaTrackingSchema = new mongoose.Schema({
  ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
  sla_id: { type: mongoose.Schema.Types.ObjectId, ref: "SLA" },
  response_deadline: Date,
  resolution_deadline: Date,
  breached: { type: Boolean, default: false },
});

module.exports = mongoose.model("SLATracking", slaTrackingSchema);
