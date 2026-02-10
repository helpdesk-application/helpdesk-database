const express = require("express");
const router = express.Router();
const SLA = require("../../models/05-sla/SLA");
const SLATracking = require("../../models/05-sla/SLATracking");

// GET /api/sla
router.get("/", async (req, res) => {
    try {
        const policies = await SLA.find();
        res.json(policies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/sla/tracking
router.post("/tracking", async (req, res) => {
    try {
        const { ticket_id, priority, created_at, breached } = req.body;

        if (!ticket_id || !priority) {
            return res.status(400).json({ error: "Missing ticket_id or priority" });
        }

        // Find SLA policy for this priority
        const slaPolicy = await SLA.findOne({ priority });
        if (!slaPolicy) {
            return res.status(404).json({ error: "SLA Policy not found for this priority" });
        }

        const slaLimitHours = slaPolicy.resolution_time_hours || 48; // Default to 48 if not set

        // Calculate deadlines
        const creationTime = new Date(created_at || Date.now());
        const resolutionDeadline = new Date(creationTime.getTime() + slaLimitHours * 60 * 60 * 1000);
        // Approximate response deadline as half of resolution if not specific (or look it up if I had model details)
        const responseDeadline = new Date(creationTime.getTime() + (slaPolicy.response_time_hours || 24) * 60 * 60 * 1000);

        const trackingEntry = new SLATracking({
            ticket_id,
            sla_id: slaPolicy._id,
            response_deadline: responseDeadline,
            resolution_deadline: resolutionDeadline,
            breached: breached || false
        });

        await trackingEntry.save();
        res.status(201).json({ message: "SLA Tracking log created", tracking: trackingEntry });

    } catch (error) {
        console.error("Error logging SLA:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
