import {
  startGD,
  continueGD,
} from "../services/gd.service.js";

import {
  createSession,
  getSession,
  addUserMessage,
  addAIMessage,
  getRecentMessages,
  getRollingSummary,
  shouldSummarize,
  startSummary,
  updateRollingSummary,
  cancelSummary,
} from "../services/gdSession.service.js";

import {
  generateRollingSummary,
} from "../services/gdSummary.service.js";

import crypto from "crypto";


// ==========================================
// START GD
// ==========================================

export async function startGroupDiscussion(req, res) {
  try {
    const data = await startGD();

    const sessionId = crypto.randomUUID();

    createSession(
      sessionId,
      data.topic,
      data.agents
    );

    // Store opening AI messages
    if (data.agents["Player 1"]) {
      addAIMessage(
        sessionId,
        "Player 1",
        data.agents["Player 1"]
      );
    }

    if (data.agents["Player 2"]) {
      addAIMessage(
        sessionId,
        "Player 2",
        data.agents["Player 2"]
      );
    }

    res.json({
      sessionId,
      topic: data.topic,
      agents: data.agents,
    });

  } catch (error) {
    console.error(
      "START GD ERROR:",
      error.message
    );

    res.status(500).json({
      error: "Failed to start GD",
    });
  }
}


// ==========================================
// CONTINUE GD
// ==========================================

export async function continueGroupDiscussion(req, res) {
  try {
    const {
      sessionId,
      userSpeech,
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        error: "sessionId is required",
      });
    }

    if (!userSpeech?.trim()) {
      return res.status(400).json({
        error: "userSpeech is required",
      });
    }

    const session = getSession(sessionId);

    // ======================================
    // 1. STORE USER MESSAGE
    // ======================================

    addUserMessage(
      sessionId,
      userSpeech.trim()
    );

    // ======================================
    // 2. GET CURRENT AI CONTEXT
    // ======================================

    const recentMessages =
      getRecentMessages(sessionId);

    const rollingSummary =
      getRollingSummary(sessionId);

    // ======================================
    // 3. GENERATE AI RESPONSE
    // ======================================

    const response = await continueGD(
      userSpeech.trim(),
      session.topic,
      rollingSummary,
      recentMessages
    );

    // ======================================
    // 4. STORE AI RESPONSES
    // ======================================

    if (response["Player 1"]) {
      addAIMessage(
        sessionId,
        "Player 1",
        response["Player 1"]
      );
    }

    if (response["Player 2"]) {
      addAIMessage(
        sessionId,
        "Player 2",
        response["Player 2"]
      );
    }

    // ======================================
    // 5. CHECK FOR SUMMARY
    // ======================================

    if (shouldSummarize(sessionId)) {

      const summaryJob =
        startSummary(sessionId);

      if (summaryJob) {

        console.log(
          "8 turns completed."
        );

        console.log(
          "Starting background summary..."
        );

        const {
          messages,
          messageCount,
          turnCount,
        } = summaryJob;

        const summaryInput = {
          messages,
          messageCount,
          turnCount,
          oldSummary:
            getRollingSummary(sessionId),
        };

        // ==================================
        // BACKGROUND SUMMARY
        // ==================================

        generateRollingSummary(
          summaryInput.oldSummary,
          summaryInput.messages
        )
          .then((newSummary) => {

            console.log(
              "========== NEW ROLLING SUMMARY =========="
            );

            console.log(
              JSON.stringify(
                newSummary,
                null,
                2
              )
            );

            console.log(
              "=========================================="
            );

            updateRollingSummary(
              sessionId,
              newSummary,
              summaryInput.messageCount,
              summaryInput.turnCount
            );

            console.log(
              "Rolling summary updated."
            );

          })
          .catch((error) => {

            console.error(
              "ROLLING SUMMARY ERROR:",
              error.message
            );

            cancelSummary(sessionId);
          });
      }
    }

    // ======================================
    // 6. RESPOND IMMEDIATELY
    // ======================================

    res.json(response);

  } catch (error) {

    console.error(
      "GD TURN ERROR:",
      error.message
    );

    if (!res.headersSent) {
      res.status(500).json({
        error: "GD turn failed",
      });
    }
  }
}