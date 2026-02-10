const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env from database folder
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/02-users/User');

const MONGO_URI = process.env.MONGO_URI;

const users = [
    {
        name: 'Admin User',
        email: 'admin@helpdesk.com',
        password: 'admin123',
        role: 'Admin',
        department: 'IT Support'
    },
    {
        name: 'Agent User',
        email: 'agent@helpdesk.com',
        password: 'agent123',
        role: 'Agent',
        department: 'IT Support'
    },
    {
        name: 'Customer User',
        email: 'customer@helpdesk.com',
        password: 'customer123',
        role: 'Customer',
        department: 'General'
    }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        for (const u of users) {
            const exists = await User.findOne({ email: u.email });
            if (exists) {
                console.log(`User ${u.email} already exists. Updating password...`);
                exists.password = await bcrypt.hash(u.password, 10);
                await exists.save();
            } else {
                console.log(`Creating user ${u.email}...`);
                u.password = await bcrypt.hash(u.password, 10);
                await User.create(u);
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
