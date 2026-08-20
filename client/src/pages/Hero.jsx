import {
  useState,
  useRef,
  useEffect,
} from "react";

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

import {
  startGD as startGDRequest,
  continueGD,
} from "../services/gd.service";

import {
  getStreak as getStreakRequest,
  updateStreak,
} from "../services/streak.service";



// Custom Components
import Navbar from "../components/Navbar";
import Countdown from "../components/Countdown";

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
   STREAK DISPLAY
========================================================= */

function StreakBadge({
  streak,
  onClick,
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className="
        group
        flex
        items-center
        gap-3
        px-4
        py-2.5
        rounded-2xl
        border
        border-orange-500/15
        bg-orange-500/[0.04]
        hover:bg-orange-500/[0.07]
        transition-all
      "
    >
      <div
        className="
          w-9
          h-9
          rounded-xl
          bg-orange-500/10
          border
          border-orange-500/15
          flex
          items-center
          justify-center
          text-orange-400
          text-lg
        "
      >
        🔥
      </div>

      <div className="text-left">

        <p className="text-base font-bold text-white">
          {streak}
        </p>

        <p className="text-[11px] uppercase tracking-[0.14em] text-white/35">
          Day streak
        </p>

      </div>

      <FiChevronRight
        className="
          w-4
          h-4
          text-white/20
          group-hover:text-orange-400
          transition-colors
        "
      />

    </motion.button>
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

  const [streak, setStreak] = useState(0);
  const [lastShownStreak, setLastShownStreak] =
    useState(0);

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

  const [showStreakPopup, setShowStreakPopup] =
    useState(false);

  const [latestStreak, setLatestStreak] =
    useState(0);

  const [showHowToPlay, setShowHowToPlay] =
    useState(false);

  const chatContainerRef =
    useRef(null);

  const recognitionRef =
    useRef(null);

  const silenceTimeoutRef =
    useRef(null);

  const isUserSpeakingRef =
    useRef(false);

  const fullSpeechRef =
    useRef("");

  const aiSpeechQueue =
    useRef([]);

  const isProcessingQueue =
    useRef(false);

  /* =======================================================
     FETCH STREAK
  ======================================================= */

  useEffect(() => {
    if (!user?.uid) return;

    const fetchStreak = async () => {
      try {
        console.log("🔥 Fetching streak:", user.uid);

        const data = await getStreakRequest(user.uid);

        const currentStreak = Number(data?.streak ?? 0);

        console.log("🔥 Current streak:", currentStreak);

        setStreak(currentStreak);
        setLastShownStreak(currentStreak);
      } catch (error) {
        console.error(
          "❌ Failed to fetch streak:",
          error.response?.data || error.message
        );
      }
    };

    fetchStreak();
  }, [user?.uid]);

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

    if (silenceTimeoutRef.current) {
      clearTimeout(
        silenceTimeoutRef.current
      );
    }

    aiSpeechQueue.current = [];
    isProcessingQueue.current = false;
    isUserSpeakingRef.current = false;
    fullSpeechRef.current = "";

    setIsAiSpeaking(false);
    setActiveAiSpeaker("");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart =
          null;

        recognitionRef.current.onresult =
          null;

        recognitionRef.current.onerror =
          null;

        recognitionRef.current.onend =
          null;

        recognitionRef.current.stop();
      } catch (e) {}

      recognitionRef.current = null;
    }
  };

  /* =======================================================
     SPEECH RECOGNITION
  ======================================================= */

  const startContinuousListening = () => {
    const SR =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SR) {
      alert(
        "Speech Recognition not supported in this browser."
      );

      return;
    }

    if (recognitionRef.current) return;

    const recognition =
      new SR();

    recognitionRef.current =
      recognition;

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log(
        "Continuous microphone engine live."
      );
    };

    recognition.onresult = (e) => {
      if (!isUserSpeakingRef.current) {
        isUserSpeakingRef.current =
          true;

        window.speechSynthesis.cancel();

        isProcessingQueue.current =
          false;

        setIsAiSpeaking(false);
        setActiveAiSpeaker("");
      }

      if (silenceTimeoutRef.current) {
        clearTimeout(
          silenceTimeoutRef.current
        );
      }

      silenceTimeoutRef.current =
        setTimeout(() => {
          handleUserUtteranceComplete();
        }, 2500);

      for (
        let i = e.resultIndex;
        i < e.results.length;
        i++
      ) {
        if (e.results[i].isFinal) {
          fullSpeechRef.current +=
            " " +
            e.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== "no-speech") {
        console.error(
          "Speech recognition engine glitch:",
          e.error
        );
      }
    };

    recognition.onend = () => {
      if (
        step === "gd" &&
        recognitionRef.current
      ) {
        try {
          recognition.start();
        } catch (err) {}
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(
        "Failed to boot speech capture:",
        e
      );
    }
  };

  /* =======================================================
     USER SPEECH COMPLETE
  ======================================================= */

  const handleUserUtteranceComplete =
    async () => {
      isUserSpeakingRef.current =
        false;

      const speechText =
        fullSpeechRef.current.trim();

      fullSpeechRef.current = "";

      if (!speechText) {
        processSpeechQueue();
        return;
      }

      setHistory((prev) => [
        ...prev,
        {
          speaker: "You",
          text: speechText,
          avatar: "👤",
        },
      ]);

      setLoadingAI(true);

      aiSpeechQueue.current = [];
      isProcessingQueue.current = false;

      try {
        const ai = await continueGD(
          sessionId,
          speechText
        );

        const payloads = [];

        if (ai?.["Player 1"]) {
          payloads.push({
            speaker: "Player 1",
            text: ai["Player 1"],
            avatar: "🤖",
          });
        }

        if (ai?.["Player 2"]) {
          payloads.push({
            speaker: "Player 2",
            text: ai["Player 2"],
            avatar: "🤖",
          });
        }

        setHistory((prev) => [
          ...prev,
          ...payloads,
        ]);

        aiSpeechQueue.current = [
          ...aiSpeechQueue.current,
          ...payloads,
        ];

        processSpeechQueue();

      } catch (error) {
        console.error(
          "Failed to process dialogue:",
          error
        );

        processSpeechQueue();

      } finally {
        setLoadingAI(false);
      }
    };

  /* =======================================================
     AI SPEECH QUEUE
  ======================================================= */

  const processSpeechQueue = () => {
    if (
      isUserSpeakingRef.current ||
      isProcessingQueue.current ||
      aiSpeechQueue.current.length === 0
    ) {
      return;
    }

    isProcessingQueue.current =
      true;

    const currentSegment =
      aiSpeechQueue.current.shift();

    setActiveAiSpeaker(
      currentSegment.speaker
    );

    setIsAiSpeaking(true);

    try {
      window.speechSynthesis.cancel();

      const speech =
        new SpeechSynthesisUtterance(
          currentSegment.text
        );

      speech.lang = "en-US";
      speech.pitch = 0.9;
      speech.rate = 0.95;

      speech.onend = () => {
        isProcessingQueue.current =
          false;

        setIsAiSpeaking(false);
        setActiveAiSpeaker("");

        processSpeechQueue();
      };

      speech.onerror = () => {
        isProcessingQueue.current =
          false;

        setIsAiSpeaking(false);
        setActiveAiSpeaker("");

        processSpeechQueue();
      };

      window.speechSynthesis.speak(
        speech
      );

    } catch (err) {
      console.error(
        "SpeechSynthesis error:",
        err
      );

      isProcessingQueue.current =
        false;

      setIsAiSpeaking(false);
      setActiveAiSpeaker("");

      processSpeechQueue();
    }
  };

  /* =======================================================
     START GD
  ======================================================= */

  const startGD = async () => {
    try {
      console.log("🚀 Starting GD...");

      const res = await startGDRequest();

      console.log("🔥 GD Started:", res);

      setSessionId(res.sessionId);
      setTopic(res.topic);

      const initialPayload = [
        {
          speaker: "Player 1",
          text: res.agents?.["Player 1"] || "",
          avatar: "🤖",
        },
        {
          speaker: "Player 2",
          text: res.agents?.["Player 2"] || "",
          avatar: "🤖",
        },
      ];

      setHistory(
        initialPayload
      );

      setStep("gd");

      aiSpeechQueue.current = [
        ...initialPayload,
      ];

      setTimeout(() => {
        processSpeechQueue();
      }, 400);

    } catch (error) {
      console.error(
        "Failed to start GD:",
        error
      );
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
      if (!user?.uid) {
        throw new Error("User is not authenticated.");
      }

     

      console.log("🔥 Updating streak...");

      const res = await updateStreak(
        user.uid,
        user.email
      );

      console.log("🔥 Streak response:", res);

      const newStreak = Number(
        res?.streak ?? 0
      );

      setStreak(newStreak);
      setSessionId(null);

      if (
        newStreak >
        lastShownStreak
      ) {
        setLatestStreak(
          newStreak
        );

        setShowStreakPopup(
          true
        );

        setLastShownStreak(
          newStreak
        );

        setTimeout(() => {
          setShowStreakPopup(
            false
          );

          setStep("enter");
        }, 2200);
      } else {
        setStep("enter");
      }

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

          <div
            className="
              w-14
              h-14
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/[0.04]
              flex
              items-center
              justify-center
            "
          >
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
    <div
      className="
        relative
        min-h-screen
        w-full
        bg-[#030305]
        text-gray-100
        overflow-hidden
        selection:bg-red-500/30
      "
    >

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none">

        <div
          className="
            absolute
            -top-[30%]
            -left-[15%]
            w-[800px]
            h-[800px]
            rounded-full
            bg-red-600/[0.06]
            blur-[180px]
          "
        />

        <div
          className="
            absolute
            -bottom-[25%]
            right-[-10%]
            w-[700px]
            h-[700px]
            rounded-full
            bg-violet-600/[0.05]
            blur-[170px]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
            bg-[linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)]
            bg-[size:80px_80px]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(ellipse_at_center,transparent_20%,#030305_80%)]
          "
        />

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
          STREAK POPUP
      ====================================================== */}

      <AnimatePresence>
        {showStreakPopup && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              bg-black/80
              backdrop-blur-xl
              p-6
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              transition={{
                duration: 0.45,
                ease,
              }}
              className="
                relative
                overflow-hidden
                w-full
                max-w-[400px]
                rounded-[28px]
                border
                border-orange-500/20
                bg-[#0b0b0e]
                p-10
                text-center
                shadow-[0_30px_120px_rgba(0,0,0,0.7)]
              "
            >

              <div
                className="
                  absolute
                  top-0
                  left-1/2
                  -translate-x-1/2
                  w-40
                  h-40
                  bg-orange-500/15
                  rounded-full
                  blur-[70px]
                "
              />

              <div className="relative">

                <div
                  className="
                    mx-auto
                    w-20
                    h-20
                    rounded-[24px]
                    bg-orange-500/10
                    border
                    border-orange-500/20
                    flex
                    items-center
                    justify-center
                    text-5xl
                    shadow-[0_0_50px_rgba(249,115,22,0.15)]
                  "
                >
                  🔥
                </div>

                <p className="text-sm uppercase tracking-[0.25em] text-orange-400/80 mt-7">
                  Consistency unlocked
                </p>

                <h2 className="text-7xl font-black tracking-[-0.07em] text-white mt-2">
                  {latestStreak}
                </h2>

                <p className="text-sm text-white/40 uppercase tracking-[0.2em] mt-1">
                  Day streak
                </p>

                <p className="text-[15px] text-white/50 leading-7 mt-5">
                  {latestStreak === 1 &&
                    "Nice start. Consistency begins today."}

                  {latestStreak >= 2 &&
                    latestStreak <= 3 &&
                    "You're building momentum."}

                  {latestStreak >= 4 &&
                    latestStreak <= 6 &&
                    "Strong consistency. Keep going."}

                  {latestStreak >= 7 &&
                    "Excellent discipline. Don't break the chain."}
                </p>

                <div className="mt-7 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${Math.min(
                        latestStreak * 10,
                        100
                      )}%`,
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-orange-600
                      to-amber-400
                    "
                  />

                </div>

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar
        user={user}
        streak={streak}
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
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
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
              onClick={() =>
                setShowHowToPlay(false)
              }
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                ease,
              }}
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

              <div
                className="
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
                "
              />

              <button
                onClick={() =>
                  setShowHowToPlay(false)
                }
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

                <div
                  className="
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
                  "
                >
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
                  [
                    "01",
                    "Enter the Arena",
                    "Initialize your live discussion environment.",
                  ],
                  [
                    "02",
                    "Start the discussion",
                    "AI participants introduce the topic and begin the conversation.",
                  ],
                  [
                    "03",
                    "Speak naturally",
                    "Express your ideas whenever you want. You can interrupt AI speakers naturally.",
                  ],
                  [
                    "04",
                    "AI responds",
                    "Your speech is processed and the AI participants continue the discussion.",
                  ],
                
                ].map(
                  ([num, title, desc]) => (
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

                      <div
                        className="
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
                        "
                      >
                        <span className="text-sm font-bold text-red-400">
                          {num}
                        </span>
                      </div>

                      <div>

                        <p className="text-[15px] font-semibold text-white">
                          {title}
                        </p>

                        <p className="text-sm text-white/40 leading-6 mt-1">
                          {desc}
                        </p>

                      </div>

                    </div>
                  )
                )}

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

              <div
                className="
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
                "
              />

              {/* =================================================
                  HEADER ROW
              ================================================== */}

              <div
                className="
                  relative
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-end
                  lg:justify-between
                  gap-8
                  mb-12
                "
              >

                <motion.div
                  variants={fadeUp}
                  className="max-w-2xl"
                >

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2.5
                      px-4
                      py-2
                      rounded-full
                      border
                      border-red-500/15
                      bg-red-500/[0.04]
                      mb-6
                    "
                  >

                    <span
                      className="
                        relative
                        flex
                        w-2
                        h-2
                      "
                    >

                      <span
                        className="
                          absolute
                          inset-0
                          rounded-full
                          bg-red-400
                          animate-ping
                          opacity-50
                        "
                      />

                      <span className="relative w-2 h-2 rounded-full bg-red-400" />

                    </span>

                    <span className="text-xs uppercase tracking-[0.2em] text-red-400/90 font-medium">
                      AI communication workspace
                    </span>

                  </div>

                  <h1
                    className="
                      text-4xl
                      sm:text-5xl
                      lg:text-[4.5rem]
                      leading-[0.95]
                      tracking-[-0.06em]
                      font-semibold
                    "
                  >

                    <span className="text-white">
                      Your AI
                    </span>

                    <br />

                    <span
                      className="
                        bg-gradient-to-r
                        from-red-400
                        via-orange-400
                        to-amber-300
                        bg-clip-text
                        text-transparent
                      "
                    >
                      practice ground.
                    </span>

                  </h1>

                  <p className="mt-6 text-base sm:text-lg text-white/40 leading-8 max-w-xl">
                    Build communication confidence through
                    real-time discussions, AI feedback,
                    and deliberate practice.
                  </p>

                </motion.div>

                {/* STREAK */}

                <motion.div
                  variants={fadeUp}
                  className="self-start lg:self-auto"
                >
                  <StreakBadge
                    streak={streak}
                    onClick={() => {}}
                  />
                </motion.div>

              </div>

              {/* =================================================
                  PRODUCT GRID
              ================================================== */}

              <div className="relative grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-5">

                {/* =================================================
                    GD ARENA
                ================================================== */}

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

                  {/* Background */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-[radial-gradient(circle_at_80%_25%,rgba(239,68,68,0.12),transparent_32%),radial-gradient(circle_at_65%_90%,rgba(249,115,22,0.06),transparent_30%)]
                    "
                  />

                  <div
                    className="
                      absolute
                      -right-20
                      -bottom-20
                      w-72
                      h-72
                      rounded-full
                      bg-red-600/[0.06]
                      blur-[100px]
                    "
                  />

                  {/* Decorative lines */}

                  <div className="absolute top-0 right-0 w-[55%] h-full opacity-[0.06] pointer-events-none">

                    <div className="absolute right-10 top-12 w-48 h-48 rounded-full border border-red-400" />

                    <div className="absolute right-20 top-20 w-28 h-28 rounded-full border border-red-400" />

                    <div className="absolute right-0 top-1/2 w-64 h-px bg-red-400 rotate-[20deg]" />

                  </div>

                  <div className="relative z-10 h-full flex flex-col">

                    <div className="flex items-start justify-between">

                      <div
                        className="
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
                        "
                      >
                        <FiMic className="w-6 h-6" />
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          px-3.5
                          py-2
                          rounded-full
                          bg-emerald-500/[0.05]
                          border
                          border-emerald-500/10
                        "
                      >

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
                        challenge ideas.
                      </p>

                      <div className="flex flex-wrap gap-2.5 mt-6">

                        {[
                          "Real-time voice",
                          "AI participants",
                          
                        ].map((item) => (
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
                          onClick={() =>
                            setShowCountdown(true)
                          }
                          whileHover={{
                            scale: 1.02,
                          }}
                          whileTap={{
                            scale: 0.98,
                          }}
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

                          <FiArrowRight
                            className="
                              w-4
                              h-4
                              group-hover/button:translate-x-0.5
                              transition-transform
                            "
                          />

                        </motion.button>

                        <button
                          type="button"
                          onClick={() =>
                            setShowHowToPlay(true)
                          }
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

                {/* =================================================
                    RIGHT PRODUCT COLUMN
                ================================================== */}

                <div className="grid grid-cols-1 gap-5">

                  {/* STUDYSYNC */}

                  <ProductCard
                    type="Knowledge AI"
                    title="StudySync"
                    description="Upload documents. Understand them. Ask anything."
                    icon={FiFileText}
                    accent="violet"
                    onClick={() =>
                      navigate("/studymate")
                    }
                  >

                    <div className="mt-5">

                      <div className="flex items-center gap-2">

                        <div
                          className="
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
                          "
                        >

                          <FiFileText className="w-4 h-4 text-violet-400/70" />

                          <div className="flex-1">

                            <div className="h-1.5 w-20 rounded-full bg-white/10" />

                            <div className="h-1.5 w-12 rounded-full bg-white/5 mt-1.5" />

                          </div>

                        </div>

                        <span className="text-violet-400/50 text-sm">
                          →
                        </span>

                        <div
                          className="
                            w-10
                            h-10
                            rounded-xl
                            bg-violet-500/10
                            border
                            border-violet-500/10
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <FiMessageCircle className="w-4.5 h-4.5 text-violet-400" />
                        </div>

                      </div>

                      <div className="flex items-center gap-2.5 mt-3.5">

                        <span className="text-xs text-white/30">
                          PDF
                        </span>

                        <span className="text-white/15">
                          →
                        </span>

                        <span className="text-xs text-white/30">
                          RAG
                        </span>

                        <span className="text-white/15">
                          →
                        </span>

                        <span className="text-xs text-violet-400/70">
                          AI ANSWERS
                        </span>

                      </div>

                    </div>

                  </ProductCard>

                  {/* QUICK STATS */}

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

                      <div
                        className="
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
                        "
                      >
                        <FiTrendingUp className="w-5 h-5" />
                      </div>

                    </div>

                    <div className="grid grid-cols-3 gap-2.5 mt-5">

                      <div className="rounded-xl bg-white/[0.025] p-3.5">

                        <p className="text-lg font-bold text-white">
                          {streak}
                        </p>

                        <p className="text-xs text-white/30 mt-1">
                          Streak
                        </p>

                      </div>

                      <div className="rounded-xl bg-white/[0.025] p-3.5">

                        <p className="text-lg font-bold text-white">
                          AI
                        </p>

                        <p className="text-xs text-white/30 mt-1">
                          Powered
                        </p>

                      </div>

                      <div className="rounded-xl bg-white/[0.025] p-3.5">

                        <p className="text-lg font-bold text-white">
                          24/7
                        </p>

                        <p className="text-xs text-white/30 mt-1">
                          Practice
                        </p>

                      </div>

                    </div>

                  </motion.div>

                </div>

              </div>

              {/* =================================================
                  BOTTOM SIGNALS
              ================================================== */}

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
                  [
                    FiRadio,
                    "Real-time voice",
                  ],
                  [
                    FiUsers,
                    "AI participants",
                  ],
                  [
                    FiShield,
                    "Private workspace",
                  ],
                  [
                    FiZap,
                    "Instant feedback",
                  ],
                ].map(
                  ([Icon, text]) => (
                    <div
                      key={text}
                      className="flex items-center gap-2.5"
                    >

                      <Icon className="w-4 h-4 text-white/30" />

                      <span className="text-sm text-white/35">
                        {text}
                      </span>

                    </div>
                  )
                )}

              </motion.div>

            </div>

          </motion.section>
        )}

        {/* ===================================================
            GD ARENA
        ==================================================== */}

        {step === "gd" && (
          <motion.section
            initial={{
              opacity: 0,
              y: 15,
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
              h-[calc(100vh-70px)]
              w-full
              max-w-5xl
              mx-auto
              px-4
              sm:px-6
              py-5
              flex
              flex-col
              overflow-hidden
            "
          >

            {/* =================================================
                ARENA HEADER
            ================================================== */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

              <div>

                <div className="flex items-center gap-2.5">

                  <span className="relative flex w-2.5 h-2.5">

                    <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60" />

                    <span className="relative w-2.5 h-2.5 rounded-full bg-red-400" />

                  </span>

                  <span className="text-sm uppercase tracking-[0.2em] text-red-400/80">
                    Live Arena
                  </span>

                </div>

                <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-2">
                  Group discussion
                </h1>

              </div>

              <div className="flex items-center gap-2.5">

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

                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                  <span className="text-xs uppercase tracking-[0.14em] text-emerald-400/80">
                    Connected
                  </span>

                </div>

                <button
                  onClick={handleExit}
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
                    transition-all
                  "
                >
                  Exit
                </button>

              </div>

            </div>

            {/* =================================================
                TOPIC
            ================================================== */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[22px]
                border
                border-red-500/10
                bg-red-500/[0.025]
                p-5
                sm:p-6
                mb-5
              "
            >

              <div
                className="
                  absolute
                  top-0
                  right-0
                  w-44
                  h-44
                  rounded-full
                  bg-red-500/[0.06]
                  blur-[80px]
                "
              />

              <div className="relative">

                <div className="flex items-center gap-2.5 mb-2.5">

                  <FiTarget className="w-4 h-4 text-red-400/70" />

                  <span className="text-sm uppercase tracking-[0.16em] text-red-400/70">
                    Discussion topic
                  </span>

                </div>

                <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
                  {topic}
                </p>

              </div>

            </div>

            {/* =================================================
                STATUS BAR
            ================================================== */}

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

              <div className="flex flex-wrap items-center gap-2.5">

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

            {/* =================================================
                DISCUSSION STREAM
            ================================================== */}

            <div
              className="
                flex-1
                min-h-0
                rounded-[24px]
                border
                border-white/[0.06]
                bg-white/[0.015]
                overflow-hidden
                flex
                flex-col
              "
            >

              {/* Stream Header */}

              <div
                className="
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
                    <FiMessageCircle className="w-4.5 h-4.5 text-white/40" />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-white">
                      Discussion stream
                    </p>

                    <p className="text-xs text-white/35 mt-0.5">
                      Live conversation transcript
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2.5">

                  <FiClock className="w-4 h-4 text-white/25" />

                  <span className="text-xs text-white/35">
                    Live
                  </span>

                </div>

              </div>

              {/* Messages */}

              <div
                ref={chatContainerRef}
                className="
                  flex-1
                  min-h-0
                  overflow-y-auto
                  overscroll-contain
                  p-4
                  sm:p-5
                  space-y-3.5
                  scrollbar-thin
                  scrollbar-thumb-white/10
                  scrollbar-track-transparent
                "
              >

                {history.length === 0 && (
                  <div className="h-full flex items-center justify-center">

                    <div className="text-center">

                      <FiMessageCircle className="w-10 h-10 text-white/15 mx-auto" />

                      <p className="text-sm text-white/30 mt-4">
                        Waiting for the discussion...
                      </p>

                    </div>

                  </div>
                )}

                {history.map(
                  (msg, index) => {
                    const isUser =
                      msg.speaker === "You";

                    return (
                      <motion.div
                        key={index}
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
                          p-4
                          sm:p-5
                          rounded-[18px]
                          border
                          ${
                            isUser
                              ? "bg-blue-500/[0.045] border-blue-500/10"
                              : "bg-violet-500/[0.035] border-violet-500/10"
                          }
                        `}
                      >

                        <div className="flex gap-3.5">

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
                              ${
                                isUser
                                  ? "bg-blue-500/10 border border-blue-500/10"
                                  : "bg-violet-500/10 border border-violet-500/10"
                              }
                            `}
                          >
                            {msg.avatar}
                          </div>

                          <div className="min-w-0 flex-1">

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
                                <span className="text-[10px] uppercase tracking-wider text-blue-400/50">
                                  You
                                </span>
                              )}

                            </div>

                            <p className="text-[15px] text-white/70 leading-7 mt-2">
                              {msg.text}
                            </p>

                          </div>

                        </div>

                      </motion.div>
                    );
                  }
                )}


              </div>

              {/* Bottom status */}

              <div
                className="
                  px-5
                  py-3.5
                  border-t
                  border-white/[0.05]
                  flex
                  items-center
                  justify-center
                  gap-2.5
                "
              >

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

                <span className="text-xs uppercase tracking-[0.16em] text-white/35">
                  {isAiSpeaking
                    ? `${activeAiSpeaker} is speaking`
                    : "Microphone active — speak naturally"}
                </span>

              </div>

            </div>

          </motion.section>
        )}

      </main>

    </div>
  );
}