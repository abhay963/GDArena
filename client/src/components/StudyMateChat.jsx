import { AnimatePresence, motion } from "framer-motion";

import {
  FiArrowUpRight,
  FiBookOpen,
  FiCheck,
  FiMessageCircle,
  FiZap,
} from "react-icons/fi";


// =========================================================
// ANIMATION
// =========================================================

const ease = [0.22, 1, 0.36, 1];


// =========================================================
// STUDYMATE CHAT
// =========================================================

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
}) {

  // =======================================================
  // DON'T SHOW CHAT UNTIL DOCUMENT IS READY
  // =======================================================

  if (!documentId) {
    return null;
  }


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
      className="
        max-w-4xl
        mx-auto
        mt-8
      "
    >

      {/* ===================================================
          ACTIVE DOCUMENT BAR
      ==================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-emerald-500/10
          bg-emerald-500/[0.025]
          px-5
          py-4
          mb-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {/* Document status */}

          <div
            className="
              w-9
              h-9
              rounded-lg
              bg-emerald-500/[0.08]
              border
              border-emerald-500/10
              flex
              items-center
              justify-center
            "
          >

            <FiCheck
              className="
                w-4
                h-4
                text-emerald-400
              "
            />

          </div>


          {/* Document information */}

          <div
            className="
              min-w-0
              flex-1
            "
          >

            <p
              className="
                text-xs
                uppercase
                tracking-[0.16em]
                text-emerald-400/60
              "
            >
              Active document
            </p>


            <p
              className="
                mt-1
                text-sm
                font-medium
                text-white/80
                truncate
              "
            >
              {uploadedDocument?.originalName ||
                "Document ready"}
            </p>

          </div>


          {/* Indexed badge */}

          <span
            className="
              hidden
              sm:inline-flex
              items-center
              px-2.5
              py-1
              rounded-full
              bg-emerald-500/[0.08]
              border
              border-emerald-500/10
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-emerald-400
            "
          >
            Indexed
          </span>

        </div>

      </div>


      {/* ===================================================
          MAIN CHAT CARD
      ==================================================== */}

      <div
        className="
          relative
          rounded-[28px]
          border
          border-white/[0.07]
          bg-[#08080b]/90
          overflow-hidden
          shadow-[0_30px_100px_rgba(0,0,0,0.35)]
        "
      >

        {/* Top accent */}

        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-40
            h-px
            bg-gradient-to-r
            from-transparent
            via-cyan-400/60
            to-transparent
          "
        />


        <div className="p-6 sm:p-8">

          {/* =================================================
              HEADER
          ================================================== */}

          <div
            className="
              flex
              items-start
              justify-between
              gap-4
              mb-7
            "
          >

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <FiMessageCircle
                  className="
                    w-4
                    h-4
                    text-cyan-400
                  "
                />

                <span
                  className="
                    text-xs
                    uppercase
                    tracking-[0.18em]
                    text-cyan-400/70
                  "
                >
                  Document grounded AI
                </span>

              </div>


              <h2
                className="
                  mt-2
                  text-xl
                  sm:text-2xl
                  font-semibold
                  tracking-tight
                  text-white
                "
              >
                Ask your document
              </h2>


              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-white/35
                  max-w-xl
                "
              >
                StudyMate will answer using the
                knowledge retrieved from your
                uploaded material.
              </p>

            </div>


            {/* AI icon */}

            <div
              className="
                hidden
                sm:flex
                w-10
                h-10
                rounded-xl
                bg-cyan-500/[0.06]
                border
                border-cyan-500/10
                items-center
                justify-center
              "
            >

              <FiZap
                className="
                  w-4
                  h-4
                  text-cyan-400
                "
              />

            </div>

          </div>


          {/* =================================================
              QUESTION INPUT
          ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.018]
              focus-within:border-violet-400/30
              focus-within:bg-violet-500/[0.025]
              transition-all
              overflow-hidden
            "
          >

            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={(e) => {

                // Enter → Ask
                // Shift + Enter → New line

                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {

                  e.preventDefault();

                  handleAsk();

                }

              }}
              disabled={asking}
              placeholder="Ask anything about your document..."
              rows={3}
              className="
                w-full
                resize-none
                bg-transparent
                outline-none
                px-5
                pt-5
                pb-3
                text-sm
                text-white
                placeholder:text-white/20
              "
            />


            {/* Input footer */}

            <div
              className="
                px-4
                pb-4
                flex
                items-center
                justify-between
                gap-3
              "
            >

              <p
                className="
                  hidden
                  sm:block
                  text-xs
                  text-white/20
                "
              >
                Press Enter to ask · Shift + Enter for a new line
              </p>


              {/* Ask button */}

              <button
                type="button"
                onClick={handleAsk}
                disabled={
                  asking ||
                  !question.trim()
                }
                className="
                  group
                  ml-auto
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-indigo-500
                  hover:from-violet-500
                  hover:to-indigo-400
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  text-sm
                  font-semibold
                  transition-all
                  shadow-[0_8px_25px_rgba(99,102,241,0.12)]
                "
              >

                {asking ? (

                  <>

                    {/* Spinner */}

                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="
                        w-4
                        h-4
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Thinking...

                  </>

                ) : (

                  <>

                    Ask StudyMate

                    <FiArrowUpRight
                      className="
                        w-4
                        h-4
                        group-hover:translate-x-0.5
                        group-hover:-translate-y-0.5
                        transition-transform
                      "
                    />

                  </>

                )}

              </button>

            </div>

          </div>


          {/* =================================================
              ERROR / INFO MESSAGE
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
                className="
                  mt-4
                  rounded-xl
                  border
                  border-red-500/10
                  bg-red-500/[0.035]
                  px-4
                  py-3
                  text-sm
                  text-red-300/70
                "
              >

                {askMessage}

              </motion.div>

            )}

          </AnimatePresence>


          {/* =================================================
              ANSWER
          ================================================== */}

          <AnimatePresence>

            {answer && (

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
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-violet-500/10
                  bg-violet-500/[0.025]
                  overflow-hidden
                "
              >

                {/* =================================================
                    ANSWER HEADER
                ================================================== */}

                <div
                  className="
                    px-5
                    py-4
                    border-b
                    border-white/[0.05]
                    flex
                    items-center
                    gap-2.5
                  "
                >

                  <div
                    className="
                      w-8
                      h-8
                      rounded-lg
                      bg-violet-500/[0.08]
                      border
                      border-violet-500/10
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <FiMessageCircle
                      className="
                        w-4
                        h-4
                        text-violet-400
                      "
                    />

                  </div>


                  <div>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-white/80
                      "
                    >
                      StudyMate
                    </p>


                    <p
                      className="
                        text-[11px]
                        text-white/25
                      "
                    >
                      Grounded answer
                    </p>

                  </div>

                </div>


                {/* =================================================
                    ANSWER BODY
                ================================================== */}

                <div
                  className="
                    px-5
                    sm:px-6
                    py-6
                  "
                >

                  <div
                    className="
                      whitespace-pre-wrap
                      text-sm
                      sm:text-[15px]
                      leading-7
                      text-white/65
                    "
                  >
                    {answer}
                  </div>

                </div>


                {/* =================================================
                    SOURCES
                ================================================== */}

                {sources &&
                  sources.length > 0 && (

                    <div
                      className="
                        border-t
                        border-white/[0.05]
                        px-5
                        sm:px-6
                        py-5
                      "
                    >

                      {/* Sources heading */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          mb-4
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <FiBookOpen
                            className="
                              w-3.5
                              h-3.5
                              text-cyan-400
                            "
                          />

                          <span
                            className="
                              text-xs
                              uppercase
                              tracking-[0.16em]
                              text-white/30
                            "
                          >
                            Retrieved sources
                          </span>

                        </div>


                        <span
                          className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-white/20
                          "
                        >
                          {sources.length} chunks
                        </span>

                      </div>


                      {/* Source list */}

                      <div className="space-y-2.5">

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
                              className="
                                group
                                rounded-xl
                                border
                                border-white/[0.05]
                                bg-white/[0.015]
                                p-4
                                hover:bg-white/[0.025]
                                hover:border-white/[0.08]
                                transition-all
                              "
                            >

                              {/* Source metadata */}

                              <div
                                className="
                                  flex
                                  items-center
                                  justify-between
                                  gap-3
                                  mb-2.5
                                "
                              >

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                  "
                                >

                                  <span
                                    className="
                                      flex
                                      items-center
                                      justify-center
                                      w-5
                                      h-5
                                      rounded-md
                                      bg-violet-500/[0.08]
                                      text-[9px]
                                      font-bold
                                      text-violet-400
                                    "
                                  >
                                    {index + 1}
                                  </span>


                                  <span
                                    className="
                                      text-[11px]
                                      uppercase
                                      tracking-wider
                                      text-violet-400/70
                                    "
                                  >
                                    Source {index + 1}
                                  </span>

                                </div>


                                {/* Similarity */}

                                {source.similarity !==
                                  undefined && (

                                  <span
                                    className="
                                      text-[10px]
                                      font-medium
                                      text-white/25
                                    "
                                  >
                                    {(
                                      Number(
                                        source.similarity
                                      ) * 100
                                    ).toFixed(1)}
                                    % relevance
                                  </span>

                                )}

                              </div>


                              {/* Source content */}

                              <p
                                className="
                                  text-xs
                                  leading-6
                                  text-white/35
                                  line-clamp-6
                                "
                              >
                                {source.content}
                              </p>

                            </motion.div>

                          )
                        )}

                      </div>

                    </div>

                  )}

              </motion.div>

            )}

          </AnimatePresence>

        </div>

      </div>

    </motion.section>
  );
}


export default StudyMateChat;