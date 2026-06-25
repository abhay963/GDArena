// Import reusable axios instance
import api from "./api";

// Get user's current streak
export async function getStreak(uid) {
  // Send GET request to backend
  const response = await api.get(`/api/streak/${uid}`);

  // Return streak data
  return response.data;
}

// Update user's streak
export async function updateStreak(uid, email) {
  // Send POST request to backend
  const response = await api.post("/api/streak/update", {
    uid,
    email,
  });

  // Return updated streak
  return response.data;
}