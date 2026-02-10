const express = require("express");
const router = express.Router();

const Ticket = require("../../models/03-tickets/Ticket");
const SLATracking = require("../../models/05-sla/SLATracking");

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
    const { department } = req.query;
    const match = { status: { $in: ["RESOLVED", "CLOSED"] } };
    if (department) match.department = department;

    const result = await Ticket.aggregate([
      { $match: match },
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
    const { department } = req.query;
    const filter = department ? { department } : {};

    const totalTickets = await Ticket.countDocuments(filter);
    const openTickets = await Ticket.countDocuments({ ...filter, status: "OPEN" });
    const resolvedTickets = await Ticket.countDocuments({ ...filter, status: "RESOLVED" });
    const closedTickets = await Ticket.countDocuments({ ...filter, status: "CLOSED" });

    // 🔹 Breakdown Aggregations
    const ticketsByStatus = await Ticket.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const ticketsByPriority = await Ticket.aggregate([
      { $match: filter },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    const avgResMatch = { ...filter, status: { $in: ["RESOLVED", "CLOSED"] } };
    const avgResolutionRes = await Ticket.aggregate([
      { $match: avgResMatch },
      {
        $project: {
          resolutionTime: {
            $divide: [
              { $subtract: ["$updated_at", "$created_at"] },
              3600000 // Convert ms to hours
            ]
          }
        }
      },
      { $group: { _id: null, avgResolutionTime: { $avg: "$resolutionTime" } } }
    ]);

    const slaComplianceRes = await SLATracking.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "ticket_id",
          foreignField: "_id",
          as: "ticket"
        }
      },
      { $unwind: "$ticket" },
      { $match: department ? { "ticket.department": department } : {} },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          breached: { $sum: { $cond: ["$breached", 1, 0] } }
        }
      },
      {
        $project: {
          compliancePercent: {
            $cond: [
              { $eq: ["$total", 0] },
              100,
              { $multiply: [{ $divide: [{ $subtract: ["$total", "$breached"] }, "$total"] }, 100] }
            ]
          }
        }
      }
    ]);

    res.json({
      totalTickets,
      openTickets,
      resolvedTickets,
      closedTickets,
      ticketsByStatus,
      ticketsByPriority,
      avgResolutionTime: avgResolutionRes[0]?.avgResolutionTime || 0,
      slaCompliance: slaComplianceRes[0]?.compliancePercent || 100
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
