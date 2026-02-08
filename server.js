const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Request/response logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  const { method, url } = req;
  const reqBody = req.body;
  let responseBody;
  const oldSend = res.send;
  res.send = function (body) {
    responseBody = body;
    return oldSend.apply(this, arguments);
  };
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[DB-SERVICE] ${new Date().toISOString()} ${method} ${url} -> ${res.statusCode} ${duration}ms`);
    if (reqBody && Object.keys(reqBody).length) console.log(`[DB-SERVICE] Request body: ${JSON.stringify(reqBody)}`);
    try {
      if (responseBody) console.log(`[DB-SERVICE] Response body: ${typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody)}`);
    } catch (e) {
      console.log('[DB-SERVICE] Response body: [unserializable]');
    }
  });
  next();
});

// test route
app.get("/", (req, res) => {
  res.send("Helpdesk API Running");
});

// reports route
const reportsRoute = require("./routes/08-reports/reports");
app.use("/api/reports", reportsRoute);

// tickets route
const ticketsRoute = require("./routes/03-tickets/tickets");
app.use("/api/tickets", ticketsRoute);

// users route
const usersRoute = require("./routes/02-users/users");
app.use("/api/users", usersRoute);
app.use("/api/users/activities", require("./routes/02-users/activities"));

// knowledge route
const knowledgeRoute = require("./routes/07-kb/knowledge");
app.use("/api/knowledge", knowledgeRoute);

// replies route
const repliesRoute = require("./routes/03-tickets/replies");
app.use("/api/replies", repliesRoute);

// notifications route
const notificationsRoute = require("./routes/06-notifications/notifications");
app.use("/api/notifications", notificationsRoute);

// sla route
const slaRoute = require("./routes/05-sla/sla");
app.use("/api/sla", slaRoute);

// attachments route
const attachmentRoute = require("./routes/04-attachments/attachments");
app.use("/api/attachments", attachmentRoute);

// start server (ALWAYS LAST)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
