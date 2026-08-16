let socket = null;
let mediaRecorder = null;
let mediaStream = null;

export async function startSpeech({
  onInterim,
  onFinal,
  onSpeechStarted,
  onReady,
  onError,
}) {
  try {
    // ==========================================
    // 1. MICROPHONE
    // ==========================================

    mediaStream =
      await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

    // ==========================================
    // 2. WEBSOCKET
    // ==========================================

    const wsProtocol =
      window.location.protocol === "https:"
        ? "wss"
        : "ws";

    const wsHost =
      window.location.hostname === "localhost"
        ? "localhost:5000"
        : window.location.host;

    socket = new WebSocket(
      `${wsProtocol}://${wsHost}/ws/deepgram`
    );

    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      console.log(
        "🟢 Speech WebSocket connected"
      );
    };

    // ==========================================
    // 3. RECEIVE TRANSCRIPTS
    // ==========================================

    socket.onmessage = (event) => {
      try {
        const data =
          JSON.parse(event.data);

        switch (data.type) {
          case "ready":
            console.log(
              "🎙️ Deepgram ready"
            );

            onReady?.();
            break;

          case "interim":
            onInterim?.(
              data.transcript
            );
            break;

          case "final":
            console.log(
              "🎯 FINAL TRANSCRIPT:",
              data.transcript
            );

            onFinal?.(
              data.transcript
            );
            break;

          case "speech-started":
            onSpeechStarted?.();
            break;

          case "error":
            console.error(
              "❌ Speech error:",
              data.message
            );

            onError?.(
              new Error(data.message)
            );
            break;

          default:
            break;
        }
      } catch (error) {
        console.error(
          "❌ Invalid WebSocket message:",
          error
        );
      }
    };

    socket.onerror = (error) => {
      console.error(
        "❌ Speech WebSocket error:",
        error
      );

      onError?.(
        new Error(
          "Speech WebSocket connection failed"
        )
      );
    };

    socket.onclose = () => {
      console.log(
        "🔴 Speech WebSocket closed"
      );
    };

    // ==========================================
    // 4. MEDIA RECORDER
    // ==========================================

    const mimeType =
      MediaRecorder.isTypeSupported(
        "audio/webm;codecs=opus"
      )
        ? "audio/webm;codecs=opus"
        : "audio/webm";

    mediaRecorder =
      new MediaRecorder(
        mediaStream,
        {
          mimeType,
        }
      );

    mediaRecorder.ondataavailable = (
      event
    ) => {
      if (
        event.data.size > 0 &&
        socket?.readyState === WebSocket.OPEN
      ) {
        socket.send(event.data);
      }
    };

    mediaRecorder.onerror = (error) => {
      console.error(
        "❌ MediaRecorder error:",
        error
      );

      onError?.(error);
    };

    // Small chunks = lower latency
    mediaRecorder.start(250);

    console.log(
      "🎤 MediaRecorder started"
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

export function stopSpeech() {
  console.log(
    "🛑 Stopping speech recognition"
  );

  // Stop recorder
  if (
    mediaRecorder &&
    mediaRecorder.state !== "inactive"
  ) {
    mediaRecorder.stop();
  }

  mediaRecorder = null;

  // Stop microphone
  if (mediaStream) {
    mediaStream
      .getTracks()
      .forEach((track) => {
        track.stop();
      });

    mediaStream = null;
  }

  // Close WebSocket
  if (
    socket &&
    socket.readyState === WebSocket.OPEN
  ) {
    socket.close();
  }

  socket = null;
}