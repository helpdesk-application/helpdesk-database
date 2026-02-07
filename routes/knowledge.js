const express = require("express");
const router = express.Router();
const KnowledgeBase = require("../models/KnowledgeBase");

// Get all articles
router.get("/", async (req, res) => {
    try {
        const articles = await KnowledgeBase.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create article
router.post("/", async (req, res) => {
    try {
        const article = new KnowledgeBase(req.body);
        await article.save();
        res.status(201).json({ message: "Article created", article });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update article
router.patch("/:id", async (req, res) => {
    try {
        const article = await KnowledgeBase.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!article) return res.status(404).json({ message: "Article not found" });
        res.json({ message: "Article updated", article });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete article
router.delete("/:id", async (req, res) => {
    try {
        const article = await KnowledgeBase.findByIdAndDelete(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });
        res.json({ message: "Article deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
