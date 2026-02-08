const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
  uploader_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  original_name: { type: String, required: true },
  mime_type: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true }, // Local path or Cloud URL
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attachment", attachmentSchema);
