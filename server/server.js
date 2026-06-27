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

import performanceRoutes from "./routes/performance.routes.js";

// Load .env variables into process.env
dotenv.config();

// Create Express application
const app = express();

// Enable CORS middleware
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());


// POST /api/gd
app.use("/api/gd", gdRoutes);


app.use("/api/streak", streakRoutes);


app.use("/api/topics", topicRoutes);



app.use("/api/performance", performanceRoutes);
// Default route to check whether backend is running
app.get("/", (req, res) => {
  res.send("🚀 GD Arena Backend is Running...");
});

// Read port from .env
// If not available, use 5000
// Read port from .env
const PORT = process.env.PORT || 5000;

app.listen(PORT,(req,res)=>{
  console.log(`Working on ${PORT}`);
})