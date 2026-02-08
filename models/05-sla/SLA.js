// models/SLA.js
const mongoose = require("mongoose");

const slaSchema = new mongoose.Schema({
  priority: String,
  response_time_hours: Number,
  resolution_time_hours: Number,
});

module.exports = mongoose.model("SLA", slaSchema);
