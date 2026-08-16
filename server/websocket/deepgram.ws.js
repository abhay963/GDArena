import { WebSocketServer, WebSocket } from "ws";

import {
  createDeepgramConnection,
} from "../services/deepgram.service.js";

export function setupDeepgramWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws/deepgram",
  });

  wss.on("connection", async (clientSocket) => {
    console.log(
      "🎙️ Browser connected to Deepgram WebSocket"
    );

    // ==========================================
    // STATE
    // ==========================================

    let deepgramConnection = null;

    let deepgramReady = false;

    let finalTranscriptParts = [];

    // Audio can arrive from browser before
    // Deepgram initialization finishes.
    const audioBuffer = [];

    // ==========================================
    // BROWSER AUDIO HANDLER
    // ==========================================
    //
    // IMPORTANT:
    // Register this BEFORE waiting for Deepgram.
    // This prevents early browser audio from
    // getting lost.
    //
    // ==========================================

    clientSocket.on(
      "message",
      (audioData) => {
        // --------------------------------------
        // Deepgram does not exist yet
        // --------------------------------------

        if (!deepgramConnection) {
          console.log(
            "⏳ Deepgram connection not created yet — buffering audio"
          );

          audioBuffer.push(audioData);

          return;
        }

        // --------------------------------------
        // Deepgram exists but is not ready
        // --------------------------------------

        if (!deepgramReady) {
          console.log(
            "⏳ Deepgram not ready — buffering audio"
          );

          audioBuffer.push(audioData);

          return;
        }

        // --------------------------------------
        // Deepgram ready
        // --------------------------------------

        try {
          deepgramConnection.sendMedia(
            audioData
          );
        } catch (error) {
          console.error(
            "❌ Failed to send audio to Deepgram:",
            error
          );
        }
      }
    );

    try {
      // ========================================
      // CREATE DEEPGRAM CONNECTION
      // ========================================

      console.log(
        "🔵 Creating Deepgram connection..."
      );

      deepgramConnection =
        await createDeepgramConnection();

      console.log(
        "🟢 Deepgram connection initialized"
      );

      // ========================================
      // IMPORTANT
      // ========================================
      //
      // createDeepgramConnection() already calls:
      //
      // connection.connect()
      // await connection.waitForOpen()
      //
      // Therefore the Deepgram socket is ALREADY
      // open when this line executes.
      //
      // Do NOT wait for another "open" event here.
      //
      // ========================================

      deepgramReady = true;

      console.log(
        "🟢 Deepgram is READY for audio"
      );

      // ========================================
      // DEEPGRAM MESSAGE HANDLER
      // ========================================

      deepgramConnection.on(
        "message",
        (message) => {
          try {
            // ====================================
            // SPEECH STARTED
            // ====================================

            if (
              message.type ===
              "SpeechStarted"
            ) {
              console.log(
                "🎤 Deepgram: speech started"
              );

              if (
                clientSocket.readyState ===
                WebSocket.OPEN
              ) {
                clientSocket.send(
                  JSON.stringify({
                    type: "speech-started",
                  })
                );
              }

              return;
            }

            // ====================================
            // ONLY PROCESS TRANSCRIPTION RESULTS
            // ====================================

            if (
              message.type !== "Results"
            ) {
              return;
            }

            // ====================================
            // EXTRACT TRANSCRIPT
            // ====================================

            const transcript =
              message.channel
                ?.alternatives?.[0]
                ?.transcript || "";

            if (!transcript.trim()) {
              return;
            }

            // ====================================
            // INTERIM RESULT
            // ====================================

            if (!message.is_final) {
              console.log(
                "📝 Interim:",
                transcript
              );

              if (
                clientSocket.readyState ===
                WebSocket.OPEN
              ) {
                clientSocket.send(
                  JSON.stringify({
                    type: "interim",
                    transcript,
                  })
                );
              }

              return;
            }

            // ====================================
            // FINAL SEGMENT
            // ====================================

            console.log(
              "📝 Final segment:",
              transcript
            );

            finalTranscriptParts.push(
              transcript
            );

            // ====================================
            // SPEECH FINAL
            // ====================================

            if (message.speech_final) {
              const finalTranscript =
                finalTranscriptParts
                  .join(" ")
                  .replace(/\s+/g, " ")
                  .trim();

              // Clear accumulated parts
              finalTranscriptParts = [];

              console.log(
                "🎯 SPEECH FINAL:",
                finalTranscript
              );

              // Send completed utterance
              // to browser
              if (
                finalTranscript &&
                clientSocket.readyState ===
                  WebSocket.OPEN
              ) {
                clientSocket.send(
                  JSON.stringify({
                    type: "final",
                    transcript:
                      finalTranscript,
                  })
                );
              }
            }
          } catch (error) {
            console.error(
              "❌ Deepgram message processing error:",
              error
            );
          }
        }
      );

      // ========================================
      // DEEPGRAM ERROR
      // ========================================

      deepgramConnection.on(
        "error",
        (error) => {
          console.error(
            "❌ DEEPGRAM ERROR:",
            error
          );

          deepgramReady = false;

          if (
            clientSocket.readyState ===
            WebSocket.OPEN
          ) {
            clientSocket.send(
              JSON.stringify({
                type: "error",
                message:
                  error?.message ||
                  "Deepgram connection error",
              })
            );
          }
        }
      );

      // ========================================
      // DEEPGRAM CLOSE
      // ========================================

      deepgramConnection.on(
        "close",
        () => {
          console.log(
            "🔴 Deepgram connection CLOSED"
          );

          deepgramReady = false;
        }
      );

      // ========================================
      // FLUSH BUFFERED AUDIO
      // ========================================
      //
      // Browser may have already sent audio
      // while Deepgram was connecting.
      //
      // ========================================

      if (audioBuffer.length > 0) {
        console.log(
          `📤 Sending ${audioBuffer.length} buffered audio chunks`
        );

        for (
          const audio of audioBuffer
        ) {
          try {
            deepgramConnection.sendMedia(
              audio
            );
          } catch (error) {
            console.error(
              "❌ Failed to send buffered audio:",
              error
            );
          }
        }

        // Clear buffer
        audioBuffer.length = 0;
      }

      // ========================================
      // TELL BROWSER DEEPGRAM IS READY
      // ========================================

      if (
        clientSocket.readyState ===
        WebSocket.OPEN
      ) {
        clientSocket.send(
          JSON.stringify({
            type: "ready",
          })
        );
      }

      console.log(
        "🚀 Deepgram audio streaming is ACTIVE"
      );
    } catch (error) {
      // ========================================
      // CONNECTION INITIALIZATION ERROR
      // ========================================

      console.error(
        "❌ Failed to initialize Deepgram:",
        error
      );

      deepgramReady = false;

      if (
        clientSocket.readyState ===
        WebSocket.OPEN
      ) {
        clientSocket.send(
          JSON.stringify({
            type: "error",
            message:
              error?.message ||
              "Failed to connect to Deepgram",
          })
        );

        clientSocket.close();
      }
    }

    // ==========================================
    // BROWSER DISCONNECT
    // ==========================================

    clientSocket.on(
      "close",
      () => {
        console.log(
          "🔴 Browser disconnected from Deepgram"
        );

        deepgramReady = false;

        try {
          if (deepgramConnection) {
            deepgramConnection.sendCloseStream();
          }
        } catch (error) {
          console.log(
            "ℹ️ Deepgram stream already closed"
          );
        }
      }
    );

    // ==========================================
    // BROWSER ERROR
    // ==========================================

    clientSocket.on(
      "error",
      (error) => {
        console.error(
          "❌ Browser WebSocket error:",
          error
        );
      }
    );
  });

  console.log(
    "🎙️ Deepgram WebSocket server ready at /ws/deepgram"
  );

  return wss;
}