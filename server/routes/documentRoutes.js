import express from "express";

import upload from "../middleware/upload.js";

import {
  uploadDocument,
  askDocument,
} from "../controllers/documentController.js";


const router = express.Router();


// ========================================
// UPLOAD + INDEX DOCUMENT
// ========================================

router.post(
  "/upload",
  upload.single("document"),
  uploadDocument
);


// ========================================
// ASK STUDYMATE
// ========================================

router.post(
  "/ask",
  askDocument
);


export default router;