import express from "express";

// Import controller functions
import {
  startTopic,
  fetchTopics,
  fetchTopicStats,
} from "../controllers/topic.controller.js";

// Create a new router object
const router = express.Router();

// GET /api/topics/start
// Returns one random topic with its category
router.get("/start", startTopic);

// GET /api/topics
// Returns all topics or topics filtered by category
// Example:
// /api/topics
// /api/topics?category=Technology%20%26%20Innovation
router.get("/", fetchTopics);

// GET /api/topics/stats
// Returns total topics, category counts and recently used topics
router.get("/stats", fetchTopicStats);

// Export router so server.js can use it
export default router;