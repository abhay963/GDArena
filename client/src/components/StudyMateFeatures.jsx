import { motion } from "framer-motion";

import {
  FiBookOpen,
  FiCpu,
  FiFileText,
  FiSearch,

  FiZap,
} from "react-icons/fi";


// =========================================================
// ANIMATION
// =========================================================

const ease = [0.22, 1, 0.36, 1];


// =========================================================
// FEATURE DATA
// =========================================================

const features = [
  {
    number: "01",

    icon: FiFileText,

    label: "Your material",

    title: "PDFs, notes & slides",

    description:
      "Bring your study material into StudySync and turn static documents into searchable knowledge.",

    accent: "violet",
  },

  {
    number: "02",

    icon: FiSearch,

    label: "Grounded retrieval",

    title: "Find relevant context",

    description:
      "StudyMate retrieves the most relevant passages from your uploaded material before generating an answer.",

    accent: "cyan",
  },

  {
    number: "03",

    icon: FiBookOpen,

    label: "AI answers",

    title: "Ask questions naturally",

    description:
      "Get clear responses grounded in the information retrieved from your own study material.",

    accent: "emerald",
  },
];


// =========================================================
// ACCENT STYLES
// =========================================================

const accentStyles = {

  violet: {
    icon:
      "text-violet-400 bg-violet-500/[0.07] border-violet-500/10",

    glow:
      "bg-violet-500/[0.07]",

    line:
      "via-violet-400/40",
  },

  cyan: {
    icon:
      "text-cyan-400 bg-cyan-500/[0.07] border-cyan-500/10",

    glow:
      "bg-cyan-500/[0.07]",

    line:
      "via-cyan-400/40",
  },

  emerald: {
    icon:
      "text-emerald-400 bg-emerald-500/[0.07] border-emerald-500/10",

    glow:
      "bg-emerald-500/[0.07]",

    line:
      "via-emerald-400/40",
  },
};


// =========================================================
// PIPELINE STEP
// =========================================================

function PipelineStep({
  icon: Icon,
  title,
  subtitle,
}) {

  return (
    <div
      className="
        flex
        items-center
        gap-3
        min-w-0
        md:flex-1
      "
    >

      <div
        className="
          w-10
          h-10
          rounded-xl
          border
          border-white/[0.07]
          bg-white/[0.03]
          flex
          items-center
          justify-center
          flex-shrink-0
        "
      >

        <Icon
          className="
            w-4
            h-4
            text-white/40
          "
        />

      </div>


      <div className="min-w-0">

        <p
          className="
            text-sm
            font-medium
            text-white/60
          "
        >
          {title}
        </p>


        <p
          className="
            mt-0.5
            text-[11px]
            text-white/20
            truncate
          "
        >
          {subtitle}
        </p>

      </div>

    </div>
  );
}


// =========================================================
// PIPELINE ARROW
// =========================================================

function PipelineArrow() {

  return (
    <div
      className="
        hidden
        md:block
        w-8
        h-px
        bg-gradient-to-r
        from-white/[0.03]
        via-white/[0.1]
        to-white/[0.03]
        flex-shrink-0
      "
    />
  );
}


// =========================================================
// FEATURE CARD
// =========================================================

