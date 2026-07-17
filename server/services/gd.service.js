import axios from "axios";
import { getRandomTopic } from "./topic.service.js";

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
  // Get a random topic and its category
  const { topic, category } = getRandomTopic();

  // Prompt sent to Groq AI
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
Category: ${category}
`;

  // Call Groq API
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      // AI model
      model: "llama-3.3-70b-versatile",

      // Force JSON response
      response_format: {
        type: "json_object",
      },

      // Prompt for AI
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      // Higher value = more creative responses
      temperature: 0.9,
    },
    {
      headers: {
        // API key from .env
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    }
  );

  // Return everything controller needs
  return {
    topic,
    category,
    agents: safeJSON(response.data.choices[0].message.content),
  };
}

export async function continueGD(userSpeech, topic, history) {
  // Convert chat history into readable conversation
  const transcript = history
    .map((item) => `${item.speaker}: ${item.text}`)
    .join("\n");

  // Prompt for AI
 const prompt = `
You are simulating a professional campus placement Group Discussion.

Generate responses for TWO AI participants.

Return ONLY valid JSON in this format:

{
  "Player 1":"text",
  "Player 2":"text"
}

=========================
TOPIC
=========================
${topic}

=========================
DISCUSSION SO FAR
=========================
${transcript}

=========================
LATEST USER RESPONSE
=========================
${userSpeech}

=========================
INSTRUCTIONS
=========================

The discussion has already progressed.

Read the previous discussion carefully before answering.

VERY IMPORTANT:

• Never repeat any argument, example, fact, or opinion already mentioned.
• Never paraphrase previous points.
• Introduce NEW perspectives every turn.
• Each response should move the discussion forward.

Possible new perspectives include:
- Technical
- Business
- Economic
- Social
- Ethical
- Legal
- Environmental
- Psychological
- Educational
- Historical
- Global comparison
- Government policies
- Real-world examples
- Company examples
- Future impact
- Risks
- Opportunities

Player personalities:

Player 1
- Slightly disagree with previous speaker.
- Challenge assumptions politely.
- Present a completely new argument.

Player 2
- Give a balanced opinion.
- Build upon previous discussion.
- Introduce another fresh angle or example.

Rules:
- Each player speaks only once.
- Maximum 2-3 sentences.
- Natural spoken English.
- No greetings.
- No conclusion.
- Continue the discussion naturally.
`;

  // Call Groq API
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

  // Return AI response
  return safeJSON(response.data.choices[0].message.content);
}