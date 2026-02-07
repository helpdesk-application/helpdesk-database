const express = require("express");
const router = express.Router();

const Ticket = require("../models/Ticket");
const SLATracking = require("../models/SLATracking");

// 🔹 Tickets by status
router.get("/tickets-by-status", async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Tickets by agent
router.get("/tickets-by-agent", async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      { $group: { _id: "$assigned_agent_id", count: { $sum: 1 } } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Resolved tickets by agent (Performance)
router.get("/tickets-by-agent-resolved", async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      { $match: { status: { $in: ["RESOLVED", "CLOSED"] } } },
      { $group: { _id: "$assigned_agent_id", count: { $sum: 1 } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "agent" } },
      { $unwind: "$agent" },
      { $project: { _id: 1, count: 1, "agent.name": 1, "agent.email": 1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 SLA breaches
router.get("/sla-breaches", async (req, res) => {
  try {
    const result = await SLATracking.find({ breached: true });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Dashboard Summary
router.get("/dashboard-summary", async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: "OPEN" });
    const resolvedTickets = await Ticket.countDocuments({ status: "RESOLVED" });
    const closedTickets = await Ticket.countDocuments({ status: "CLOSED" });

    const ticketsByStatus = await Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const ticketsByPriority = await Ticket.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    res.json({
      totalTickets,
      openTickets,
      resolvedTickets,
      closedTickets,
      ticketsByStatus,
      ticketsByPriority
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