function FeatureCard({
  feature,
  index,
}) {

  const Icon =
    feature.icon;

  const styles =
    accentStyles[
      feature.accent
    ];


  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
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
        duration: 0.55,
        delay: index * 0.08,
        ease,
      }}
      whileHover={{
        y: -4,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.07]
        bg-[#09090c]/90
        p-5 sm:p-6
        transition-all
        duration-300
        hover:border-white/[0.13]
        hover:bg-[#0c0c11]
      "
    >

      {/* =================================================
          BACKGROUND GLOW
      ================================================== */}

      <div
        className={`
          absolute
          -right-16
          -top-16
          w-40
          h-40
          rounded-full
          blur-3xl
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-500
          ${styles.glow}
        `}
      />


      {/* =================================================
          TOP
      ================================================== */}

      <div
        className="
          relative
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <div
          className={`
            w-11
            h-11
            rounded-xl
            border
            flex
            items-center
            justify-center
            transition-transform
            duration-300
            group-hover:scale-105
            ${styles.icon}
          `}
        >

          <Icon
            className="
              w-5
              h-5
            "
          />

        </div>


        <span
          className="
            text-[10px]
            font-mono
            tracking-wider
            text-white/15
          "
        >
          {feature.number}
        </span>

      </div>


      {/* =================================================
          CONTENT
      ================================================== */}

      <div className="relative">

        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.17em]
            text-white/25
            mb-2
          "
        >
          {feature.label}
        </p>


        <h3
          className="
            text-lg
            font-semibold
            tracking-tight
            text-white/85
          "
        >
          {feature.title}
        </h3>


        <p
          className="
            mt-2.5
            text-sm
            leading-6
            text-white/32
          "
        >
          {feature.description}
        </p>

      </div>


      {/* =================================================
          BOTTOM ACCENT
      ================================================== */}

      <div
        className="
          relative
          mt-7
          h-px
          bg-white/[0.04]
          overflow-hidden
        "
      >

        <div
          className={`
            absolute
            inset-y-0
            left-0
            w-0
            group-hover:w-1/2
            bg-gradient-to-r
            from-transparent
            to-transparent
            transition-all
            duration-500
            ${styles.line}
          `}
        />

      </div>

    </motion.div>
  );
}


// =========================================================
// STUDYMATE FEATURES
// =========================================================

function StudyMateFeatures() {

  return (
    <section
      className="
        max-w-6xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        mt-14
        pb-14
      "
    >

      {/* =================================================
          HEADER
      ================================================== */}

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
          amount: 0.2,
        }}
        transition={{
          duration: 0.6,
          ease,
        }}
        className="
          max-w-3xl
          mx-auto
          mb-8
          text-center
        "
      >

        {/* Label */}

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
            mb-4
          "
        >

          <FiCpu
            className="
              w-3
              h-3
              text-violet-400
            "
          />

          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-white/35
            "
          >
            How StudySync thinks
          </span>

        </div>


        {/* Heading */}

        <h2
          className="
            text-2xl
            sm:text-3xl
            font-semibold
            tracking-tight
            text-white
          "
        >

          Your documents become

          <span
            className="
              ml-2
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
            mt-2.5
            text-sm
            leading-6
            text-white/32
          "
        >
          StudySync transforms static study material
          into a knowledge layer you can interact with.
        </p>

      </motion.div>


      {/* =================================================
          FEATURE CARDS
      ================================================== */}

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


      {/* =================================================
          RAG PIPELINE
      ================================================== */}

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
          duration: 0.6,
          delay: 0.15,
          ease,
        }}
        className="
          mt-4
          rounded-[22px]
          border
          border-white/[0.07]
          bg-[#09090c]/80
          overflow-hidden
          shadow-[0_20px_60px_rgba(0,0,0,0.18)]
        "
      >

        {/* Header */}

        <div
          className="
            px-5
            py-4
            border-b
            border-white/[0.05]
            flex
            items-center
            gap-2
          "
        >

          <FiZap
            className="
              w-3.5
              h-3.5
              text-violet-400
            "
          />

          <span
            className="
              text-xs
              uppercase
              tracking-[0.16em]
              text-white/25
            "
          >
            Retrieval pipeline
          </span>

        </div>


        {/* Pipeline */}

        <div
          className="
            p-4
            sm:p-5
            flex
            flex-col
            md:flex-row
            items-stretch
            md:items-center
            justify-between
            gap-4
          "
        >

          <PipelineStep
            icon={FiBookOpen}
            title="Document"
            subtitle="Your study material"
          />


          <PipelineArrow />


          <PipelineStep
            icon={FiSearch}
            title="Retrieval"
            subtitle="Relevant context"
          />


          <PipelineArrow />


          <PipelineStep
            icon={FiBookOpen}
            title="AI Answer"
            subtitle="Grounded response"
          />

        </div>

      </motion.div>


      {/* =================================================
          FOOTER
      ================================================== */}

      <motion.p
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        className="
          mt-6
          text-center
          text-xs
          text-white/20
        "
      >
        StudyMate answers from the knowledge retrieved
        from your uploaded material.
      </motion.p>

    </section>
  );
}


export default StudyMateFeatures;