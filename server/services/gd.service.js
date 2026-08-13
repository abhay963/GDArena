import axios from "axios";

import { GD_TOPICS } from "../topics.js";
// Safely converts AI response into JSON
function safeJSON(text) {
  try {
    // Try parsing normally
    return JSON.parse(text);
  } catch {
    // If AI adds extra text, extract only the JSON object
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    return JSON.parse(text.slice(start, end + 1));
  }
}

// Starts a new Group Discussion
export async function startGD() {

  // Select random topic from GD_TOPICS
  const randomIndex = Math.floor(Math.random() * GD_TOPICS.length);

  const topic = GD_TOPICS[randomIndex];

  const prompt = `
Simulate a Group Discussion opening with TWO AI participants.

STRICT JSON:
{
  "Player 1": "text",
  "Player 2": "text"
}

Rules:
- 2-3 lines each
- No greetings
- Player 1: aggressive debater
- Player 2: calm logical analyst

Topic: ${topic}
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",

      response_format: {
        type: "json_object"
      },

      messages: [
        {
          role: "user",
          content: prompt
        }
      ],

      temperature: 0.4
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      }
    }
  );

  return {
    topic,
    agents: safeJSON(response.data.choices[0].message.content)
  };
}

export async function continueGD(
  userSpeech,
  topic,
  rollingSummary,
  recentMessages
) {
  const recentTranscript = recentMessages
    .map((item) => `${item.speaker}: ${item.text}`)
    .join("\n");

  const prompt = `
You are simulating a professional campus placement Group Discussion.

Generate responses for TWO AI participants.

Return ONLY valid JSON:

{
  "Player 1": "text",
  "Player 2": "text"
}

TOPIC:
${topic}

LONG-TERM MEMORY:
${JSON.stringify(rollingSummary, null, 2)}

RECENT DISCUSSION:
${recentTranscript}

LATEST USER RESPONSE:
${userSpeech}

INSTRUCTIONS:

- Remember participant positions from LONG-TERM MEMORY.
- Remember position changes and contradictions.
- Never repeat previous arguments.
- Introduce a NEW perspective every turn.
- Move the discussion forward naturally.

Player 1:
- Slightly disagree with previous speaker.
- Challenge assumptions politely.
- Present a new argument.

Player 2:
- Give a balanced opinion.
- Build upon the discussion.
- Introduce another fresh angle.

Rules:
- Each player speaks once.
- Maximum 2-3 sentences.
- Natural spoken English.
- No greetings.
- No conclusion.
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

      temperature: 0.8,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    }
  );

  return safeJSON(
    response.data.choices[0].message.content
  );
}