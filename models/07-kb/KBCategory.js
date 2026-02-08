const mongoose = require('mongoose');

const kbCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    icon: String, // Lucide icon name or URL
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KBCategory', kbCategorySchema);
