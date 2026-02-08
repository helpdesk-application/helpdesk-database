// models/KBCategory.js
const mongoose = require("mongoose");
const kbSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "KBCategory" },
  category: { type: String, default: "General" },
  title: String,
  content: String,
  tags: [String],
  visibility: { type: String, enum: ["PUBLIC", "INTERNAL"], default: "PUBLIC" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("KnowledgeBase", kbSchema);
