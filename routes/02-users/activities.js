const express = require("express");
const router = express.Router();
const UserActivity = require("../../models/02-users/UserActivity");

// Log an activity
router.post("/", async (req, res) => {
    try {
        const activity = new UserActivity(req.body);
        await activity.save();
        res.status(201).json(activity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get activities for a user
router.get("/user/:userId", async (req, res) => {
    try {
        const activities = await UserActivity.find({ user_id: req.params.userId }).sort({ created_at: -1 }).limit(50);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
