const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");

// Create a ticket
router.post("/", async (req, res) => {
  try {
    const { subject, description, priority, customer_id } = req.body;
    const ticketData = {
      subject,
      description,
      priority: priority || "MEDIUM",
      status: "OPEN"
    };
    // Only add customer_id if it's a valid ObjectId
    if (customer_id && mongoose.Types.ObjectId.isValid(customer_id)) {
      ticketData.customer_id = customer_id;
    }
    const ticket = new Ticket(ticketData);
    await ticket.save();
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
    const { subject, description, priority, status, assigned_agent_id } = req.body;
    const updateData = { updated_at: Date.now() };

    if (subject) updateData.subject = subject;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;
    if (assigned_agent_id) updateData.assigned_agent_id = assigned_agent_id;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket updated", ticket });
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
