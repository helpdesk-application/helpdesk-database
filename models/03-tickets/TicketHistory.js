const mongoose = require('mongoose');

const ticketHistorySchema = new mongoose.Schema({
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user_name: String, // Denormalized for quick display
    action: { type: String, required: true }, // e.g., 'UPDATE_STATUS', 'ASSIGN', 'EDIT'
    field: String,
    old_value: mongoose.Schema.Types.Mixed,
    new_value: mongoose.Schema.Types.Mixed,
    description: String,
    created_at: { type: Date, default: Date.now }
});

ticketHistorySchema.index({ ticket_id: 1 });

module.exports = mongoose.model('TicketHistory', ticketHistorySchema);
