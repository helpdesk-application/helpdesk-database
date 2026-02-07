const mongoose = require("mongoose");

const connectDB = async () => {
  let uri = process.env.MONGO_URI || "mongodb://localhost:27017/helpdesk";
  console.log(`📡 MongoDB: Attempting connection...`);
  mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000, // Timeout after 10
  })
    .then(() => {
      console.log("✅ MongoDB: Connected successfully");
      console.log(`URI: ${uri}`);
    })
    .catch(error => {
      console.error("❌ MongoDB: Connection failed");
      console.error(`📝 Error message: ${error.message}`);
      console.error(`📝 Error code: ${error.code || 'N/A'}`);

      if (error.message.includes("authentication failed")) {
        console.error("🔑 Hint: Authentication failed. Verify the username and password in your connection string.");
      } else if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo")) {
        console.error("🌐 Hint: Could not reach the MongoDB server. Check your internet connection and cluster address.");
      } else if (error.message.includes("IP") || error.message.includes("whitelist") || error.message.includes("not whitelisted")) {
        console.error("🔒 Hint: Your IP address may not be whitelisted in MongoDB Atlas. Add your current IP to the Atlas Network Access list.");
      }

      console.log("⚡ MongoDB: Falling back to unbuffered/offline mode");
    });
};

module.exports = connectDB;
