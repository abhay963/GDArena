let socket = null;
let mediaRecorder = null;
let mediaStream = null;

let isStopping = false;
let isPaused = false;

/* =========================================================
   START SPEECH
========================================================= */

export async function startSpeech({
  onInterim,
  onFinal,
  onSpeechStarted,
  onReady,
  onError,
}) {
  try {
    isStopping = false;
    isPaused = false;

    /* =====================================================
       1. MICROPHONE
    ===================================================== */

    console.log("🎤 Requesting microphone...");

    mediaStream =
      await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

    console.log(
      "🎤 Microphone permission granted"
    );

    /* =====================================================
       2. CREATE WEBSOCKET
    ===================================================== */

    const wsProtocol =
      window.location.protocol === "https:"
        ? "wss"
        : "ws";

    const wsHost =
      window.location.hostname === "localhost"
        ? "localhost:5000"
        : window.location.host;

    const wsUrl =
      `${wsProtocol}://${wsHost}/ws/deepgram`;

    console.log(
      "🔵 Connecting Speech WebSocket:",
      wsUrl
    );

    socket = new WebSocket(wsUrl);

    socket.binaryType = "arraybuffer";

    /* =====================================================
       WAIT FOR SERVER READY
    ===================================================== */

    let resolveReady;
    let rejectReady;

    const readyPromise =
      new Promise(
        (resolve, reject) => {
          resolveReady = resolve;
          rejectReady = reject;
        }
      );

    /* =====================================================
       WEBSOCKET OPEN
    ===================================================== */

    socket.onopen = () => {
      console.log(
        "🟢 Speech WebSocket connected"
      );
    };

    /* =====================================================
       RECEIVE SERVER MESSAGES
    ===================================================== */

    socket.onmessage = (event) => {
      try {
        const data =
          JSON.parse(event.data);

        console.log(
          "📨 Speech server message:",
          data.type
        );

        /* ================================================
           DEEPGRAM READY
        ================================================= */

        if (
          data.type === "ready"
        ) {
          console.log(
            "🎙️ Deepgram ready"
          );

          resolveReady();

          onReady?.();

          return;
        }

        /* ================================================
           INTERIM TRANSCRIPT
        ================================================= */

        if (
          data.type === "interim"
        ) {
          const transcript =
            data.transcript?.trim();

          if (!transcript) {
            return;
          }

          /*
           * Safety check.
           *
           * While AI is speaking, the recorder is paused.
           * Therefore normally no Deepgram transcript should
           * arrive here.
           */

          if (isPaused) {
            console.log(
              "🔇 Ignoring interim while AI is speaking:",
              transcript
            );

            return;
          }

          console.log(
            "📝 Interim transcript:",
            transcript
          );

          onInterim?.(
            transcript
          );

          return;
        }

        /* ================================================
           FINAL TRANSCRIPT
        ================================================= */

        if (
          data.type === "final"
        ) {
          const transcript =
            data.transcript?.trim();

          if (!transcript) {
            return;
          }

          /*
           * NEVER allow a transcript through while
           * AI is speaking.
           */

          if (isPaused) {
            console.log(
              "🔇 Ignoring final while AI is speaking:",
              transcript
            );

            return;
          }

          console.log(
            "🎯 FINAL TRANSCRIPT:",
            transcript
          );

          onFinal?.(
            transcript
          );

          return;
        }

        /* ================================================
           SPEECH STARTED
        ================================================= */

        if (
          data.type ===
          "speech-started"
        ) {
          /*
           * If AI is speaking, ignore this completely.
           */

          if (isPaused) {
            console.log(
              "🔇 Ignoring speech-started — AI is speaking"
            );

            return;
          }

          console.log(
            "🗣️ Speech started"
          );

          onSpeechStarted?.();

          return;
        }

        /* ================================================
           UTTERANCE END
        ================================================= */

        if (
          data.type ===
          "utterance-end"
        ) {
          console.log(
            "🛑 Utterance ended"
          );

          return;
        }

        /* ================================================
           SERVER ERROR
        ================================================= */

        if (
          data.type === "error"
        ) {
          const message =
            data.message ||
            "Speech recognition error";

          console.error(
            "❌ Speech server error:",
            message
          );

          const error =
            new Error(message);

          rejectReady(error);

          onError?.(error);

          return;
        }

        /* ================================================
           SERVER CLOSED
        ================================================= */

        if (
          data.type === "closed"
        ) {
          console.log(
            "🔴 Speech server closed connection"
          );

          return;
        }

      } catch (error) {
        console.error(
          "❌ Invalid Speech WebSocket message:",
          error
        );
      }
    };

    /* =====================================================
       WEBSOCKET ERROR
    ===================================================== */

    socket.onerror = (error) => {
      console.error(
        "❌ Speech WebSocket error:",
        error
      );

      const speechError =
        new Error(
          "Speech WebSocket connection failed"
        );

      rejectReady(
        speechError
      );

      onError?.(
        speechError
      );
    };

    /* =====================================================
       WEBSOCKET CLOSE
    ===================================================== */

    socket.onclose = (event) => {
      console.log(
        "🔴 Speech WebSocket closed",
        {
          code: event.code,
          reason: event.reason,
        }
      );

      if (!isStopping) {
        console.warn(
          "⚠️ Speech WebSocket closed unexpectedly"
        );
      }
    };

    /* =====================================================
       3. WAIT FOR DEEPGRAM READY
    ===================================================== */

    console.log(
      "⏳ Waiting for Deepgram to become ready..."
    );

    await readyPromise;

    console.log(
      "🟢 Deepgram is ready — starting recorder"
    );

    /* =====================================================
       4. MEDIA RECORDER
    ===================================================== */

    const supportedTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
    ];

    let mimeType = "";

    for (
      const type of supportedTypes
    ) {
      if (
        MediaRecorder.isTypeSupported(
          type
        )
      ) {
        mimeType = type;
        break;
      }
    }

    if (!mimeType) {
      throw new Error(
        "Browser does not support WebM audio recording"
      );
    }

    console.log(
      "🎧 MediaRecorder MIME type:",
      mimeType
    );

    mediaRecorder =
      new MediaRecorder(
        mediaStream,
        {
          mimeType,
        }
      );

    /* =====================================================
       AUDIO DATA
    ===================================================== */

    mediaRecorder.ondataavailable = (
      event
    ) => {
      if (
        !event.data ||
        event.data.size === 0
      ) {
        return;
      }

      /*
       * CRITICAL:
       *
       * If AI is speaking, don't send microphone
       * audio to Deepgram.
       */

      if (isPaused) {
        return;
      }

      if (
        !socket ||
        socket.readyState !==
          WebSocket.OPEN
      ) {
        console.warn(
          "⚠️ WebSocket not open — audio chunk skipped"
        );

        return;
      }

      try {
        socket.send(
          event.data
        );
      } catch (error) {
        console.error(
          "❌ Failed to send audio chunk:",
          error
        );
      }
    };

    /* =====================================================
       RECORDER START
    ===================================================== */

    mediaRecorder.onstart = () => {
      console.log(
        "🎤 MediaRecorder started"
      );
    };

    /* =====================================================
       RECORDER STOP
    ===================================================== */

    mediaRecorder.onstop = () => {
      console.log(
        "🛑 MediaRecorder stopped"
      );
    };

    /* =====================================================
       RECORDER PAUSE
    ===================================================== */

    mediaRecorder.onpause = () => {
      console.log(
        "⏸️ MediaRecorder paused"
      );
    };

    /* =====================================================
       RECORDER RESUME
    ===================================================== */

    mediaRecorder.onresume = () => {
      console.log(
        "▶️ MediaRecorder resumed"
      );
    };

    /* =====================================================
       RECORDER ERROR
    ===================================================== */

    mediaRecorder.onerror = (
      event
    ) => {
      console.error(
        "❌ MediaRecorder error:",
        event
      );

      onError?.(
        event.error ||
          new Error(
            "MediaRecorder error"
          )
      );
    };

    /* =====================================================
       START RECORDING
    ===================================================== */

    mediaRecorder.start(
      250
    );

    console.log(
      "🎙️ Speech pipeline fully active"
    );

  } catch (error) {
    console.error(
      "❌ Failed to start speech:",
      error
    );

    stopSpeech();

    onError?.(
      error
    );

    throw error;
  }
}

