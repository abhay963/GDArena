import { pool } from "../config/db.js";


// ========================================================
// CREATE DOCUMENT RECORD
// ========================================================

export const createDocument = async ({
  userId = null,
  fileName,
  fileType,
}) => {

  try {

    const result =
      await pool.query(
        `
        INSERT INTO documents
        (
          user_id,
          file_name,
          file_type,
          status,
          processing_stage,
          progress,
          total_chunks,
          processed_chunks
        )

        VALUES
        (
          $1,
          $2,
          $3,
          'processing',
          'uploading',
          0,
          0,
          0
        )

        RETURNING
          id,
          user_id,
          file_name,
          file_type,
          status,
          processing_stage,
          progress,
          total_chunks,
          processed_chunks,
          error_message,
          created_at
        `,
        [
          userId,
          fileName,
          fileType,
        ]
      );


    console.log(
      `✅ Document record created: ${result.rows[0].id}`
    );


    return result.rows[0];

  } catch (error) {

    console.error(
      "❌ Failed to create document record:",
      error
    );

    throw error;
  }
};


// ========================================================
// UPDATE DOCUMENT PROCESSING STATUS
// ========================================================

export const updateDocumentStatus = async (
  documentId,
  {
    status,
    processingStage,
    progress,
    totalChunks,
    processedChunks,
    errorMessage = null,
  }
) => {

  try {

    const result =
      await pool.query(
        `
        UPDATE documents

        SET

          status =
            COALESCE($2, status),

          processing_stage =
            COALESCE(
              $3,
              processing_stage
            ),

          progress =
            COALESCE(
              $4,
              progress
            ),

          total_chunks =
            COALESCE(
              $5,
              total_chunks
            ),

          processed_chunks =
            COALESCE(
              $6,
              processed_chunks
            ),

          error_message =
            $7

        WHERE id = $1

        RETURNING
          id,
          status,
          processing_stage,
          progress,
          total_chunks,
          processed_chunks,
          error_message
        `,
        [
          documentId,

          status ?? null,

          processingStage ?? null,

          progress ?? null,

          totalChunks ?? null,

          processedChunks ?? null,

          errorMessage,
        ]
      );


    if (
      result.rows.length === 0
    ) {

      throw new Error(
        `Document not found: ${documentId}`
      );
    }


    const document =
      result.rows[0];


    console.log(
      `📊 Document ${documentId}:`,
      `${document.processing_stage}`,
      `${document.progress}%`,
      `(${document.processed_chunks}/${document.total_chunks})`
    );


    return document;

  } catch (error) {

    console.error(
      "❌ Failed to update document status:",
      error
    );

    throw error;
  }
};


// ========================================================
// GET DOCUMENT PROCESSING STATUS
// ========================================================

export const getDocumentStatus = async (
  documentId
) => {

  try {

    const result =
      await pool.query(
        `
        SELECT
          id,
          file_name,
          file_type,
          status,
          processing_stage,
          progress,
          total_chunks,
          processed_chunks,
          error_message,
          created_at

        FROM documents

        WHERE id = $1

        LIMIT 1
        `,
        [
          documentId,
        ]
      );


    // ------------------------------------------------------
    // DOCUMENT DOES NOT EXIST
    // ------------------------------------------------------

    if (
      result.rows.length === 0
    ) {

      return null;
    }


    const document =
      result.rows[0];


    console.log(
      `📡 Status requested: ${documentId}`
    );


    console.log(
      `   Stage: ${document.processing_stage}`
    );


    console.log(
      `   Progress: ${document.progress}%`
    );


    console.log(
      `   Chunks: ${document.processed_chunks}/${document.total_chunks}`
    );


    return document;

  } catch (error) {

    console.error(
      "❌ Failed to get document status:",
      error
    );

    throw error;
  }
};


// ========================================================
// STORE DOCUMENT CHUNKS
// ========================================================

export const storeDocumentChunks = async (
  documentId,
  embeddedChunks
) => {

  const client =
    await pool.connect();


  try {

    // ------------------------------------------------------
    // START TRANSACTION
    // ------------------------------------------------------

    await client.query(
      "BEGIN"
    );


    // ------------------------------------------------------
    // INSERT EVERY CHUNK
    // ------------------------------------------------------

    for (
      const chunk of embeddedChunks
    ) {

      // Convert JavaScript array
      // into pgvector format.

      const vector =
        `[${chunk.embedding.join(",")}]`;


      await client.query(
        `
        INSERT INTO document_chunks
        (
          document_id,
          content,
          embedding,
          metadata
        )

        VALUES
        (
          $1,
          $2,
          $3::vector,
          $4
        )
        `,
        [
          documentId,

          chunk.content,

          vector,

          JSON.stringify(
            chunk.metadata || {}
          ),
        ]
      );
    }


    // ------------------------------------------------------
    // COMMIT
    // ------------------------------------------------------

    await client.query(
      "COMMIT"
    );


    console.log(
      `✅ ${embeddedChunks.length} chunks stored in pgvector`
    );


    return true;

  } catch (error) {

    // ------------------------------------------------------
    // ROLLBACK
    // ------------------------------------------------------

    await client.query(
      "ROLLBACK"
    );


    console.error(
      "❌ Failed to store document chunks:",
      error
    );


    throw error;

  } finally {

    client.release();
  }
};


// ========================================================
// DELETE DOCUMENT RECORD
// ========================================================

export const deleteDocument = async (
  documentId
) => {

  try {

    await pool.query(
      `
      DELETE FROM documents

      WHERE id = $1
      `,
      [
        documentId,
      ]
    );


    console.log(
      `🗑️ Document record deleted: ${documentId}`
    );

  } catch (error) {

    console.error(
      "❌ Failed to delete document record:",
      error
    );

    throw error;
  }
};