import { AnimatePresence, motion } from "framer-motion";

import {
  FiArrowUpRight,
  FiBookOpen,
  FiCheck,
  FiGlobe,
  FiMessageCircle,
  FiFileText,
  FiZap,
  FiUser,
  FiClock,
  FiChevronDown,

  FiCpu,
  FiDatabase,
} from "react-icons/fi";

const ease = [0.22, 1, 0.36, 1];

function StudyMateChat({
  documentId,
  uploadedDocument,
  question,
  setQuestion,
  answer,
  sources,
  asking,
  askMessage,
  handleAsk,
  chatMessages = [],
}) {
  /*
   * =========================================================
   * CHAT MODE
   * =========================================================
   *
   * No document
   *      ↓
   * General AI
   *
   * Document selected
   *      ↓
   * Document-grounded RAG
   */

  const hasDocument = Boolean(documentId);

  const isReady =
    uploadedDocument?.status === "completed";

  const isFailed =
    uploadedDocument?.status === "failed";

  const isProcessing =
    hasDocument &&
    !isReady &&
    !isFailed;

  const documentName =
    uploadedDocument?.originalName ||
    uploadedDocument?.fileName ||
    "Selected document";

  /*
   * =========================================================
   * TIME FORMATTER
   * =========================================================
   */

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(date).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "";
    }
  };

  /*
   * =========================================================
   * MESSAGE RENDERER
   * =========================================================
   */

  const renderMessage = (message, index) => {
    const role =
      message.role ||
      message.sender ||
      "assistant";

    const isUser =
      role === "user";

    const content =
      message.content ||
      message.message ||
      message.text ||
      "";

    if (!content.trim()) {
      return null;
    }

    return (
      <motion.div
        key={
          message.id ||
          `${role}-${index}`
        }
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
          ease,
        }}
        className={`flex ${
          isUser
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <div
          className={`flex gap-3 max-w-[94%] sm:max-w-[80%] ${
            isUser
              ? "flex-row-reverse"
              : ""
          }`}
        >
          {/* =================================================
              AVATAR
          ================================================== */}

          <div
            className={`shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center ${
              isUser
                ? "bg-violet-500/[0.10] border-violet-500/15 text-violet-300"
                : hasDocument
                ? "bg-cyan-500/[0.07] border-cyan-500/10 text-cyan-300"
                : "bg-violet-500/[0.07] border-violet-500/10 text-violet-300"
            }`}
          >
            {isUser ? (
              <FiUser className="w-4 h-4" />
            ) : hasDocument ? (
              <FiFileText className="w-4 h-4" />
            ) : (
              <FiBookOpen className="w-4 h-4" />
            )}
          </div>

          {/* =================================================
              MESSAGE CONTENT
          ================================================== */}

          <div
            className={`min-w-0 flex flex-col ${
              isUser
                ? "items-end"
                : "items-start"
            }`}
          >
            {/* Metadata */}

            <div
              className={`flex items-center gap-2 mb-1.5 ${
                isUser
                  ? "flex-row-reverse"
                  : ""
              }`}
            >
              <span className="text-[11px] font-semibold text-white/45">
                {isUser
                  ? "You"
                  : "StudyMate"}
              </span>

              {message.created_at && (
                <span className="flex items-center gap-1 text-[9px] text-white/15">
                  <FiClock className="w-2.5 h-2.5" />

                  {formatTime(
                    message.created_at
                  )}
                </span>
              )}
            </div>

            {/* Bubble */}

            <div
              className={`rounded-2xl px-4 py-3.5 ${
                isUser
                  ? "rounded-tr-md bg-violet-500/[0.10] border border-violet-400/10"
                  : "rounded-tl-md bg-white/[0.025] border border-white/[0.06]"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-7 text-white/65">
                {content}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  /*
   * =========================================================
   * EMPTY STATE
   * =========================================================
   */

  const emptyStateTitle = hasDocument
    ? "Ask anything about your document"
    : "What would you like to learn?";

  const emptyStateDescription = hasDocument
    ? "StudyMate retrieves relevant sections from your document and uses them to build a grounded answer."
    : "Ask StudyMate about DSA, DBMS, coding, interviews, concepts, or any topic you're learning.";

  /*
   * =========================================================
   * PLACEHOLDER
   * =========================================================
   */

  const inputPlaceholder = isProcessing
    ? "Your document is still being prepared..."
    : isFailed
    ? "This document could not be processed"
    : hasDocument
    ? "Ask anything about this document..."
    : "Ask StudyMate anything...";

  /*
   * =========================================================
   * MODE COLORS
   * =========================================================
   */

  const accent = hasDocument
    ? {
        text: "text-cyan-400",
        softText: "text-cyan-300",
        border: "border-cyan-400/15",
        softBorder: "border-cyan-400/10",
        bg: "bg-cyan-500/[0.06]",
        glow: "via-cyan-400/60",
      }
    : {
        text: "text-violet-400",
        softText: "text-violet-300",
        border: "border-violet-400/15",
        softBorder: "border-violet-400/10",
        bg: "bg-violet-500/[0.06]",
        glow: "via-violet-400/60",
      };

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        ease,
      }}
      className="w-full mt-5 sm:mt-6"
    >
      {/* =====================================================
          MODE / CONTEXT HEADER
      ====================================================== */}

      <motion.div
        layout
        className={`relative mb-4 overflow-hidden rounded-[22px] border px-5 py-4 ${
          hasDocument
            ? "border-cyan-500/10 bg-cyan-500/[0.025]"
            : "border-violet-500/10 bg-violet-500/[0.025]"
        }`}
      >
        {/* Background glow */}

        <div
          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[70px] ${
            hasDocument
              ? "bg-cyan-500/[0.05]"
              : "bg-violet-500/[0.06]"
          }`}
        />

        <div className="relative flex items-center gap-4">
          {/* Icon */}

          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
              hasDocument
                ? "bg-emerald-500/[0.07] border-emerald-500/10"
                : "bg-violet-500/[0.08] border-violet-500/10"
            }`}
          >
            {hasDocument ? (
              isReady ? (
                <FiCheck className="w-5 h-5 text-emerald-400" />
              ) : isFailed ? (
                <FiFileText className="w-5 h-5 text-red-400" />
              ) : (
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-4 h-4 rounded-full border-2 border-white/10 border-t-cyan-400"
                />
              )
            ) : (
              <FiBookOpen className="w-5 h-5 text-violet-400" />
            )}
          </div>

          {/* Context */}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                StudyMate AI
              </p>

              <span
                className={`px-2 py-0.5 rounded-full border text-[9px] font-semibold uppercase tracking-wider ${
                  hasDocument
                    ? isReady
                      ? "bg-emerald-500/[0.08] border-emerald-500/10 text-emerald-400"
                      : isFailed
                      ? "bg-red-500/[0.08] border-red-500/10 text-red-400"
                      : "bg-cyan-500/[0.08] border-cyan-500/10 text-cyan-300"
                    : "bg-violet-500/[0.08] border-violet-500/10 text-violet-300"
                }`}
              >
                {hasDocument
                  ? isReady
                    ? "Document grounded"
                    : isFailed
                    ? "Unavailable"
                    : "Preparing"
                  : "General AI"}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-white/75 truncate">
              {hasDocument
                ? documentName
                : "Ask anything — no document required"}
            </p>
          </div>

          {/* Right indicator */}

          <div
            className={`hidden sm:flex shrink-0 w-10 h-10 rounded-xl border items-center justify-center ${
              hasDocument
                ? "bg-cyan-500/[0.05] border-cyan-500/10"
                : "bg-violet-500/[0.05] border-violet-500/10"
            }`}
          >
            {hasDocument ? (
              <FiDatabase className="w-4 h-4 text-cyan-400/70" />
            ) : (
              <FiGlobe className="w-4 h-4 text-violet-400/70" />
            )}
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          MAIN CHAT CARD
      ====================================================== */}

      <div className="relative rounded-[26px] border border-white/[0.08] bg-[#08080b]/95 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.30)]">
        {/* Top glow */}

        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-52 h-px bg-gradient-to-r from-transparent ${accent.glow} to-transparent`}
        />

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {hasDocument ? (
                  <FiMessageCircle
                    className={`w-4 h-4 ${accent.text}`}
                  />
                ) : (
                  <FiBookOpen
                    className={`w-4 h-4 ${accent.text}`}
                  />
                )}

                <span
                  className={`text-[10px] uppercase tracking-[0.2em] ${accent.text} opacity-70`}
                >
                  {hasDocument
                    ? "Document intelligence"
                    : "General AI assistant"}
                </span>
              </div>

              <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-white">
                {hasDocument
                  ? "Ask your document"
                  : "Ask StudyMate"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/35 max-w-xl">
                {hasDocument
                  ? "StudyMate searches your indexed document before generating an answer."
                  : "Your everyday AI study companion. Ask questions even when you haven't uploaded anything."}
              </p>
            </div>

            <div
              className={`hidden sm:flex shrink-0 w-11 h-11 rounded-xl border items-center justify-center ${accent.bg} ${accent.softBorder}`}
            >
              {hasDocument ? (
                <FiZap
                  className={`w-5 h-5 ${accent.text}`}
                />
              ) : (
                <FiCpu
                  className={`w-5 h-5 ${accent.text}`}
                />
              )}
            </div>
          </div>

          {/* =================================================
              ACTIVE MODE CARD
          ================================================== */}

          <div className="mt-4">
            <div
              className={`relative overflow-hidden flex items-center gap-3 rounded-2xl border px-4 py-3.5 ${
                hasDocument
                  ? "border-cyan-400/10 bg-cyan-400/[0.025]"
                  : "border-violet-400/10 bg-violet-400/[0.025]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  hasDocument
                    ? "bg-cyan-500/[0.08]"
                    : "bg-violet-500/[0.08]"
                }`}
              >
                {hasDocument ? (
                  <FiFileText className="w-4 h-4 text-cyan-400" />
                ) : (
                  <FiGlobe className="w-4 h-4 text-violet-400" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-white/55">
                  {hasDocument
                    ? isReady
                      ? "Document context is active"
                      : "Document context is being prepared"
                    : "General AI is active"}
                </p>

                <p className="text-[10px] text-white/20 mt-0.5 truncate">
                  {hasDocument
                    ? documentName
                    : "No document selected — ask anything"}
                </p>
              </div>

              <span
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] uppercase tracking-wider font-semibold ${
                  hasDocument
                    ? isReady
                      ? "border-emerald-400/10 bg-emerald-400/[0.05] text-emerald-400"
                      : "border-cyan-400/10 bg-cyan-400/[0.05] text-cyan-300"
                    : "border-violet-400/10 bg-violet-400/[0.05] text-violet-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    hasDocument
                      ? isReady
                        ? "bg-emerald-400"
                        : "bg-cyan-400 animate-pulse"
                      : "bg-violet-400"
                  }`}
                />

                {hasDocument
                  ? isReady
                    ? "RAG ready"
                    : "Processing"
                  : "AI ready"}
              </span>

              <FiChevronDown className="w-3.5 h-3.5 text-white/10 shrink-0" />
            </div>
          </div>

          {/* =================================================
              CHAT HISTORY
          ================================================== */}

          {chatMessages.length > 0 && (
            <div className="mt-5 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  hasDocument ? "bg-cyan-400" : "bg-violet-400"
                }`} />
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                  Live conversation
                </span>
              </div>

              <span className="text-[10px] text-white/15">
                {chatMessages.length} messages
              </span>
            </div>
          )}

          <AnimatePresence>
            {chatMessages.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                transition={{
                  duration: 0.4,
                  ease,
                }}
                className="mt-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FiMessageCircle className="w-3.5 h-3.5 text-violet-400/70" />

                    <span className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                      Conversation
                    </span>
                  </div>

                  <span className="text-[10px] text-white/15">
                    {chatMessages.length}{" "}
                    {chatMessages.length === 1
                      ? "message"
                      : "messages"}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-[#060609] p-3 sm:p-4 shadow-inner">
                  <div className="space-y-4 max-h-[430px] overflow-y-auto pr-2 scrollbar-thin scroll-smooth">
                    {chatMessages.map(
                      renderMessage
                    )}

                    {/* Thinking */}

                    {asking && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="flex items-start gap-3"
                      >
                        <div
                          className={`w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center ${
                            hasDocument
                              ? "bg-cyan-500/[0.07] border-cyan-500/10"
                              : "bg-violet-500/[0.07] border-violet-500/10"
                          }`}
                        >
                          {hasDocument ? (
                            <FiZap className="w-4 h-4 text-cyan-300" />
                          ) : (
                            <FiBookOpen className="w-4 h-4 text-violet-300" />
                          )}
                        </div>

                        <div className="rounded-2xl rounded-tl-md bg-white/[0.025] border border-white/[0.06] px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {[0, 1, 2].map(
                              (dot) => (
                                <motion.span
                                  key={dot}
                                  animate={{
                                    opacity: [
                                      0.25,
                                      1,
                                      0.25,
                                    ],
                                  }}
                                  transition={{
                                    duration: 1.2,
                                    delay:
                                      dot * 0.2,
                                    repeat:
                                      Infinity,
                                  }}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    hasDocument
                                      ? "bg-cyan-400"
                                      : "bg-violet-400"
                                  }`}
                                />
                              )
                            )}

                            <span className="ml-2 text-[11px] text-white/25">
                              {hasDocument
                                ? "Searching your document..."
                                : "StudyMate is thinking..."}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =================================================
              EMPTY CHAT STATE
          ================================================== */}

          {chatMessages.length === 0 &&
            !asking && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className={`mt-6 rounded-[22px] border border-dashed px-5 py-10 text-center ${
                  hasDocument
                    ? "border-cyan-400/[0.10] bg-cyan-400/[0.012]"
                    : "border-violet-400/[0.10] bg-violet-400/[0.012]"
                }`}
              >
                {/* Icon */}

                <div
                  className={`relative mx-auto w-16 h-16 rounded-[20px] border flex items-center justify-center ${
                    hasDocument
                      ? "bg-cyan-500/[0.07] border-cyan-500/10"
                      : "bg-violet-500/[0.07] border-violet-500/10"
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-[20px] blur-xl ${
                      hasDocument
                        ? "bg-cyan-500/[0.06]"
                        : "bg-violet-500/[0.06]"
                    }`}
                  />

                  <div className="relative">
                    {hasDocument ? (
                      <FiMessageCircle className="w-7 h-7 text-cyan-300/70" />
                    ) : (
                      <FiBookOpen className="w-7 h-7 text-violet-300/70" />
                    )}
                  </div>
                </div>

                <p className="mt-5 text-sm font-semibold text-white/55">
                  {emptyStateTitle}
                </p>

                <p className="mt-2 max-w-lg mx-auto text-xs leading-6 text-white/20">
                  {emptyStateDescription}
                </p>

                {/* General AI suggestions */}

                {!hasDocument && (
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    {[
                      "Explain DSA",
                      "Help with DBMS",
                      "Practice interview",
                      "Explain recursion",
                    ].map(
                      (suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() =>
                            setQuestion(
                              suggestion
                            )
                          }
                          className="px-3.5 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-400/15 text-[10px] text-white/30 hover:text-white/55 transition-all"
                        >
                          {suggestion}
                        </button>
                      )
                    )}
                  </div>
                )}

                {/* Document suggestions */}

                {hasDocument &&
                  isReady && (
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                      {[
                        "Summarize this document",
                        "Explain the main concepts",
                        "Give me important points",
                      ].map(
                        (suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() =>
                              setQuestion(
                                suggestion
                              )
                            }
                            className="px-3.5 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-cyan-400/[0.04] hover:border-cyan-400/15 text-[10px] text-white/30 hover:text-white/55 transition-all"
                          >
                            {suggestion}
                          </button>
                        )
                      )}
                    </div>
                  )}
              </motion.div>
            )}

          {/* =================================================
              INPUT AREA
          ================================================== */}

          <div
            className={`sticky bottom-0 mt-4 rounded-[20px] border bg-[#0b0b10]/98 backdrop-blur-xl shadow-[0_-12px_35px_rgba(0,0,0,0.22)] focus-within:bg-[#0d0d13] transition-all overflow-hidden ${
              hasDocument
                ? "border-white/[0.07] focus-within:border-cyan-400/25"
                : "border-white/[0.07] focus-within:border-violet-400/25"
            }`}
          >
            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  if (
                    !asking &&
                    question.trim() &&
                    !isProcessing &&
                    !isFailed
                  ) {
                    handleAsk();
                  }
                }
              }}
              disabled={
                asking ||
                isProcessing ||
                isFailed
              }
              placeholder={
                inputPlaceholder
              }
              rows={2}
              className="w-full resize-none bg-transparent outline-none px-4 pt-4 pb-2.5 text-sm leading-6 text-white placeholder:text-white/20 disabled:cursor-not-allowed"
            />

            {/* Input footer */}

            <div className="px-3.5 pb-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                {hasDocument ? (
                  <>
                    <FiFileText className="w-3 h-3 text-cyan-400/50 shrink-0" />

                    <p className="hidden sm:block text-[11px] text-white/20 truncate">
                      {isReady
                        ? "Answers grounded in your document"
                        : "Waiting for document indexing"}
                    </p>
                  </>
                ) : (
                  <>
                    <FiGlobe className="w-3 h-3 text-violet-400/50 shrink-0" />

                    <p className="hidden sm:block text-[11px] text-white/20">
                      General AI conversation
                    </p>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleAsk}
                disabled={
                  asking ||
                  !question.trim() ||
                  isProcessing ||
                  isFailed
                }
                className={`group shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  hasDocument
                    ? "bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 shadow-[0_8px_25px_rgba(34,211,238,0.10)]"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 shadow-[0_8px_25px_rgba(139,92,246,0.12)]"
                }`}
              >
                {asking ? (
                  <>
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    />

                    Thinking...
                  </>
                ) : (
                  <>
                    <span>
                      Ask StudyMate
                    </span>

                    <FiArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* =================================================
              PROCESSING MESSAGE
          ================================================== */}

          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 6,
                }}
                className="mt-4 flex items-center gap-3 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.025] px-4 py-3"
              >
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-4 h-4 rounded-full border-2 border-white/10 border-t-cyan-400 shrink-0"
                />

                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/50">
                    Preparing your document
                  </p>

                  <p className="text-[10px] text-white/20 mt-0.5">
                    You can continue using StudyMate once indexing is complete.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =================================================
              ERROR / STATUS
          ================================================== */}

          <AnimatePresence>
            {askMessage && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                className="mt-4 rounded-xl border border-red-500/10 bg-red-500/[0.035] px-4 py-3 text-sm text-red-300/70"
              >
                {askMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* =================================================
              ANSWER FALLBACK
          ================================================== */}

          <AnimatePresence>
            {answer &&
              chatMessages.length === 0 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease,
                  }}
                  className="mt-6 rounded-2xl border border-violet-500/10 bg-violet-500/[0.025] overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/[0.08] border border-violet-500/10 flex items-center justify-center">
                      <FiMessageCircle className="w-4 h-4 text-violet-400" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white/80">
                        StudyMate
                      </p>

                      <p className="text-[11px] text-white/25">
                        {hasDocument
                          ? "Grounded answer"
                          : "AI answer"}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 py-6">
                    <div className="whitespace-pre-wrap text-sm sm:text-[15px] leading-7 text-white/65">
                      {answer}
                    </div>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>

          {/* =================================================
              RAG SOURCES
          ================================================== */}

          {hasDocument &&
            isReady &&
            sources &&
            sources.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-6 rounded-2xl border border-white/[0.05] bg-white/[0.012] overflow-hidden"
              >
                {/* Source header */}

                <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FiDatabase className="w-3.5 h-3.5 text-cyan-400" />

                    <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                      Retrieved context
                    </span>
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-white/20">
                    {sources.length}{" "}
                    {sources.length === 1
                      ? "chunk"
                      : "chunks"}
                  </span>
                </div>

                {/* Sources */}

                <div className="p-4 sm:p-5 space-y-2.5">
                  {sources.map(
                    (source, index) => (
                      <motion.div
                        key={
                          source.id ||
                          index
                        }
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.35,
                          delay:
                            index * 0.05,
                          ease,
                        }}
                        className="group rounded-xl border border-white/[0.05] bg-white/[0.015] p-4 hover:bg-white/[0.025] hover:border-cyan-400/[0.10] transition-all"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-cyan-500/[0.08] text-[9px] font-bold text-cyan-400">
                              {index + 1}
                            </span>

                            <span className="text-[11px] uppercase tracking-wider text-cyan-400/70">
                              Retrieved chunk{" "}
                              {index + 1}
                            </span>
                          </div>

                          {source.similarity !==
                            undefined && (
                            <span className="text-[10px] font-medium text-white/25">
                              {(
                                Number(
                                  source.similarity
                                ) * 100
                              ).toFixed(1)}
                              % match
                            </span>
                          )}
                        </div>

                        <p className="text-xs leading-6 text-white/35 line-clamp-6">
                          {source.content}
                        </p>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>
            )}
        </div>
      </div>

      {/* =====================================================
          MODE FOOTER
      ====================================================== */}

      <div className="mt-3 flex items-center justify-center">
        <div className="flex items-center gap-2 text-[10px] text-white/15">
          {hasDocument ? (
            <>
              <FiFileText className="w-3 h-3" />

              <span>
                Document-grounded answers use your indexed knowledge base
              </span>
            </>
          ) : (
            <>
              <FiGlobe className="w-3 h-3" />

              <span>
                General AI works without uploading a document
              </span>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}

export default StudyMateChat;