import { motion } from "framer-motion";

import {
  FiArrowRight,
  FiBookOpen,
  FiCpu,
  FiDatabase,
  FiFileText,
  FiSearch,
  FiZap,
} from "react-icons/fi";

const ease = [0.22, 1, 0.36, 1];

/* =========================================================
   FEATURE DATA
========================================================= */

const features = [
  {
    number: "01",
    icon: FiFileText,
    label: "YOUR MATERIAL",
    title: "Bring your study material",
    description:
      "Upload PDFs, notes and slides. StudyMate turns your static material into searchable knowledge.",
    accent: "violet",
  },
  {
    number: "02",
    icon: FiSearch,
    label: "SMART RETRIEVAL",
    title: "Find the right context",
    description:
      "Relevant passages are retrieved from your material before StudyMate generates an answer.",
    accent: "cyan",
  },
  {
    number: "03",
    icon: FiBookOpen,
    label: "GROUNDED AI",
    title: "Ask naturally",
    description:
      "Ask questions in your own words and get clear answers grounded in your uploaded material.",
    accent: "emerald",
  },
];

/* =========================================================
   COLORS
========================================================= */

const accentStyles = {
  violet: {
    icon:
      "text-violet-300 bg-violet-500/[0.07] border-violet-400/10",

    glow:
      "bg-violet-500/[0.10]",

    line:
      "via-violet-400/40",

    text:
      "text-violet-300/70",
  },

  cyan: {
    icon:
      "text-cyan-300 bg-cyan-500/[0.07] border-cyan-400/10",

    glow:
      "bg-cyan-500/[0.10]",

    line:
      "via-cyan-400/40",

    text:
      "text-cyan-300/70",
  },

  emerald: {
    icon:
      "text-emerald-300 bg-emerald-500/[0.07] border-emerald-400/10",

    glow:
      "bg-emerald-500/[0.10]",

    line:
      "via-emerald-400/40",

    text:
      "text-emerald-300/70",
  },
};

