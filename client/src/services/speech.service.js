let socket = null;
let mediaRecorder = null;
let mediaStream = null;

let isStopping = false;

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

    console.log("🎤 Microphone permission granted");

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

    const readyPromise = new Promise(
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

        /* =================================================
           DEEPGRAM READY
        ================================================= */

        if (data.type === "ready") {
          console.log(
            "🎙️ Deepgram ready"
          );

          resolveReady();

          onReady?.();

          return;
        }

        /* =================================================
           INTERIM TRANSCRIPT
        ================================================= */

        if (data.type === "interim") {
          const transcript =
            data.transcript?.trim();

          if (!transcript) {
            return;
          }

          console.log(
            "📝 Interim transcript:",
            transcript
          );

          onInterim?.(transcript);

          return;
        }

        /* =================================================
           FINAL TRANSCRIPT
        ================================================= */

        if (data.type === "final") {
          const transcript =
            data.transcript?.trim();

          if (!transcript) {
            return;
          }

          console.log(
            "🎯 FINAL TRANSCRIPT:",
            transcript
          );

          onFinal?.(transcript);

          return;
        }

        /* =================================================
           SPEECH STARTED
        ================================================= */

        if (
          data.type === "speech-started"
        ) {
          console.log(
            "🗣️ Speech started"
          );

          onSpeechStarted?.();

          return;
        }

        /* =================================================
           UTTERANCE END
        ================================================= */

        if (
          data.type === "utterance-end"
        ) {
          console.log(
            "🛑 Utterance ended"
          );

          /*
           * IMPORTANT:
           *
           * We DO NOT create a final transcript here.
           *
           * The server should send:
           *
           * {
           *   type: "final",
           *   transcript: "..."
           * }
           *
           * when Deepgram has assembled the final
           * transcript.
           */

          return;
        }

        /* =================================================
           SERVER ERROR
        ================================================= */

        if (data.type === "error") {
          const message =
            data.message ||
            "Speech recognition error";

          console.error(
            "❌ Speech server error:",
            message
          );

          rejectReady(
            new Error(message)
          );

          onError?.(
            new Error(message)
          );

          return;
        }

        /* =================================================
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

      rejectReady(speechError);

      onError?.(speechError);
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
        socket.send(event.data);
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
       
       250ms gives relatively low latency.
    ===================================================== */

    mediaRecorder.start(250);

    console.log(
      "🎙️ Speech pipeline fully active"
    );
  } catch (error) {
    console.error(
      "❌ Failed to start speech:",
      error
    );

    stopSpeech();

    onError?.(error);

    throw error;
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

  /* =======================================================
     STOP MEDIA RECORDER
  ======================================================= */

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

  /* =======================================================
     STOP MICROPHONE
  ======================================================= */

  if (mediaStream) {
    mediaStream
      .getTracks()
      .forEach((track) => {
        try {
          track.stop();
        } catch (error) {
          console.warn(
            "⚠️ Failed to stop microphone track:",
            error
          );
        }
      });

    mediaStream = null;
  }

  /* =======================================================
     CLOSE WEBSOCKET
  ======================================================= */

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