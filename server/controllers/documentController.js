import fs from "fs/promises";

import {
  loadPDF,
  splitDocuments,
  embedChunks,
} from "../services/document.service.js";

import {
  createDocument,
  storeDocumentChunks,
  updateDocumentStatus,
  getDocumentStatus,
} from "../services/documentVector.service.js";

import { askStudyMate } from "../services/studyMate.service.js";


// ========================================================
// BACKGROUND DOCUMENT PROCESSING
// ========================================================

const processDocument = async ({
  documentId,
  file,
}) => {

  try {

    console.log("========================================");
    console.log("🚀 Background document processing started");
    console.log(`Document ID: ${documentId}`);
    console.log(`File: ${file.originalname}`);
    console.log("========================================");


    // ======================================================
    // STEP 1: EXTRACT
    // ======================================================

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


    console.log(
      "📖 Extracting document text..."
    );


    const documents =
      await loadPDF(file.path);


    console.log(
      `✅ Extracted ${documents.length} pages/sections`
    );


    // ======================================================
    // STEP 2: CHUNK
    // ======================================================

    await updateDocumentStatus(
      documentId,
      {
        status: "processing",
        processingStage: "chunking",
        progress: 20,
      }
    );


    console.log(
      "✂️ Creating document chunks..."
    );


    const chunks =
      await splitDocuments(documents);


    const totalChunks =
      chunks.length;


    console.log(
      `✅ Created ${totalChunks} chunks`
    );


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


    // ======================================================
    // STEP 3: EMBEDDINGS
    // ======================================================

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


    console.log(
      "🧠 Starting embedding generation..."
    );


    const embeddedChunks =
      await embedChunks(
        chunks,

        async ({
          processedChunks,
          totalChunks,
          batchNumber,
          totalBatches,
        }) => {

          const progress =
            Math.min(
              70,
              Math.round(
                30 +
                (
                  processedChunks /
                  totalChunks
                ) * 40
              )
            );


          console.log(
            `📊 Embedding progress: ${processedChunks}/${totalChunks}`
          );


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


          console.log(
            `   Batch ${batchNumber}/${totalBatches} saved`
          );
        }
      );


    console.log(
      `✅ ${embeddedChunks.length} embeddings generated`
    );


    // ======================================================
    // STEP 4: STORE VECTORS
    // ======================================================

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


    console.log(
      "💾 Storing vectors in Neon pgvector..."
    );


    await storeDocumentChunks(
      documentId,
      embeddedChunks
    );


    console.log(
      `✅ ${embeddedChunks.length} vectors stored`
    );


    // ======================================================
    // STEP 5: DELETE TEMPORARY FILE
    // ======================================================

    try {

      await fs.unlink(file.path);

      console.log(
        `🗑️ Temporary document deleted: ${file.path}`
      );

    } catch (fileError) {

      console.warn(
        "⚠️ Could not delete temporary file:",
        fileError.message
      );
    }


    // ======================================================
    // STEP 6: COMPLETE
    // ======================================================

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


    console.log("========================================");
    console.log("🎉 DOCUMENT PROCESSING COMPLETE");
    console.log(`Document ID: ${documentId}`);
    console.log(`Chunks: ${embeddedChunks.length}`);
    console.log("========================================");


  } catch (error) {

    console.error("========================================");
    console.error("❌ DOCUMENT PROCESSING FAILED");
    console.error(`Document ID: ${documentId}`);
    console.error(error);
    console.error("========================================");


    try {

      await updateDocumentStatus(
        documentId,
        {
          status: "failed",
          processingStage: "failed",
          errorMessage:
            error.message ||
            "Document processing failed.",
        }
      );

    } catch (statusError) {

      console.error(
        "❌ Failed to update failed status:",
        statusError
      );
    }


    try {

      await fs.unlink(file.path);

      console.log(
        `🗑️ Failed document file deleted: ${file.path}`
      );

    } catch (fileError) {

      console.warn(
        "⚠️ Could not delete failed document file:",
        fileError.message
      );
    }
  }
};


// ========================================================
// UPLOAD DOCUMENT
// ========================================================

export const uploadDocument = async (
  req,
  res
) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "No document uploaded.",
      });
    }


    const file =
      req.file;


    console.log("========================================");
    console.log("📄 Document upload received");
    console.log(`File: ${file.originalname}`);
    console.log(`Type: ${file.mimetype}`);
    console.log(`Size: ${file.size} bytes`);
    console.log("========================================");


    const document =
      await createDocument({

        userId:
          req.body.userId || null,

        fileName:
          file.originalname,

        fileType:
          file.mimetype,
      });


    const documentId =
      document.id;


    console.log(
      `✅ Document ID created: ${documentId}`
    );


    // Start processing WITHOUT await.
    processDocument({
      documentId,
      file,
    }).catch((error) => {

      console.error(
        "❌ Unhandled background processing error:",
        error
      );

    });


    return res.status(202).json({

      success: true,

      message:
        "Document uploaded. Processing started.",

      document: {

        id:
          document.id,

        originalName:
          document.file_name,

        fileType:
          document.file_type,

        status:
          "processing",

        processingStage:
          "uploading",

        progress:
          0,

        chunks:
          0,

        createdAt:
          document.created_at,
      },

    });

  } catch (error) {

    console.error(
      "❌ Document upload error:",
      error
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


// ========================================================
// GET DOCUMENT PROCESSING STATUS
// ========================================================

export const getDocumentProcessingStatus = async (
  req,
  res
) => {

  try {

    const {
      documentId,
    } = req.params;


    // ======================================================
    // VALIDATE ID
    // ======================================================

    if (!documentId) {

      return res.status(400).json({

        success: false,

        message:
          "documentId is required.",
      });
    }


    console.log(
      `📡 Checking document status: ${documentId}`
    );


    // ======================================================
    // GET STATUS FROM DATABASE
    // ======================================================

    const document =
      await getDocumentStatus(
        documentId
      );


    // ======================================================
    // DOCUMENT NOT FOUND
    // ======================================================

    if (!document) {

      return res.status(404).json({

        success: false,

        message:
          "Document not found.",
      });
    }


    // ======================================================
    // RETURN STATUS
    // ======================================================

    return res.status(200).json({

      success: true,

      document: {

        id:
          document.id,

        fileName:
          document.file_name,

        fileType:
          document.file_type,

        status:
          document.status,

        processingStage:
          document.processing_stage,

        progress:
          document.progress,

        totalChunks:
          document.total_chunks,

        processedChunks:
          document.processed_chunks,

        errorMessage:
          document.error_message,

        createdAt:
          document.created_at,
      },

    });

  } catch (error) {

    console.error(
      "❌ Failed to get document processing status:",
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


// ========================================================
// ASK STUDYMATE
// ========================================================

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


    console.log("========================================");
    console.log("🤖 StudyMate question received");
    console.log(`Document ID: ${documentId}`);
    console.log(`Question: ${question}`);
    console.log("========================================");


    const result =
      await askStudyMate({

        documentId,

        question,
      });


    console.log("========================================");
    console.log("✅ StudyMate answer generated");
    console.log("========================================");


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