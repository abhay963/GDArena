const sessions = new Map();

const EMPTY_SUMMARY = {
  positions: {},
  keyArguments: [],
  importantClaims: [],
  contradictions: [],
  unresolvedPoints: [],
  discussionState: "",
};

export function createSession(sessionId, topic, agents) {
  sessions.set(sessionId, {
    sessionId,
    topic,
    agents,

    rollingSummary: {
      ...EMPTY_SUMMARY,
    },

    recentMessages: [],

    turnCount: 0,

    // Prevent multiple summary calls at the same time
    summaryInProgress: false,
  });

  console.log(
    "GD SESSION CREATED:",
    sessionId
  );
}


export function getSession(sessionId) {
  const session = sessions.get(sessionId);

  if (!session) {
    throw new Error("GD session not found");
  }

  return session;
}


export function addUserMessage(
  sessionId,
  text
) {
  const session = getSession(sessionId);

  session.recentMessages.push({
    speaker: "You",
    text,
  });

  session.turnCount++;

  console.log(
    `USER TURN: ${session.turnCount}/8`
  );
}


export function addAIMessage(
  sessionId,
  speaker,
  text
) {
  const session = getSession(sessionId);

  session.recentMessages.push({
    speaker,
    text,
  });
}


export function getRecentMessages(sessionId) {
  return getSession(sessionId).recentMessages;
}


export function getRollingSummary(sessionId) {
  return getSession(sessionId).rollingSummary;
}


// ==========================================
// SUMMARY CONTROL
// ==========================================

export function shouldSummarize(sessionId) {
  const session = getSession(sessionId);

  // Don't start another summary
  // while one is already running
  if (session.summaryInProgress) {
    return false;
  }

  return session.turnCount >= 8;
}


export function startSummary(sessionId) {
  const session = getSession(sessionId);

  if (session.summaryInProgress) {
    return null;
  }

  session.summaryInProgress = true;

  // Take a snapshot of current messages
  const messages = [
    ...session.recentMessages,
  ];

  const turnCount = session.turnCount;

  return {
    messages,
    messageCount: messages.length,
    turnCount,
  };
}


// ==========================================
// UPDATE SUMMARY SAFELY
// ==========================================

export function updateRollingSummary(
  sessionId,
  newSummary,
  messageCount,
  summarizedTurnCount
) {
  const session = getSession(sessionId);

  // Update long-term memory
  session.rollingSummary = newSummary;

  // Remove ONLY messages that were included
  // in the summary.
  //
  // If new messages arrived while Groq was
  // generating the summary, they remain here.
  session.recentMessages.splice(
    0,
    messageCount
  );

  // Remove only the turns that were summarized.
  //
  // Example:
  // 8 turns summarized
  // 1 new turn happened during summary
  //
  // 9 - 8 = 1
  session.turnCount = Math.max(
    0,
    session.turnCount - summarizedTurnCount
  );

  session.summaryInProgress = false;

  console.log(
    "SESSION MEMORY UPDATED"
  );

  console.log(
    "Remaining recent messages:",
    session.recentMessages.length
  );

  console.log(
    "Remaining turns:",
    session.turnCount
  );
}


// ==========================================
// SUMMARY FAILURE
// ==========================================

export function cancelSummary(sessionId) {
  const session = getSession(sessionId);

  session.summaryInProgress = false;

  console.log(
    "ROLLING SUMMARY CANCELLED"
  );
}