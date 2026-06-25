// Import AI service functions
import { startGD, continueGD } from "../services/gd.service.js";

// Handles GET /api/gd/start
export async function startGroupDiscussion(req, res) {
  try {
    // Ask service to generate a new GD topic and AI opening
    const data = await startGD();

    // Send response back to frontend
    res.json(data);
  } catch (error) {
    // Print error on server
    console.error("START GD ERROR:", error.message);

    // Send error response
    res.status(500).json({
      error: "Failed to start GD",
    });
  }
}

// Handles POST /api/gd
export async function continueGroupDiscussion(req, res) {
  try {
    // Receive data sent from frontend
    const { userSpeech, topic, history } = req.body;

    // Ask AI service to continue the discussion
    const response = await continueGD(
      userSpeech,
      topic,
      history
    );

    // Return AI response
    res.json(response);
  } catch (error) {
    // Print error on server
    console.error("GD TURN ERROR:", error.message);

    // Send error response
    res.status(500).json({
      error: "GD turn failed",
    });
  }
}