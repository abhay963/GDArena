import axios from "axios";

function safeJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    return JSON.parse(
      text.slice(start, end + 1)
    );
  }
}

export async function generateRollingSummary(
  oldSummary,
  messages
) {
  const conversation = messages
    .map(
      (item) =>
        `${item.speaker}: ${item.text}`
    )
    .join("\n");

  const prompt = `
You are maintaining long-term memory for a Group Discussion.

Update the existing structured memory using the new discussion messages.

IMPORTANT:
Do NOT create a generic summary.

Preserve important historical information.

If a participant changes their position:
- Keep the old position.
- Add the new position.
- Record the change.
- Do not overwrite history.

Return ONLY valid JSON in this exact structure:

{
  "positions": {
    "You": {
      "currentPosition": "",
      "positionHistory": []
    },
    "Player 1": {
      "currentPosition": "",
      "positionHistory": []
    },
    "Player 2": {
      "currentPosition": "",
      "positionHistory": []
    }
  },
  "keyArguments": [],
  "importantClaims": [],
  "contradictions": [],
  "unresolvedPoints": [],
  "discussionState": ""
}

=========================
EXISTING MEMORY
=========================

${JSON.stringify(oldSummary, null, 2)}

=========================
NEW DISCUSSION MESSAGES
=========================

${conversation}

=========================
MEMORY RULES
=========================

1. Preserve important previous positions.

2. Never delete an earlier position just because
   the participant has changed their opinion.

3. If a position changes, add both positions to
   positionHistory with the relevant turn/order.

4. Detect contradictions between earlier and newer claims.

5. Preserve important arguments.

6. Preserve important factual claims.

7. Keep only meaningful unresolved points.

8. Remove information that is no longer useful.

9. Keep the memory compact.

10. Focus on information that will help an AI
    continue this Group Discussion intelligently.
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

      temperature: 0.2,
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