import dotenv from "dotenv";

dotenv.config();

import {
  searchSimilarChunks,
} from "../services/retrieval.service.js";


// ========================================
// TEST DOCUMENT ID
// ========================================

// Replace this with your actual document_id
// from the documents/document_chunks table.

const DOCUMENT_ID =
  "0e4e338c-7c89-472c-890e-44a7db7a695f";


// ========================================
// TEST QUESTION
// ========================================

const question =
  "What are data structures and algorithms?";


// ========================================
// TEST RETRIEVAL
// ========================================

const testRetrieval = async () => {

  try {

    console.log(
      "========================================"
    );

    console.log(
      "🔎 Testing semantic search"
    );

    console.log(
      `Question: ${question}`
    );

    console.log(
      "========================================"
    );


    const results =
      await searchSimilarChunks(
        DOCUMENT_ID,
        question,
        5
      );


    console.log(
      "\n========================================"
    );

    console.log(
      "📚 RETRIEVED CHUNKS"
    );

    console.log(
      "========================================\n"
    );


    results.forEach(
      (result, index) => {

        console.log(
          `---------- CHUNK ${index + 1} ----------`
        );

        console.log(
          `ID: ${result.id}`
        );

        console.log(
          `Similarity: ${result.similarity}`
        );

        console.log(
          `Content:\n${result.content}`
        );

        console.log("\n");
      }
    );


  } catch (error) {

    console.error(
      "❌ Retrieval test failed:",
      error
    );
  }
};


testRetrieval();