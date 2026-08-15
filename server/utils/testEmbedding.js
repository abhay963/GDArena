import dotenv from "dotenv";

dotenv.config();

import { createEmbedding } from "../services/document.service.js";


const testEmbedding = async () => {
  try {
    const vector = await createEmbedding(
      "What is dynamic programming?"
    );

    console.log("✅ Embedding generated successfully");

    console.log("Vector dimensions:", vector.length);

    console.log(
      "First 10 values:",
      vector.slice(0, 10)
    );

  } catch (error) {
    console.error("❌ Embedding test failed:", error);
  }
};


testEmbedding();