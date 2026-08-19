import express from "express";

import {
  startGroupDiscussion,
  continueGroupDiscussion,
} from "../controllers/gd.controller.js";

const router = express.Router();

// Start a new Group Discussion
// POST /api/gd/start
router.post("/start", startGroupDiscussion);

// Continue existing Group Discussion
// POST /api/gd
router.post("/", continueGroupDiscussion);

export default router;