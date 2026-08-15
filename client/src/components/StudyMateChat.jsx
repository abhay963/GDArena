import { AnimatePresence, motion } from "framer-motion";

import {
  FiArrowUpRight,
  FiBookOpen,
  FiCheck,
  FiDatabase,
  FiFileText,
  FiGlobe,
  FiLoader,
  FiMessageCircle,
  FiSearch,

} from "react-icons/fi";

const ease = [0.22, 1, 0.36, 1];

/* =========================================================
   MESSAGE BUBBLE
========================================================= */

function MessageBubble({ message, index }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.03, 0.15),
        ease,
      }}
      className={`flex gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="shrink-0 pt-1">
          <div className="w-8 h-8 rounded-xl border border-violet-400/10 bg-violet-500/[0.08] flex items-center justify-center">
            <FiBookOpen className="w-3.5 h-3.5 text-violet-300" />
          </div>
        </div>
      )}

      <div
        className={`max-w-[88%] sm:max-w-[78%] ${
          isUser
            ? "items-end"
            : "items-start"
        } flex flex-col`}
      >
        <div
          className={`rounded-2xl px-4 py-3.5 ${
            isUser
              ? "rounded-br-md bg-gradient-to-br from-violet-600/90 to-violet-500/80 text-white shadow-[0_10px_30px_rgba(139,92,246,0.10)]"
              : "rounded-bl-md border border-white/[0.06] bg-white/[0.025] text-white/65"
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-7">
            {message.content}
          </p>
        </div>

        <span
          className={`mt-1.5 text-[9px] text-white/15 ${
            isUser
              ? "mr-1"
              : "ml-1"
          }`}
        >
          {isUser
            ? "You"
            : "StudyMate"}
        </span>
      </div>
    </motion.div>
  );
}

/* =========================================================
   EMPTY CHAT
========================================================= */

function EmptyChat({
  hasDocument,
  isReady,
  question,
  setQuestion,
}) {
  const documentSuggestions = [
    "Summarize this document",
    "Explain the main concepts",
    "Give me the important points",
    "Create exam questions from this",
  ];

  const generalSuggestions = [
    "Explain DSA",
    "Help me with DBMS",
    "Explain recursion",
    "Practice interview questions",
  ];

  const suggestions = hasDocument
    ? documentSuggestions
    : generalSuggestions;

  return (
    <div className="flex-1 flex items-center justify-center px-5 py-14">
      <div className="max-w-xl w-full text-center">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.94,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.45,
            ease,
          }}
          className="mx-auto w-14 h-14 rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.10] to-cyan-500/[0.05] flex items-center justify-center"
        >
          {hasDocument ? (
            <FiFileText className="w-6 h-6 text-cyan-300/70" />
          ) : (
            <FiMessageCircle className="w-6 h-6 text-violet-300/70" />
          )}
        </motion.div>

        <motion.h3
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.08,
            ease,
          }}
          className="mt-5 text-xl font-semibold text-white/85"
        >
          {hasDocument
            ? isReady
              ? "Ask anything about your document"
              : "Your document is being prepared"
            : "What do you want to learn?"}
        </motion.h3>

        <motion.p
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.13,
            ease,
          }}
          className="mt-2 text-sm leading-6 text-white/25 max-w-md mx-auto"
        >
          {hasDocument
            ? isReady
              ? "Ask StudyMate questions and get answers grounded in your uploaded material."
              : "You can continue after indexing finishes."
            : "Start a conversation with StudyMate or upload a document to get grounded answers."}
        </motion.p>

        {isReady || !hasDocument ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.18,
              ease,
            }}
            className="mt-7 flex flex-wrap justify-center gap-2"
          >
            {suggestions.map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() =>
                    setQuestion(
                      suggestion
                    )
                  }
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-[11px] text-white/30 hover:text-white/65 hover:border-violet-400/15 hover:bg-violet-500/[0.04] transition-all"
                >
                  <span>
                    {suggestion}
                  </span>

                  <FiArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all" />
                </button>
              )
            )}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

/* =========================================================
   THINKING INDICATOR
========================================================= */

