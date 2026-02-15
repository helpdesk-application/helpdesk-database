const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request/response logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  const { method, url } = req;
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[DB-SERVICE] ${method} ${url} -> ${res.statusCode} ${duration}ms`);
  });
  next();
});

// test route
app.get("/", (req, res) => {
  res.send("Helpdesk API Running");
});

// reports route
const reportsRoute = require("./routes/08-reports/reports");
app.use("/reports", reportsRoute);

// tickets route
const ticketsRoute = require("./routes/03-tickets/tickets");
app.use("/tickets", ticketsRoute);

// users route
const usersRoute = require("./routes/02-users/users");
app.use("/users", usersRoute);
app.use("/users/activities", require("./routes/02-users/activities"));

// knowledge route
const knowledgeRoute = require("./routes/07-kb/knowledge");
app.use("/knowledge", knowledgeRoute);

// replies route
const repliesRoute = require("./routes/03-tickets/replies");
app.use("/replies", repliesRoute);

// notifications route
const notificationsRoute = require("./routes/06-notifications/notifications");
app.use("/notifications", notificationsRoute);

// sla route
const slaRoute = require("./routes/05-sla/sla");
app.use("/sla", slaRoute);

// attachments route
const attachmentRoute = require("./routes/04-attachments/attachments");
app.use("/attachments", attachmentRoute);

// start server (ALWAYS LAST)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});