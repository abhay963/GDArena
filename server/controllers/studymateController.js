import dotenv from "dotenv";

import { GoogleGenAI } from "@google/genai";

dotenv.config();

/*
|--------------------------------------------------------------------------
| GEMINI CLIENT
|--------------------------------------------------------------------------
*/

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/*
|--------------------------------------------------------------------------
| GENERAL STUDYMATE AI CHAT
|--------------------------------------------------------------------------
|
| This controller is intentionally different from the RAG controller.
|
| RAG mode:
|   /api/documents/ask
|   → retrieve document chunks
|   → build context
|   → Gemini
|
| General AI mode:
|   /api/studymate/chat
|   → Gemini directly
|
|--------------------------------------------------------------------------
*/

export const chatWithStudyMate = async (
  req,
  res
) => {
  try {
    const {
      question,
      userId,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | 1. VALIDATE QUESTION
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | 2. OPTIONAL USER ID
    |--------------------------------------------------------------------------
    |
    | We accept userId so that later we can connect this
    | general conversation with persistent chat history.
    |
    | For now Gemini does not need it.
    |
    */

    const cleanQuestion =
      question.trim();

    /*
    |--------------------------------------------------------------------------
    | 3. GENERAL AI SYSTEM PROMPT
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are StudyMate, an intelligent AI study assistant.

You are currently operating in GENERAL AI MODE.

There is no uploaded document being used as context.

Your job is to help the student understand concepts clearly and accurately.

You can answer questions about:

- Data Structures and Algorithms
- Programming
- C++
- JavaScript
- React
- Node.js
- Backend development
- Databases
- SQL
- DBMS
- Operating Systems
- Computer Networks
- Computer Architecture
- System Design
- Software Engineering
- Interview preparation
- Placement preparation
- General academic concepts

When explaining technical topics:

1. Start with the core idea.
2. Explain the concept clearly.
3. Use a simple example when useful.
4. For algorithms, explain the intuition before the implementation.
5. Mention time and space complexity when relevant.
6. For programming questions, provide correct and practical code when appropriate.
7. Do not pretend that a document was uploaded.
8. Do not claim that your answer came from the user's personal knowledge base.
9. If the question is ambiguous, explain the ambiguity briefly and make the most reasonable interpretation.
10. Do not invent facts.

Keep the response useful for a student and avoid unnecessary filler.

USER QUESTION:
${cleanQuestion}

Now answer the user's question.
`;

    /*
    |--------------------------------------------------------------------------
    | 4. CALL GEMINI
    |--------------------------------------------------------------------------
    */

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

    /*
    |--------------------------------------------------------------------------
    | 5. EXTRACT ANSWER
    |--------------------------------------------------------------------------
    */

    const answer =
      response.text?.trim() || "";

    if (!answer) {
      return res.status(500).json({
        success: false,
        message:
          "StudyMate returned an empty response.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 6. RETURN RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,
      mode: "general",
      answer,
      sources: [],
    });
  } catch (error) {
    console.error(
      "❌ General StudyMate error:",
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