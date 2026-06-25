// Import reusable axios instance
import api from "./api";

// Start a new Group Discussion
export async function startGD() {
  // Send request to backend
  const response = await api.get("/api/start-gd");

  // Return response data
  return response.data;
}

// Continue the Group Discussion
export async function continueGD(userSpeech, topic, history) {
  // Send user's speech, topic and history to backend
  const response = await api.post("/api/gd", {
    userSpeech,
    topic,
    history,
  });

  // Return AI response
  return response.data;
}