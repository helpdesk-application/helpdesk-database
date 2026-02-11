const express = require("express");
const router = express.Router();
const Ticket = require("../../models/03-tickets/Ticket");
const TicketHistory = require("../../models/03-tickets/TicketHistory");
const mongoose = require("mongoose");

// Create a ticket
router.post("/", async (req, res) => {
  try {
    const { subject, description, priority, customer_id, category, sentiment } = req.body;

    const ticketData = {
      subject,
      description,
      priority: priority || "MEDIUM",
      status: "OPEN",
      category: category || "General",
      department: req.body.department || "General",
      sentiment: sentiment || "Neutral"
    };
    // Only add customer_id if it's a valid ObjectId
    if (customer_id && mongoose.Types.ObjectId.isValid(customer_id)) {
      ticketData.customer_id = customer_id;
    }
    const ticket = new Ticket(ticketData);
    await ticket.save();

    // Log Creation History
    const history = new TicketHistory({
      ticket_id: ticket._id,
      user_id: customer_id,
      user_name: req.body.user_name || 'Customer',
      action: 'TICKET_CREATED',
      description: 'Ticket opened by user'
    });
    await history.save();

    res.status(201).json({ message: "Ticket created", ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("customer_id").populate("assigned_agent_id");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tickets by customer ID
router.get("/customer/:id", async (req, res) => {
  try {
    const tickets = await Ticket.find({ customer_id: req.params.id }).populate("customer_id").populate("assigned_agent_id");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tickets by agent ID
router.get("/agent/:id", async (req, res) => {
  try {
    const tickets = await Ticket.find({ assigned_agent_id: req.params.id }).populate("customer_id").populate("assigned_agent_id");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get ticket by ID
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("customer_id").populate("assigned_agent_id");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update ticket
router.patch("/:id", async (req, res) => {
  try {
    const { subject, description, priority, status, assigned_agent_id, user_id, user_name } = req.body;
    const oldTicket = await Ticket.findById(req.params.id);
    if (!oldTicket) return res.status(404).json({ message: "Ticket not found" });

    const updateData = { updated_at: Date.now() };
    const historyEntries = [];

    const checkAndLog = (field, newVal) => {
      if (newVal !== undefined && String(oldTicket[field]) !== String(newVal)) {
        updateData[field] = newVal;
        historyEntries.push({
          ticket_id: req.params.id,
          user_id: user_id,
          user_name: user_name || 'System',
          action: 'UPDATE',
          field: field,
          old_value: oldTicket[field],
          new_value: newVal
        });
      }
    };

    if (subject) checkAndLog('subject', subject);
    if (description) checkAndLog('description', description);
    if (priority) checkAndLog('priority', priority);
    if (status) checkAndLog('status', status);
    if (assigned_agent_id) checkAndLog('assigned_agent_id', assigned_agent_id);
    if (req.body.department) checkAndLog('department', req.body.department);

    if (req.body.happiness_rating !== undefined) updateData.happiness_rating = req.body.happiness_rating;
    if (req.body.customer_feedback !== undefined) updateData.customer_feedback = req.body.customer_feedback;
    if (req.body.time_spent_minutes !== undefined) updateData.time_spent_minutes = req.body.time_spent_minutes;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (historyEntries.length > 0) {
      await TicketHistory.insertMany(historyEntries);
    }

    res.json({ message: "Ticket updated", ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get ticket history
router.get("/:id/history", async (req, res) => {
  try {
    const history = await TicketHistory.find({ ticket_id: req.params.id }).sort({ created_at: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete ticket
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
