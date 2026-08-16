import React from "react";

const GDHeader = ({ onExit }) => {
  return (
    <div
      className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        justify-between
        gap-4
        mb-6
        flex-shrink-0
      "
    >
      {/* =====================================================
          LEFT SIDE
      ====================================================== */}

      <div>
        {/* Live Arena */}

        <div className="flex items-center gap-2.5">
          <span className="relative flex w-2.5 h-2.5">
            <span
              className="
                absolute
                inset-0
                rounded-full
                bg-red-400
                animate-ping
                opacity-60
              "
            />

            <span
              className="
                relative
                w-2.5
                h-2.5
                rounded-full
                bg-red-400
              "
            />
          </span>

          <span
            className="
              text-sm
              uppercase
              tracking-[0.2em]
              text-red-400/80
            "
          >
            Live Arena
          </span>
        </div>

        {/* Heading */}

        <h1
          className="
            text-2xl
            sm:text-3xl
            font-semibold
            text-white
            tracking-tight
            mt-2
          "
        >
          Group discussion
        </h1>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="flex items-center gap-2.5">
        {/* =================================================
            CONNECTED STATUS
        ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2.5

            px-3.5
            py-2.5

            rounded-xl

            border
            border-emerald-500/10

            bg-emerald-500/[0.04]
          "
        >
          <span
            className="
              w-2
              h-2
              rounded-full
              bg-emerald-400
              animate-pulse
            "
          />

          <span
            className="
              text-xs
              uppercase
              tracking-[0.14em]
              text-emerald-400/80
            "
          >
            Connected
          </span>
        </div>

        {/* =================================================
            EXIT BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={onExit}
          className="
            cursor-pointer

            px-4
            py-2.5

            rounded-xl

            border
            border-white/[0.07]

            bg-white/[0.025]

            text-xs
            uppercase
            tracking-[0.14em]

            text-white/40

            hover:text-red-400
            hover:border-red-500/20
            hover:bg-red-500/[0.03]

            transition-all
          "
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default GDHeader;