function ThinkingIndicator() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="flex gap-3"
    >
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-xl border border-violet-400/10 bg-violet-500/[0.08] flex items-center justify-center">
          <FiBookOpen className="w-3.5 h-3.5 text-violet-300" />
        </div>
      </div>

      <div className="rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.025] px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            {[0, 1, 2].map(
              (dot) => (
                <motion.span
                  key={dot}
                  className="w-1.5 h-1.5 rounded-full bg-violet-400/60"
                  animate={{
                    opacity: [
                      0.2,
                      1,
                      0.2,
                    ],
                    y: [
                      0,
                      -2,
                      0,
                    ],
                  }}
                  transition={{
                    duration: 0.9,
                    delay:
                      dot * 0.15,
                    repeat: Infinity,
                  }}
                />
              )
            )}
          </div>

          <span className="text-[11px] text-white/25">
            StudyMate is thinking...
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   SOURCES
========================================================= */

function SourcesPanel({
  sources,
}) {
  if (
    !sources ||
    sources.length === 0
  ) {
    return null;
  }

  return (
    <motion.div
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
        ease,
      }}
      className="mt-3 rounded-2xl border border-cyan-400/[0.08] bg-cyan-400/[0.02] overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiDatabase className="w-3.5 h-3.5 text-cyan-400/70" />

          <span className="text-[10px] uppercase tracking-[0.16em] text-white/25">
            Sources used
          </span>
        </div>

        <span className="text-[9px] text-white/15">
          {sources.length}{" "}
          {sources.length === 1
            ? "source"
            : "sources"}
        </span>
      </div>

      <div className="p-3 space-y-2">
        {sources.map(
          (source, index) => (
            <div
              key={
                source.id ||
                index
              }
              className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3.5 hover:bg-white/[0.025] transition"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-cyan-500/[0.08] text-cyan-300/70 flex items-center justify-center text-[9px] font-semibold">
                    {index + 1}
                  </span>

                  <span className="text-[9px] uppercase tracking-wider text-cyan-300/45">
                    Retrieved context
                  </span>
                </div>

                {source.similarity !==
                  undefined && (
                  <span className="text-[9px] text-white/20">
                    {(
                      Number(
                        source.similarity
                      ) * 100
                    ).toFixed(1)}
                    % match
                  </span>
                )}
              </div>

              <p className="text-[11px] leading-5 text-white/30 line-clamp-5">
                {source.content}
              </p>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}

/* =========================================================
   INPUT AREA
========================================================= */

function ChatInput({
  question,
  setQuestion,
  handleAsk,
  asking,
  hasDocument,
  isReady,
  isProcessing,
  isFailed,
}) {
  const disabled =
    asking ||
    isProcessing ||
    isFailed ||
    (hasDocument &&
      !isReady);

  return (
    <div className="border-t border-white/[0.06] bg-[#09090d]/95 backdrop-blur-xl p-3 sm:p-4">
      <div
        className={`rounded-2xl border bg-white/[0.015] transition-all ${
          disabled
            ? "border-white/[0.05]"
            : hasDocument
            ? "border-cyan-400/[0.08] focus-within:border-cyan-400/20"
            : "border-violet-400/[0.08] focus-within:border-violet-400/20"
        }`}
      >
        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(
              event.target.value
            )
          }
          onKeyDown={(event) => {
            if (
              event.key ===
                "Enter" &&
              !event.shiftKey
            ) {
              event.preventDefault();

              if (
                !disabled &&
                question.trim()
              ) {
                handleAsk();
              }
            }
          }}
          disabled={disabled}
          rows={2}
          placeholder={
            hasDocument
              ? isReady
                ? "Ask anything about your document..."
                : "Waiting for your document to finish processing..."
              : "Ask StudyMate anything..."
          }
          className="w-full resize-none bg-transparent outline-none px-4 pt-4 pb-2 text-sm leading-6 text-white/80 placeholder:text-white/20 disabled:cursor-not-allowed"
        />

        <div className="px-3 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {hasDocument ? (
              <>
                <FiBookOpen className="w-3 h-3 text-cyan-400/50 shrink-0" />

                <span className="text-[10px] text-white/20 truncate">
                  {isReady
                    ? "Grounded in your document"
                    : "Document indexing in progress"}
                </span>
              </>
            ) : (
              <>
                <FiGlobe className="w-3 h-3 text-violet-400/50 shrink-0" />

                <span className="text-[10px] text-white/20">
                  General AI
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleAsk}
            disabled={
              disabled ||
              !question.trim()
            }
            className={`shrink-0 h-9 px-4 rounded-xl inline-flex items-center gap-2 text-xs font-semibold transition-all ${
              hasDocument
                ? "bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500"
                : "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400"
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {asking ? (
              <>
                <FiLoader className="w-3.5 h-3.5 animate-spin" />

                <span className="hidden sm:inline">
                  Thinking
                </span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">
                  Ask StudyMate
                </span>

                <FiArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-[9px] text-white/10">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}

/* =========================================================
   MAIN CHAT COMPONENT
========================================================= */

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
  chatMessages,
}) {
  const hasDocument =
    Boolean(documentId);

  const isReady =
    uploadedDocument?.status ===
    "completed";

  const isProcessing =
    uploadedDocument?.status ===
    "processing";

  const isFailed =
    uploadedDocument?.status ===
    "failed";

  /*
   * Use persisted chat messages when available.
   * If there are no persisted messages yet,
   * use the generated answer fallback.
   */

  const messages =
    chatMessages || [];

  return (
    <section className="rounded-[24px] border border-white/[0.07] bg-[#09090d]/90 backdrop-blur-xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
      {/* ===================================================
          CHAT HEADER
      ==================================================== */}

      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/15 to-cyan-500/[0.08] border border-violet-400/10 flex items-center justify-center">
              <FiBookOpen className="w-4 h-4 text-violet-300" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white/85">
                  StudyMate
                </h3>

                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/[0.07] border border-emerald-400/10 text-[8px] uppercase tracking-wider text-emerald-300/50">
                  AI
                </span>
              </div>

              <p className="text-[10px] text-white/20 mt-0.5">
                {hasDocument
                  ? "Document conversation"
                  : "General conversation"}
              </p>
            </div>
          </div>

          {hasDocument && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-400/[0.08] bg-cyan-400/[0.025]">
              <FiFileText className="w-3 h-3 text-cyan-300/50" />

              <span className="text-[9px] text-cyan-300/40">
                RAG enabled
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          CONVERSATION
      ==================================================== */}

      <div className="min-h-[430px] max-h-[650px] overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <EmptyChat
            hasDocument={
              hasDocument
            }
            isReady={isReady}
            question={question}
            setQuestion={
              setQuestion
            }
          />
        ) : (
          <div className="px-4 sm:px-6 py-6 space-y-6">
            {messages.map(
              (message, index) => (
                <div key={message.id || index}>
                  <MessageBubble
                    message={
                      message
                    }
                    index={index}
                  />

                  {/* Show sources after the latest assistant message */}

                  {!(
                    message.role ===
                    "user"
                  ) &&
                    index ===
                      messages.length -
                        1 &&
                    sources?.length >
                      0 && (
                      <div className="ml-11 max-w-[88%] sm:max-w-[78%]">
                        <SourcesPanel
                          sources={
                            sources
                          }
                        />
                      </div>
                    )}
                </div>
              )
            )}

            {/* Thinking */}

            {asking && (
              <ThinkingIndicator />
            )}
          </div>
        )}

        {/* =================================================
            ERROR
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
                y: 6,
              }}
              className="mx-4 sm:mx-6 mb-4 rounded-xl border border-red-500/[0.10] bg-red-500/[0.025] px-4 py-3"
            >
              <p className="text-[11px] leading-5 text-red-300/60">
                {askMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================
            FALLBACK ANSWER
        ================================================== */}

        {answer &&
          messages.length ===
            0 && (
            <div className="px-4 sm:px-6 pb-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 shrink-0 rounded-xl border border-violet-400/10 bg-violet-500/[0.08] flex items-center justify-center">
                  <FiBookOpen className="w-3.5 h-3.5 text-violet-300" />
                </div>

                <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.025] px-4 py-3.5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-white/65">
                    {answer}
                  </p>

                  <SourcesPanel
                    sources={
                      sources
                    }
                  />
                </div>
              </div>
            </div>
          )}
      </div>

      {/* ===================================================
          INPUT
      ==================================================== */}

      <ChatInput
        question={question}
        setQuestion={
          setQuestion
        }
        handleAsk={
          handleAsk
        }
        asking={asking}
        hasDocument={
          hasDocument
        }
        isReady={isReady}
        isProcessing={
          isProcessing
        }
        isFailed={isFailed}
      />
    </section>
  );
}

export default StudyMateChat;