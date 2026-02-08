// models/Role.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role_name: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Role", roleSchema);
