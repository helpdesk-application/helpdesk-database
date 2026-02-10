const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const readline = require('readline');

// Load env from database folder
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/02-users/User');

const MONGO_URI = process.env.MONGO_URI;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createSuperAdmin() {
    try {
        console.log('\n--- Create Super Admin ---');

        const name = await question('Enter Name: ');
        const email = await question('Enter Email: ');
        const password = await question('Enter Password: ');

        if (!name || !email || !password) {
            console.error('Error: All fields are required.');
            process.exit(1);
        }

        console.log('\nConnecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        const exists = await User.findOne({ email });
        if (exists) {
            console.error(`Error: User with email ${email} already exists.`);
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'Super Admin',
            department: 'Management',
            status: 'ACTIVE'
        });

        await newUser.save();
        console.log(`\n✅ Super Admin created successfully: ${email}`);

        process.exit(0);
    } catch (err) {
        console.error('\n❌ Failed to create Super Admin:', err.message);
        process.exit(1);
    }
}

createSuperAdmin();
