const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');
const dotenv = require('dotenv');

dotenv.config({ path: './helpdesk-backend/.env' });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/helpdesk";

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for migration...");

        const tickets = await Ticket.find();
        let updatedCount = 0;

        for (const ticket of tickets) {
            let needsUpdate = false;

            if (ticket.customer_id && typeof ticket.customer_id === 'string') {
                ticket.customer_id = new mongoose.Types.ObjectId(ticket.customer_id);
                needsUpdate = true;
            }

            if (ticket.assigned_agent_id && typeof ticket.assigned_agent_id === 'string') {
                ticket.assigned_agent_id = new mongoose.Types.ObjectId(ticket.assigned_agent_id);
                needsUpdate = true;
            }

            if (needsUpdate) {
                await ticket.save();
                updatedCount++;
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} tickets.`);
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
