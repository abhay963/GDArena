import express from "express";

import {
  chatWithStudyMate,
} from "../controllers/studymateController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| General StudyMate AI Chat
|--------------------------------------------------------------------------
|
| This endpoint is used when the user has NOT selected a document.
|
| POST /api/studymate/chat
|
*/

router.post(
  "/chat",
  chatWithStudyMate
);

export default router;