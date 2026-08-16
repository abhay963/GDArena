import { DeepgramClient } from "@deepgram/sdk";

const deepgram = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

export async function createDeepgramConnection() {
  console.log("🔵 Creating Deepgram connection...");

  if (!process.env.DEEPGRAM_API_KEY) {
    throw new Error(
      "DEEPGRAM_API_KEY is missing from server/.env"
    );
  }

  const connection = await deepgram.listen.v1.connect({
    model: "nova-3",
    language: "en-US",

    smart_format: "true",
    punctuate: "true",

    // Send partial/interim transcripts
    interim_results: "true",

    // Detect pauses
    endpointing: "500",

    // Backup utterance detection
    utterance_end_ms: "1000",

    // Detect speech start
    vad_events: "true",
  });

  console.log(
    "🔵 Deepgram connection object created"
  );

  // IMPORTANT:
  // Explicitly open the Deepgram WebSocket.
  connection.connect();

  // Wait until the socket is actually OPEN.
  await connection.waitForOpen();

  console.log(
    "🟢 Deepgram connection OPEN"
  );

  return connection;
}