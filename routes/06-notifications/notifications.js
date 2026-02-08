const express = require("express");
const router = express.Router();
const Notification = require("../../models/06-notifications/Notification");

// Get notifications for a user
router.get("/user/:userId", async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.params.userId })
            .sort({ created_at: -1 })
            .limit(20);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a notification
router.post("/", async (req, res) => {
    try {
        const { user_id, message, ticket_id } = req.body;
        const notification = new Notification({ user_id, message, ticket_id });
        await notification.save();
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark as read
router.patch("/:id/read", async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { is_read: true },
            { new: true }
        );
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
