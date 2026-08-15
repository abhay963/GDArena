import {
  getOrCreateChatSession,
  getChatSession,
  getChatSessionByDocument,
  saveChatMessage,
  getChatMessages,
  getUserDocuments,
} from "../services/chat.service.js";


// ========================================================
// UUID VALIDATION
// ========================================================
//
// PostgreSQL UUID fields:
//   documents.id
//   chat_sessions.id
//   chat_messages.chat_session_id
//
// Firebase UID is NOT a UUID.
// Firebase UID is stored as TEXT in user_id.
//
// ========================================================

const isValidUUID = (value) => {
  if (!value || typeof value !== "string") {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
};


// ========================================================
// CREATE OR GET CHAT
// ========================================================
//
// Input:
//
// userId     → Firebase UID (TEXT)
// documentId → PostgreSQL UUID
//
// Output:
//
// chat.id → PostgreSQL UUID
//
// The returned chat.id becomes chatSessionId.
// ========================================================

export const createOrGetChat = async (
  req,
  res
) => {
  try {
    const {
      userId,
      documentId,
    } = req.body;


    // ------------------------------------------------------
    // USER ID
    // ------------------------------------------------------

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }


    // ------------------------------------------------------
    // DOCUMENT ID
    // ------------------------------------------------------

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "documentId is required.",
      });
    }


    if (!isValidUUID(documentId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid documentId. Expected a PostgreSQL UUID.",
      });
    }


    // ------------------------------------------------------
    // GET / CREATE CHAT SESSION
    // ------------------------------------------------------

    const chat =
      await getOrCreateChatSession({
        userId,
        documentId,
      });


    return res.status(200).json({
      success: true,
      chat,
    });

  } catch (error) {

    console.error(
      "Create/get chat error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create chat.",
    });
  }
};


// ========================================================
// GET CHAT BY DOCUMENT
// ========================================================
//
// Input:
//
// userId     → Firebase UID
// documentId → PostgreSQL UUID
//
// Useful when the frontend knows the document but does
// not know the chatSessionId yet.
// ========================================================

export const getChatByDocument = async (
  req,
  res
) => {
  try {
    const {
      userId,
      documentId,
    } = req.query;


    // ------------------------------------------------------
    // USER ID
    // ------------------------------------------------------

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }


    // ------------------------------------------------------
    // DOCUMENT ID
    // ------------------------------------------------------

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "documentId is required.",
      });
    }


    if (!isValidUUID(documentId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid documentId. Expected a PostgreSQL UUID.",
      });
    }


    // ------------------------------------------------------
    // FIND CHAT
    // ------------------------------------------------------

    const chat =
      await getChatSessionByDocument({
        userId,
        documentId,
      });


    return res.status(200).json({
      success: true,
      chat,
    });

  } catch (error) {

    console.error(
      "Get chat by document error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get chat.",
    });
  }
};


// ========================================================
// GET CHAT
// ========================================================
//
// URL:
//
// GET /api/chat/:chatSessionId?userId=...
//
// IMPORTANT:
//
// chatSessionId MUST be:
// PostgreSQL chat_sessions.id
//
// It MUST NOT be:
// Firebase user.uid
//
// It MUST NOT be:
// documentId
// ========================================================

export const getChat = async (
  req,
  res
) => {
  try {
    const {
      chatSessionId,
    } = req.params;


    const {
      userId,
    } = req.query;


    // ------------------------------------------------------
    // USER ID
    // ------------------------------------------------------

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }


    // ------------------------------------------------------
    // CHAT SESSION ID
    // ------------------------------------------------------

    if (!chatSessionId) {
      return res.status(400).json({
        success: false,
        message:
          "chatSessionId is required.",
      });
    }


    if (!isValidUUID(chatSessionId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid chatSessionId. Expected a PostgreSQL UUID. Do not pass the Firebase user UID here.",
      });
    }


    // ------------------------------------------------------
    // GET CHAT
    // ------------------------------------------------------

    const chat =
      await getChatSession({
        userId,
        chatSessionId,
      });


    // ------------------------------------------------------
    // CHAT NOT FOUND
    // ------------------------------------------------------

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }


    // ------------------------------------------------------
    // GET MESSAGES
    // ------------------------------------------------------

    const messages =
      await getChatMessages({
        userId,
        chatSessionId,
      });


    return res.status(200).json({
      success: true,
      chat,
      messages,
    });

  } catch (error) {

    console.error(
      "Get chat error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get chat.",
    });
  }
};


// ========================================================
// SAVE CHAT MESSAGE
// ========================================================
//
// Input:
//
// userId        → Firebase UID
// chatSessionId → PostgreSQL UUID
// role          → user | assistant
// content       → message text
// ========================================================

export const saveMessage = async (
  req,
  res
) => {
  try {
    const {
      userId,
      chatSessionId,
      role,
      content,
    } = req.body;


    // ------------------------------------------------------
    // USER ID
    // ------------------------------------------------------

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }


    // ------------------------------------------------------
    // CHAT SESSION ID
    // ------------------------------------------------------

    if (!chatSessionId) {
      return res.status(400).json({
        success: false,
        message:
          "chatSessionId is required.",
      });
    }


    if (!isValidUUID(chatSessionId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid chatSessionId. Expected a PostgreSQL UUID. Do not pass the Firebase user UID here.",
      });
    }


    // ------------------------------------------------------
    // ROLE
    // ------------------------------------------------------

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "role is required.",
      });
    }


    if (
      !["user", "assistant"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Role must be user or assistant.",
      });
    }


    // ------------------------------------------------------
    // CONTENT
    // ------------------------------------------------------

    if (
      !content ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "content is required.",
      });
    }


    // ------------------------------------------------------
    // VERIFY CHAT OWNERSHIP
    // ------------------------------------------------------

    const chat =
      await getChatSession({
        userId,
        chatSessionId,
      });


    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }


    // ------------------------------------------------------
    // SAVE MESSAGE
    // ------------------------------------------------------

    const message =
      await saveChatMessage({
        chatSessionId,
        role,
        content,
      });


    return res.status(201).json({
      success: true,
      message,
    });

  } catch (error) {

    console.error(
      "Save chat message error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to save message.",
    });
  }
};


// ========================================================
// GET USER DOCUMENTS
// ========================================================
//
// userId is Firebase UID → TEXT.
//
// DO NOT validate it as UUID.
// ========================================================

export const getDocuments = async (
  req,
  res
) => {
  try {
    const {
      userId,
    } = req.query;


    // ------------------------------------------------------
    // USER ID
    // ------------------------------------------------------

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }


    // ------------------------------------------------------
    // GET DOCUMENTS
    // ------------------------------------------------------

    const documents =
      await getUserDocuments({
        userId,
      });


    return res.status(200).json({
      success: true,
      documents,
    });

  } catch (error) {

    console.error(
      "Get user documents error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get documents.",
    });
  }
};