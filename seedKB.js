const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const KBCategory = require('./models/07-kb/KBCategory');
const KnowledgeBase = require('./models/07-kb/KnowledgeBase');

const categories = [
    { name: 'General', description: 'Basic information and common questions.', icon: 'HelpCircle' },
    { name: 'IT Support', description: 'Technical guides and troubleshooting.', icon: 'Settings' },
    { name: 'Billing', description: 'Information regarding invoices and payments.', icon: 'CreditCard' },
    { name: 'Sales', description: 'Product information and pricing guides.', icon: 'ShoppingCart' }
];

const articles = [
    {
        title: 'Getting Started with Helpdesk Pro',
        content: 'Welcome to Helpdesk Pro! This guide will walk you through the basics of raising a ticket and managing your profile. Regular tickets can be created via the "Tickets" menu. You can track their status in real-time.',
        category: 'General',
        tags: ['welcome', 'guide', 'basics'],
        visibility: 'PUBLIC'
    },
    {
        title: 'How to Reset Your password',
        content: 'To reset your password, go to Account Settings and fill in the "Change Password" form. Remember that your new password must be at least 8 characters long.',
        category: 'General',
        tags: ['password', 'account', 'security'],
        visibility: 'PUBLIC'
    },
    {
        title: 'Troubleshooting VPN Connections',
        content: 'If you are having trouble connecting to the corporate VPN, please ensure you are using the latest version of the client. Check your credentials and ensure your internet connection is stable. If issues persist, contact IT support.',
        category: 'IT Support',
        tags: ['vpn', 'network', 'it'],
        visibility: 'PUBLIC'
    },
    {
        title: 'Internal: Agent Onboarding Guide',
        content: 'This guide is for internal staff only. When a new agent joins, ensure they are assigned to the correct department and have the necessary permissions to respond to tickets.',
        category: 'General',
        tags: ['onboarding', 'internal', 'hr'],
        visibility: 'INTERNAL'
    },
    {
        title: 'Understanding SLA Breach Notifications',
        content: 'SLAs are tracked automatically. If a ticket exceeds the response time, a notification is sent to the manager. Managers can reallocate tickets to ensure compliance.',
        category: 'General',
        tags: ['sla', 'notifications', 'manager'],
        visibility: 'INTERNAL'
    }
];

const seedKB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for KB Seeding...');

        // Clear existing
        await KBCategory.deleteMany({});
        await KnowledgeBase.deleteMany({});
        console.log('Cleared existing articles and categories.');

        // Insert categories
        const createdCats = await KBCategory.insertMany(categories);
        console.log(`Inserted ${createdCats.length} categories.`);

        // Map articles to category IDs
        const catMap = {};
        createdCats.forEach(cat => {
            catMap[cat.name] = cat._id;
        });

        const articlesWithIds = articles.map(a => ({
            ...a,
            category_id: catMap[a.category]
        }));

        const createdArticles = await KnowledgeBase.insertMany(articlesWithIds);
        console.log(`Inserted ${createdArticles.length} articles.`);

        console.log('Knowledge Base Seeding Complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedKB();
