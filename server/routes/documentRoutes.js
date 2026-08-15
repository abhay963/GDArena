import express from "express";

import upload from "../middleware/upload.js";

import {
  uploadDocument,
  askDocument,
  getDocumentProcessingStatus,
} from "../controllers/documentController.js";

const router = express.Router();

// =====================================================
// DOCUMENT UPLOAD
// =====================================================

router.post(
  "/upload",
  upload.single("document"),
  uploadDocument
);

// =====================================================
// DOCUMENT PROCESSING STATUS
// =====================================================

router.get(
  "/status/:documentId",
  getDocumentProcessingStatus
);

// =====================================================
// DOCUMENT RAG QUESTION
// =====================================================

router.post(
  "/ask",
  askDocument
);

export default router;