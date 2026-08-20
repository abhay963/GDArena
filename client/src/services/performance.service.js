import api from "./api";

// Save and analyze the completed GD performance
export async function savePerformance(uid, topic, history) {
  const response = await api.post("/api/performance", {
    uid,
    topic,
    history,
  });

  return response.data;
}