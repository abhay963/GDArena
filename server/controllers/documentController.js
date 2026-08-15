import fs from "fs/promises";
import crypto from "crypto";

import {
  loadPDF,
  splitDocuments,
  embedChunks,
} from "../services/document.service.js";

import {
  createDocument,
  findDocumentByHash,
  storeDocumentChunks,
  updateDocumentStatus,
  getDocumentStatus,
} from "../services/documentVector.service.js";

import { askStudyMate } from "../services/studyMate.service.js";

const generateFileHash = async (filePath) => {
  const buffer = await fs.readFile(filePath);

  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");
};

const deleteTemporaryFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(
        "Failed to delete temporary file:",
        error.message
      );
    }
  }
};

const formatDocument = (document) => {
  if (!document) {
    return null;
  }

  return {
    id: document.id,
    originalName:
      document.file_name,
    fileName:
      document.file_name,
    fileType:
      document.file_type,
    fileHash:
      document.file_hash,
    status:
      document.status,
    processingStage:
      document.processing_stage,
    progress:
      Number(document.progress) || 0,
    totalChunks:
      Number(document.total_chunks) || 0,
    processedChunks:
      Number(document.processed_chunks) || 0,
    errorMessage:
      document.error_message,
    createdAt:
      document.created_at,
  };
};

const processDocument = async ({
  documentId,
  file,
}) => {
  try {
    await updateDocumentStatus(
      documentId,
      {
        status: "processing",
        processingStage: "extracting",
        progress: 5,
        processedChunks: 0,
        errorMessage: null,
      }
    );

    const documents =
      await loadPDF(file.path);

    await updateDocumentStatus(
      documentId,
      {
        status: "processing",
        processingStage: "chunking",
        progress: 20,
      }
    );

    const chunks =
      await splitDocuments(documents);

    const totalChunks =
      chunks.length;

    await updateDocumentStatus(
      documentId,
      {
        status: "processing",
        processingStage: "chunking",
        progress: 30,
        totalChunks,
        processedChunks: 0,
      }
    );

    await updateDocumentStatus(
      documentId,
      {
        status: "processing",
        processingStage: "embedding",
        progress: 30,
        totalChunks,
        processedChunks: 0,
      }
    );

    const embeddedChunks =
      await embedChunks(
        chunks,
        async ({
          processedChunks,
          totalChunks,
        }) => {
          const progress =
            totalChunks > 0
              ? Math.min(
                  70,
                  Math.round(
                    30 +
                      (
                        processedChunks /
                        totalChunks
                      ) *
                        40
                  )
                )
              : 70;

          await updateDocumentStatus(
            documentId,
            {
              status: "processing",
              processingStage: "embedding",
              progress,
              totalChunks,
              processedChunks,
            }
          );
        }
      );

    await updateDocumentStatus(
      documentId,
      {
        status: "processing",
        processingStage: "storing",
        progress: 80,
        totalChunks,
        processedChunks:
          embeddedChunks.length,
      }
    );

    await storeDocumentChunks(
      documentId,
      embeddedChunks
    );

    await updateDocumentStatus(
      documentId,
      {
        status: "completed",
        processingStage: "complete",
        progress: 100,
        totalChunks,
        processedChunks:
          embeddedChunks.length,
        errorMessage: null,
      }
    );

    await deleteTemporaryFile(
      file.path
    );

    console.log(
      `✅ Document processing completed: ${documentId}`
    );
  } catch (error) {
    console.error(
      "❌ Document processing failed:",
      error
    );

    try {
      await updateDocumentStatus(
        documentId,
        {
          status: "failed",
          processingStage: "failed",
          progress: 0,
          errorMessage:
            error.message ||
            "Document processing failed.",
        }
      );
    } catch (statusError) {
      console.error(
        "❌ Failed to update document failure status:",
        statusError
      );
    }

    await deleteTemporaryFile(
      file.path
    );
  }
};

export const uploadDocument = async (
  req,
  res
) => {
  const file = req.file;

  try {
    if (!file) {
      return res.status(400).json({
        success: false,
        message:
          "No document uploaded.",
      });
    }

    const userId =
      req.body.userId || null;

    if (!userId) {
      await deleteTemporaryFile(
        file.path
      );

      return res.status(400).json({
        success: false,
        message:
          "userId is required.",
      });
    }

    const fileHash =
      await generateFileHash(
        file.path
      );

    const existingDocument =
      await findDocumentByHash({
        userId,
        fileHash,
      });

    if (existingDocument) {
      await deleteTemporaryFile(
        file.path
      );

      return res.status(200).json({
        success: true,
        duplicate: true,
        message:
          "This document is already uploaded. You can continue using it.",
        document:
          formatDocument(
            existingDocument
          ),
      });
    }

    let document;

    try {
      document =
        await createDocument({
          userId,
          fileName:
            file.originalname,
          fileType:
            file.mimetype,
          fileHash,
        });
    } catch (error) {
      if (
        error.code === "23505"
      ) {
        const duplicateDocument =
          await findDocumentByHash({
            userId,
            fileHash,
          });

        await deleteTemporaryFile(
          file.path
        );

        if (duplicateDocument) {
          return res.status(200).json({
            success: true,
            duplicate: true,
            message:
              "This document is already uploaded. You can continue using it.",
            document:
              formatDocument(
                duplicateDocument
              ),
          });
        }
      }

      throw error;
    }

    processDocument({
      documentId: document.id,
      file,
    }).catch((error) => {
      console.error(
        "Background processing error:",
        error
      );
    });

    return res.status(202).json({
      success: true,
      duplicate: false,
      message:
        "Document uploaded. Processing started.",
      document:
        formatDocument({
          ...document,
          status: "processing",
          processing_stage:
            "uploading",
          progress: 0,
          total_chunks: 0,
          processed_chunks: 0,
        }),
    });
  } catch (error) {
    console.error(
      "❌ Document upload error:",
      error
    );

    await deleteTemporaryFile(
      file?.path
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload document.",
      error:
        error.message,
    });
  }
};

export const getDocumentProcessingStatus = async (
  req,
  res
) => {
  try {
    const {
      documentId,
    } = req.params;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message:
          "documentId is required.",
      });
    }

    const document =
      await getDocumentStatus(
        documentId
      );

    if (!document) {
      return res.status(404).json({
        success: false,
        message:
          "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      document:
        formatDocument(document),
    });
  } catch (error) {
    console.error(
      "❌ Failed to get document status:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get document status.",
      error:
        error.message,
    });
  }
};

export const askDocument = async (
  req,
  res
) => {
  try {
    const {
      documentId,
      question,
    } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message:
          "documentId is required.",
      });
    }

    if (
      !question ||
      !question.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Question is required.",
      });
    }

    const document =
      await getDocumentStatus(
        documentId
      );

    if (!document) {
      return res.status(404).json({
        success: false,
        message:
          "Document not found.",
      });
    }

    if (
      document.status ===
      "processing"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This document is still being prepared. Please wait until processing is complete.",
      });
    }

    if (
      document.status ===
      "failed"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This document could not be processed. Please upload it again.",
      });
    }

    const result =
      await askStudyMate({
        documentId,
        question:
          question.trim(),
      });

    return res.status(200).json({
      success: true,
      answer:
        result.answer,
      sources:
        result.sources,
    });
  } catch (error) {
    console.error(
      "❌ StudyMate controller error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate StudyMate answer.",
      error:
        error.message,
    });
  }
};