// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Agent', 'Manager', 'Customer'],
    default: 'Customer'
  },
  department: { type: String, default: 'General' },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
