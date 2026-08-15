import { pool } from "../config/db.js";


// ========================================================
// UUID VALIDATION
// ========================================================
//
// PostgreSQL UUID columns must receive UUID values.
//
// Firebase UID:
// 6NvA5q4Cs8cb9gkLwPFjZj2...
//
// PostgreSQL UUID:
// 3cb07151-a610-4361-8a7c-xxxxxxxxxxxx
//
// This helper prevents invalid values from reaching
// PostgreSQL UUID columns.
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
// GET OR CREATE CHAT SESSION
// ========================================================

export const getOrCreateChatSession = async ({
  userId,
  documentId,
}) => {
  if (!userId) {
    throw new Error("userId is required.");
  }

  if (!documentId) {
    throw new Error("documentId is required.");
  }

  // ------------------------------------------------------
  // DOCUMENT ID MUST BE UUID
  // ------------------------------------------------------

  if (!isValidUUID(documentId)) {
    throw new Error(
      "Invalid documentId. Expected a PostgreSQL UUID."
    );
  }

  // ------------------------------------------------------
  // VERIFY DOCUMENT OWNERSHIP
  // ------------------------------------------------------

  const documentResult = await pool.query(
    `
    SELECT
      id,
      user_id,
      file_name,
      status
    FROM documents
    WHERE id = $1
      AND user_id = $2
    LIMIT 1
    `,
    [
      documentId,
      userId,
    ]
  );

  if (documentResult.rows.length === 0) {
    throw new Error(
      "Document not found or does not belong to this user."
    );
  }

  // ------------------------------------------------------
  // CREATE / GET EXISTING SESSION
  // ------------------------------------------------------

  const result = await pool.query(
    `
    INSERT INTO chat_sessions
    (
      user_id,
      document_id
    )
    VALUES
    (
      $1,
      $2
    )
    ON CONFLICT (user_id, document_id)
    DO UPDATE SET
      updated_at = CURRENT_TIMESTAMP
    RETURNING
      id,
      user_id,
      document_id,
      title,
      created_at,
      updated_at
    `,
    [
      userId,
      documentId,
    ]
  );

  return result.rows[0];
};


// ========================================================
// GET CHAT SESSION BY SESSION UUID
// ========================================================

