import api from "./api";

// Start a new Group Discussion
export async function startGD() {
  const response = await api.get("/api/gd/start");

  return response.data;
}


// Continue the Group Discussion
export async function continueGD(
  sessionId,
  userSpeech
) {
  const response = await api.post("/api/gd", {
    sessionId,
    userSpeech,
  });

  return response.data;
}