const express = require("express");
const router = express.Router();
const Attachment = require("../../models/04-attachments/Attachment");

// Create attachment
router.post("/", async (req, res) => {
    try {
        // req.body.content should be a base64 string or buffer from axios
        const attachmentData = req.body;
        if (attachmentData.content && typeof attachmentData.content === 'string') {
            attachmentData.content = Buffer.from(attachmentData.content, 'base64');
        }
        const attachment = new Attachment(attachmentData);
        await attachment.save();

        // Don't send back the buffer in the list/metadata response
        const response = attachment.toObject();
        delete response.content;
        res.status(201).json(response);
    } catch (err) {
        console.error("[DB-ATTACHMENT] Save error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// Get attachments for a ticket (Metadata only)
router.get("/ticket/:id", async (req, res) => {
    try {
        const attachments = await Attachment.find({ ticket_id: req.params.id }).select("-content");
        res.json(attachments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

<<<<<<< HEAD
// Download attachment by filename (Returns binary)
router.get("/filename/:filename/download", async (req, res) => {
    try {
        const attachment = await Attachment.findOne({ filename: req.params.filename });
        if (!attachment) return res.status(404).json({ error: "Not found" });

        res.set({
            "Content-Type": attachment.mime_type,
            "Content-Disposition": `attachment; filename="${attachment.original_name}"`,
            "Content-Length": attachment.content.length
        });
        res.send(attachment.content);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

=======
>>>>>>> 111453fecb43ccc8fd926c7444d5545796875210
// Download attachment (Returns binary)
router.get("/:id/download", async (req, res) => {
    try {
        const attachment = await Attachment.findById(req.params.id);
        if (!attachment) return res.status(404).json({ error: "Not found" });

        res.set({
            "Content-Type": attachment.mime_type,
            "Content-Disposition": `attachment; filename="${attachment.original_name}"`,
            "Content-Length": attachment.content.length
        });
        res.send(attachment.content);
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