export const getChatSession = async ({
  userId,
  chatSessionId,
}) => {
  if (!userId) {
    throw new Error("userId is required.");
  }

  if (!chatSessionId) {
    throw new Error(
      "chatSessionId is required."
    );
  }

  // ------------------------------------------------------
  // IMPORTANT:
  //
  // chatSessionId is a PostgreSQL UUID.
  //
  // NEVER pass Firebase user.uid here.
  // ------------------------------------------------------

  if (!isValidUUID(chatSessionId)) {
    throw new Error(
      "Invalid chatSessionId. Expected a PostgreSQL UUID."
    );
  }

  const result = await pool.query(
    `
    SELECT
      id,
      user_id,
      document_id,
      title,
      created_at,
      updated_at
    FROM chat_sessions
    WHERE id = $1
      AND user_id = $2
    LIMIT 1
    `,
    [
      chatSessionId,
      userId,
    ]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};


// ========================================================
// GET CHAT SESSION BY DOCUMENT
// ========================================================
//
// This is useful when the frontend knows:
//   userId + documentId
//
// and does NOT yet know the chatSessionId.
// ========================================================

export const getChatSessionByDocument = async ({
  userId,
  documentId,
}) => {
  if (!userId) {
    throw new Error("userId is required.");
  }

  if (!documentId) {
    throw new Error("documentId is required.");
  }

  if (!isValidUUID(documentId)) {
    throw new Error(
      "Invalid documentId. Expected a PostgreSQL UUID."
    );
  }

  const result = await pool.query(
    `
    SELECT
      id,
      user_id,
      document_id,
      title,
      created_at,
      updated_at
    FROM chat_sessions
    WHERE user_id = $1
      AND document_id = $2
    LIMIT 1
    `,
    [
      userId,
      documentId,
    ]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};


// ========================================================
// SAVE CHAT MESSAGE
// ========================================================

export const saveChatMessage = async ({
  chatSessionId,
  role,
  content,
}) => {
  if (!chatSessionId) {
    throw new Error(
      "chatSessionId is required."
    );
  }

  // ------------------------------------------------------
  // CHAT SESSION ID MUST BE UUID
  // ------------------------------------------------------

  if (!isValidUUID(chatSessionId)) {
    throw new Error(
      "Invalid chatSessionId. Expected a PostgreSQL UUID."
    );
  }

  // ------------------------------------------------------
  // VALIDATE ROLE
  // ------------------------------------------------------

  if (
    !["user", "assistant"].includes(role)
  ) {
    throw new Error(
      "Invalid message role."
    );
  }

  // ------------------------------------------------------
  // VALIDATE CONTENT
  // ------------------------------------------------------

  if (
    !content ||
    !content.trim()
  ) {
    throw new Error(
      "Message content is required."
    );
  }

  // ------------------------------------------------------
  // TRANSACTION
  // ------------------------------------------------------

  const client =
    await pool.connect();

  try {
    await client.query(
      "BEGIN"
    );

    // ----------------------------------------------------
    // INSERT MESSAGE
    // ----------------------------------------------------

    const messageResult =
      await client.query(
        `
        INSERT INTO chat_messages
        (
          chat_session_id,
          role,
          content
        )
        VALUES
        (
          $1,
          $2,
          $3
        )
        RETURNING
          id,
          chat_session_id,
          role,
          content,
          created_at
        `,
        [
          chatSessionId,
          role,
          content.trim(),
        ]
      );

    // ----------------------------------------------------
    // UPDATE SESSION TIMESTAMP
    // ----------------------------------------------------

    await client.query(
      `
      UPDATE chat_sessions
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [
        chatSessionId,
      ]
    );

    await client.query(
      "COMMIT"
    );

    return messageResult.rows[0];

  } catch (error) {

    await client.query(
      "ROLLBACK"
    );

    console.error(
      "❌ Failed to save chat message:",
      error
    );

    throw error;

  } finally {

    client.release();
  }
};


// ========================================================
// GET CHAT MESSAGES
// ========================================================

export const getChatMessages = async ({
  userId,
  chatSessionId,
}) => {
  if (!userId) {
    throw new Error("userId is required.");
  }

  if (!chatSessionId) {
    throw new Error(
      "chatSessionId is required."
    );
  }

  // ------------------------------------------------------
  // UUID VALIDATION
  // ------------------------------------------------------

  if (!isValidUUID(chatSessionId)) {
    throw new Error(
      "Invalid chatSessionId. Expected a PostgreSQL UUID."
    );
  }

  const result =
    await pool.query(
      `
      SELECT
        m.id,
        m.chat_session_id,
        m.role,
        m.content,
        m.created_at

      FROM chat_messages m

      INNER JOIN chat_sessions s
        ON s.id = m.chat_session_id

      WHERE m.chat_session_id = $1
        AND s.user_id = $2

      ORDER BY
        m.created_at ASC
      `,
      [
        chatSessionId,
        userId,
      ]
    );

  return result.rows;
};


// ========================================================
// GET USER DOCUMENTS
// ========================================================
//
// Firebase UID is TEXT here.
//
// This is intentionally NOT validated as UUID.
// ========================================================

export const getUserDocuments = async ({
  userId,
}) => {
  if (!userId) {
    throw new Error(
      "userId is required."
    );
  }

  const result =
    await pool.query(
      `
      SELECT
        d.id,
        d.file_name,
        d.file_type,
        d.status,
        d.processing_stage,
        d.progress,
        d.total_chunks,
        d.processed_chunks,
        d.created_at,

        dcs.id AS chat_session_id,
        dcs.title AS chat_title,
        dcs.updated_at AS chat_updated_at

      FROM documents d

      LEFT JOIN chat_sessions dcs
        ON dcs.document_id = d.id
        AND dcs.user_id = d.user_id

      WHERE d.user_id = $1

      ORDER BY
        d.created_at DESC
      `,
      [
        userId,
      ]
    );

  return result.rows;
};