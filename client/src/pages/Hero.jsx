import {
  useState,
  useRef,
  useEffect,
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import {
  FaSpinner,
} from "react-icons/fa";

import {
  FiArrowRight,
  FiArrowUpRight,
  FiBookOpen,
  FiChevronRight,
  FiChevronLeft,
  FiCalendar,
  FiClock,
  FiFileText,
  FiHelpCircle,
  FiLogOut,
  FiMic,
  FiMessageCircle,
  FiPlay,
  FiRadio,
  FiShield,
  FiAirplay,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiX,
  FiZap,
} from "react-icons/fi";

// Authentication
import { useAuth } from "../context/AuthContext";
import {
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

// Deepgram streaming speech service
import {
  startSpeech,
  stopSpeech,
  pauseSpeech,
  resumeSpeech,
} from "../services/speech.service.js";

// Custom Components
import Navbar from "../components/Navbar";
import Countdown from "../components/Countdown";
import GDHeader from "../components/GDHeader";
import GDStatusBar from "../components/GDStatusBar";
import DiscussionStream from "../components/DiscussionStream";

/* =========================================================
   ANIMATION CONFIG
========================================================= */

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease,
    },
  },
};

const stagger = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* =========================================================
   AMBIENT PARTICLES
========================================================= */

function AmbientParticles() {
  const particles = useRef(
    Array.from({ length: 24 }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 7,
      size:
        Math.random() > 0.8 ? 3 : 1.5,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            opacity: [0, 0.35, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  type,
  title,
  description,
  icon: Icon,
  accent,
  children,
  onClick,
}) {
  const isRed = accent === "red";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -5,
      }}
      whileTap={{
        scale: 0.985,
      }}
      transition={{
        duration: 0.55,
        ease,
      }}
      className={`
        group
        relative
        overflow-hidden
        w-full
        text-left
        rounded-[22px]
        border
        p-5
        bg-[#09090c]/80
        backdrop-blur-xl
        shadow-[0_25px_80px_rgba(0,0,0,0.35)]
        transition-all
        duration-500
        ${
          isRed
            ? "border-red-500/15 hover:border-red-500/35"
            : "border-violet-500/15 hover:border-violet-500/35"
        }
      `}
    >
      {/* Glow */}

      <div
        className={`
          absolute
          -top-20
          -right-20
          w-48
          h-48
          rounded-full
          blur-[80px]
          opacity-20
          transition-opacity
          duration-500
          group-hover:opacity-35
          ${
            isRed
              ? "bg-red-500"
              : "bg-violet-500"
          }
        `}
      />

      <div className="relative">

        {/* Top */}

        <div className="flex items-start justify-between">

          <div
            className={`
              w-11
              h-11
              rounded-[14px]
              flex
              items-center
              justify-center
              border
              ${
                isRed
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-violet-500/10 border-violet-500/20 text-violet-400"
              }
            `}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">

            <span
              className={`
                w-1.5
                h-1.5
                rounded-full
                ${
                  isRed
                    ? "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]"
                    : "bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]"
                }
              `}
            />

            <span className="text-[11px] uppercase tracking-[0.18em] text-white/35">
              {type}
            </span>

          </div>

        </div>

        {/* Content */}

        <div className="mt-5">

          <div className="flex items-center justify-between">

            <h3 className="text-[17px] font-semibold text-white">
              {title}
            </h3>

            <FiArrowUpRight
              className="
                w-4
                h-4
                text-white/20
                group-hover:text-white/70
                transition-colors
              "
            />

          </div>

          <p className="text-sm text-white/40 mt-2 leading-relaxed">
            {description}
          </p>

        </div>

        {children}

      </div>
    </motion.button>
  );
}

/* =========================================================
   LIVE SPEAKING FLOW – cinematic version
========================================================= */

const SPEAKING_LINES = [
  { speaker: "AI", text: "The core issue is trust in institutions." },
  { speaker: "You", text: "I think transparency is the real foundation." },
  { speaker: "AI", text: "But does transparency alone change behaviour?" },
  { speaker: "You", text: "It creates pressure. People adapt when watched." },
  { speaker: "AI", text: "Interesting. So accountability is the catalyst?" },
  { speaker: "You", text: "Exactly. Without it, systems drift." },
];

