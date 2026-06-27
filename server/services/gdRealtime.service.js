import axios from "axios";

export async function processTranscript({
  transcript,
  topic,
  history,
}) {
  if (!transcript.trim()) return null;

  const response = await axios.post(
    `http://localhost:${process.env.PORT}/api/gd`,
    {
      userSpeech: transcript,
      topic,
      history,
    }
  );

  return response.data;
}