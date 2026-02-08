const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the standard location
dotenv.config({ path: path.join(__dirname, '.env') });

const SLA = require('./models/05-sla/SLA');
const KBCategory = require('./models/07-kb/KBCategory');

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/helpdesk');

        console.log('Seeding SLA Policies...');
        await SLA.deleteMany({});
        await SLA.insertMany([
            { priority: 'CRITICAL', response_time_hours: 1, resolution_time_hours: 4 },
            { priority: 'HIGH', response_time_hours: 4, resolution_time_hours: 24 },
            { priority: 'MEDIUM', response_time_hours: 24, resolution_time_hours: 48 },
            { priority: 'LOW', response_time_hours: 48, resolution_time_hours: 72 }
        ]);

        console.log('Seeding KB Categories...');
        await KBCategory.deleteMany({});
        await KBCategory.insertMany([
            { name: 'General', description: 'General help and guides', icon: 'HelpCircle' },
            { name: 'Billing', description: 'Billing and subscription issues', icon: 'CreditCard' },
            { name: 'Technical', description: 'Technical troubleshooting', icon: 'Settings' },
            { name: 'Security', description: 'Account security and privacy', icon: 'Lock' }
        ]);

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
}

seed();
