import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import studyDiscussionAnimation from "../assets/Study discussion.json";
import {
  Terminal,
  Menu,
  X,
  ArrowRight,
  Bot,
  Sparkles,
  Mic,
  BarChart3,
  Quote,
  Activity,
  FileText,
  Search,
  Brain,
  Layers,
  Database,
  MessageCircle,
  Zap,
  Shield,
  ChevronRight,
  Star,
  CheckCircle2,
  ArrowUpRight,
  Upload,
  Network,
  ScanSearch,
  GraduationCap,
  LockKeyhole,
  Play,
  Waves,
  Command,
  LineChart,
  Flame,
  Trophy,
  Target,
  Check,
} from "lucide-react";

/**
 * GD Arena + StudyMate
 * Premium landing page — optimized visual system.
 *
 * Design direction:
 * - Less black/gradient-heavy
 * - Warm neutral surfaces with controlled red accents
 * - Product-first micro-interactions
 * - Animated RAG pipeline
 * - Interactive streak-generation experience
 *
 * Dependencies:
 * - react
 * - react-router-dom
 * - framer-motion
 * - lucide-react
 * - @lottiefiles/dotlottie-react
 */

const easeOut = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOut },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const featureCards = [
  {
    icon: Mic,
    eyebrow: "VOICE-FIRST",
    title: "Talk like it is a real GD.",
    body: "Streaming speech, AI participants, interruption-aware turns, and live feedback keep the room moving naturally.",
    accent: "rose",
  },
  {
    icon: FileText,
    eyebrow: "CONTEXT",
    title: "Your PDFs become a second brain.",
    body: "Upload notes, textbooks, interview prep, or class material and ask questions grounded in your own content.",
    accent: "pink",
  },
  {
    icon: Search,
    eyebrow: "RAG",
    title: "Retrieve before you generate.",
    body: "Semantic retrieval finds the right chunks first, then the model answers from that evidence.",
    accent: "violet",
  },
];

const logos = [
  "DSA",
  "DBMS",
  "OS",
  "CN",
  "SYSTEM DESIGN",
  "APTITUDE",
  "HR",
  "INTERVIEWS",
];

const stats = [
  { value: "10K+", label: "practice sessions" },
  { value: "5K+", label: "learners" },
  { value: "100+", label: "discussion topics" },
  { value: "24/7", label: "study companion" },
];

function SectionHeading({ kicker, title, description, align = "center" }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`max-w-4xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
    >
      {kicker && (
        <motion.div
          variants={fadeUp}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200/10 bg-white/[0.035] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-red-300 backdrop-blur-xl"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {kicker}
        </motion.div>
      )}

      <motion.h2
        variants={fadeUp}
        className="text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          variants={fadeUp}
          className="mt-5 text-base leading-7 text-white/45 sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

function AmbientGlow({ className = "", color = "rose" }) {
  const colors = {
    rose: "bg-red-500/[0.09]",
    red: "bg-red-400/[0.07]",
    pink: "bg-red-500/[0.06]",
    violet: "bg-violet-500/[0.055]",
  };

  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-[120px] ${colors[color]} ${className}`}
    />
  );
}

