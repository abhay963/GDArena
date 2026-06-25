import express from "express";

// Import controller functions
import {
  startGroupDiscussion,
  continueGroupDiscussion,
} from "../controllers/gd.controller.js";

// Create a new router
const router = express.Router();

// GET /api/gd/start
// Starts a new Group Discussion by generating
// a random topic and AI opening statements
router.get("/start", startGroupDiscussion);

// POST /api/gd
// Continues the existing discussion
// Expects:
// {
//   userSpeech,
//   topic,
//   history
// }
router.post("/", continueGroupDiscussion);

// Export router so it can be used in server.js
export default router;