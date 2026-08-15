import { pool } from "../config/db.js";

import {
  createQueryEmbedding,
} from "./document.service.js";


// ========================================
// STEP 13: SEMANTIC SEARCH
// ========================================

export const searchSimilarChunks = async (
  documentId,
  question,
  topK = 5
) => {
  try {

    // ------------------------------------
    // 1. CREATE QUERY EMBEDDING
    // ------------------------------------

    const queryEmbedding =
      await createQueryEmbedding(question);


    // ------------------------------------
    // 2. CONVERT TO PGVECTOR FORMAT
    // ------------------------------------

    const queryVector =
      `[${queryEmbedding.join(",")}]`;


    // ------------------------------------
    // 3. SEARCH SIMILAR CHUNKS
    // ------------------------------------

    const result = await pool.query(
      `
      SELECT
        id,
        document_id,
        content,
        metadata,

        1 - (embedding <=> $1::vector)
        AS similarity

      FROM document_chunks

      WHERE document_id = $2

      ORDER BY embedding <=> $1::vector

      LIMIT $3
      `,
      [
        queryVector,
        documentId,
        topK,
      ]
    );


    console.log(
      `✅ Retrieved ${result.rows.length} relevant chunks`
    );


    return result.rows;

  } catch (error) {

    console.error(
      "❌ Similarity search failed:",
      error
    );

    throw error;
  }
};


// ========================================
// STEP 15: BUILD RAG CONTEXT
// ========================================

export const buildContext = (chunks) => {

  try {

    if (!chunks || chunks.length === 0) {
      return "";
    }


    const context = chunks
      .map((chunk, index) => {

        return `
SOURCE ${index + 1}

${chunk.content}
`;

      })
      .join("\n-------------------------\n");


    console.log(
      `✅ RAG context created from ${chunks.length} chunks`
    );


    return context;

  } catch (error) {

    console.error(
      "❌ Failed to build RAG context:",
      error
    );

    throw error;
  }
};