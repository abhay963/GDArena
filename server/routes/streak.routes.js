import express from "express";

// Import controller functions that handle the request logic
import {
  updateStreak,
  getStreak,
} from "../controllers/streak.controller.js";

// Create a new router object
const router = express.Router();

// POST /api/streak/update
// Updates the user's streak after completing today's task
router.post("/update", updateStreak);

// GET /api/streak/:uid
// Returns the current streak of the given user
router.get("/:uid", getStreak);

// Export router so it can be used in server.js
export default router;