function Glass({ className = "", children }) {
  return (
    <div
      className={`border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function FlowingAudio({ side = "left" }) {
  return (
    <div
      className={`relative flex items-center ${
        side === "left" ? "justify-end" : "justify-start"
      }`}
    >
      <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-red-400/45 to-transparent" />

      <motion.div
        animate={{
          x: side === "left" ? ["-20%", "118%"] : ["118%", "-20%"],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="relative h-1.5 w-20 rounded-full bg-gradient-to-r from-transparent via-red-300 to-red-300 blur-[1px]"
      />

      <div className="relative z-10 flex items-center gap-1 rounded-full border border-white/[0.08] bg-zinc-900/80 px-2.5 py-1.5 backdrop-blur-xl">
        {[1, 0.65, 1.3, 0.75, 1.15, 0.6, 0.95].map((scale, i) => (
          <motion.span
            key={i}
            animate={{ scaleY: [0.5, scale, 0.6] }}
            transition={{
              duration: 0.6 + i * 0.04,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="h-3 w-0.5 origin-center rounded-full bg-red-300"
          />
        ))}
      </div>
    </div>
  );
}

function AvatarOrb({ type = "human", label }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{ duration: 2.8, repeat: Infinity }}
          className={`absolute -inset-3 rounded-[30px] ${
            type === "human" ? "bg-red-400/20" : "bg-red-400/20"
          } blur-2xl`}
        />

        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: type === "ai" ? [0, 3, -3, 0] : [0, -2, 2, 0],
          }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          className={`relative flex h-20 w-20 items-center justify-center rounded-[28px] border shadow-xl ${
            type === "human"
              ? "border-red-300/20 bg-gradient-to-br from-red-300 via-red-400 to-red-600"
              : "border-red-300/20 bg-gradient-to-br from-red-400 via-red-500 to-violet-600"
          }`}
        >
          {type === "human" ? (
            <div className="h-10 w-10 rounded-full border-2 border-white/70 bg-white/20" />
          ) : (
            <Bot className="h-9 w-9 text-white" />
          )}
        </motion.div>

        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-zinc-950 bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.7)]" />
      </div>

      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </span>
    </div>
  );
}

function RAGPipeline() {
  const nodes = [
    { icon: Upload, label: "PDF" },
    { icon: ScanSearch, label: "PARSE" },
    { icon: Layers, label: "CHUNK" },
    { icon: Brain, label: "EMBED" },
    { icon: Database, label: "VECTOR" },
    { icon: Search, label: "RETRIEVE" },
    { icon: MessageCircle, label: "ANSWER" },
  ];

  return (
    <div className="relative mt-12 overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="absolute left-[7%] right-[7%] top-[51%] hidden h-px bg-gradient-to-r from-transparent via-red-300/35 to-transparent md:block" />

      <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
        {nodes.map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative rounded-2xl border border-white/[0.08] bg-zinc-900/65 p-4 text-center backdrop-blur-xl"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 rgba(251,113,133,0)",
                  "0 0 22px rgba(251,113,133,.16)",
                  "0 0 0 rgba(251,113,133,0)",
                ],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.22,
              }}
              className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.035] ring-1 ring-white/[0.08] transition group-hover:scale-110 group-hover:ring-rose-300/30"
            >
              <Icon className="h-5 w-5 text-red-300" />
            </motion.div>

            <div className="mt-3 text-[10px] font-black tracking-[0.18em] text-white/45">
              {label}
            </div>

            {i < nodes.length - 1 && (
              <motion.div
                animate={{
                  opacity: [0.15, 1, 0.15],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="absolute -right-2 top-1/2 hidden h-1.5 w-1.5 rounded-full bg-red-300 md:block"
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
        <motion.span
          animate={{ x: [-5, 5, -5], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <Zap className="h-3.5 w-3.5 text-red-300" />
        </motion.span>
        retrieval signal moving through your knowledge base
      </div>
    </div>
  );
}

function ChatWindow() {
  const [step, setStep] = useState(0);

  const messages = useMemo(
    () => [
      {
        side: "user",
        text: "Explain deadlock like I am revising for tomorrow's viva.",
      },
      {
        side: "ai",
        text: "I'll stay inside your OS notes and keep it viva-ready.",
      },
      {
        side: "ai",
        text: "Deadlock needs four conditions: mutual exclusion, hold & wait, no preemption, and circular wait.",
      },
    ],
    []
  );

  useEffect(() => {
    const id = setInterval(
      () => setStep((value) => (value + 1) % messages.length),
      2500
    );
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="relative h-full min-h-[530px] overflow-hidden rounded-[32px] border border-white/[0.08] bg-zinc-900/70 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(244,63,94,.07),transparent_35%),radial-gradient(circle_at_15%_80%,rgba(239,68,68,.045),transparent_30%)]" />

      <div className="relative flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 ring-1 ring-rose-300/10">
            <FileText className="h-5 w-5 text-red-300" />
          </div>

          <div>
            <div className="text-sm font-semibold text-white">
              Operating Systems.pdf
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Context loaded
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/35 sm:flex">
          <LockKeyhole className="h-3.5 w-3.5" />
          grounded
        </div>
      </div>

      <div className="relative flex h-[450px] flex-col justify-end gap-4 p-5 sm:p-7">
        <AnimatePresence mode="popLayout">
          {messages.slice(0, step + 1).map((message, i) => (
            <motion.div
              key={`${step}-${i}-${message.text}`}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: easeOut }}
              className={`flex ${
                message.side === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.side === "user"
                    ? "rounded-br-md border border-white/[0.08] bg-white/[0.035] text-zinc-200"
                    : "rounded-bl-md border border-red-300/15 bg-red-400/[0.07] text-zinc-200"
                }`}
              >
                {message.text}

                {message.side === "ai" && i === 2 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.15 }}
                    className="mt-3 rounded-xl border border-white/[0.07] bg-[#030305]/35 p-3"
                  >
                    <div className="mb-2 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-red-300">
                      <Search className="h-3 w-3" />
                      retrieved context
                    </div>

                    <div className="space-y-2 text-[11px] leading-5 text-white/35">
                      {[
                        "§4.2 — resource ownership",
                        "§4.3 — hold and wait",
                        "§4.4 — circular wait",
                      ].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 + index * 0.08 }}
                          className="border-l-2 border-red-300/40 pl-2"
                        >
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="mx-auto flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
          <Waves className="h-3.5 w-3.5" />
          memory-aware answer engine
        </div>
      </div>
    </div>
  );
}

function StreakSystem() {
  const [streak, setStreak] = useState(7);
  const [claimed, setClaimed] = useState(false);
  const [burst, setBurst] = useState(0);

  const milestones = [
    { day: 7, label: "Starter", icon: Flame },
    { day: 14, label: "Focused", icon: Target },
    { day: 30, label: "Unstoppable", icon: Trophy },
  ];

  const week = [
    { day: "M", done: true },
    { day: "T", done: true },
    { day: "W", done: true },
    { day: "T", done: true },
    { day: "F", done: true },
    { day: "S", done: true },
    { day: "S", done: true, active: true },
  ];

  const claimStreak = () => {
    if (claimed) return;

    setClaimed(true);
    setBurst((value) => value + 1);
    setStreak((value) => Math.min(value + 1, 30));

    window.setTimeout(() => setClaimed(false), 1700);
  };

  const nextMilestone =
    milestones.find((item) => item.day > streak) || milestones[milestones.length - 1];

  const milestoneProgress =
    streak >= 30
      ? 100
      : ((streak - (nextMilestone.day === 14 ? 7 : 14)) /
          (nextMilestone.day - (nextMilestone.day === 14 ? 7 : 14))) *
        100;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#070709] p-5 shadow-[0_30px_90px_rgba(0,0,0,.32)] sm:p-7">
      {/* subtle product glow — intentionally behind everything */}
      <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-red-500/[0.07] blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 right-[-5%] h-80 w-80 rounded-full bg-red-400/[0.045] blur-[120px]" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg border border-red-300/20 bg-red-300/[0.08]">
                <Flame className="h-3.5 w-3.5 fill-red-300/20 text-red-300" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-red-300">
                consistency engine
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-[-0.035em] text-white sm:text-3xl">
              Your streak is becoming a habit.
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/42">
              Keep one practice session alive every day. Watch your chain,
              milestones and momentum build in real time.
            </p>
          </div>

          <div className="hidden rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 sm:block">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              live progress
            </div>
          </div>
        </div>

        {/* Main premium streak panel */}
        <div className="mt-6 grid overflow-hidden rounded-[26px] border border-white/[0.075] bg-[#0b0b0e] lg:grid-cols-[.9fr_1.1fr]">
          {/* LEFT — streak identity */}
          <div className="relative overflow-hidden border-b border-white/[0.06] p-6 lg:border-b-0 lg:border-r sm:p-7">
            <div className="pointer-events-none absolute right-[-15%] top-[-30%] h-64 w-64 rounded-full bg-red-400/[0.055] blur-[90px]" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/28">
                  current streak
                </span>

                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="text-red-300"
                >
                  <Flame className="h-4 w-4" />
                </motion.div>
              </div>

              {/* Big number */}
              <div className="relative mt-4 flex items-center gap-5">
                <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-[30px] border border-red-300/15 bg-gradient-to-br from-red-300/[0.12] to-red-500/[0.055]">
                  <motion.div
                    animate={{
                      opacity: [0.25, 0.55, 0.25],
                      scale: [0.9, 1.08, 0.9],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-[-8px] rounded-[34px] border border-red-300/10"
                  />

                  <div className="relative text-center">
                    <motion.div
                      key={streak}
                      initial={{ opacity: 0, y: 8, scale: 0.7 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: easeOut }}
                      className="text-5xl font-black leading-none tracking-[-0.08em] text-white"
                    >
                      {streak}
                    </motion.div>
                    <div className="mt-1 text-[8px] font-black uppercase tracking-[0.18em] text-red-200/70">
                      days
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-lg font-black text-white">Keep it going.</div>
                  <div className="mt-1 text-xs leading-5 text-white/35">
                    {streak >= 30
                      ? "You've reached the 30-day milestone."
                      : `${nextMilestone.day - streak} more ${
                          nextMilestone.day - streak === 1 ? "day" : "days"
                        } to your next badge.`}
                  </div>
                </div>
              </div>

              {/* Week */}
              <div className="mt-auto pt-7">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-[0.17em] text-white/25">
                    weekly activity
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-[0.15em] text-red-300">
                    7 / 7 complete
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {week.map(({ day, done, active }, i) => (
                    <motion.div
                      key={`${day}-${i}`}
                      animate={
                        active
                          ? { y: [0, -2, 0], scale: [1, 1.06, 1] }
                          : {}
                      }
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className={`relative flex h-9 items-center justify-center rounded-xl border text-[9px] font-black ${
                        done
                          ? "border-red-300/20 bg-red-300/[0.09] text-red-100"
                          : "border-white/[0.06] bg-white/[0.02] text-white/20"
                      }`}
                    >
                      {day}
                      {active && (
                        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.65)]" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — action + milestones */}
          <div className="relative p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/28">
                  momentum
                </div>
                <div className="mt-1 text-sm font-black text-white">
                  Build your next milestone
                </div>
              </div>

              <div className="rounded-lg border border-red-300/15 bg-red-300/[0.07] px-2.5 py-1.5 text-[9px] font-black text-red-200">
                {Math.min(streak, 30)} / 30
              </div>
            </div>

            {/* Progress */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.15em]">
                <span className="text-white/22">progress</span>
                <span className="text-red-300">
                  {streak >= 30 ? "complete" : `${nextMilestone.day - streak} days left`}
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  animate={{
                    width: `${streak >= 30 ? 100 : Math.max(8, Math.min(100, milestoneProgress))}%`,
                  }}
                  transition={{ duration: 0.8, ease: easeOut }}
                  className="relative h-full rounded-full bg-gradient-to-r from-red-500 via-red-400 to-red-200"
                >
                  <span className="absolute right-0 top-1/2 h-2 w-6 -translate-y-1/2 rounded-full bg-white/60 blur-[4px]" />
                </motion.div>
              </div>
            </div>

            {/* Milestones */}
            <div className="mt-5 grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
              {milestones.map(({ day, label, icon: Icon }) => {
                const unlocked = streak >= day;

                return (
                  <motion.div
                    key={day}
                    whileHover={{ x: 3 }}
                    className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border px-3.5 py-3 transition ${
                      unlocked
                        ? "border-red-300/15 bg-red-300/[0.055]"
                        : "border-white/[0.055] bg-white/[0.018]"
                    }`}
                  >
                    {unlocked && (
                      <motion.div
                        animate={{ x: ["-130%", "250%"] }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          delay: day * 0.03,
                        }}
                        className="pointer-events-none absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/[0.045] to-transparent"
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-3">
                      <div
                        className={`grid h-9 w-9 place-items-center rounded-xl ${
                          unlocked
                            ? "bg-red-300/10 text-red-200"
                            : "bg-white/[0.035] text-white/20"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div>
                        <div className="text-xs font-black text-white">
                          {label}
                        </div>
                        <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-white/25">
                          {day} day milestone
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10">
                      {unlocked ? (
                        <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-2 py-1 text-[7px] font-black uppercase tracking-[0.12em] text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          unlocked
                        </div>
                      ) : (
                        <span className="text-[8px] font-black uppercase tracking-[0.12em] text-white/20">
                          locked
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.055] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-black text-white">
                  Ready for today's session?
                </div>
                <div className="mt-0.5 text-[9px] text-white/28">
                  One session keeps your streak alive.
                </div>
              </div>

              <div className="relative">
                <AnimatePresence>
                  {claimed && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.8 }}
                      animate={{ opacity: 1, y: -30, scale: 1 }}
                      exit={{ opacity: 0, y: -48 }}
                      transition={{ duration: 0.9, ease: easeOut }}
                      className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-red-200"
                    >
                      +1 DAY 🔥
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {burst > 0 &&
                    Array.from({ length: 18 }).map((_, i) => {
                      const angle = (i / 18) * Math.PI * 2;
                      return (
                        <motion.span
                          key={`${burst}-${i}`}
                          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                          animate={{
                            opacity: 0,
                            x: Math.cos(angle) * 55,
                            y: Math.sin(angle) * 35,
                            scale: 0,
                          }}
                          transition={{ duration: 0.75, ease: easeOut }}
                          className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-red-200"
                        />
                      );
                    })}
                </AnimatePresence>

                <motion.button
                  type="button"
                  onClick={claimStreak}
                  whileHover={{ y: -2, scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  animate={
                    claimed
                      ? {
                          boxShadow: [
                            "0 0 0 rgba(239,68,68,0)",
                            "0 0 28px rgba(239,68,68,.3)",
                            "0 0 0 rgba(239,68,68,0)",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 0.8 }}
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-red-200/20 bg-gradient-to-r from-red-500 to-red-400 px-5 py-3 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-[0_10px_30px_rgba(239,68,68,.15)] sm:w-auto"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative flex items-center gap-2">
                    {claimed ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Streak secured
                      </>
                    ) : (
                      <>
                        <Flame className="h-3.5 w-3.5 transition-transform group-hover:scale-125" />
                        Complete today's practice
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContextGraph() {
  const nodes = [
    ["PDF", 16, 54],
    ["CHUNKS", 39, 25],
    ["VECTOR", 67, 50],
    ["QUERY", 34, 78],
    ["ANSWER", 78, 76],
  ];

  return (
    <div className="relative mt-6 h-[210px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#030305]/25">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 500 210"
        fill="none"
      >
        <path
          d="M82 113 C145 65 145 62 195 53 S325 87 335 104"
          stroke="rgba(251,113,133,.42)"
          strokeWidth="1.5"
          strokeDasharray="5 6"
        />
        <path
          d="M168 164 C225 122 270 120 335 160"
          stroke="rgba(239,68,68,.35)"
          strokeWidth="1.5"
          strokeDasharray="5 6"
        />
      </svg>

      {nodes.map(([label, left, top], i) => (
        <motion.div
          key={label}
          style={{ left: `${left}%`, top: `${top}%` }}
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.65, 1, 0.65],
          }}
          transition={{
            duration: 2.3,
            repeat: Infinity,
            delay: i * 0.25,
          }}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-zinc-900/85 px-3 py-2 text-[9px] font-black tracking-[0.16em] text-white/45 backdrop-blur-xl"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
          {label}
        </motion.div>
      ))}

      <motion.div
        animate={{ x: ["-10%", "420%"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 top-[52%] h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-red-300 to-transparent"
      />
    </div>
  );
}

function BentoFeature({ card }) {
  const Icon = card.icon;

  const accents = {
    rose: "from-red-400/15 to-transparent text-red-300",
    red: "from-red-300/15 to-transparent text-red-300",
    pink: "from-red-400/15 to-transparent text-red-300",
    violet: "from-violet-400/15 to-transparent text-violet-300",
  };

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -7 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 transition-colors hover:border-white/[0.14] sm:p-7"
    >
      <div
        className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${accents[card.accent]} blur-3xl opacity-0 transition duration-500 group-hover:opacity-100`}
      />

      <div className="relative">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accents[card.accent]} ring-1 ring-white/[0.08]`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="mt-6 text-[10px] font-black tracking-[0.2em] text-white/25">
          {card.eyebrow}
        </div>

        <h3 className="mt-2 text-xl font-black tracking-tight text-white">
          {card.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-white/45">{card.body}</p>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-red-400 via-red-300 to-transparent"
      />
    </motion.div>
  );
}

function LiveArenaCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 22 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: easeOut }}
      className="relative mx-auto w-full max-w-xl lg:ml-auto"
    >
      <motion.div
        animate={{ rotate: [0, 1, -1, 0], y: [0, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-3 shadow-2xl shadow-red-950/20 backdrop-blur-2xl sm:p-4"
      >
        <div className="rounded-[28px] border border-white/[0.07] bg-zinc-900/65 p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                live room
              </div>
              <div className="mt-1 text-sm font-bold text-white">
                AI Group Discussion
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              live
            </div>
          </div>

          <div className="grid grid-cols-[.7fr_1.2fr_.7fr] items-center gap-2 sm:gap-4">
            <AvatarOrb type="human" label="you" />

            <div className="space-y-3">
              <FlowingAudio side="left" />

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 py-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                  topic
                </div>
                <div className="mt-1 text-xs font-semibold leading-5 text-white/60">
                  Impact of LLMs on Software Engineering
                </div>
              </div>

              <FlowingAudio side="right" />
            </div>

            <AvatarOrb type="ai" label="AI" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.2,
  });

  const heroY = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : 130]);
  const heroOpacity = useTransform(
    scrollY,
    [0, 500],
    [1, reduceMotion ? 1 : 0.18]
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState("GD Arena");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion) return;

    let raf = 0;

    const onMove = (event) => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        setCursor({
          x: (event.clientX / window.innerWidth - 0.5) * 2,
          y: (event.clientY / window.innerHeight - 0.5) * 2,
        });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduceMotion]);

  const navTo = (id) => {
    setMenuOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030305] font-sans text-gray-100 selection:bg-red-500/30">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 right-0 top-0 z-[90] h-[2px] origin-left bg-gradient-to-r from-red-600 via-red-500 to-red-300"
      />

      {/* Lightweight ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <AmbientGlow
          color="rose"
          className="left-[-16%] top-[-10%] h-[480px] w-[480px]"
        />
        <AmbientGlow
          color="red"
          className="right-[-15%] top-[28%] h-[430px] w-[430px]"
        />

        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  x: cursor.x * 12,
                  y: cursor.y * 12,
                }
          }
          transition={{ type: "spring", stiffness: 80, damping: 25 }}
          className="absolute left-1/2 top-[14%] h-[430px] w-[430px] -translate-x-1/2 rounded-full border border-white/[0.025]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_15%,black_25%,transparent_90%)]" />
      </div>

      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-[80] px-4 pt-4 sm:px-6">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/[0.08] bg-[#09090c]/75 px-3 py-2.5 shadow-xl shadow-black/10 backdrop-blur-2xl">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5"
          >
            <motion.span
              whileHover={{ rotate: 6, scale: 1.05 }}
              className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg shadow-red-500/10"
            >
              <Terminal className="relative h-4 w-4" />
            </motion.span>

            <span className="text-sm font-black tracking-tight sm:text-base">
              GD <span className="text-red-300">Arena</span>
            </span>
          </button>

          <div className="hidden items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.025] p-1 lg:flex">
            {[
              ["Product", "product"],
              ["GD Arena", "gd-arena"],
              ["StudyMate", "studymate"],
              ["Workflow", "workflow"],
            ].map(([label, id]) => (
              <button
                key={label}
                onClick={() => navTo(id)}
                className="rounded-lg px-3.5 py-2 text-xs font-semibold text-white/45 transition hover:bg-white/[0.05] hover:text-white"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl px-4 py-2 text-xs font-bold text-white/60 transition hover:text-white"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2.5 text-xs font-black text-white shadow-[0_10px_30px_rgba(220,38,38,0.16)] transition hover:-translate-y-0.5"
            >
              Start free
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-2 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/[0.08] bg-[#09090c]/95 p-2 shadow-xl backdrop-blur-xl lg:hidden"
            >
              {[
                ["Product", "product"],
                ["GD Arena", "gd-arena"],
                ["StudyMate", "studymate"],
                ["Workflow", "workflow"],
              ].map(([label, id]) => (
                <button
                  key={label}
                  onClick={() => navTo(id)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm text-white/60 hover:bg-white/[0.05]"
                >
                  {label}
                </button>
              ))}

              <button
                onClick={() => navigate("/signup")}
                className="mt-1 w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-sm font-black text-white"
              >
                Start free
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen items-center px-5 pb-20 pt-32 sm:px-8 lg:pt-40">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="mx-auto w-full max-w-7xl"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: easeOut }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-300/10 bg-white/[0.025] px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-red-200 backdrop-blur-xl"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                AI-powered placement OS
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.08, ease: easeOut }}
                className="max-w-5xl text-[clamp(3.5rem,7vw,7.6rem)] font-black leading-[0.88] tracking-[-0.065em]"
              >
                <span className="block text-white">Practice.</span>
                <span className="block bg-gradient-to-r from-red-500 via-red-400 to-red-300 bg-clip-text text-transparent">
                  Understand.
                </span>
                <span className="block text-white/35">Perform.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2, ease: easeOut }}
                className="mt-7 max-w-2xl text-base leading-7 text-white/45 sm:text-xl sm:leading-8"
              >
                GD Arena trains how you speak. StudyMate trains what you know.
                One intelligent workspace for the high-pressure part of
                placement preparation.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.3, ease: easeOut }}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <button
                  onClick={() => navigate("/signup")}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 text-sm font-black text-white shadow-[0_18px_50px_rgba(244,63,94,.14)] transition hover:-translate-y-1"
                >
                  Enter the Arena
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navTo("studymate")}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/[0.035] px-6 py-4 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-red-300/35 hover:bg-red-500/[0.07]"
                >
                  See StudyMate
                  <ChevronRight className="h-4 w-4 text-white/35 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/25"
              >
                <span className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  context-grounded
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" />
                  real-time
                </span>
                <span className="flex items-center gap-2">
                  <Network className="h-3.5 w-3.5" />
                  adaptive
                </span>
              </motion.div>
            </div>

            <LiveArenaCard />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-16 border-y border-white/[0.055] py-5"
          >
            <div className="mb-3 text-center text-[9px] font-black uppercase tracking-[0.24em] text-white/25">
              built around what you actually prepare
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-bold text-white/35 sm:gap-x-12">
              {logos.map((logo) => (
                <motion.span
                  key={logo}
                  whileHover={{ y: -2, color: "#f4f4f5" }}
                  className="transition"
                >
                  {logo}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Product bridge */}
      <section
        id="product"
        className="relative z-10 border-y border-white/[0.055] bg-white/[0.012] px-5 py-28 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            kicker="two modes · one brain"
            title={
              <>
                <span>Train your </span>
                <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                  skills.
                </span>
              </>
            }
            description="The interface behaves like a product, not a brochure: live state, retrieval, and voice are always moving."
          />

          <div className="mt-14 flex justify-center">
            <div className="inline-flex rounded-2xl border border-white/[0.07] bg-white/[0.025] p-1.5">
              {["GD Arena", "StudyMate"].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveFeature(item)}
                  className={`rounded-xl px-5 py-2.5 text-xs font-black transition ${
                    activeFeature === item
                      ? "bg-white text-white shadow-lg"
                      : "text-white/35 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]"
            >
              <div className="relative min-h-[430px] overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
                <AmbientGlow
                  color={activeFeature === "GD Arena" ? "rose" : "pink"}
                  className="right-[-10%] top-[-18%] h-[330px] w-[330px]"
                />

                {activeFeature === "GD Arena" ? (
                  <div className="relative h-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-red-300">
                          GD Arena / session 027
                        </div>
                        <div className="mt-2 text-xl font-black tracking-tight">
                          The AI listens. The room reacts.
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-2.5">
                        <Mic className="h-4 w-4 text-red-300" />
                      </div>
                    </div>

                    <div className="mt-12 grid grid-cols-[.75fr_1.5fr_.75fr] items-center gap-4">
                      <AvatarOrb type="ai" label="opponent 01" />

                      <div className="relative py-8">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-red-500/10 via-red-300/60 to-red-300/10" />

                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ x: ["-20%", "120%"] }}
                            transition={{
                              duration: 2.1 + i * 0.35,
                              repeat: Infinity,
                              delay: i * 0.45,
                              ease: "linear",
                            }}
                            className="absolute top-1/2 h-1.5 w-16 rounded-full bg-gradient-to-r from-transparent via-white to-transparent blur-[1px]"
                          />
                        ))}

                        <div className="mx-auto w-fit rounded-2xl border border-white/[0.08] bg-zinc-900/70 px-5 py-4 text-center backdrop-blur-xl">
                          <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
                            current speaker
                          </div>
                          <div className="mt-1 text-sm font-bold text-white">
                            You
                          </div>

                          <div className="mt-2 flex items-end justify-center gap-1">
                            {[18, 34, 25, 45, 22, 38, 29, 42, 20, 31, 25].map(
                              (h, i) => (
                                <motion.span
                                  key={i}
                                  animate={{
                                    height: [h, Math.max(10, h * 1.6), h],
                                  }}
                                  transition={{
                                    duration: 0.7 + i * 0.03,
                                    repeat: Infinity,
                                  }}
                                  className="w-1 rounded-full bg-red-300"
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <AvatarOrb type="ai" label="opponent 02" />
                    </div>
                  </div>
                ) : (
                  <div className="relative grid h-full items-center gap-8 lg:grid-cols-[.85fr_1.15fr]">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-red-300">
                        StudyMate / memory graph
                      </div>

                      <div className="mt-3 text-3xl font-black tracking-tight">
                        Answers change when your context changes.
                      </div>

                      <p className="mt-4 max-w-md text-sm leading-6 text-white/45">
                        Upload one document. Ask different questions. StudyMate
                        retrieves different evidence each time.
                      </p>

                      <div className="mt-7 flex flex-wrap gap-2">
                        {[
                          "OS Notes",
                          "CN Revision",
                          "DBMS Interview",
                          "Resume Prep",
                        ].map((tag) => (
                          <motion.span
                            key={tag}
                            whileHover={{ y: -2 }}
                            className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold text-white/35"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <ContextGraph />
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                {[
                  {
                    icon: Sparkles,
                    t: "Adaptive",
                    d: "The experience changes with the learner instead of showing the same static marketing cards.",
                  },
                  {
                    icon: Command,
                    t: "Fast to understand",
                    d: "Visual state explains the product before the visitor reads a wall of copy.",
                  },
                  {
                    icon: LineChart,
                    t: "Built to prove value",
                    d: "Voice → retrieval → discussion becomes one visible loop.",
                  },
                ].map(({ icon: Icon, t, d }) => (
                  <motion.div
                    key={t}
                    whileHover={{ y: -4 }}
                    className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.03] ring-1 ring-white/[0.08]">
                      <Icon className="h-5 w-5 text-red-300" />
                    </div>
                    <div className="mt-5 text-lg font-black">{t}</div>
                    <p className="mt-2 text-sm leading-6 text-white/35">{d}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* GD Arena */}
      <section
        id="gd-arena"
        className="relative z-10 px-5 py-28 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            kicker="GD Arena"
            title={
              <>
                <span>Make communication </span>
                <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                  trainable.
                </span>
              </>
            }
            description="A simulated discussion room that listens, pushes back, and makes the next turn feel consequential."
          />

          <div className="relative mt-16 overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-8">
            <AmbientGlow
              color="rose"
              className="left-[-10%] top-[10%] h-[330px] w-[330px]"
            />
            <AmbientGlow
              color="red"
              className="right-[-8%] bottom-[-15%] h-[350px] w-[350px]"
            />

            <div className="relative grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                  <Activity className="h-3.5 w-3.5" />
                  room state / responding
                </div>

                <h3 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                  A person speaks.
                  <br />
                  <span className="text-white/35">The room moves.</span>
                </h3>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
                  Interim speech becomes a real-time conversation, and AI
                  participants react to your arguments as the discussion
                  unfolds.
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    "Interim speech becomes a real-time conversation",
                    "AI participants react to your last argument",
                    "The room stays alive for the whole session",
                  ].map((item) => (
                    <motion.div
                      key={item}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                      <span className="text-sm text-white/60">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-[32px] border border-white/[0.08] bg-[#09090c]/95 p-3 backdrop-blur-xl">
                  <DotLottieReact
                    data={JSON.stringify(studyDiscussionAnimation)}
                    autoplay
                    loop
                    style={{ width: "100%", height: "min(520px, 62vw)" }}
                  />

                  <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2 sm:left-7 sm:right-7">
                    {[
                      ["LIVE", "voice input"],
                      ["AI", "argument model"],
                      ["ROOM", "group discussion"],
                    ].map(([a, b]) => (
                      <motion.div
                        key={a}
                        whileHover={{ y: -3 }}
                        className="rounded-xl border border-white/[0.08] bg-zinc-900/85 p-3 text-center backdrop-blur-xl"
                      >
                        <div className="text-[9px] font-black tracking-[0.18em] text-red-300">
                          {a}
                        </div>
                        <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/25">
                          {b}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* StudyMate / RAG */}
      <section
        id="studymate"
        className="relative z-10 border-y border-white/[0.055] bg-white/[0.012] px-5 py-28 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <SectionHeading
              align="left"
              kicker="StudyMate"
              title={
                <>
                  <span>Upload once. </span>
                  <span className="bg-gradient-to-r from-red-300 to-red-200 bg-clip-text text-transparent">
                    Ask in context.
                  </span>
                </>
              }
              description="The PDF becomes a living, queryable memory through an animated retrieval pipeline."
            />

            <div className="justify-self-end rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-white/35">
              <span className="font-black text-white">RAG</span> / retrieve →
              ground → answer
            </div>
          </div>

          <RAGPipeline />

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <ChatWindow />

            <div className="grid gap-5">
              <div className="rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-red-300">
                    context graph
                  </div>
                  <Network className="h-4 w-4 text-white/25" />
                </div>

                <ContextGraph />

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    ["memory", "document-aware"],
                    ["retrieval", "semantic"],
                  ].map(([label, value]) => (
                    <motion.div
                      key={label}
                      whileHover={{ y: -3 }}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                    >
                      <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
                        {label}
                      </div>
                      <div className="mt-1 text-lg font-black">{value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-red-300/10 bg-red-400/[0.035] p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.03] ring-1 ring-white/[0.08]">
                    <Shield className="h-5 w-5 text-red-300" />
                  </div>

                  <div>
                    <div className="text-sm font-black">Grounded by design</div>
                    <div className="text-xs text-white/35">
                      Uploaded material stays at the center of the answer.
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  {[
                    "Source-aware answers",
                    "Retrieved context",
                    "Context-first response flow",
                  ].map((label) => (
                    <motion.div
                      key={label}
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3 text-xs text-white/45"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      {label}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Streaks */}
      <section className="relative z-10 px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            kicker="consistency engine"
            title={
              <>
                <span>Don't just practice.</span>
                <br />
                <span className="bg-gradient-to-r from-red-200 to-red-300 bg-clip-text text-transparent">
                  Keep coming back.
                </span>
              </>
            }
            description="Streaks give you a reason to show up every day, turning one-off practice into a lasting habit."
          />

          <div className="mt-14">
            <StreakSystem />
          </div>
        </div>
      </section>

      {/* Capability bento */}
      <section className="relative z-10 px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            kicker="the system"
            title={
              <>
                <span>Less brochure.</span>
                <br />
                <span className="text-white/35">More product.</span>
              </>
            }
            description="Every section earns its place by showing how the platform behaves."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {featureCards.map((card) => (
              <BentoFeature key={card.eyebrow} card={card} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-5 rounded-[30px] border border-white/[0.08] bg-red-300/[0.035] p-7 sm:p-9"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
              <GraduationCap className="h-5 w-5 text-red-300" />
            </div>

            <h3 className="mt-6 text-2xl font-black tracking-tight">
              Placement mode.
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Turn scattered practice into a repeatable loop: talk, study,
              retrieve, and come back tomorrow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Workflow */}
      <section
        id="workflow"
        className="relative z-10 border-y border-white/[0.055] bg-white/[0.012] px-5 py-28 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            kicker="workflow"
            title={
              <>
                <span>Five moves.</span>{" "}
                <span className="text-white/35">
                  One serious advantage.
                </span>
              </>
            }
            description="The path from signup to placement-readiness stays visible from the first click."
          />

          <div className="relative mt-16">
            <div className="absolute left-1/2 top-10 hidden h-[calc(100%-80px)] w-px -translate-x-1/2 bg-gradient-to-b from-red-400/45 via-red-300/20 to-transparent lg:block" />

            <div className="space-y-5 lg:space-y-14">
              {[
                [
                  "01",
                  "Enter the room",
                  "Pick a topic and start speaking. No waiting around for a human practice group.",
                  Mic,
                ],
                [
                  "02",
                  "Get challenged",
                  "AI participants respond to your arguments instead of handing you a canned answer.",
                  Bot,
                ],
                [
                  "03",
                  "Bring your context",
                  "Upload class notes, interview PDFs, or revision material into StudyMate.",
                  FileText,
                ],
                [
                  "04",
                  "Ask better questions",
                  "Retrieve the right context and get a grounded explanation exactly when you need it.",
                  Search,
                ],
                [
                  "05",
                  "Repeat daily",
                  "Keep your streak alive and let daily practice compound into real readiness.",
                  BarChart3,
                ],
              ].map(([num, title, body, Icon], i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, x: i % 2 ? 28 : -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: easeOut }}
                  className={`relative grid gap-5 lg:grid-cols-2 lg:items-center ${
                    i % 2 ? "lg:text-right" : ""
                  }`}
                >
                  <div className={i % 2 ? "lg:order-2" : ""}>
                    <div className="text-5xl font-black tracking-[-0.06em] text-white/[0.08] sm:text-7xl">
                      {num}
                    </div>

                    <h3 className="mt-1 text-2xl font-black tracking-tight">
                      {title}
                    </h3>

                    <p
                      className={`mt-2 max-w-xl text-sm leading-6 text-white/35 ${
                        i % 2 ? "lg:ml-auto" : ""
                      }`}
                    >
                      {body}
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`${
                      i % 2
                        ? "lg:order-1 lg:justify-self-end"
                        : "lg:justify-self-start"
                    } flex w-fit items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03]">
                      <Icon className="h-4 w-4 text-red-300" />
                    </div>

                    <span className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                      {
                        [
                          "real-time",
                          "adaptive",
                          "context-aware",
                          "grounded",
                          "consistent",
                        ][i]
                      }
                    </span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="relative z-10 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Glass className="rounded-[30px] bg-white/[0.025] p-7 sm:p-12">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="text-center"
                >
                  <motion.div
                    whileInView={{ y: [8, 0] }}
                    viewport={{ once: true }}
                    className="text-3xl font-black tracking-[-0.04em] sm:text-5xl"
                  >
                    {value}
                  </motion.div>
                  <div className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/25 sm:text-[10px]">
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>
          </Glass>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            kicker="the feeling we want"
            title={
              <>
                <span>“Oh, this feels </span>
                <span className="text-white/35">different.”</span>
              </>
            }
            description="The product should feel alive before the visitor even signs in."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              [
                "It stopped feeling like practice.",
                "The AI room made me think on my feet. It changed how I approached a GD.",
                "Ananya Iyer",
              ],
              [
                "My notes finally became interactive.",
                "Instead of searching a 200-page PDF, I can ask exactly what I am stuck on and see the supporting context.",
                "Rohan Malhotra",
              ],
              [
                "This is how a student product should feel.",
                "It feels less like a college project and more like a focused product built around one clear outcome.",
                "Sarah Jenkins",
              ],
            ].map(([quote, body, author], i) => (
              <motion.div
                key={author}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="relative rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-7"
              >
                <Quote className="absolute right-6 top-6 h-8 w-8 text-red-400/10" />

                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="h-3.5 w-3.5 fill-rose-300 text-red-300"
                    />
                  ))}
                </div>

                <div className="text-lg font-black tracking-tight">
                  “{quote}”
                </div>

                <p className="mt-4 text-sm leading-6 text-white/35">{body}</p>

                <div className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-white/25">
                  {author}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 overflow-hidden px-5 pb-20 pt-12 sm:px-8">
        <motion.div
          whileHover={{ scale: 1.003 }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/[0.09] bg-white/[0.025] px-6 py-20 text-center shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:px-12 lg:py-28"
        >
          <AmbientGlow
            color="rose"
            className="left-[22%] top-[-30%] h-[420px] w-[420px]"
          />
          <AmbientGlow
            color="red"
            className="right-[5%] bottom-[-35%] h-[360px] w-[360px]"
          />

          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.04, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-300 to-red-200 text-white shadow-[0_0_45px_rgba(244,63,94,.14)]"
            >
              <Terminal className="h-6 w-6" />
            </motion.div>

            <h2 className="mx-auto mt-7 max-w-4xl text-4xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Stop preparing in pieces.
              <span className="block bg-gradient-to-r from-red-500 via-red-400 to-red-300 bg-clip-text text-transparent">
                Start training as a system.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/35 sm:text-lg">
              Talk. Study. Retrieve. Repeat. Walk into the next placement
              round knowing exactly what to work on.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-500 px-7 py-4 text-sm font-black text-white shadow-[0_18px_50px_rgba(239,68,68,.22)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(239,68,68,.30)]"
              >
                Start free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navTo("gd-arena")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/[0.035] px-7 py-4 text-sm font-bold text-white transition hover:border-red-300/35 hover:bg-red-500/[0.07]"
              >
                <Play className="h-4 w-4 text-red-300" />
                See the experience
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.055] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-300 to-red-200 text-white">
              <Terminal className="h-4 w-4" />
            </div>

            <div>
              <div className="text-sm font-black">GD Arena</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-700">
                practice smarter
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-white/25">
            <button
              onClick={() => navTo("gd-arena")}
              className="transition hover:text-white"
            >
              GD Arena
            </button>
            <button
              onClick={() => navTo("studymate")}
              className="transition hover:text-white"
            >
              StudyMate
            </button>
            <button
              onClick={() => navTo("workflow")}
              className="transition hover:text-white"
            >
              Workflow
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="transition hover:text-white"
            >
              Back to top
            </button>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-700">
            © 2026 GD Arena
          </div>
        </div>
      </footer>
    </main>
  );
}