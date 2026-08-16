import { DeepgramClient } from "@deepgram/sdk";

/* =========================================================
   DEEPGRAM CLIENT
========================================================= */

if (!process.env.DEEPGRAM_API_KEY) {
  console.warn(
    "⚠️ DEEPGRAM_API_KEY is not loaded yet."
  );
}

const deepgram = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

/* =========================================================
   CREATE STREAMING CONNECTION
========================================================= */

export async function createDeepgramConnection() {
  console.log(
    "🔵 Creating Deepgram connection..."
  );

  /* -------------------------------------------------------
     Validate API key
  ------------------------------------------------------- */

  if (!process.env.DEEPGRAM_API_KEY) {
    throw new Error(
      "DEEPGRAM_API_KEY is missing from server/.env"
    );
  }

  /* -------------------------------------------------------
     Create Deepgram Live STT connection
  ------------------------------------------------------- */

  const connection =
    await deepgram.listen.v1.connect({
      model: "nova-3",

      language: "en-US",

      /* Formatting */

      smart_format: true,

      punctuate: true,

      /* ---------------------------------------------------
         INTERIM RESULTS

         Deepgram continuously sends partial transcripts.

         Example:

         "I"
         "I think"
         "I think it's"
         "I think it's not working"

         These are NOT final user messages.
      --------------------------------------------------- */

      interim_results: true,

      /* ---------------------------------------------------
         ENDPOINTING

         After approximately 500ms of silence,
         Deepgram can mark the current speech segment
         as speech_final: true.
      --------------------------------------------------- */

      endpointing: 500,

      /* ---------------------------------------------------
         UTTERANCE END

         Backup end-of-speech detection.

         Deepgram sends an UtteranceEnd event when
         it detects the configured silence gap.
      --------------------------------------------------- */

      utterance_end_ms: "1000",

      /* ---------------------------------------------------
         VAD EVENTS

         Allows us to receive SpeechStarted events.
      --------------------------------------------------- */

      vad_events: true,
    });

  console.log(
    "🔵 Deepgram connection object created"
  );

  /* =======================================================
     OPEN CONNECTION
  ======================================================= */

  connection.connect();

  /* -------------------------------------------------------
     IMPORTANT

     Do not send microphone audio until the Deepgram
     WebSocket is actually OPEN.
  ------------------------------------------------------- */

  await connection.waitForOpen();

  console.log(
    "🟢 Deepgram connection OPEN"
  );

  return connection;
}