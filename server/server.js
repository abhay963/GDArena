// Import Express framework
import express from "express";

// Enable Cross-Origin Resource Sharing (allows frontend to access backend)
import cors from "cors";

// Load environment variables from .env
import dotenv from "dotenv";

// Import all route files
import gdRoutes from "./routes/gd.routes.js";
import streakRoutes from "./routes/streak.routes.js";
import topicRoutes from "./routes/topic.routes.js";

// Load .env variables into process.env
dotenv.config();

// Create Express application
const app = express();

// Enable CORS middleware
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Register GD routes
// All routes inside gd.routes.js will start with /api/gd
// Example:
// GET /api/gd/start
// POST /api/gd
app.use("/api/gd", gdRoutes);

// Register streak routes
// Example:
// POST /api/streak/update
// GET /api/streak/:uid
app.use("/api/streak", streakRoutes);

// Register topic routes
// Example:
// GET /api/topics
// GET /api/topics/start
// GET /api/topics/stats
app.use("/api/topics", topicRoutes);

// Default route to check whether backend is running
app.get("/", (req, res) => {
  res.send("🚀 GD Arena Backend is Running...");
});

// Read port from .env
// If not available, use 5000
const PORT = process.env.PORT || 5000;

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("Hey Abhay Back Again 😎");
});