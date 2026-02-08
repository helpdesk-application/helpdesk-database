const express = require("express");
const router = express.Router();
const KBCategory = require("../../models/07-kb/KBCategory");
const KnowledgeBase = require("../../models/07-kb/KnowledgeBase");

// Get all articles (Populated)
router.get("/", async (req, res) => {
    try {
        const articles = await KnowledgeBase.find().populate("category_id");
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SEARCH articles
router.get("/search", async (req, res) => {
    try {
        const { q } = req.query;
        const articles = await KnowledgeBase.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ]
        }).populate("category_id");
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CATEGORY ROUTES ---

// Get all categories
router.get("/categories", async (req, res) => {
    try {
        const categories = await KBCategory.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create category
router.post("/categories", async (req, res) => {
    try {
        const category = new KBCategory(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ARTICLE ROUTES ---

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
