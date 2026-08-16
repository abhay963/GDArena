import {
  WebSocketServer,
  WebSocket,
} from "ws";

import {
  createDeepgramConnection,
} from "../services/deepgram.service.js";

/* =========================================================
   DEEPGRAM WEBSOCKET BRIDGE

   Browser
      ↓
   WebSocket
      ↓
   Deepgram Streaming STT
      ↓
   Interim / Final transcript
      ↓
   Browser
========================================================= */

export function setupDeepgramWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws/deepgram",
  });

  wss.on(
    "connection",
    async (clientSocket) => {
      console.log(
        "🎙️ Browser connected to Deepgram WebSocket"
      );

      /* ===================================================
         STATE
      =================================================== */

      let deepgramConnection = null;

      let deepgramReady = false;

      /*
       * Stores finalized Deepgram segments.
       *
       * Example:
       *
       * Segment 1:
       * "I think it's"
       *
       * Segment 2:
       * "not working well"
       *
       * We combine them into:
       *
       * "I think it's not working well"
       */
      let finalTranscriptParts = [];

      /*
       * Prevent duplicate final transcript events.
       */
      let lastSentTranscript = "";

      /*
       * Browser can start sending audio before
       * Deepgram has finished initializing.
       */
      const audioBuffer = [];

      /*
       * KeepAlive prevents long-running streaming
       * connections from becoming stale.
       */
      let keepAliveInterval = null;

      /*
       * Prevent cleanup from running multiple times.
       */
      let cleanedUp = false;

      /* ===================================================
         HELPER:
         SEND MESSAGE TO BROWSER
      =================================================== */

      const sendToBrowser = (payload) => {
        if (
          clientSocket.readyState ===
          WebSocket.OPEN
        ) {
          try {
            clientSocket.send(
              JSON.stringify(payload)
            );
          } catch (error) {
            console.error(
              "❌ Failed to send message to browser:",
              error
            );
          }
        }
      };

      /* ===================================================
         HELPER:
         BUILD COMPLETE FINAL TRANSCRIPT
      =================================================== */

      const buildFinalTranscript = () => {
        return finalTranscriptParts
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
      };

      /* ===================================================
         HELPER:
         SEND FINAL TRANSCRIPT
      =================================================== */

      const sendFinalTranscript = (
        reason = "unknown"
      ) => {
        const finalTranscript =
          buildFinalTranscript();

        if (!finalTranscript) {
          console.log(
            `ℹ️ No final transcript to send (${reason})`
          );

          return;
        }

        /*
         * Prevent duplicate transcript delivery.
         */
        if (
          finalTranscript ===
          lastSentTranscript
        ) {
          console.log(
            "⚠️ Duplicate final transcript ignored:",
            finalTranscript
          );

          finalTranscriptParts = [];

          return;
        }

        console.log(
          `🎯 FINAL TRANSCRIPT (${reason}):`,
          finalTranscript
        );

        lastSentTranscript =
          finalTranscript;

        sendToBrowser({
          type: "final",
          transcript: finalTranscript,
        });

        /*
         * Start collecting the next utterance.
         */
        finalTranscriptParts = [];
      };

      /* ===================================================
         BROWSER AUDIO HANDLER
         
         IMPORTANT:
         Register this BEFORE Deepgram initialization.
      =================================================== */

      clientSocket.on(
        "message",
        (audioData) => {
          /*
           * Ignore messages after cleanup.
           */
          if (cleanedUp) {
            return;
          }

          /*
           * Deepgram connection doesn't exist yet.
           */
          if (!deepgramConnection) {
            console.log(
              "⏳ Deepgram connection not created yet — buffering audio"
            );

            audioBuffer.push(audioData);

            return;
          }

          /*
           * Deepgram exists but isn't ready.
           */
          if (!deepgramReady) {
            console.log(
              "⏳ Deepgram not ready — buffering audio"
            );

            audioBuffer.push(audioData);

            return;
          }

          /*
           * Deepgram is ready.
           */
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

      /* ===================================================
         INITIALIZE DEEPGRAM
      =================================================== */

      try {
        console.log(
          "🔵 Creating Deepgram connection..."
        );

        deepgramConnection =
          await createDeepgramConnection();

        console.log(
          "🟢 Deepgram connection initialized"
        );

        /*
         * createDeepgramConnection()
         * already calls:
         *
         * connection.connect()
         * await connection.waitForOpen()
         *
         * Therefore the connection is OPEN here.
         */

        deepgramReady = true;

        console.log(
          "🟢 Deepgram is READY for audio"
        );

        /* =================================================
           DEEPGRAM MESSAGE HANDLER
        ================================================= */

        deepgramConnection.on(
          "message",
          (message) => {
            try {
              if (!message) {
                return;
              }

              console.log(
                "📨 Deepgram event:",
                message.type
              );

              /* =========================================
                 SPEECH STARTED
              ========================================= */

              if (
                message.type ===
                "SpeechStarted"
              ) {
                console.log(
                  "🎤 Deepgram: speech started"
                );

                sendToBrowser({
                  type: "speech-started",
                });

                return;
              }

              /* =========================================
                 UTTERANCE END
                 
                 This is important.

                 Deepgram can send:
                 
                 {
                   type: "UtteranceEnd"
                 }

                 even after the actual transcript
                 segments have already been finalized.
              ========================================= */

              if (
                message.type ===
                "UtteranceEnd"
              ) {
                console.log(
                  "🛑 Deepgram: UtteranceEnd"
                );

                /*
                 * If finalized transcript parts exist,
                 * this is a safe point to send them.
                 */
                if (
                  finalTranscriptParts.length >
                  0
                ) {
                  sendFinalTranscript(
                    "UtteranceEnd"
                  );
                }

                return;
              }

              /* =========================================
                 ONLY PROCESS RESULTS
              ========================================= */

              if (
                message.type !==
                "Results"
              ) {
                return;
              }

              /* =========================================
                 EXTRACT TRANSCRIPT
              ========================================= */

              const transcript =
                message
                  ?.channel
                  ?.alternatives?.[0]
                  ?.transcript
                  ?.trim() || "";

              /*
               * Ignore empty transcripts.
               */
              if (!transcript) {
                return;
              }

              /* =========================================
                 INTERIM RESULT
              ========================================= */

              if (
                !message.is_final
              ) {
                console.log(
                  "📝 Interim:",
                  transcript
                );

                sendToBrowser({
                  type: "interim",
                  transcript,
                });

                return;
              }

              /* =========================================
                 FINALIZED SEGMENT
                 
                 IMPORTANT:
                 
                 is_final === true
                 
                 does NOT necessarily mean the
                 user has finished speaking.
                 
                 We accumulate it.
              ========================================= */

              console.log(
                "📝 Final segment:",
                transcript
              );

              finalTranscriptParts.push(
                transcript
              );

              console.log(
                "📚 Final parts:",
                finalTranscriptParts
              );

              /* =========================================
                 SPEECH FINAL
                 
                 This means Deepgram detected an
                 endpoint / pause.
              ========================================= */

              if (
                message.speech_final
              ) {
                console.log(
                  "🛑 Deepgram speech_final = true"
                );

                sendFinalTranscript(
                  "speech_final"
                );

                return;
              }

              /*
               * If speech_final is false,
               * DO NOT send the transcript yet.
               *
               * There may be more finalized
               * segments coming.
               */
            } catch (error) {
              console.error(
                "❌ Deepgram message processing error:",
                error
              );
            }
          }
        );

        /* =================================================
           DEEPGRAM ERROR
        ================================================= */

        deepgramConnection.on(
          "error",
          (error) => {
            console.error(
              "❌ DEEPGRAM ERROR:",
              error
            );

            deepgramReady = false;

            sendToBrowser({
              type: "error",
              message:
                error?.message ||
                "Deepgram connection error",
            });
          }
        );

        /* =================================================
           DEEPGRAM CLOSE
        ================================================= */

        deepgramConnection.on(
          "close",
          () => {
            console.log(
              "🔴 Deepgram connection CLOSED"
            );

            deepgramReady = false;

            if (
              keepAliveInterval
            ) {
              clearInterval(
                keepAliveInterval
              );

              keepAliveInterval = null;
            }
          }
        );

        /* =================================================
           KEEP ALIVE
           
           Long GD sessions can remain active for
           several minutes. Keep the connection alive.
        ================================================= */

        keepAliveInterval =
          setInterval(() => {
            if (
              !deepgramConnection ||
              !deepgramReady
            ) {
              return;
            }

            try {
              deepgramConnection.sendKeepAlive(
                {
                  type: "KeepAlive",
                }
              );

              console.log(
                "💓 Deepgram KeepAlive"
              );
            } catch (error) {
              console.warn(
                "⚠️ Deepgram KeepAlive failed:",
                error?.message
              );
            }
          }, 3000);

        /* =================================================
           FLUSH BUFFERED AUDIO
        ================================================= */

        if (
          audioBuffer.length > 0
        ) {
          console.log(
            `📤 Sending ${audioBuffer.length} buffered audio chunks`
          );

          for (
            const audio of audioBuffer
          ) {
            try {
              if (
                deepgramReady
              ) {
                deepgramConnection.sendMedia(
                  audio
                );
              }
            } catch (error) {
              console.error(
                "❌ Failed to send buffered audio:",
                error
              );
            }
          }

          audioBuffer.length = 0;
        }

        /* =================================================
           TELL BROWSER DEEPGRAM IS READY
        ================================================= */

        sendToBrowser({
          type: "ready",
        });

        console.log(
          "🚀 Deepgram audio streaming is ACTIVE"
        );
      } catch (error) {
        /* ===============================================
           INITIALIZATION ERROR
        =============================================== */

        console.error(
          "❌ Failed to initialize Deepgram:",
          error
        );

        deepgramReady = false;

        sendToBrowser({
          type: "error",
          message:
            error?.message ||
            "Failed to connect to Deepgram",
        });

        try {
          clientSocket.close();
        } catch {
          // Ignore close errors
        }
      }

      /* =================================================
         BROWSER DISCONNECT
      ================================================= */

      clientSocket.on(
        "close",
        () => {
          console.log(
            "🔴 Browser disconnected from Deepgram"
          );

          cleanedUp = true;

          deepgramReady = false;

          /* ---------------------------------------------
             Clear KeepAlive
          --------------------------------------------- */

          if (
            keepAliveInterval
          ) {
            clearInterval(
              keepAliveInterval
            );

            keepAliveInterval = null;
          }

          /* ---------------------------------------------
             Close Deepgram
          --------------------------------------------- */

          try {
            if (
              deepgramConnection
            ) {
              deepgramConnection.sendCloseStream();
            }
          } catch (error) {
            console.log(
              "ℹ️ Deepgram stream already closed"
            );
          }

          deepgramConnection = null;

          audioBuffer.length = 0;

          finalTranscriptParts = [];
        }
      );

      /* =================================================
         BROWSER ERROR
      ================================================= */

      clientSocket.on(
        "error",
        (error) => {
          console.error(
            "❌ Browser WebSocket error:",
            error
          );
        }
      );
    }
  );

  console.log(
    "🎙️ Deepgram WebSocket server ready at /ws/deepgram"
  );

  return wss;
}