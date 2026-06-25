// Import functions from topic service
import {
  getRandomTopic,
  getTopics,
  getTopicStats,
} from "../services/topic.service.js";

// Handles GET /api/topics/start
export function startTopic(req, res) {
  try {
    // Get one random topic and its category
    const topic = getRandomTopic();

    // Send topic to frontend
    res.json(topic);
  } catch (error) {
    // Print error for debugging
    console.error(error);

    // Send error response
    res.status(500).json({
      message: "Failed to generate topic",
    });
  }
}

// Handles GET /api/topics
export function fetchTopics(req, res) {
  try {
    // Read category from query string
    // Example: /api/topics?category=Technology & Innovation
    const { category } = req.query;

    // Fetch topics
    const topics = getTopics(category);

    // Send topics
    res.json({
      topics,
      count: topics.length,
    });
  } catch (error) {
    // Print error
    console.error(error);

    // Send error response
    res.status(500).json({
      message: "Failed to fetch topics",
    });
  }
}

// Handles GET /api/topics/stats
export function fetchTopicStats(req, res) {
  try {
    // Get topic statistics
    const stats = getTopicStats();

    // Send statistics
    res.json(stats);
  } catch (error) {
    // Print error
    console.error(error);

    // Send error response
    res.status(500).json({
      message: "Failed to fetch topic statistics",
    });
  }
}