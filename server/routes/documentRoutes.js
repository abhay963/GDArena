import express from "express";

import upload from "../middleware/upload.js";

import {
  uploadDocument,
  askDocument,
  getDocumentProcessingStatus,
} from "../controllers/documentController.js";

const router = express.Router();

router.post(
  "/upload",
  upload.single("document"),
  uploadDocument
);

router.get(
  "/status/:documentId",
  getDocumentProcessingStatus
);

router.post(
  "/ask",
  askDocument
);

export default router;