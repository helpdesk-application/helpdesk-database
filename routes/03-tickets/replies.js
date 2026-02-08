const express = require("express");
const router = express.Router();
const TicketReply = require("../../models/03-tickets/TicketReply");

// Get all replies for a specific ticket
router.get("/ticket/:ticketId", async (req, res) => {
    try {
        const replies = await TicketReply.find({ ticket_id: req.params.ticketId })
            .populate("user_id", "name email role") // Populate user info
            .sort({ created_at: 1 }); // Oldest first
        res.json(replies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new reply
router.post("/", async (req, res) => {
    try {
        const { ticket_id, user_id, message, is_internal } = req.body;

        if (!ticket_id || !user_id || !message) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const reply = new TicketReply({
            ticket_id,
            user_id,
            message,
            is_internal: is_internal || false
        });

        await reply.save();

        // Return the reply with populated user info for immediate frontend update
        const populatedReply = await TicketReply.findById(reply._id).populate("user_id", "name email role");

        res.status(201).json(populatedReply);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