/* =========================================================
   AMBIENT BACKGROUND
========================================================= */

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* Violet ambient */}

      <motion.div
        animate={{
          x: [0, 45, 0],
          y: [0, -25, 0],
          opacity: [0.22, 0.4, 0.22],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -top-40
          left-[8%]
          w-[480px]
          h-[320px]
          rounded-full
          bg-violet-600/[0.05]
          blur-[120px]
        "
      />

      {/* Cyan ambient */}

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          opacity: [0.16, 0.3, 0.16],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          top-[25%]
          right-[0%]
          w-[420px]
          h-[300px]
          rounded-full
          bg-cyan-500/[0.04]
          blur-[120px]
        "
      />

      {/* Emerald ambient */}

      <motion.div
        animate={{
          x: [0, 25, 0],
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-0
          left-[35%]
          w-[350px]
          h-[220px]
          rounded-full
          bg-emerald-500/[0.025]
          blur-[100px]
        "
      />

      {/* Grid */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.015]
          bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]
          bg-[size:44px_44px]
        "
      />
    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  feature,
  index,
}) {
  const Icon = feature.icon;

  const styles =
    accentStyles[feature.accent];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease,
      }}
      whileHover={{
        y: -5,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.07]
        bg-[#09090d]/90
        p-6
        sm:p-7
        transition-all
        duration-500
        hover:border-white/[0.13]
        hover:bg-[#0b0b10]
        hover:shadow-[0_25px_70px_rgba(0,0,0,0.25)]
      "
    >
      {/* Hover glow */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        whileHover={{
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className={`
          pointer-events-none
          absolute
          -right-24
          -top-24
          w-56
          h-56
          rounded-full
          blur-[80px]
          ${styles.glow}
        `}
      />

      {/* Top shine */}

      <div
        className="
          absolute
          top-0
          left-10
          right-10
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/[0.09]
          to-transparent
        "
      />

      {/* Header */}

      <div
        className="
          relative
          flex
          items-center
          justify-between
          mb-8
        "
      >
        <motion.div
          whileHover={{
            scale: 1.06,
            rotate: 2,
          }}
          transition={{
            duration: 0.25,
          }}
          className={`
            relative
            w-12
            h-12
            rounded-[15px]
            border
            flex
            items-center
            justify-center
            ${styles.icon}
          `}
        >
          <Icon className="w-5 h-5" />

          <div
            className="
              absolute
              top-0
              left-2
              right-2
              h-px
              bg-white/10
            "
          />
        </motion.div>

        <span
          className="
            text-[9px]
            font-mono
            tracking-[0.16em]
            text-white/15
          "
        >
          {feature.number}
        </span>
      </div>

      {/* Label */}

      <p
        className="
          relative
          text-[9px]
          uppercase
          tracking-[0.18em]
          text-white/25
          mb-2.5
        "
      >
        {feature.label}
      </p>

      {/* Bigger heading */}

      <h3
        className="
          relative
          text-[20px]
          sm:text-[21px]
          font-semibold
          tracking-[-0.025em]
          leading-tight
          text-white/85
        "
      >
        {feature.title}
      </h3>

      {/* Description */}

      <p
        className="
          relative
          mt-3
          text-[13px]
          leading-6
          text-white/30
        "
      >
        {feature.description}
      </p>

      {/* Bottom */}

      <div
        className="
          relative
          mt-8
          h-px
          bg-white/[0.04]
          overflow-hidden
        "
      >
        <motion.div
          initial={{
            width: 0,
          }}
          whileHover={{
            width: "60%",
          }}
          transition={{
            duration: 0.5,
            ease,
          }}
          className={`
            absolute
            inset-y-0
            left-0
            bg-gradient-to-r
            from-transparent
            ${styles.line}
            to-transparent
          `}
        />
      </div>
    </motion.div>
  );
}

/* =========================================================
   DATA PARTICLE
========================================================= */

function DataParticle({
  delay = 0,
  duration = 3,
  offset = 0,
}) {
  return (
    <motion.div
      animate={{
        left: [
          `${offset}%`,
          `${100 + offset}%`,
        ],
        opacity: [
          0,
          1,
          1,
          0,
        ],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeInOut",
      }}
      className="
        absolute
        top-1/2
        -translate-y-1/2
        w-2
        h-2
        -ml-1
        rounded-full
        bg-white
        shadow-[0_0_8px_rgba(255,255,255,0.95),0_0_20px_rgba(139,92,246,0.7)]
      "
    />
  );
}

/* =========================================================
   ENERGY CONNECTION
========================================================= */

function EnergyConnection({
  delay = 0,
}) {
  return (
    <div
      className="
        relative
        hidden
        md:block
        flex-1
        max-w-[170px]
        h-12
      "
    >
      {/* Base */}

      <div
        className="
          absolute
          top-1/2
          left-0
          right-0
          h-px
          -translate-y-1/2
          bg-white/[0.06]
        "
      />

      {/* Gradient energy */}

      <motion.div
        animate={{
          opacity: [
            0.15,
            0.35,
            0.15,
          ],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          top-1/2
          left-0
          right-0
          h-px
          -translate-y-1/2
          bg-gradient-to-r
          from-violet-400/10
          via-cyan-400/25
          to-emerald-400/10
        "
      />

      {/* Main particle */}

      <motion.div
        animate={{
          left: [
            "-2%",
            "102%",
          ],
          opacity: [
            0,
            1,
            1,
            0,
          ],
        }}
        transition={{
          duration: 2.8,
          delay,
          repeat: Infinity,
          repeatDelay: 0.7,
          ease: "easeInOut",
        }}
        className="
          absolute
          top-1/2
          -translate-y-1/2
          -translate-x-1/2
          w-2.5
          h-2.5
          rounded-full
          bg-white
          shadow-[0_0_8px_rgba(255,255,255,1),0_0_25px_rgba(139,92,246,0.85)]
        "
      >
        {/* Particle trail */}

        <div
          className="
            absolute
            right-1/2
            top-1/2
            -translate-y-1/2
            w-16
            h-px
            bg-gradient-to-r
            from-transparent
            via-violet-300/40
            to-white/70
          "
        />

        {/* Cross sparkle */}

        <motion.div
          animate={{
            opacity: [
              0.2,
              1,
              0.2,
            ],
            scale: [
              0.7,
              1.2,
              0.7,
            ],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
          }}
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-7
            h-7
          "
        >
          <div
            className="
              absolute
              left-1/2
              top-0
              bottom-0
              w-px
              -translate-x-1/2
              bg-white/70
            "
          />

          <div
            className="
              absolute
              top-1/2
              left-0
              right-0
              h-px
              -translate-y-1/2
              bg-white/70
            "
          />
        </motion.div>
      </motion.div>

      {/* Smaller particles */}

      <DataParticle
        delay={delay + 0.5}
        duration={3.2}
        offset={5}
      />

      <DataParticle
        delay={delay + 1.2}
        duration={3}
        offset={8}
      />

      {/* Floating data packet */}

      <motion.div
        animate={{
          left: [
            "5%",
            "95%",
          ],
          opacity: [
            0,
            0.5,
            0,
          ],
        }}
        transition={{
          duration: 3.5,
          delay: delay + 0.8,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
        className="
          absolute
          top-[32%]
          -translate-y-1/2
          w-1
          h-1
          rounded-full
          bg-cyan-300
          shadow-[0_0_8px_rgba(103,232,249,0.8)]
        "
      />
    </div>
  );
}

/* =========================================================
   MOBILE ENERGY
========================================================= */

function MobileEnergy({
  delay = 0,
}) {
  return (
    <div
      className="
        md:hidden
        relative
        w-px
        h-14
        bg-white/[0.06]
      "
    >
      <motion.div
        animate={{
          top: [
            "-10%",
            "110%",
          ],
          opacity: [
            0,
            1,
            1,
            0,
          ],
        }}
        transition={{
          duration: 2,
          delay,
          repeat: Infinity,
          repeatDelay: 0.8,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-1/2
          -translate-x-1/2
          w-2
          h-2
          rounded-full
          bg-white
          shadow-[0_0_10px_rgba(255,255,255,1),0_0_20px_rgba(139,92,246,0.8)]
        "
      />
    </div>
  );
}

/* =========================================================
   PIPELINE NODE
========================================================= */

function PipelineNode({
  icon: Icon,
  title,
  subtitle,
  accent,
  number,
  status,
}) {
  const styles =
    accentStyles[accent];

  const active =
    status === "active";

  const complete =
    status === "complete";

  return (
    <motion.div
      animate={{
        y: active
          ? [0, -3, 0]
          : 0,
      }}
      transition={{
        duration: 2.5,
        repeat: active
          ? Infinity
          : 0,
        ease: "easeInOut",
      }}
      className="
        relative
        flex
        flex-col
        items-center
        text-center
        min-w-[145px]
      "
    >
      {/* Outer ring */}

      <motion.div
        animate={{
          rotate: active
            ? 360
            : 0,
          opacity: active
            ? 0.7
            : 0,
        }}
        transition={{
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
          opacity: {
            duration: 0.4,
          },
        }}
        className="
          absolute
          -inset-3
          rounded-[21px]
          border
          border-dashed
          border-violet-400/15
        "
      />

      {/* Glow */}

      <motion.div
        animate={{
          opacity: active
            ? [0.15, 0.4, 0.15]
            : complete
            ? 0.12
            : 0,
          scale: active
            ? [1, 1.14, 1]
            : 1,
        }}
        transition={{
          duration: 2.4,
          repeat: active
            ? Infinity
            : 0,
          ease: "easeInOut",
        }}
        className={`
          absolute
          -inset-8
          rounded-full
          blur-2xl
          ${styles.glow}
        `}
      />

      {/* Main node */}

      <motion.div
        animate={{
          boxShadow: active
            ? [
                "0 0 0 rgba(139,92,246,0)",
                "0 0 35px rgba(139,92,246,0.16)",
                "0 0 0 rgba(139,92,246,0)",
              ]
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{
          duration: 2.5,
          repeat: active
            ? Infinity
            : 0,
        }}
        className="
          relative
          w-[64px]
          h-[64px]
          rounded-[19px]
          border
          border-white/[0.08]
          bg-[#0a0b0f]
          flex
          items-center
          justify-center
          shadow-[0_12px_35px_rgba(0,0,0,0.3)]
        "
      >
        {/* Inner gradient */}

        <div
          className="
            absolute
            inset-0
            rounded-[19px]
            bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_55%)]
          "
        />

        <Icon
          className="
            relative
            w-6
            h-6
            text-white/60
          "
        />

        {/* Status dot */}

        <motion.div
          animate={{
            scale: active
              ? [0.7, 1, 0.7]
              : 1,
            opacity: active
              ? [0.4, 1, 0.4]
              : complete
              ? 0.8
              : 0.2,
          }}
          transition={{
            duration: 1.7,
            repeat: active
              ? Infinity
              : 0,
          }}
          className="
            absolute
            -right-1
            -top-1
            w-2.5
            h-2.5
            rounded-full
            bg-violet-300
            border-2
            border-[#0a0b0f]
            shadow-[0_0_10px_rgba(167,139,250,0.8)]
          "
        />
      </motion.div>

      {/* Number */}

      <span
        className="
          mt-4
          text-[8px]
          uppercase
          tracking-[0.18em]
          text-white/15
        "
      >
        STEP {number}
      </span>

      {/* BIG TITLE */}

      <h3
        className={`
          mt-1.5
          text-[18px]
          sm:text-[19px]
          font-semibold
          tracking-[-0.025em]
          transition-colors
          duration-500
          ${
            active
              ? "text-white/90"
              : "text-white/55"
          }
        `}
      >
        {title}
      </h3>

      {/* Subtitle */}

      <p
        className="
          mt-1.5
          text-[10px]
          sm:text-[11px]
          text-white/22
        "
      >
        {subtitle}
      </p>

      {/* Active status */}

      <motion.div
        animate={{
          opacity: active
            ? 1
            : 0.25,
        }}
        className="
          mt-3
          flex
          items-center
          gap-1.5
        "
      >
        <span
          className="
            w-1
            h-1
            rounded-full
            bg-emerald-400
          "
        />

        <span
          className="
            text-[8px]
            uppercase
            tracking-[0.14em]
            text-white/20
          "
        >
          {active
            ? "Processing"
            : "Ready"}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   RETRIEVAL SCAN
========================================================= */

function RetrievalScan() {
  return (
    <div
      className="
        relative
        mt-8
        rounded-[16px]
        border
        border-cyan-400/[0.07]
        bg-cyan-400/[0.018]
        px-4
        py-3.5
        overflow-hidden
      "
    >
      {/* Scanning light */}

      <motion.div
        animate={{
          x: [
            "-120%",
            "220%",
          ],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
        className="
          absolute
          inset-y-0
          w-24
          bg-gradient-to-r
          from-transparent
          via-cyan-300/[0.08]
          to-transparent
          skew-x-[-20deg]
        "
      />

      <div
        className="
          relative
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            relative
            w-8
            h-8
            rounded-lg
            border
            border-cyan-400/10
            bg-cyan-400/[0.04]
            flex
            items-center
            justify-center
          "
        >
          <FiSearch
            className="
              w-3.5
              h-3.5
              text-cyan-300/65
            "
          />

          <motion.div
            animate={{
              scale: [0.7, 1.2, 0.7],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="
              absolute
              -right-1
              -top-1
              w-2
              h-2
              rounded-full
              bg-cyan-300
              shadow-[0_0_8px_rgba(103,232,249,0.7)]
            "
          />
        </div>

        <div className="flex-1">
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.16em]
                text-white/25
              "
            >
              Retrieval
            </span>

            <span
              className="
                text-[8px]
                text-cyan-300/40
              "
            >
              03 relevant chunks found
            </span>
          </div>

          {/* Scan bars */}

          <div
            className="
              mt-2.5
              flex
              items-center
              gap-1
            "
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
              (item) => (
                <motion.div
                  key={item}
                  animate={{
                    opacity: [
                      0.15,
                      item % 3 === 0
                        ? 0.9
                        : 0.45,
                      0.15,
                    ],
                    scaleY: [
                      0.5,
                      item % 2 === 0
                        ? 1
                        : 0.75,
                      0.5,
                    ],
                  }}
                  transition={{
                    duration: 1.3,
                    delay:
                      item * 0.06,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    h-1
                    flex-1
                    rounded-full
                    bg-cyan-400/35
                    origin-center
                  "
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   AI RESPONSE VISUAL
========================================================= */

function AIResponseVisual() {
  return (
    <div
      className="
        relative
        mt-3
        rounded-[16px]
        border
        border-emerald-400/[0.06]
        bg-emerald-400/[0.012]
        px-4
        py-3.5
        overflow-hidden
      "
    >
      {/* Moving response beam */}

      <motion.div
        animate={{
          x: [
            "-120%",
            "220%",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
        className="
          absolute
          inset-y-0
          w-28
          bg-gradient-to-r
          from-transparent
          via-emerald-300/[0.06]
          to-transparent
          skew-x-[-20deg]
        "
      />

      <div className="relative flex items-center gap-3">
        <div
          className="
            w-8
            h-8
            shrink-0
            rounded-lg
            border
            border-emerald-400/10
            bg-emerald-400/[0.04]
            flex
            items-center
            justify-center
          "
        >
          <FiDatabase
            className="
              w-3.5
              h-3.5
              text-emerald-300/60
            "
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.16em]
                text-white/25
              "
            >
              Grounded response
            </span>

            <span
              className="
                text-[8px]
                text-emerald-300/40
              "
            >
              context verified
            </span>
          </div>

          {/* Response waveform */}

          <div
            className="
              mt-2.5
              flex
              items-center
              gap-[3px]
              h-3
            "
          >
            {[2, 5, 8, 4, 10, 6, 12, 7, 4, 9, 5, 3, 7, 10, 5, 3].map(
              (height, index) => (
                <motion.div
                  key={index}
                  animate={{
                    height: [
                      `${height * 0.45}px`,
                      `${height}px`,
                      `${height * 0.45}px`,
                    ],
                    opacity: [
                      0.25,
                      0.65,
                      0.25,
                    ],
                  }}
                  transition={{
                    duration: 1.4,
                    delay:
                      index * 0.045,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    flex-1
                    max-w-[8px]
                    rounded-full
                    bg-emerald-400/40
                  "
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PIPELINE
========================================================= */

function RetrievalPipeline() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.65,
        delay: 0.15,
        ease,
      }}
      className="
        relative
        mt-5
        rounded-[26px]
        border
        border-white/[0.07]
        bg-[#08090d]/95
        overflow-hidden
        shadow-[0_30px_80px_rgba(0,0,0,0.25)]
      "
    >
      {/* Ambient center */}

      <motion.div
        animate={{
          opacity: [
            0.15,
            0.3,
            0.15,
          ],
          scale: [
            1,
            1.06,
            1,
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -top-32
          left-1/2
          -translate-x-1/2
          w-[550px]
          h-[260px]
          rounded-full
          bg-violet-500/[0.045]
          blur-[110px]
        "
      />

      {/* Top accent */}

      <div
        className="
          absolute
          top-0
          left-12
          right-12
          h-px
          bg-gradient-to-r
          from-transparent
          via-violet-400/20
          to-transparent
        "
      />

      {/* Header */}

      <div
        className="
          relative
          px-5
          sm:px-7
          py-5
          border-b
          border-white/[0.05]
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              w-9
              h-9
              rounded-xl
              border
              border-violet-400/10
              bg-violet-500/[0.06]
              flex
              items-center
              justify-center
            "
          >
            <FiCpu
              className="
                w-4
                h-4
                text-violet-300/70
              "
            />
          </motion.div>

          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-white/35
              "
            >
              How StudyMate works
            </p>

            <p
              className="
                mt-1
                text-[10px]
                text-white/18
              "
            >
              Watch your knowledge flow into the answer
            </p>
          </div>
        </div>

        {/* Live */}

        <div
          className="
            flex
            items-center
            gap-2
            px-2.5
            py-1.5
            rounded-lg
            border
            border-emerald-400/[0.07]
            bg-emerald-400/[0.025]
          "
        >
          <motion.span
            animate={{
              opacity: [
                0.3,
                1,
                0.3,
              ],
              scale: [
                0.8,
                1,
                0.8,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="
              w-1.5
              h-1.5
              rounded-full
              bg-emerald-400
              shadow-[0_0_8px_rgba(52,211,153,0.7)]
            "
          />

          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.12em]
              text-emerald-300/40
            "
          >
            AI pipeline
          </span>
        </div>
      </div>

      {/* Main pipeline */}

      <div
        className="
          relative
          px-5
          sm:px-10
          py-10
        "
      >
        <div
          className="
            flex
            flex-col
            md:flex-row
            items-center
            justify-center
            gap-0
          "
        >
          {/* DOCUMENT */}

          <PipelineNode
            icon={FiFileText}
            title="Document"
            subtitle="Your study material"
            accent="violet"
            number="01"
            status="complete"
          />

          <EnergyConnection delay={0} />

          <MobileEnergy delay={0} />

          {/* RETRIEVAL */}

          <PipelineNode
            icon={FiSearch}
            title="Retrieval"
            subtitle="Relevant context"
            accent="cyan"
            number="02"
            status="active"
          />

          <EnergyConnection delay={1.25} />

          <MobileEnergy delay={1} />

          {/* AI ANSWER */}

          <PipelineNode
            icon={FiBookOpen}
            title="AI Answer"
            subtitle="Grounded response"
            accent="emerald"
            number="03"
            status="complete"
          />
        </div>

        {/* Retrieval scanner */}

        <RetrievalScan />

        {/* AI response */}

        <AIResponseVisual />
      </div>

      {/* Bottom message */}

      <div
        className="
          relative
          px-5
          sm:px-7
          py-4
          border-t
          border-white/[0.04]
          flex
          items-center
          justify-center
          gap-2
        "
      >
        <FiZap
          className="
            w-3
            h-3
            text-violet-300/40
          "
        />

        <p
          className="
            text-[9px]
            sm:text-[10px]
            text-white/20
          "
        >
          Retrieve relevant context first. Generate the answer second.
        </p>
      </div>
    </motion.div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.65,
        ease,
      }}
      className="
        relative
        max-w-3xl
        mx-auto
        mb-10
        text-center
      "
    >
      {/* Eyebrow */}

      <div
        className="
          inline-flex
          items-center
          gap-2
          px-3
          py-1.5
          rounded-full
          border
          border-white/[0.07]
          bg-white/[0.02]
          mb-5
        "
      >
        <motion.span
          animate={{
            opacity: [
              0.35,
              1,
              0.35,
            ],
            scale: [
              0.8,
              1,
              0.8,
            ],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
          }}
          className="
            w-1.5
            h-1.5
            rounded-full
            bg-violet-400
            shadow-[0_0_8px_rgba(167,139,250,0.6)]
          "
        />

        <FiCpu
          className="
            w-3
            h-3
            text-violet-400/70
          "
        />

        <span
          className="
            text-[9px]
            uppercase
            tracking-[0.18em]
            text-white/30
          "
        >
          Intelligent document AI
        </span>
      </div>

      {/* Heading */}

      <h2
        className="
          text-3xl
          sm:text-4xl
          lg:text-[42px]
          font-semibold
          tracking-[-0.04em]
          leading-[1.05]
          text-white
        "
      >
        Your documents become{" "}
        <span
          className="
            bg-gradient-to-r
            from-violet-300
            via-indigo-300
            to-cyan-300
            bg-clip-text
            text-transparent
          "
        >
          searchable knowledge.
        </span>
      </h2>

      {/* Description */}

      <p
        className="
          mt-4
          text-[14px]
          leading-6
          text-white/28
          max-w-2xl
          mx-auto
        "
      >
        StudyMate doesn't just generate an answer.
        It first finds the right information inside
        your material, then uses that context to
        generate a grounded response.
      </p>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function StudyMateFeatures() {
  return (
    <section
      className="
        relative
        overflow-hidden
        max-w-6xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        mt-16
        pb-20
      "
    >
      <AmbientBackground />

      <div className="relative">

        <SectionHeader />

        {/* Feature cards */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          "
        >
          {features.map(
            (feature, index) => (
              <FeatureCard
                key={feature.number}
                feature={feature}
                index={index}
              />
            )
          )}
        </div>

        {/* Animated AI pipeline */}

        <RetrievalPipeline />

      </div>
    </section>
  );
}

export default StudyMateFeatures;