const express = require("express");
const router = express.Router();
const Attachment = require("../models/Attachment");

// Create attachment
router.post("/", async (req, res) => {
    try {
        const attachment = new Attachment(req.body);
        await attachment.save();
        res.status(201).json(attachment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get attachments for a ticket
router.get("/ticket/:id", async (req, res) => {
    try {
        const attachments = await Attachment.find({ ticket_id: req.params.id });
        res.json(attachments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete attachment
router.delete("/:id", async (req, res) => {
    try {
        await Attachment.findByIdAndDelete(req.params.id);
        res.json({ message: "Attachment deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
