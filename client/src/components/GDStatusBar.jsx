import React from "react";
import { FaSpinner } from "react-icons/fa";
import { FiMessageCircle, FiMic } from "react-icons/fi";

const GDStatusBar = ({
  isAiSpeaking,
  activeAiSpeaker,
  loadingAI,
}) => {
  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        justify-between
        gap-3
        p-3.5
        rounded-[18px]
        border
        border-white/[0.06]
        bg-white/[0.02]
        mb-5
      "
    >
      {/* Left Statuses */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Listening */}
        <div
          className="
            flex
            items-center
            gap-2.5
            px-3.5
            py-2.5
            rounded-xl
            bg-blue-500/[0.06]
            border
            border-blue-500/10
          "
        >
          <FiMic className="w-4 h-4 text-blue-400" />

          <span className="text-xs uppercase tracking-[0.14em] text-blue-400/80">
            Listening
          </span>
        </div>

        {/* AI Speaking / Discussion Open */}
        {isAiSpeaking ? (
          <div
            className="
              flex
              items-center
              gap-2.5
              px-3.5
              py-2.5
              rounded-xl
              bg-violet-500/[0.06]
              border
              border-violet-500/10
            "
          >
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />

            <span className="text-xs uppercase tracking-[0.14em] text-violet-400/80">
              {activeAiSpeaker}
            </span>
          </div>
        ) : (
          <div
            className="
              flex
              items-center
              gap-2.5
              px-3.5
              py-2.5
              rounded-xl
              bg-white/[0.025]
              border
              border-white/[0.06]
            "
          >
            <FiMessageCircle className="w-4 h-4 text-white/35" />

            <span className="text-xs uppercase tracking-[0.14em] text-white/40">
              Discussion open
            </span>
          </div>
        )}
      </div>

      {/* AI Processing */}
      {loadingAI && (
        <div
          className="
            flex
            items-center
            gap-2.5
            px-3.5
            py-2.5
            rounded-xl
            bg-amber-500/[0.05]
            border
            border-amber-500/10
          "
        >
          <FaSpinner className="animate-spin text-amber-400 text-sm" />

          <span className="text-xs uppercase tracking-[0.14em] text-amber-400/80">
            AI processing
          </span>
        </div>
      )}
    </div>
  );
};

export default GDStatusBar;