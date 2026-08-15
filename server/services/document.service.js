import dotenv from "dotenv";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { GoogleGenAI } from "@google/genai";

dotenv.config();


// ========================================================
// GEMINI CLIENT
// ========================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// ========================================================
// CONSTANTS
// ========================================================

const EMBEDDING_MODEL =
  "gemini-embedding-2";

const EMBEDDING_DIMENSIONS =
  768;

const EMBEDDING_BATCH_SIZE =
  50;


// ========================================================
// STEP 1: LOAD PDF
// ========================================================

export const loadPDF = async (
  filePath
) => {

  console.log(
    "📄 Loading PDF..."
  );


  const loader =
    new PDFLoader(filePath);


  const documents =
    await loader.load();


  console.log(
    `✅ PDF loaded successfully: ${documents.length} pages`
  );


  return documents;
};


// ========================================================
// STEP 2: SPLIT DOCUMENT
// ========================================================

export const splitDocuments = async (
  documents
) => {

  console.log(
    "✂️ Splitting document into chunks..."
  );


  const splitter =
    new RecursiveCharacterTextSplitter({

      chunkSize:
        1000,

      chunkOverlap:
        200,

    });


  const chunks =
    await splitter.splitDocuments(
      documents
    );


  console.log(
    `✅ Document split into ${chunks.length} chunks`
  );


  return chunks;
};


// ========================================================
// STEP 3: CREATE SINGLE DOCUMENT EMBEDDING
// ========================================================
//
// Used when one piece of text needs an embedding.
//
// Bulk document indexing uses embedChunks()
// below.
// ========================================================

export const createEmbedding = async (
  text
) => {

  if (
    !text ||
    !text.trim()
  ) {

    throw new Error(
      "Text is required for embedding."
    );
  }


  const response =
    await ai.models.embedContent({

      model:
        EMBEDDING_MODEL,

      contents:
        text,

      config: {

        taskType:
          "RETRIEVAL_DOCUMENT",

        outputDimensionality:
          EMBEDDING_DIMENSIONS,

      },

    });


  if (
    !response.embeddings ||
    response.embeddings.length === 0
  ) {

    throw new Error(
      "Gemini returned no embedding."
    );
  }


  const vector =
    response.embeddings[0].values;


  if (
    !vector ||
    vector.length !==
      EMBEDDING_DIMENSIONS
  ) {

    throw new Error(
      `Invalid embedding dimensions. Expected ${EMBEDDING_DIMENSIONS}, received ${vector?.length}.`
    );
  }


  return vector;
};


// ========================================================
// STEP 4: CREATE QUERY EMBEDDING
// ========================================================
//
// Used by retrieval.service.js
//
// taskType:
// RETRIEVAL_QUERY
// ========================================================

export const createQueryEmbedding = async (
  question
) => {

  if (
    !question ||
    !question.trim()
  ) {

    throw new Error(
      "Question is required for query embedding."
    );
  }


  console.log(
    "🔎 Creating query embedding..."
  );


  const response =
    await ai.models.embedContent({

      model:
        EMBEDDING_MODEL,

      contents:
        question,

      config: {

        taskType:
          "RETRIEVAL_QUERY",

        outputDimensionality:
          EMBEDDING_DIMENSIONS,

      },

    });


  if (
    !response.embeddings ||
    response.embeddings.length === 0
  ) {

    throw new Error(
      "Gemini returned no query embedding."
    );
  }


  const vector =
    response.embeddings[0].values;


  if (
    !vector ||
    vector.length !==
      EMBEDDING_DIMENSIONS
  ) {

    throw new Error(
      `Invalid query embedding dimensions. Expected ${EMBEDDING_DIMENSIONS}, received ${vector?.length}.`
    );
  }


  console.log(
    `✅ Query embedding generated: ${vector.length} dimensions`
  );


  return vector;
};


// ========================================================
// STEP 5: GEMINI REST BATCH EMBEDDING
// ========================================================
//
// The installed @google/genai version does not expose
// batchEmbedContents() in the way we need.
//
// Therefore we directly call Google's REST endpoint.
//
// One request contains multiple embedding requests.
//
// ========================================================

