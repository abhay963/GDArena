import axios from "axios";

function safeJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    return JSON.parse(text.slice(start, end + 1));
  }
}

export async function analyzeTranscript(topic, history) {

  const transcript = history
    .map((msg) => `${msg.speaker}: ${msg.text}`)
    .join("\n");

  const prompt = `
You are an expert Group Discussion evaluator.

Analyze ONLY the USER.

Topic:
${topic}

Transcript:

${transcript}

Return ONLY valid JSON.

{
  "overall_score":8,
  "communication":8,
  "confidence":8,
  "vocabulary":8,
  "fluency":8,
  "logic":8,
  "participation":8,

  "strengths":"",

  "weaknesses":"",

  "suggestions":""
}
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    }
  );

  return safeJSON(response.data.choices[0].message.content);
}