/* =========================================================
   PAUSE SPEECH
========================================================= */

/*
 * Called immediately BEFORE AI TTS starts.
 *
 * IMPORTANT:
 *
 * We DO NOT close:
 *
 * ❌ Microphone permission
 * ❌ WebSocket
 * ❌ Deepgram connection
 *
 * We only pause MediaRecorder.
 *
 * Therefore the entire Deepgram connection remains alive.
 */

export function pauseSpeech() {

  if (isStopping) {
    return;
  }

  if (isPaused) {
    console.log(
      "ℹ️ Speech already paused"
    );

    return;
  }

  isPaused = true;

  console.log(
    "🔇 Speech input PAUSED — AI is speaking"
  );

  if (
    mediaRecorder &&
    mediaRecorder.state ===
      "recording"
  ) {
    try {
      mediaRecorder.pause();

      console.log(
        "⏸️ MediaRecorder paused"
      );

    } catch (error) {
      console.error(
        "❌ Failed to pause MediaRecorder:",
        error
      );
    }
  }
}

/* =========================================================
   RESUME SPEECH
========================================================= */

/*
 * Called ONLY after the ENTIRE AI speech queue
 * has finished.
 */

export function resumeSpeech() {

  if (isStopping) {
    return;
  }

  if (!isPaused) {
    console.log(
      "ℹ️ Speech is already active"
    );

    return;
  }

  isPaused = false;

  console.log(
    "🎤 Speech input RESUMED — user's turn"
  );

  if (
    mediaRecorder &&
    mediaRecorder.state ===
      "paused"
  ) {
    try {
      mediaRecorder.resume();

      console.log(
        "▶️ MediaRecorder resumed"
      );

    } catch (error) {
      console.error(
        "❌ Failed to resume MediaRecorder:",
        error
      );
    }
  }
}

