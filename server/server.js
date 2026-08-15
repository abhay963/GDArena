import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import gdRoutes from "./routes/gd.routes.js";
import streakRoutes from "./routes/streak.routes.js";
import documentRoutes from "./routes/documentRoutes.js";
import performanceRoutes from "./routes/performance.routes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/gd", gdRoutes);

app.use("/api/streak", streakRoutes);

app.use("/api/performance", performanceRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.send("🚀 GD Arena Backend is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Working on ${PORT}`);
});