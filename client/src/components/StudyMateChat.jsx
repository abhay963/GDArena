import { AnimatePresence, motion } from "framer-motion";

import {
  FiArrowUpRight,
  FiBookOpen,
  FiCheck,
  FiMessageCircle,
  FiZap,
  FiUser,
  FiClock,
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
  if (!documentId) {
    return null;
  }

  const isReady =
    uploadedDocument?.status === "completed";

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
          className={`flex gap-3 max-w-[92%] sm:max-w-[82%] ${
            isUser
              ? "flex-row-reverse"
              : ""
          }`}
        >
          <div
            className={`shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center ${
              isUser
                ? "bg-violet-500/[0.10] border-violet-500/15 text-violet-300"
                : "bg-cyan-500/[0.07] border-cyan-500/10 text-cyan-300"
            }`}
          >
            {isUser ? (
              <FiUser className="w-4 h-4" />
            ) : (
              <FiZap className="w-4 h-4" />
            )}
          </div>

          <div
            className={`min-w-0 ${
              isUser
                ? "items-end"
                : "items-start"
            } flex flex-col`}
          >
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
      className="w-full mt-8"
    >
      <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.025] px-5 py-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/10 flex items-center justify-center">
            {isReady ? (
              <FiCheck className="w-4 h-4 text-emerald-400" />
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
                className="w-4 h-4 rounded-full border-2 border-white/10 border-t-emerald-400"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-400/60">
              Active document
            </p>

            <p className="mt-1 text-sm font-medium text-white/80 truncate">
              {uploadedDocument?.originalName ||
                "Document"}
            </p>
          </div>

          <span
            className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${
              isReady
                ? "bg-emerald-500/[0.08] border-emerald-500/10 text-emerald-400"
                : "bg-violet-500/[0.08] border-violet-500/10 text-violet-300"
            }`}
          >
            {isReady
              ? "Indexed"
              : "Processing"}
          </span>
        </div>
      </div>

      <div className="relative rounded-[28px] border border-white/[0.07] bg-[#08080b]/90 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4 mb-7">
            <div>
              <div className="flex items-center gap-2">
                <FiMessageCircle className="w-4 h-4 text-cyan-400" />

                <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-400/70">
                  Persistent conversation
                </span>
              </div>

              <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-white">
                Ask your document
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/35 max-w-xl">
                Continue where you left off. Your
                conversation stays attached to this
                document.
              </p>
            </div>

            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/10 items-center justify-center">
              <FiZap className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

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
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-3.5 h-3.5 text-violet-400/70" />

                    <span className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                      Conversation history
                    </span>
                  </div>

                  <span className="text-[10px] text-white/15">
                    {chatMessages.length}{" "}
                    {chatMessages.length === 1
                      ? "message"
                      : "messages"}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/[0.05] bg-black/20 p-4 sm:p-5">
                  <div className="space-y-5 max-h-[520px] overflow-y-auto pr-1">
                    {chatMessages.map(
                      renderMessage
                    )}

                    {asking && (
                      <motion.div
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-9 h-9 shrink-0 rounded-xl bg-cyan-500/[0.07] border border-cyan-500/10 flex items-center justify-center">
                          <FiZap className="w-4 h-4 text-cyan-300" />
                        </div>

                        <div className="rounded-2xl rounded-tl-md bg-white/[0.025] border border-white/[0.06] px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <motion.span
                              animate={{
                                opacity: [
                                  0.25,
                                  1,
                                  0.25,
                                ],
                              }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                              }}
                              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                            />

                            <motion.span
                              animate={{
                                opacity: [
                                  0.25,
                                  1,
                                  0.25,
                                ],
                              }}
                              transition={{
                                duration: 1.2,
                                delay: 0.2,
                                repeat: Infinity,
                              }}
                              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                            />

                            <motion.span
                              animate={{
                                opacity: [
                                  0.25,
                                  1,
                                  0.25,
                                ],
                              }}
                              transition={{
                                duration: 1.2,
                                delay: 0.4,
                                repeat: Infinity,
                              }}
                              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                            />

                            <span className="ml-2 text-[11px] text-white/25">
                              StudyMate is thinking
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

          {chatMessages.length === 0 &&
            !asking && (
              <div className="mb-6 rounded-2xl border border-dashed border-white/[0.07] bg-white/[0.012] px-5 py-10 text-center">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-violet-500/[0.07] border border-violet-500/10 flex items-center justify-center">
                  <FiMessageCircle className="w-5 h-5 text-violet-300/70" />
                </div>

                <p className="mt-4 text-sm text-white/45">
                  Start a conversation
                </p>

                <p className="mt-1.5 text-xs text-white/20">
                  Ask anything about the content of
                  this document.
                </p>
              </div>
            )}

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] focus-within:border-violet-400/30 focus-within:bg-violet-500/[0.025] transition-all overflow-hidden">
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
                    question.trim()
                  ) {
                    handleAsk();
                  }
                }
              }}
              disabled={
                asking ||
                !isReady
              }
              placeholder={
                isReady
                  ? "Ask anything about your document..."
                  : "Your document is still being prepared..."
              }
              rows={3}
              className="w-full resize-none bg-transparent outline-none px-5 pt-5 pb-3 text-sm text-white placeholder:text-white/20 disabled:cursor-not-allowed"
            />

            <div className="px-4 pb-4 flex items-center justify-between gap-3">
              <p className="hidden sm:block text-[11px] text-white/20">
                Enter to ask · Shift + Enter for
                new line
              </p>

              <button
                type="button"
                onClick={handleAsk}
                disabled={
                  asking ||
                  !question.trim() ||
                  !isReady
                }
                className="group ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold transition-all shadow-[0_8px_25px_rgba(99,102,241,0.12)]"
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
                    Ask StudyMate

                    <FiArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

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
                        Grounded answer
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

          {sources &&
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
                <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FiBookOpen className="w-3.5 h-3.5 text-cyan-400" />

                    <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                      Retrieved sources
                    </span>
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-white/20">
                    {sources.length} chunks
                  </span>
                </div>

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
                        className="group rounded-xl border border-white/[0.05] bg-white/[0.015] p-4 hover:bg-white/[0.025] hover:border-white/[0.08] transition-all"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-violet-500/[0.08] text-[9px] font-bold text-violet-400">
                              {index + 1}
                            </span>

                            <span className="text-[11px] uppercase tracking-wider text-violet-400/70">
                              Source{" "}
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
                              % relevance
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
    </motion.section>
  );
}

export default StudyMateChat;