/* =========================================================
   STOP SPEECH
========================================================= */

export function stopSpeech() {

  console.log(
    "🛑 Stopping speech recognition"
  );

  isStopping = true;
  isPaused = false;

  /* =====================================================
     STOP MEDIA RECORDER
  ===================================================== */

  if (
    mediaRecorder &&
    mediaRecorder.state !==
      "inactive"
  ) {
    try {
      mediaRecorder.stop();

    } catch (error) {
      console.warn(
        "⚠️ Failed to stop MediaRecorder:",
        error
      );
    }
  }

  mediaRecorder = null;

  /* =====================================================
     STOP MICROPHONE
  ===================================================== */

  if (mediaStream) {

    mediaStream
      .getTracks()
      .forEach(
        (track) => {

          try {
            track.stop();

          } catch (error) {
            console.warn(
              "⚠️ Failed to stop microphone track:",
              error
            );
          }

        }
      );

    mediaStream = null;
  }

  /* =====================================================
     CLOSE WEBSOCKET
  ===================================================== */

  if (
    socket &&
    (
      socket.readyState ===
        WebSocket.OPEN ||
      socket.readyState ===
        WebSocket.CONNECTING
    )
  ) {
    try {

      socket.close();

    } catch (error) {

      console.warn(
        "⚠️ Failed to close Speech WebSocket:",
        error
      );

    }
  }

  socket = null;

  console.log(
    "🔴 Speech pipeline stopped"
  );
}