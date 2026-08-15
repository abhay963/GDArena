import express from "express";

import {
  createOrGetChat,
  getChatByDocument,
  getChat,
  saveMessage,
  getDocuments,
} from "../controllers/chatController.js";

const router = express.Router();


// ========================================================
// CREATE / GET CHAT SESSION
// POST /api/chats
// ========================================================

router.post(
  "/",
  createOrGetChat
);


// ========================================================
// GET CHAT BY DOCUMENT
// GET /api/chats/document?userId=...&documentId=...
//
// IMPORTANT:
// This MUST come before /:chatSessionId
// ========================================================

router.get(
  "/document",
  getChatByDocument
);


// ========================================================
// GET USER DOCUMENTS
// GET /api/chats/documents?userId=...
//
// IMPORTANT:
// This MUST also come before /:chatSessionId
// ========================================================

router.get(
  "/documents",
  getDocuments
);


// ========================================================
// SAVE CHAT MESSAGE
// POST /api/chats/message
// ========================================================

router.post(
  "/message",
  saveMessage
);


// ========================================================
// GET CHAT SESSION
// GET /api/chats/:chatSessionId
//
// This dynamic route MUST be LAST.
// ========================================================

router.get(
  "/:chatSessionId",
  getChat
);


export default router;