const createBatchEmbeddings = async (
  texts
) => {

  if (
    !texts ||
    texts.length === 0
  ) {

    return [];
  }


  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents`;


  const requests =
    texts.map(
      (text) => ({

        model:
          `models/${EMBEDDING_MODEL}`,

        content: {

          parts: [
            {
              text,
            },
          ],

        },

        embedContentConfig: {

          taskType:
            "RETRIEVAL_DOCUMENT",

          outputDimensionality:
            EMBEDDING_DIMENSIONS,

        },

      })
    );


  console.log(
    `📡 Sending ${requests.length} embedding requests to Gemini...`
  );


  const response =
    await fetch(
      url,
      {

        method:
          "POST",

        headers: {

          "Content-Type":
            "application/json",

          "x-goog-api-key":
            process.env.GEMINI_API_KEY,

        },

        body:
          JSON.stringify({
            requests,
          }),

      }
    );


  // ======================================================
  // HANDLE API ERROR
  // ======================================================

  if (!response.ok) {

    const errorText =
      await response.text();


    throw new Error(
      `Gemini batch embedding failed (${response.status}): ${errorText}`
    );
  }


  // ======================================================
  // PARSE RESPONSE
  // ======================================================

  const data =
    await response.json();


  // ======================================================
  // VALIDATE RESPONSE
  // ======================================================

  if (
    !data.embeddings ||
    data.embeddings.length !==
      texts.length
  ) {

    throw new Error(
      `Embedding count mismatch. Expected ${texts.length}, received ${
        data.embeddings?.length ?? 0
      }.`
    );
  }


  // ======================================================
  // EXTRACT VECTORS
  // ======================================================

  const vectors =
    data.embeddings.map(
      (embedding) => {

        const vector =
          embedding.values;


        if (
          !vector ||
          vector.length !==
            EMBEDDING_DIMENSIONS
        ) {

          throw new Error(
            `Invalid embedding dimensions. Expected ${EMBEDDING_DIMENSIONS}, received ${vector?.length}.`
          );
        }


        return vector;
      }
    );


  console.log(
    `✅ Received ${vectors.length} embeddings`
  );


  return vectors;
};


// ========================================================
// STEP 6: EMBED DOCUMENT CHUNKS IN BATCHES
// ========================================================
//
// onProgress is optional.
//
// Example:
//
// embedChunks(chunks, ({
//   processedChunks,
//   totalChunks,
//   batchNumber,
//   totalBatches
// }) => {
//
//   console.log(
//     processedChunks,
//     totalChunks
//   );
//
// });
//
// This gives us REAL progress:
//
// 50 / 226
// 100 / 226
// 150 / 226
// 200 / 226
// 226 / 226
//
// ========================================================

export const embedChunks = async (
  chunks,
  onProgress = null
) => {

  if (
    !chunks ||
    chunks.length === 0
  ) {

    return [];
  }


  const totalChunks =
    chunks.length;


  const totalBatches =
    Math.ceil(
      totalChunks /
        EMBEDDING_BATCH_SIZE
    );


  console.log(
    "========================================"
  );


  console.log(
    "🧠 Starting batched embedding"
  );


  console.log(
    `Total chunks: ${totalChunks}`
  );


  console.log(
    `Batch size: ${EMBEDDING_BATCH_SIZE}`
  );


  console.log(
    `Expected API requests: ${totalBatches}`
  );


  console.log(
    "========================================"
  );


  const embeddedChunks = [];


  // ======================================================
  // INITIAL PROGRESS
  // ======================================================

  if (
    typeof onProgress ===
    "function"
  ) {

    await onProgress({

      processedChunks:
        0,

      totalChunks,

      batchNumber:
        0,

      totalBatches,

      progress:
        0,

    });
  }


  // ======================================================
  // PROCESS EACH BATCH
  // ======================================================

  for (
    let start = 0;

    start < totalChunks;

    start += EMBEDDING_BATCH_SIZE
  ) {

    const end =
      Math.min(
        start +
          EMBEDDING_BATCH_SIZE,

        totalChunks
      );


    const batch =
      chunks.slice(
        start,
        end
      );


    const batchNumber =
      Math.floor(
        start /
          EMBEDDING_BATCH_SIZE
      ) + 1;


    console.log(
      `\n🔹 Batch ${batchNumber}/${totalBatches}`
    );


    console.log(
      `   Chunks ${start + 1}-${end} of ${totalChunks}`
    );


    // ====================================================
    // EXTRACT TEXT
    // ====================================================

    const texts =
      batch.map(
        (
          chunk,
          index
        ) => {

          if (
            !chunk.pageContent ||
            !chunk.pageContent.trim()
          ) {

            throw new Error(
              `Empty chunk encountered at index ${
                start + index
              }.`
            );
          }


          return chunk.pageContent;
        }
      );


    // ====================================================
    // CREATE EMBEDDINGS
    // ====================================================

    let vectors;


    try {

      vectors =
        await createBatchEmbeddings(
          texts
        );

    } catch (error) {

      console.error(
        `❌ Gemini batch embedding failed for batch ${batchNumber}`
      );


      console.error(
        error
      );


      throw error;
    }


    // ====================================================
    // COMBINE CHUNKS + EMBEDDINGS
    // ====================================================

    for (
      let i = 0;

      i < batch.length;

      i++
    ) {

      const vector =
        vectors[i];


      embeddedChunks.push({

        content:
          batch[i].pageContent,

        embedding:
          vector,

        metadata:
          batch[i].metadata ||
          {},

      });
    }


    const processedChunks =
      embeddedChunks.length;


    // ====================================================
    // REAL PROGRESS
    // ====================================================

    const progress =
      Math.round(
        (
          processedChunks /
          totalChunks
        ) * 100
      );


    console.log(
      `   ✅ Batch ${batchNumber} completed`
    );


    console.log(
      `   Embedded: ${processedChunks}/${totalChunks}`
    );


    console.log(
      `   Progress: ${progress}%`
    );


    // ====================================================
    // SEND PROGRESS TO CONTROLLER
    // ====================================================

    if (
      typeof onProgress ===
      "function"
    ) {

      await onProgress({

        processedChunks,

        totalChunks,

        batchNumber,

        totalBatches,

        progress,

      });
    }
  }


  // ======================================================
  // COMPLETE
  // ======================================================

  console.log(
    "\n========================================"
  );


  console.log(
    `🎉 All ${embeddedChunks.length} chunks embedded`
  );


  console.log(
    `📦 Total Gemini batch requests: ${totalBatches}`
  );


  console.log(
    "========================================"
  );


  return embeddedChunks;
};