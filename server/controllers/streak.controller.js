import {
  updateUserStreak,
  getUserStreak,
} from "../services/streak.service.js";

// Handles POST /api/streak/update
export async function updateStreak(req, res) {
  try {
    // Get uid and email sent from frontend
    const { uid, email } = req.body;

    // Call service to update the user's streak
    const streak = await updateUserStreak(uid, email);

    // Send updated streak back to frontend
    res.json({ streak });
  } catch (error) {
    // Print error on server for debugging
    console.error(error);

    // Send error response to frontend
    res.status(500).json({
      message: "Failed to update streak",
    });
  }
}

// Handles GET /api/streak/:uid
export async function getStreak(req, res) {
  try {
    // Get uid from URL parameter
    const { uid } = req.params;

    // Fetch streak from service
    const streak = await getUserStreak(uid);

    // Return streak to frontend
    res.json({ streak });
  } catch (error) {
    // Print error on server for debugging
    console.error(error);

    // Send error response to frontend
    res.status(500).json({
      message: "Failed to fetch streak",
    });
  }
}