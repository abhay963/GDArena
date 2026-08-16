import React from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiMessageCircle,
} from "react-icons/fi";

const ease = [0.22, 1, 0.36, 1];

const DiscussionStream = ({
  history,
  chatContainerRef,
  isAiSpeaking,
  activeAiSpeaker,
}) => {
  return (
    <div
      className="
        w-full

        h-[850px]
        min-h-[850px]

        rounded-[24px]

        border
        border-white/[0.06]

        bg-white/[0.015]

        overflow-hidden

        flex
        flex-col
      "
    >
      {/* =====================================================
          STREAM HEADER
      ====================================================== */}

      <div
        className="
          flex-shrink-0

          flex
          items-center
          justify-between

          px-5
          py-4

          border-b
          border-white/[0.05]
        "
      >
        <div className="flex items-center gap-3.5">

          {/* Icon */}

          <div
            className="
              w-9
              h-9
              rounded-lg

              bg-white/[0.04]

              border
              border-white/[0.06]

              flex
              items-center
              justify-center
            "
          >
            <FiMessageCircle
              className="
                w-[18px]
                h-[18px]
                text-white/40
              "
            />
          </div>

          {/* Title */}

          <div>
            <p
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              Discussion stream
            </p>

            <p
              className="
                text-xs
                text-white/35
                mt-0.5
              "
            >
              Live conversation transcript
            </p>
          </div>

        </div>

        {/* Live indicator */}

        <div className="flex items-center gap-2.5">

          <FiClock
            className="
              w-4
              h-4
              text-white/25
            "
          />

          <span
            className="
              text-xs
              text-white/35
            "
          >
            Live
          </span>

        </div>
      </div>

      {/* =====================================================
          SCROLLABLE MESSAGE AREA
      ====================================================== */}

      <div
        ref={chatContainerRef}
        className="
          flex-1
          min-h-0

          overflow-y-auto
          overflow-x-hidden

          overscroll-contain

          px-4
          sm:px-5

          py-5

          space-y-4

          pb-8

          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-white/10
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-white/20
        "
      >

        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {history.length === 0 && (
          <div
            className="
              h-full
              flex
              items-center
              justify-center
            "
          >
            <div className="text-center">

              <FiMessageCircle
                className="
                  w-10
                  h-10
                  text-white/15
                  mx-auto
                "
              />

              <p
                className="
                  text-sm
                  text-white/30
                  mt-4
                "
              >
                Waiting for the discussion...
              </p>

            </div>
          </div>
        )}

        {/* ===================================================
            MESSAGES
        ==================================================== */}

        {history.map((msg, index) => {

          const isUser =
            msg.speaker === "You";

          return (
            <motion.div
              key={`${msg.speaker}-${index}`}

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

              className={`
                w-full

                p-4
                sm:p-5

                rounded-[18px]

                border

                ${
                  isUser
                    ? `
                      bg-blue-500/[0.045]
                      border-blue-500/10
                    `
                    : `
                      bg-violet-500/[0.035]
                      border-violet-500/10
                    `
                }
              `}
            >

              <div className="flex gap-3.5">

                {/* =================================================
                    AVATAR
                ================================================== */}

                <div
                  className={`
                    flex-shrink-0

                    w-10
                    h-10

                    rounded-xl

                    flex
                    items-center
                    justify-center

                    text-base

                    border

                    ${
                      isUser
                        ? `
                          bg-blue-500/10
                          border-blue-500/10
                        `
                        : `
                          bg-violet-500/10
                          border-violet-500/10
                        `
                    }
                  `}
                >
                  {msg.avatar}
                </div>

                {/* =================================================
                    MESSAGE CONTENT
                ================================================== */}

                <div className="min-w-0 flex-1">

                  {/* Speaker */}

                  <div className="flex items-center gap-2.5">

                    <p
                      className={`
                        text-xs
                        uppercase
                        tracking-[0.14em]
                        font-semibold

                        ${
                          isUser
                            ? "text-blue-400/90"
                            : "text-violet-400/90"
                        }
                      `}
                    >
                      {msg.speaker}
                    </p>

                    {isUser && (
                      <span
                        className="
                          text-[10px]
                          uppercase
                          tracking-wider
                          text-blue-400/50
                        "
                      >
                        You
                      </span>
                    )}

                  </div>

                  {/* Message */}

                  <p
                    className="
                      text-[15px]

                      text-white/70

                      leading-7

                      mt-2

                      whitespace-pre-wrap

                      break-words
                    "
                  >
                    {msg.text}
                  </p>

                </div>

              </div>

            </motion.div>
          );
        })}

      </div>

      {/* =====================================================
          BOTTOM STATUS
      ====================================================== */}

      <div
        className="
          flex-shrink-0

          px-5
          py-3.5

          border-t
          border-white/[0.05]

          flex
          items-center
          justify-center

          gap-2.5

          bg-[#08080b]/60
        "
      >

        {/* Status dot */}

        <span
          className={`
            w-2
            h-2

            rounded-full

            ${
              isAiSpeaking
                ? "bg-violet-400 animate-pulse"
                : "bg-emerald-400"
            }
          `}
        />

        {/* Status text */}

        <span
          className="
            text-xs
            uppercase
            tracking-[0.16em]
            text-white/35
          "
        >
          {isAiSpeaking
            ? `${activeAiSpeaker} is speaking`
            : "Microphone active — speak naturally"}
        </span>

      </div>

    </div>
  );
};

export default DiscussionStream;