function SpeakingFlow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % SPEAKING_LINES.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  // Show 3 lines: previous (faded), current (active), next (coming)
  const prev = SPEAKING_LINES[(index - 1 + SPEAKING_LINES.length) % SPEAKING_LINES.length];
  const current = SPEAKING_LINES[index];
  const next = SPEAKING_LINES[(index + 1) % SPEAKING_LINES.length];

  return (
    <div className="relative w-full max-w-[340px] select-none">
      {/* Outer cinematic glow */}
      <motion.div
        className="pointer-events-none absolute -inset-8 rounded-[40px] bg-gradient-to-br from-orange-500/15 via-red-500/8 to-transparent blur-3xl"
        animate={{
          opacity: [0.4, 0.75, 0.4],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft orbit ring */}
      <motion.div
        className="pointer-events-none absolute -inset-3 rounded-[28px] border border-orange-400/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#08080b]/95 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
        {/* Top live header */}
        <div className="relative flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <motion.span
                className="absolute inset-0 rounded-full bg-emerald-400"
                animate={{ scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">
              Live exchange
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-orange-300/60">AI</span>
            <span className="text-[10px] text-white/25">↔</span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/50">You</span>
          </div>
        </div>

        {/* Message stream */}
        <div className="relative h-[210px] overflow-hidden px-5 py-5">
          {/* Vertical timeline rail */}
          <div className="absolute left-[27px] top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

          <AnimatePresence mode="popLayout" initial={false}>
            {/* Previous (fading up) */}
            <motion.div
              key={`prev-${index}`}
              initial={{ opacity: 0.4, y: 0 }}
              animate={{ opacity: 0.22, y: -8 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7, ease }}
              className="absolute left-0 right-0 top-3 px-5"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                    prev.speaker === "AI" ? "bg-orange-400/40" : "bg-white/30"
                  }`}
                />
                <div>
                  <p className="mb-0.5 text-[9px] uppercase tracking-[0.18em] text-white/25">
                    {prev.speaker === "AI" ? "AI" : "You"}
                  </p>
                  <p className="text-[12.5px] leading-5 text-white/30 line-clamp-2">
                    {prev.text}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Current (hero) */}
            <motion.div
              key={`curr-${index}`}
              initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -28, filter: "blur(4px)" }}
              transition={{ duration: 0.75, ease }}
              className="absolute left-0 right-0 top-[58px] px-5"
            >
              <div className="flex items-start gap-3.5">
                <div className="relative mt-1">
                  <div
                    className={`h-3.5 w-3.5 rounded-full ${
                      current.speaker === "AI"
                        ? "bg-orange-400 shadow-[0_0_18px_rgba(251,146,60,0.85)]"
                        : "bg-white shadow-[0_0_18px_rgba(255,255,255,0.45)]"
                    }`}
                  />
                  <motion.span
                    className={`absolute inset-0 rounded-full ${
                      current.speaker === "AI" ? "bg-orange-400" : "bg-white"
                    }`}
                    animate={{ scale: [1, 2.1, 1], opacity: [0.55, 0, 0.55] }}
                    transition={{ duration: 1.7, repeat: Infinity }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                        current.speaker === "AI" ? "text-orange-300" : "text-white/70"
                      }`}
                    >
                      {current.speaker === "AI" ? "AI speaking" : "You speaking"}
                    </p>
                    {/* tiny speaking dots */}
                    <div className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className={`h-1 w-1 rounded-full ${
                            current.speaker === "AI" ? "bg-orange-300" : "bg-white/60"
                          }`}
                          animate={{ opacity: [0.25, 1, 0.25], scale: [0.7, 1.2, 0.7] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: i * 0.18,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[14px] font-medium leading-6 text-white/95">
                    {current.text}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Next (rising in) */}
            <motion.div
              key={`next-${index}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.38, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease }}
              className="absolute left-0 right-0 top-[148px] px-5"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                    next.speaker === "AI" ? "bg-orange-400/35" : "bg-white/25"
                  }`}
                />
                <div>
                  <p className="mb-0.5 text-[9px] uppercase tracking-[0.18em] text-white/20">
                    {next.speaker === "AI" ? "AI" : "You"}
                  </p>
                  <p className="text-[12.5px] leading-5 text-white/30 line-clamp-2">
                    {next.text}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom voice strip */}
        <div className="border-t border-white/[0.05] bg-white/[0.015] px-5 py-3.5">
          <div className="flex h-6 items-center justify-center gap-[2.5px]">
            {[...Array(32)].map((_, i) => (
              <motion.span
                key={i}
                className="w-[2px] rounded-full bg-gradient-to-t from-red-500/40 via-orange-400 to-amber-200"
                animate={{
                  height: [
                    3 + (i % 5),
                    8 + ((i * 7) % 16),
                    3 + (i % 4),
                  ],
                }}
                transition={{
                  duration: 0.38 + (i % 5) * 0.06,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: i * 0.018,
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-white/25">
            <span>Voice stream</span>
            <span className="flex items-center gap-1.5 text-orange-300/50">
              <span className="h-1 w-1 rounded-full bg-orange-400 animate-pulse" />
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HERO
========================================================= */

export default function Hero() {

  const navigate = useNavigate();

  const {
    user,
    loading,
  } = useAuth();

  const [step, setStep] =
    useState("enter");

  const [topic, setTopic] =
    useState("");

  const [history, setHistory] =
    useState([]);

  const [sessionId, setSessionId] =
    useState(null);

  const [loadingAI, setLoadingAI] =
    useState(false);

  const [showCountdown, setShowCountdown] =
    useState(false);

  const [isAiSpeaking, setIsAiSpeaking] =
    useState(false);

  const [activeAiSpeaker, setActiveAiSpeaker] =
    useState("");

  const [showHowToPlay, setShowHowToPlay] =
    useState(false);

  const chatContainerRef =
    useRef(null);

  // Deepgram streaming speech lifecycle
  const speechServiceRef =
    useRef(false);

  const isUserSpeakingRef =
    useRef(false);

  const interimTranscriptRef =
    useRef("");

  const aiSpeechQueue =
    useRef([]);

  const isProcessingQueue =
    useRef(false);

  /* =======================================================
     CHAT SCROLL
  ======================================================= */

  useEffect(() => {

    const container = chatContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {

      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });

    });

  }, [history]);

  /* =======================================================
     AUDIO LIFECYCLE
  ======================================================= */

  useEffect(() => {

    if (step === "gd") {
      startContinuousListening();
    } else {
      stopAllAudio();
    }

    return () => {
      stopAllAudio();
    };

  }, [step]);

  const stopAllAudio = () => {

    window.speechSynthesis.cancel();

    aiSpeechQueue.current = [];

    isProcessingQueue.current = false;

    isUserSpeakingRef.current = false;

    interimTranscriptRef.current = "";

    setIsAiSpeaking(false);

    setActiveAiSpeaker("");

    if (speechServiceRef.current) {

      try {

        stopSpeech();

      } catch (error) {

        console.error(
          "Failed to stop speech service:",
          error
        );

      }

      speechServiceRef.current = false;
    }
  };

  /* =======================================================
     DEEPGRAM STREAMING SPEECH
  ======================================================= */

  const startContinuousListening = async () => {

    if (speechServiceRef.current) {
      return;
    }

    if (step !== "gd") {
      return;
    }

    try {

      speechServiceRef.current = true;

      await startSpeech({

        onInterim: (text) => {
          interimTranscriptRef.current = text || "";
          console.log("📝 Interim transcript:", text);
        },

        onSpeechStarted: () => {
          if (isAiSpeaking) {
            console.log("🔇 Ignoring speech-started event — AI is speaking");
            return;
          }
          isUserSpeakingRef.current = true;
          console.log("🎤 User started speaking");
        },

        onReady: () => {
          console.log("🟢 Deepgram speech stream ready");
        },

        onFinal: async (text) => {
          const speechText = text?.trim();
          interimTranscriptRef.current = "";

          if (!speechText) {
            isUserSpeakingRef.current = false;
            processSpeechQueue();
            return;
          }

          console.log("🎯 User speech complete:", speechText);
          await handleUserUtteranceComplete(speechText);
        },

        onError: (error) => {
          console.error("❌ Deepgram speech error:", error);
          speechServiceRef.current = false;
          if (step === "gd") {
            setIsAiSpeaking(false);
            setActiveAiSpeaker("");
          }
        },
      });

    } catch (error) {
      speechServiceRef.current = false;
      console.error("❌ Failed to start Deepgram speech:", error);
    }
  };

  /* =======================================================
     USER SPEECH COMPLETE
  ======================================================= */

  const handleUserUtteranceComplete = async (speechText) => {
    isUserSpeakingRef.current = false;
    const cleanedSpeech = speechText?.trim();

    if (!cleanedSpeech) {
      processSpeechQueue();
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        speaker: "You",
        text: cleanedSpeech,
        avatar: "👤",
      },
    ]);

    setLoadingAI(true);
    aiSpeechQueue.current = [];
    isProcessingQueue.current = false;

    try {
      const ai = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/gd`,
        {
          sessionId,
          userSpeech: cleanedSpeech,
        },
      );

      const payloads = [];

      if (ai.data["Player 1"]) {
        payloads.push({
          speaker: "Player 1",
          text: ai.data["Player 1"],
          avatar: "🤖",
        });
      }

      if (ai.data["Player 2"]) {
        payloads.push({
          speaker: "Player 2",
          text: ai.data["Player 2"],
          avatar: "🤖",
        });
      }

      setHistory((prev) => [...prev, ...payloads]);
      aiSpeechQueue.current = [...aiSpeechQueue.current, ...payloads];
      processSpeechQueue();
    } catch (error) {
      console.error("Failed to process dialogue:", error);
      processSpeechQueue();
    } finally {
      setLoadingAI(false);
    }
  };

  /* =======================================================
     AI SPEECH QUEUE
  ======================================================= */

  const processSpeechQueue = () => {
    if (isUserSpeakingRef.current) return;
    if (isProcessingQueue.current) return;

    if (aiSpeechQueue.current.length === 0) {
      setIsAiSpeaking(false);
      setActiveAiSpeaker("");
      try {
        resumeSpeech();
        console.log("🎤 AI queue complete — microphone resumed");
      } catch (error) {
        console.error("❌ Failed to resume microphone:", error);
      }
      return;
    }

    isProcessingQueue.current = true;
    const currentSegment = aiSpeechQueue.current.shift();
    setActiveAiSpeaker(currentSegment.speaker);
    setIsAiSpeaking(true);

    try {
      pauseSpeech();
      console.log(`🔇 Microphone paused — ${currentSegment.speaker} is speaking`);
    } catch (error) {
      console.error("❌ Failed to pause microphone:", error);
    }

    try {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(currentSegment.text);
      speech.lang = "en-US";
      speech.pitch = 0.9;
      speech.rate = 0.95;

      speech.onend = () => {
        isProcessingQueue.current = false;
        console.log(`✅ ${currentSegment.speaker} finished speaking`);
        if (aiSpeechQueue.current.length > 0) {
          console.log(`🤖 ${aiSpeechQueue.current.length} AI segment(s) remaining — microphone stays paused`);
          processSpeechQueue();
          return;
        }
        processSpeechQueue();
      };

      speech.onerror = (event) => {
        console.error("❌ SpeechSynthesis segment error:", event);
        isProcessingQueue.current = false;
        if (aiSpeechQueue.current.length > 0) {
          processSpeechQueue();
          return;
        }
        processSpeechQueue();
      };

      window.speechSynthesis.speak(speech);
    } catch (err) {
      console.error("❌ SpeechSynthesis error:", err);
      isProcessingQueue.current = false;
      if (aiSpeechQueue.current.length > 0) {
        processSpeechQueue();
        return;
      }
      processSpeechQueue();
    }
  };

  /* =======================================================
     START GD
  ======================================================= */

 const startGD = async () => {
  try {
    console.log("🚀 Starting GD...");

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/gd/start`
    );

    console.log("🔥 GD START RESPONSE:", res.data);

    setSessionId(res.data.sessionId);
    setTopic(res.data.topic || "");

    const initialPayload = [
      {
        speaker: "Player 1",
        text: res.data.agents["Player 1"],
        avatar: "🤖",
      },
      {
        speaker: "Player 2",
        text: res.data.agents["Player 2"],
        avatar: "🤖",
      },
    ];

    setHistory(initialPayload);
    setStep("gd");

    aiSpeechQueue.current = [...initialPayload];

    setTimeout(() => {
      processSpeechQueue();
    }, 400);

  } catch (error) {
    console.error("🔥 Failed to start GD:", error);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
  }
};

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    await signOut(auth);
    stopAllAudio();
    setSessionId(null);
    setHistory([]);
    setTopic("");
    setStep("enter");
  };

  /* =======================================================
     EXIT GD
  ======================================================= */

  const handleExit = async () => {
    stopAllAudio();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/performance`,
        {
          uid: user.uid,
          topic,
          history,
        }
      );

      setSessionId(null);
      setStep("enter");
    } catch (err) {
      console.error(err);
      setSessionId(null);
      setStep("enter");
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#030305] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="
              absolute
              top-1/2
              left-1/2
              -translate-x-1/2
              -translate-y-1/2
              w-[500px]
              h-[500px]
              rounded-full
              bg-red-600/20
              blur-[140px]
            "
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="
            w-14
            h-14
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/[0.04]
            flex
            items-center
            justify-center
          ">
            <FaSpinner className="animate-spin text-red-400 text-xl" />
          </div>
          <p className="mt-5 text-sm uppercase tracking-[0.25em] text-white/35">
            Preparing your workspace
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="
      relative
      min-h-screen
      w-full
      bg-[#030305]
      text-gray-100
      overflow-hidden
      selection:bg-red-500/30
    ">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none">
        <div className="
          absolute
          -top-[30%]
          -left-[15%]
          w-[800px]
          h-[800px]
          rounded-full
          bg-red-600/[0.06]
          blur-[180px]
        " />
        <div className="
          absolute
          -bottom-[25%]
          right-[-10%]
          w-[700px]
          h-[700px]
          rounded-full
          bg-violet-600/[0.05]
          blur-[170px]
        " />
        <div className="
          absolute
          inset-0
          opacity-[0.018]
          bg-[linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)]
          bg-[size:80px_80px]
        " />
        <div className="
          absolute
          inset-0
          bg-[radial-gradient(ellipse_at_center,transparent_20%,#030305_80%)]
        " />
      </div>

      <AmbientParticles />

      {/* =====================================================
          COUNTDOWN
      ====================================================== */}

      {showCountdown && (
        <Countdown
          initialCount={3}
          onComplete={() => {
            setShowCountdown(false);
            startGD();
          }}
        />
      )}

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar
        user={user}
        streak={0}
        onLogout={handleLogout}
        onNavigateHome={() => {
          stopAllAudio();
          setSessionId(null);
          setHistory([]);
          setTopic("");
          setStep("enter");
        }}
      />

      {/* =====================================================
          HOW TO PLAY
      ====================================================== */}

      <AnimatePresence>
        {showHowToPlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-[999]
              flex
              items-center
              justify-center
              p-5
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-black/75
                backdrop-blur-xl
              "
              onClick={() => setShowHowToPlay(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="
                relative
                w-full
                max-w-xl
                max-h-[90vh]
                overflow-y-auto
                rounded-[28px]
                border
                border-white/[0.08]
                bg-[#09090c]
                p-7
                sm:p-9
                shadow-[0_40px_120px_rgba(0,0,0,0.7)]
              "
            >
              <div className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-28
                h-px
                bg-gradient-to-r
                from-transparent
                via-red-500
                to-transparent
              " />

              <button
                onClick={() => setShowHowToPlay(false)}
                className="
                  absolute
                  top-5
                  right-5
                  w-10
                  h-10
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.03]
                  flex
                  items-center
                  justify-center
                  text-white/40
                  hover:text-white
                  hover:bg-white/[0.06]
                  transition-all
                "
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="mb-8">
                <div className="
                  w-12
                  h-12
                  rounded-[14px]
                  bg-red-500/10
                  border
                  border-red-500/20
                  flex
                  items-center
                  justify-center
                  text-red-400
                  mb-5
                ">
                  <FiHelpCircle className="w-6 h-6" />
                </div>

                <p className="text-sm uppercase tracking-[0.2em] text-red-400/80">
                  Arena guide
                </p>

                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-2">
                  How the Arena works
                </h2>

                <p className="text-[15px] text-white/40 mt-3 leading-6">
                  A natural voice-driven discussion
                  environment designed to simulate
                  real group discussions.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  ["01", "Enter the Arena", "Initialize your live discussion environment."],
                  ["02", "Start the discussion", "AI participants introduce the topic and begin the conversation."],
                  ["03", "Speak naturally", "Speak after the AI finishes its turn. The microphone stays paused while AI is speaking."],
                  ["04", "AI responds", "Your speech is processed and the AI participants continue the discussion."],
                  ["05", "Review your performance", "Your complete discussion is analyzed when you exit the Arena."],
                ].map(([num, title, desc]) => (
                  <div
                    key={num}
                    className="
                      group
                      flex
                      gap-4
                      p-4
                      rounded-2xl
                      border
                      border-white/[0.06]
                      bg-white/[0.025]
                      hover:bg-white/[0.045]
                      transition-all
                    "
                  >
                    <div className="
                      flex-shrink-0
                      w-10
                      h-10
                      rounded-xl
                      bg-red-500/[0.08]
                      border
                      border-red-500/10
                      flex
                      items-center
                      justify-center
                    ">
                      <span className="text-sm font-bold text-red-400">{num}</span>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-white">{title}</p>
                      <p className="text-sm text-white/40 leading-6 mt-1">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="relative z-10 min-h-[calc(100vh-70px)]">

        {/* ===================================================
            ENTER EXPERIENCE
        ==================================================== */}

        {step === "enter" && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="
              min-h-[calc(100vh-70px)]
              flex
              items-center
              justify-center
              px-5
              sm:px-8
              py-14
            "
          >
            <div className="relative w-full max-w-6xl">

              {/* Center glow */}
              <div className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[550px]
                h-[550px]
                rounded-full
                bg-red-600/[0.06]
                blur-[130px]
                pointer-events-none
              " />

              {/* =================================================
                  HEADER ROW
              ================================================== */}

              <div className="relative mb-16 overflow-visible">
                {/* Ambient background blobs */}
                <motion.div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    -top-32
                    left-[18%]
                    h-[420px]
                    w-[420px]
                    rounded-full
                    bg-red-500/[0.08]
                    blur-[120px]
                  "
                  animate={{
                    x: [0, 80, -30, 0],
                    y: [0, -35, 30, 0],
                    scale: [1, 1.15, 0.92, 1],
                    opacity: [0.35, 0.55, 0.4, 0.35],
                  }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    top-10
                    h-[300px]
                    w-[300px]
                    rounded-full
                    bg-orange-400/[0.05]
                    blur-[110px]
                  "
                  animate={{
                    x: [0, -60, 20, 0],
                    y: [0, 40, -20, 0],
                    opacity: [0.2, 0.4, 0.25, 0.2],
                  }}
                  transition={{
                    duration: 11,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />

                {/* MAIN HERO */}
                <div className="
                  relative
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-end
                  lg:justify-between
                  gap-12
                  lg:gap-16
                ">
                  {/* LEFT CONTENT */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.12,
                        },
                      },
                    }}
                    className="relative max-w-3xl"
                  >
                    {/* AI WORKSPACE BADGE */}
                    <motion.div
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 20,
                          scale: 0.92,
                          filter: "blur(8px)",
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                      className="
                        relative
                        inline-flex
                        items-center
                        gap-3
                        px-4
                        py-2.5
                        rounded-full
                        border
                        border-red-400/[0.15]
                        bg-red-500/[0.035]
                        backdrop-blur-xl
                        overflow-hidden
                        mb-7
                        shadow-[0_0_40px_rgba(239,68,68,0.04)]
                      "
                    >
                      <motion.span
                        className="
                          absolute
                          inset-y-0
                          -left-20
                          w-20
                          bg-gradient-to-r
                          from-transparent
                          via-white/[0.08]
                          to-transparent
                          skew-x-[-20deg]
                        "
                        animate={{ x: ["0%", "500%"] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut",
                        }}
                      />

                      <span className="relative flex h-2 w-2">
                        <motion.span
                          className="absolute inset-0 rounded-full bg-red-400"
                          animate={{
                            scale: [1, 2.3, 1],
                            opacity: [0.7, 0, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                        <span className="
                          relative
                          h-2
                          w-2
                          rounded-full
                          bg-red-400
                          shadow-[0_0_12px_rgba(248,113,113,0.8)]
                        " />
                      </span>

                      <span className="
                        relative
                        text-[11px]
                        uppercase
                        tracking-[0.22em]
                        text-red-300/80
                        font-medium
                      ">
                        AI communication workspace
                      </span>
                    </motion.div>

                    {/* HEADING */}
                    <div className="overflow-hidden">
                      <motion.h1
                        variants={{
                          hidden: {},
                          visible: {
                            transition: {
                              delayChildren: 0.1,
                              staggerChildren: 0.08,
                            },
                          },
                        }}
                        className="
                          text-5xl
                          sm:text-6xl
                          lg:text-[5.5rem]
                          leading-[0.88]
                          tracking-[-0.065em]
                          font-semibold
                        "
                      >
                        <span className="block overflow-hidden">
                          <motion.span
                            variants={{
                              hidden: {
                                y: "110%",
                                opacity: 0,
                                filter: "blur(10px)",
                              },
                              visible: {
                                y: "0%",
                                opacity: 1,
                                filter: "blur(0px)",
                                transition: {
                                  duration: 1,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                              },
                            }}
                            className="block text-white"
                          >
                            Your AI
                          </motion.span>
                        </span>

                        <span className="block overflow-hidden mt-2">
                          <motion.span
                            variants={{
                              hidden: {
                                y: "110%",
                                opacity: 0,
                                filter: "blur(14px)",
                              },
                              visible: {
                                y: "0%",
                                opacity: 1,
                                filter: "blur(0px)",
                                transition: {
                                  duration: 1.15,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                              },
                            }}
                            className="
                              relative
                              inline-block
                              bg-[length:200%_auto]
                              bg-gradient-to-r
                              from-red-400
                              via-orange-300
                              to-amber-200
                              bg-clip-text
                              text-transparent
                              animate-[gradient_5s_ease_infinite]
                            "
                          >
                            practice ground.
                            <span
                              aria-hidden="true"
                              className="
                                pointer-events-none
                                absolute
                                inset-0
                                -z-10
                                blur-2xl
                                bg-gradient-to-r
                                from-red-500/20
                                via-orange-400/15
                                to-transparent
                              "
                            />
                          </motion.span>
                        </span>
                      </motion.h1>
                    </div>

                    {/* DESCRIPTION */}
                    <motion.div
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 24,
                          filter: "blur(8px)",
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.9,
                            delay: 0.35,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                      className="mt-7 max-w-xl"
                    >
                      <p className="
                        text-base
                        sm:text-lg
                        text-white/40
                        leading-8
                      ">
                        Build communication confidence through{" "}
                        <span className="text-white/65">
                          real-time discussions
                        </span>
                        , AI feedback, and deliberate practice.
                      </p>
                    </motion.div>

                    {/* MICRO STATUS LINE */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.65, duration: 0.7 },
                        },
                      }}
                      className="
                        mt-8
                        flex
                        items-center
                        gap-3
                        text-[11px]
                        uppercase
                        tracking-[0.18em]
                        text-white/20
                      "
                    >
                      <span className="flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        AI systems online
                      </span>
                      <span className="h-3 w-px bg-white/[0.08]" />
                      <span>Practice • Improve • Repeat</span>
                    </motion.div>
                  </motion.div>

                  {/* RIGHT – LIVE SPEAKING FLOW */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: 40,
                      y: 15,
                      scale: 0.94,
                      filter: "blur(10px)",
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="
                      relative
                      self-start
                      lg:self-end
                      shrink-0
                    "
                  >
                    <SpeakingFlow />
                  </motion.div>
                </div>
              </div>

              {/* =================================================
                  PRODUCT GRID
              ================================================== */}

              <div className="relative grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-5">
                {/* GD ARENA */}
                <motion.div
                  variants={fadeUp}
                  className="
                    group
                    relative
                    overflow-hidden
                    min-h-[420px]
                    rounded-[30px]
                    border
                    border-red-500/15
                    bg-[#09090c]
                    p-7
                    sm:p-9
                  "
                >
                  <div className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_80%_25%,rgba(239,68,68,0.12),transparent_32%),radial-gradient(circle_at_65%_90%,rgba(249,115,22,0.06),transparent_30%)]
                  " />
                  <div className="
                    absolute
                    -right-20
                    -bottom-20
                    w-72
                    h-72
                    rounded-full
                    bg-red-600/[0.06]
                    blur-[100px]
                  " />

                  <div className="absolute top-0 right-0 w-[55%] h-full opacity-[0.06] pointer-events-none">
                    <div className="absolute right-10 top-12 w-48 h-48 rounded-full border border-red-400" />
                    <div className="absolute right-20 top-20 w-28 h-28 rounded-full border border-red-400" />
                    <div className="absolute right-0 top-1/2 w-64 h-px bg-red-400 rotate-[20deg]" />
                  </div>

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="
                        w-13
                        h-13
                        rounded-2xl
                        bg-red-500/10
                        border
                        border-red-500/20
                        flex
                        items-center
                        justify-center
                        text-red-400
                      ">
                        <FiMic className="w-6 h-6" />
                      </div>

                      <div className="
                        flex
                        items-center
                        gap-2
                        px-3.5
                        py-2
                        rounded-full
                        bg-emerald-500/[0.05]
                        border
                        border-emerald-500/10
                      ">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs uppercase tracking-[0.16em] text-emerald-400/80">
                          Live
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto max-w-xl">
                      <p className="text-sm uppercase tracking-[0.2em] text-red-400/70 font-medium">
                        GD Arena
                      </p>
                      <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-white mt-2">
                        Practice under pressure.
                      </h2>
                      <p className="text-[15px] sm:text-base text-white/40 leading-7 mt-4 max-w-lg">
                        Enter a live AI-moderated group
                        discussion. Speak, interrupt,
                        challenge ideas, and receive
                        performance insights.
                      </p>

                      <div className="flex flex-wrap gap-2.5 mt-6">
                        {["Real-time voice", "AI participants", "Performance analysis"].map((item) => (
                          <span
                            key={item}
                            className="
                              px-3.5
                              py-2
                              rounded-lg
                              bg-white/[0.03]
                              border
                              border-white/[0.06]
                              text-xs
                              text-white/40
                            "
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 mt-8">
                        <motion.button
                          type="button"
                          onClick={() => setShowCountdown(true)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="
                            cursor-pointer
                            group/button
                            h-13
                            px-7
                            rounded-xl
                            bg-gradient-to-r
                            from-red-600
                            to-orange-500
                            text-white
                            text-sm
                            font-semibold
                            flex
                            items-center
                            gap-2.5
                            shadow-[0_12px_40px_rgba(220,38,38,0.18)]
                            hover:shadow-[0_16px_50px_rgba(220,38,38,0.28)]
                            transition-shadow
                          "
                        >
                          <FiPlay className="w-4 h-4 fill-current" />
                          Start GD
                          <FiArrowRight className="
                            w-4
                            h-4
                            group-hover/button:translate-x-0.5
                            transition-transform
                          " />
                        </motion.button>

                        <button
                          type="button"
                          onClick={() => setShowHowToPlay(true)}
                          className="
                            cursor-pointer
                            h-13
                            px-6
                            rounded-xl
                            border
                            border-white/[0.08]
                            bg-white/[0.025]
                            hover:bg-white/[0.05]
                            text-white/50
                            hover:text-white
                            text-sm
                            font-medium
                            flex
                            items-center
                            gap-2.5
                            transition-all
                          "
                        >
                          <FiHelpCircle className="w-4 h-4" />
                          How it works
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* RIGHT PRODUCT COLUMN */}
                <div className="grid grid-cols-1 gap-5">
                  <ProductCard
                    type="Knowledge AI"
                    title="StudyMate"
                    description="Upload documents. Understand them. Ask anything."
                    icon={FiFileText}
                    accent="violet"
                    onClick={() => navigate("/studymate")}
                  >
                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <div className="
                          flex-1
                          h-10
                          rounded-xl
                          border
                          border-violet-500/10
                          bg-violet-500/[0.04]
                          flex
                          items-center
                          px-3
                          gap-2
                        ">
                          <FiFileText className="w-4 h-4 text-violet-400/70" />
                          <div className="flex-1">
                            <div className="h-1.5 w-20 rounded-full bg-white/10" />
                            <div className="h-1.5 w-12 rounded-full bg-white/5 mt-1.5" />
                          </div>
                        </div>
                        <span className="text-violet-400/50 text-sm">→</span>
                        <div className="
                          w-10
                          h-10
                          rounded-xl
                          bg-violet-500/10
                          border
                          border-violet-500/10
                          flex
                          items-center
                          justify-center
                        ">
                          <FiMessageCircle className="w-4.5 h-4.5 text-violet-400" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 mt-3.5">
                        <span className="text-xs text-white/30">PDF</span>
                        <span className="text-white/15">→</span>
                        <span className="text-xs text-white/30">RAG</span>
                        <span className="text-white/15">→</span>
                        <span className="text-xs text-violet-400/70">AI ANSWERS</span>
                      </div>
                    </div>
                  </ProductCard>

                  <motion.div
                    variants={fadeUp}
                    className="
                      rounded-[22px]
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      p-5
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                          Your progress
                        </p>
                        <p className="text-xl font-semibold text-white mt-1.5">
                          Keep building.
                        </p>
                      </div>
                      <div className="
                        w-11
                        h-11
                        rounded-xl
                        bg-emerald-500/10
                        border
                        border-emerald-500/10
                        flex
                        items-center
                        justify-center
                        text-emerald-400
                      ">
                        <FiTrendingUp className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 mt-5">
                      <div className="rounded-xl bg-white/[0.025] p-3.5">
                        <p className="text-lg font-bold text-white">∞</p>
                        <p className="text-xs text-white/30 mt-1">Sessions</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.025] p-3.5">
                        <p className="text-lg font-bold text-white">AI</p>
                        <p className="text-xs text-white/30 mt-1">Powered</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.025] p-3.5">
                        <p className="text-lg font-bold text-white">24/7</p>
                        <p className="text-xs text-white/30 mt-1">Practice</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* BOTTOM SIGNALS */}
              <motion.div
                variants={fadeUp}
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-x-7
                  gap-y-3
                  mt-10
                "
              >
                {[
                  [FiRadio, "Real-time voice"],
                  [FiUsers, "AI participants"],
                  [FiShield, "Private workspace"],
                  [FiZap, "Instant feedback"],
                ].map(([Icon, text]) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-white/30" />
                    <span className="text-sm text-white/35">{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* ===================================================
            GD ARENA
        ==================================================== */}

        {step === "gd" && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="
              min-h-[calc(100vh-70px)]
              h-auto
              w-full
              max-w-5xl
              mx-auto
              px-4
              sm:px-6
              py-7
              flex
              flex-col
              overflow-visible
            "
          >
            <GDHeader onExit={handleExit} />

            <div className="
              relative
              overflow-hidden
              rounded-[22px]
              border
              border-red-500/10
              bg-red-500/[0.025]
              p-5
              sm:p-6
              mb-5
            ">
              <div className="
                absolute
                top-0
                right-0
                w-44
                h-44
                rounded-full
                bg-red-500/[0.06]
                blur-[80px]
              " />
              <div className="relative">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <FiTarget className="w-4 h-4 text-red-400/70" />
                  <span className="text-sm uppercase tracking-[0.16em] text-red-400/70">
                    Discussion topic
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
                  {topic || "Loading discussion topic..."}
                </p>
              </div>
            </div>

            <GDStatusBar
              isAiSpeaking={isAiSpeaking}
              activeAiSpeaker={activeAiSpeaker}
              loadingAI={loadingAI}
            />

            <DiscussionStream
              history={history}
              chatContainerRef={chatContainerRef}
              isAiSpeaking={isAiSpeaking}
              activeAiSpeaker={activeAiSpeaker}
            />
          </motion.section>
        )}
      </main>
    </div>
  );
}