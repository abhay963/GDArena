import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import gdRoutes from "./routes/gd.routes.js";
import streakRoutes from "./routes/streak.routes.js";
import documentRoutes from "./routes/documentRoutes.js";

import chatRoutes from "./routes/chatRoutes.js";
import studymateRoutes from "./routes/studymate.routes.js";

import {
  setupDeepgramWebSocket,
} from "./websocket/deepgram.ws.js";

dotenv.config();

const app = express();

/*
|--------------------------------------------------------------------------
| MIDDLEWARE
|--------------------------------------------------------------------------
*/

app.use(
  cors()
);

app.use(
  express.json()
);

/*
|--------------------------------------------------------------------------
| EXISTING ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  "/api/gd",
  gdRoutes
);

app.use(
  "/api/streak",
  streakRoutes
);



app.use(
  "/api/documents",
  documentRoutes
);

app.use(
  "/api/chats",
  chatRoutes
);

/*
|--------------------------------------------------------------------------
| STUDYMATE
|--------------------------------------------------------------------------
|
| General AI:
|
| POST /api/studymate/chat
|
| Document RAG remains:
|
| POST /api/documents/ask
|
*/

app.use(
  "/api/studymate",
  studymateRoutes
);

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get(
  "/",
  (req, res) => {
    res.send(
      "🚀 GD Arena Backend is Running..."
    );
  }
);

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/

const PORT =
  process.env.PORT || 5000;

const server = http.createServer(app);

// Setup Deepgram WebSocket
setupDeepgramWebSocket(server);

server.listen(
  PORT,
  () => {
    console.log(
      `🚀 Server running on port ${PORT}`
    );

    console.log(
      `🎙️ Deepgram WS: ws://localhost:${PORT}/ws/deepgram`
    );
  }
);