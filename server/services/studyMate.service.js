import dotenv from "dotenv";

import { GoogleGenAI } from "@google/genai";

import {
  searchSimilarChunks,
  buildContext,
} from "./retrieval.service.js";

dotenv.config();

// ========================================
// GEMINI CLIENT
// ========================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = "gemini-3.6-flash";

// ========================================
// ASK STUDYMATE - DOCUMENT RAG MODE
// ========================================

export const askStudyMate = async ({
  documentId,
  question,
}) => {
  try {
    // ------------------------------------
    // 1. VALIDATE INPUT
    // ------------------------------------

    if (!documentId) {
      throw new Error(
        "documentId is required"
      );
    }

    if (!question || !question.trim()) {
      throw new Error(
        "Question is required"
      );
    }

    // ------------------------------------
    // 2. RETRIEVE RELEVANT CHUNKS
    // ------------------------------------

    const chunks =
      await searchSimilarChunks(
        documentId,
        question,
        5
      );

    // ------------------------------------
    // 3. BUILD CONTEXT
    // ------------------------------------

    const context =
      buildContext(chunks);

    // ------------------------------------
    // 4. CHECK IF CONTEXT EXISTS
    // ------------------------------------

    if (!context) {
      return {
        answer:
          "I couldn't find relevant information in the uploaded document.",

        sources: [],
      };
    }

    // ------------------------------------
    // 5. CREATE RAG PROMPT
    // ------------------------------------

    const prompt = `
You are StudyMate, an AI study assistant.

Answer the user's question using ONLY the
information provided in the document context.

If the answer cannot be found in the context,
say clearly that the information is not available
in the uploaded document.

Do not invent facts.

Explain the answer clearly and naturally so that
a student can understand it.

DOCUMENT CONTEXT:
=================

${context}

=================

USER QUESTION:
${question}

Now answer the user's question.
`;

    // ------------------------------------
    // 6. GENERATE ANSWER
    // ------------------------------------

    const response =
      await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

    const answer =
      response.text || "";

    // ------------------------------------
    // 7. RETURN ANSWER + SOURCES
    // ------------------------------------

    return {
      answer,

      sources: chunks.map(
        (chunk) => ({
          id: chunk.id,

          similarity:
            Number(chunk.similarity),

          content:
            chunk.content,
        })
      ),
    };
  } catch (error) {
    console.error(
      "❌ StudyMate RAG error:",
      error
    );

    throw error;
  }
};

// ========================================
// ASK STUDYMATE - GENERAL AI MODE
// ========================================

export const askGeneralStudyMate = async ({
  question,
}) => {
  try {
    // ------------------------------------
    // 1. VALIDATE INPUT
    // ------------------------------------

    if (!question || !question.trim()) {
      throw new Error(
        "Question is required"
      );
    }

    // ------------------------------------
    // 2. GENERAL AI PROMPT
    // ------------------------------------

    const prompt = `
You are StudyMate, an AI study assistant.

The user has not selected a document.

Answer the user's question using your
general knowledge and reasoning.

Your response should be:

- Clear
- Accurate
- Student-friendly
- Well structured
- Easy to understand

For technical questions, include examples
when useful.

For programming questions, prefer practical
solutions and explain the important reasoning.

Do not pretend that information comes from
an uploaded document because no document
context is available.

USER QUESTION:
${question.trim()}

Now answer the user's question.
`;

    // ------------------------------------
    // 3. GENERATE ANSWER
    // ------------------------------------

    const response =
      await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

    const answer =
      response.text || "";

    // ------------------------------------
    // 4. RETURN GENERAL ANSWER
    // ------------------------------------

    return {
      answer,
      sources: [],
    };
  } catch (error) {
    console.error(
      "❌ StudyMate general AI error:",
      error
    );

    throw error;
  }
};