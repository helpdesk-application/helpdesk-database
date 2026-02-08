const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g., "LoggedIn", "LoggedOut", "ProfileUpdated"
    description: { type: String },
    ip_address: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserActivity", userActivitySchema);
