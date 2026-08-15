import fs from "fs/promises";
import path from "path";

import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const EMBEDDING_MODEL = "gemini-embedding-2";
const EMBEDDING_DIMENSION = 768;

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 150,
  separators: ["\n\n", "\n", ". ", " ", ""],
});

const cleanText = (text) => {
  return text
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const loadPDF = async (filePath) => {
  const extension = path
    .extname(filePath)
    .toLowerCase();

  if (extension === ".txt") {
    const text = await fs.readFile(
      filePath,
      "utf-8"
    );

    const cleaned = cleanText(text);

    if (!cleaned) {
      throw new Error(
        "The uploaded TXT file contains no readable text."
      );
    }

    return [
      {
        pageContent: cleaned,
        metadata: {
          source: filePath,
          fileType: "txt",
        },
      },
    ];
  }

  if (extension === ".pdf") {
    const buffer = await fs.readFile(
      filePath
    );

    const parser = new PDFParse({
      data: buffer,
    });

    try {
      const result =
        await parser.getText();

      const text = cleanText(
        result.text || ""
      );

      if (!text) {
        throw new Error(
          "No readable text was found in the PDF."
        );
      }

      return [
        {
          pageContent: text,
          metadata: {
            source: filePath,
            fileType: "pdf",
          },
        },
      ];
    } finally {
      await parser.destroy();
    }
  }

  if (
    extension === ".ppt" ||
    extension === ".pptx"
  ) {
    try {
      const { OfficeParser } =
        await import("officeparser");

      const ast =
        await OfficeParser.parseOffice(
          filePath
        );

      const text =
        typeof ast.toText === "function"
          ? ast.toText()
          : "";

      const cleaned =
        cleanText(text || "");

      if (!cleaned) {
        throw new Error(
          "No readable text was found in the PowerPoint file."
        );
      }

      return [
        {
          pageContent: cleaned,
          metadata: {
            source: filePath,
            fileType:
              extension === ".pptx"
                ? "pptx"
                : "ppt",
          },
        },
      ];
    } catch (error) {
      if (
        error.code ===
        "ERR_MODULE_NOT_FOUND"
      ) {
        throw new Error(
          "PowerPoint processing requires the officeparser package. Run: npm install officeparser"
        );
      }

      throw error;
    }
  }

  throw new Error(
    "Unsupported document format."
  );
};

export const splitDocuments = async (
  documents
) => {
  if (
    !documents ||
    documents.length === 0
  ) {
    throw new Error(
      "No document content available for chunking."
    );
  }

  const chunks = [];

  for (const document of documents) {
    const pageContent =
      cleanText(
        document.pageContent || ""
      );

    if (!pageContent) {
      continue;
    }

    const split =
      await splitter.splitText(
        pageContent
      );

    split.forEach(
      (content, index) => {
        chunks.push({
          content: content.trim(),
          metadata: {
            ...(document.metadata || {}),
            chunkIndex: index,
          },
        });
      }
    );
  }

  if (chunks.length === 0) {
    throw new Error(
      "Document could not be divided into readable chunks."
    );
  }

  return chunks;
};

const embedTextBatch = async (
  texts,
  mode
) => {
  const contents =
    texts.map((text) => ({
      parts: [
        {
          text:
            mode === "document"
              ? `title: none | text: ${text}`
              : `task: search result | query: ${text}`,
        },
      ],
    }));

  const response =
    await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents,
      config: {
        outputDimensionality:
          EMBEDDING_DIMENSION,
      },
    });

  if (
    !response.embeddings ||
    response.embeddings.length !==
      texts.length
  ) {
    throw new Error(
      "Embedding API returned an unexpected number of embeddings."
    );
  }

  return response.embeddings.map(
    (embedding) => embedding.values
  );
};

export const embedChunks = async (
  chunks,
  onProgress
) => {
  if (
    !chunks ||
    chunks.length === 0
  ) {
    return [];
  }

  const results = [];
  const batchSize = 20;

  for (
    let i = 0;
    i < chunks.length;
    i += batchSize
  ) {
    const batch =
      chunks.slice(
        i,
        i + batchSize
      );

    const embeddings =
      await embedTextBatch(
        batch.map(
          (chunk) => chunk.content
        ),
        "document"
      );

    batch.forEach(
      (chunk, index) => {
        results.push({
          content:
            chunk.content,
          embedding:
            embeddings[index],
          metadata:
            chunk.metadata || {},
        });
      }
    );

    if (onProgress) {
      await onProgress({
        processedChunks:
          results.length,
        totalChunks:
          chunks.length,
      });
    }
  }

  return results;
};

export const createQueryEmbedding =
  async (question) => {
    if (
      !question ||
      !question.trim()
    ) {
      throw new Error(
        "Question is required for embedding."
      );
    }

    const embeddings =
      await embedTextBatch(
        [question.trim()],
        "query"
      );

    const embedding =
      embeddings[0];

    if (
      !embedding ||
      embedding.length !==
        EMBEDDING_DIMENSION
    ) {
      throw new Error(
        `Invalid query embedding dimension. Expected ${EMBEDDING_DIMENSION}.`
      );
    }

    return embedding;
  };