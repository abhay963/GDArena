// React Hooks
import { useState, useRef, useEffect } from "react";
import axios from "axios";

// Icons
import { FaSpinner } from "react-icons/fa";

// Authentication Hook & Firebase Auth Actions
import { useAuth } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

// Custom Sub-Components
import Auth from "../components/Auth";
import Navbar from "../components/Navbar";
import Countdown from "../components/Countdown";

export default function Hero() {
  const { user, loading } = useAuth();

  const [streak, setStreak] = useState(0);
  const [lastShownStreak, setLastShownStreak] = useState(0);

  const [step, setStep] = useState("enter");
  const [topic, setTopic] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  // Dynamic UI States for active talkers
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [activeAiSpeaker, setActiveAiSpeaker] = useState("");

  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [latestStreak, setLatestStreak] = useState(0);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const chatEndRef = useRef(null);

  // Refs for continuous speech & interruption mechanics
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const isUserSpeakingRef = useRef(false);
  const fullSpeechRef = useRef("");

  // Queue to coordinate asynchronous dynamic speech segments safely
  const aiSpeechQueue = useRef([]);
  const isProcessingQueue = useRef(false);

  // Fetch streak info on user login
  useEffect(() => {
    if (!user) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/streak/${user.uid}`)
      .then((res) => {
        setStreak(res.data.streak);
        setLastShownStreak(res.data.streak);
      })
      .catch(console.error);
  }, [user?.uid]);

  // Keep chat log scrolled to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [history]);

  // Main listener hook to spawn/teardown speech stream based on playground steps
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
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    
    aiSpeechQueue.current = [];
    isProcessingQueue.current = false;
    isUserSpeakingRef.current = false;
    fullSpeechRef.current = "";
    
    setIsAiSpeaking(false);
    setActiveAiSpeaker("");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  // Continuous background audio stream engine
  const startContinuousListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (recognitionRef.current) return; // Prevent double initialization

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log("Continuous microphone engine live.");
    };

    recognition.onresult = (e) => {
      // User started making sound: Immediately cut off any speaking AIs
      if (!isUserSpeakingRef.current) {
        isUserSpeakingRef.current = true;
        window.speechSynthesis.cancel(); 
        // Pause the queue manager so it waits for user utterance wrap-up
        isProcessingQueue.current = false; 
        setIsAiSpeaking(false);
        setActiveAiSpeaker("");
      }

      // Reset voice frame threshold timers
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        handleUserUtteranceComplete();
      }, 2500); // 2.5 seconds of silence processing threshold

      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          fullSpeechRef.current += " " + e.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== "no-speech") {
        console.error("Speech recognition engine glitch:", e.error);
      }
    };

    // Auto-restart loop if browser drops mic connection organically
    recognition.onend = () => {
      if (step === "gd" && recognitionRef.current) {
        try {
          recognition.start();
        } catch (err) {}
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to boot speech capture runtime exception:", e);
    }
  };

  const handleUserUtteranceComplete = async () => {
    isUserSpeakingRef.current = false;
    const speechText = fullSpeechRef.current.trim();
    fullSpeechRef.current = ""; // Flush internal text buffer clear

    if (!speechText) {
      // No valid vocal statements found; resume processing leftover queued elements safely
      processSpeechQueue();
      return;
    }

    // Append statement logs synchronously to chat history stack UI
    setHistory((prev) => [...prev, { speaker: "You", text: speechText, avatar: "👤" }]);
    setLoadingAI(true);

    // Wipe outstanding speech items to prevent delayed logic overlap
    aiSpeechQueue.current = [];
    isProcessingQueue.current = false;

    try {
      const ai = await axios.post(`${import.meta.env.VITE_API_URL}/api/gd`, {
        userSpeech: speechText,
        topic,
        history: history.map((h) => ({
          ...h,
          speaker: h.speaker.replace("Agent", "Player"),
        })),
      });

      // Clear downstream text pipeline array payloads
      const payloads = [];
      if (ai.data["Player 1"]) payloads.push({ speaker: "Player 1", text: ai.data["Player 1"], avatar: "🤖" });
      if (ai.data["Player 2"]) payloads.push({ speaker: "Player 2", text: ai.data["Player 2"], avatar: "🤖" });

      // Append items to UI timeline feed
      setHistory((prev) => [...prev, ...payloads]);

      // Push into processing array safely
      aiSpeechQueue.current = [...aiSpeechQueue.current, ...payloads];
      processSpeechQueue();
    } catch (error) {
      console.error("Failed to evaluate dialogue tree logic calculations:", error);
      processSpeechQueue();
    } finally {
      setLoadingAI(false);
    }
  };

  // Asynchronous queue logic to process text-to-speech blocks sequentially
  const processSpeechQueue = () => {
    if (isUserSpeakingRef.current || isProcessingQueue.current || aiSpeechQueue.current.length === 0) {
      return;
    }

    isProcessingQueue.current = true;
    const currentSegment = aiSpeechQueue.current.shift();

    setActiveAiSpeaker(currentSegment.speaker);
    setIsAiSpeaking(true);

    try {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(currentSegment.text);
      speech.lang = "en-US";
      speech.pitch = 0.9;
      speech.rate = 0.95;

      speech.onend = () => {
        isProcessingQueue.current = false;
        setIsAiSpeaking(false);
        setActiveAiSpeaker("");
        // Recursively trigger next queue evaluation step
        processSpeechQueue(); 
      };

      speech.onerror = (e) => {
        isProcessingQueue.current = false;
        setIsAiSpeaking(false);
        setActiveAiSpeaker("");
        processSpeechQueue();
      };

      window.speechSynthesis.speak(speech);
    } catch (err) {
      console.error("SpeechSynthesis error:", err);
      isProcessingQueue.current = false;
      setIsAiSpeaking(false);
      setActiveAiSpeaker("");
      processSpeechQueue();
    }
  };

  const startGD = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/gd/start`);
      setTopic(res.data.topic);

      const initialPayload = [
        { speaker: "Player 1", text: res.data.agents["Player 1"], avatar: "🤖" },
        { speaker: "Player 2", text: res.data.agents["Player 2"], avatar: "🤖" },
      ];

      setHistory(initialPayload);
      
      // Pivot stage tracking triggers the continuous listening effect chain
      setStep("gd");

      aiSpeechQueue.current = [...initialPayload];
      // Slight artificial timeout to let mic drivers spin up comfortably
      setTimeout(() => {
        processSpeechQueue();
      }, 400);
    } catch (error) {
      console.error("Failed to switch session stage parameters dynamically:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    stopAllAudio();
    setStep("enter");
  };

  const handleExit = async () => {
    stopAllAudio();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/performance`, {
        uid: user.uid,
        topic,
        history,
      });

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/streak/update`, {
        uid: user.uid,
        email: user.email,
      });

      const newStreak = res.data.streak;
      setStreak(newStreak);

      if (newStreak > lastShownStreak) {
        setLatestStreak(newStreak);
        setShowStreakPopup(true);
        setLastShownStreak(newStreak);

        setTimeout(() => {
          setShowStreakPopup(false);
          setStep("enter");
        }, 2000);
      } else {
        setStep("enter");
      }
    } catch (err) {
      console.error(err);
      setStep("enter");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#030303] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className="w-11 h-11 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
          <p className="text-[11px] tracking-[0.35em] uppercase font-medium text-gray-500">
            Loading Arena
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-gray-100 flex flex-col overflow-hidden selection:bg-red-500/30">
      
      {/* Full-screen ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] bg-red-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-orange-500/8 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-purple-600/6 rounded-full blur-[120px]" />
        
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030303_70%)]" />
      </div>

      {/* COUNTDOWN */}
      {showCountdown && (
        <Countdown
          initialCount={3}
          onComplete={() => {
            setShowCountdown(false);
            startGD();
          }}
        />
      )}

      {/* STREAK POPUP */}
      {showStreakPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-xl">
          <div className="relative bg-[#0c0c0c] border border-orange-500/25 rounded-3xl px-12 py-11 w-[380px] text-center shadow-[0_0_100px_rgba(255,140,0,0.18)] overflow-hidden">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-44 h-44 bg-orange-500/20 rounded-full blur-[60px] animate-pulse" />
            
            <div className="relative flex flex-col items-center">
              <span className="text-7xl mb-1 drop-shadow-[0_0_35px_rgba(255,160,20,0.7)]">🔥</span>
              <h2 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-orange-300 to-orange-500">
                {latestStreak}
              </h2>
              <p className="text-xs font-semibold text-orange-200/80 mt-3 tracking-[0.25em] uppercase">
                Day Streak
              </p>
              <p className="text-gray-400 text-sm mt-4 leading-relaxed max-w-[240px]">
                {latestStreak === 1 && "Nice start. Consistency begins today."}
                {latestStreak >= 2 && latestStreak <= 3 && "You're building momentum."}
                {latestStreak >= 4 && latestStreak <= 6 && "Strong consistency. Keep going."}
                {latestStreak >= 7 && "Excellent discipline. Don't break the chain."}
              </p>
              
              <div className="mt-8 w-full">
                <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-600 to-amber-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(latestStreak * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <Navbar
        user={user}
        streak={streak}
        onLogout={handleLogout}
        onNavigateHome={() => {
          stopAllAudio();
          setStep("enter");
        }}
      />

      {/* HOW TO PLAY MODAL */}
      {showHowToPlay && (
        <div className="fixed inset-0 flex items-center justify-center z-[999] p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => setShowHowToPlay(false)} 
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0c0c0c] border border-gray-800 p-8 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            
            <button
              onClick={() => setShowHowToPlay(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 text-gray-500 hover:text-white hover:bg-gray-800 transition-all cursor-pointer text-sm"
            >
              ✕
            </button>
            
            <h2 className="text-xl font-bold tracking-wide text-center text-white mb-7">
              How to Play
            </h2>
            
            <div className="space-y-3">
              {[
                ["1", "Enter Playground", "Begin your interactive speech session environment."],
                ["2", "Press Start Match", "The workspace initializes context variables."],
                ["3", "Dynamic Environment", "AI participants converse naturally. Speak at any moment to express your ideas."],
                ["4", "Natural Interruptions", "Starting to speak instantly pauses ongoing AI vocal feedback tracks."],
                ["5", "Fluid Tracking Loop", "Pause for 2.5 seconds to dispatch transcription payloads smoothly to the backend."],
              ].map(([num, title, desc], i) => (
                <div 
                  key={i} 
                  className="flex gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <span className="text-red-400 font-bold text-sm">{num}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-100">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="relative z-10 flex-1 w-full flex flex-col">
        
        {/* ========== ENTER / SPLASH (FULL SCREEN) ========== */}
        {step === "enter" && (
          <section className="flex-1 w-full flex flex-col items-center justify-center px-6 py-12 relative">
            
            {/* Soft floating glow behind content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/8 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative w-full max-w-2xl mx-auto text-center space-y-10">
              
              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-[11px] font-semibold tracking-[0.2em] text-red-400 uppercase">
                  Live Arena
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-5">
                <h1 className="text-[2.75rem] sm:text-5xl md:text-[3.5rem] font-extrabold leading-[1.15] tracking-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">
                    Welcome to the
                  </span>
                  <span className="block text-white mt-1">
                    Arena
                  </span>
                </h1>
                
                <p className="text-gray-400 text-[15px] sm:text-base max-w-md mx-auto leading-relaxed">
                  Step into a live discussion floor. Coordinate with AI players in real time. Speak freely. Interrupt naturally. Own the conversation.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <button
                  onClick={() => setShowCountdown(true)}
                  className="group relative w-full sm:w-auto min-w-[200px] overflow-hidden bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgba(239,68,68,0.35)] hover:shadow-[0_8px_40px_rgba(239,68,68,0.5)] text-sm tracking-wide uppercase cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Enter Playground
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                  {/* Shine sweep */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </button>

                <button
                  onClick={() => setShowHowToPlay(true)}
                  className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 text-sm font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 text-gray-300 hover:text-white cursor-pointer uppercase tracking-wide backdrop-blur-sm"
                >
                  How to Play
                </button>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 text-[12px] text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Real-time Voice
                </div>
                <div className="hidden sm:block w-px h-3 bg-gray-700" />
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  AI Partners
                </div>
                <div className="hidden sm:block w-px h-3 bg-gray-700" />
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Streak System
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========== GD / DISCUSSION SCREEN ========== */}
        {step === "gd" && (
          <section className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-6 py-8 flex flex-col">
            <div className="space-y-5 flex-1 flex flex-col">
              
              {/* Topic Card */}
              <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px] pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-[10px] font-semibold text-red-400 tracking-[0.2em] uppercase">
                      Active Topic
                    </p>
                  </div>
                  <p className="text-lg sm:text-xl font-medium text-gray-100 leading-snug">
                    {topic}
                  </p>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Listening */}
                  <div className="px-3.5 py-2 bg-blue-500/10 border border-blue-500/25 text-blue-300 text-[11px] font-semibold tracking-wider uppercase rounded-xl flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                    </span>
                    Listening
                  </div>

                  {/* Speaker state */}
                  {isAiSpeaking ? (
                    <div className="px-3.5 py-2 bg-violet-500/10 border border-violet-500/25 text-violet-200 text-[11px] font-semibold tracking-wider uppercase rounded-xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                      {activeAiSpeaker} Speaking
                    </div>
                  ) : (
                    <div className="px-3.5 py-2 bg-white/[0.04] border border-white/10 text-gray-400 text-[11px] font-semibold tracking-wider uppercase rounded-xl">
                      Discussion Open
                    </div>
                  )}

                  <button
                    onClick={handleExit}
                    className="cursor-pointer px-3.5 py-2 bg-white/[0.04] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl text-gray-400 hover:text-red-300 font-semibold text-[11px] tracking-wider uppercase transition-all duration-200"
                  >
                    Exit Arena
                  </button>
                </div>

                {loadingAI && (
                  <div className="flex items-center gap-2 text-amber-400/90 text-[11px] font-medium bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
                    <FaSpinner className="animate-spin text-xs" />
                    <span className="tracking-wider uppercase">Processing</span>
                  </div>
                )}
              </div>

              {/* Chat Stream */}
              <div className="flex-1 min-h-0 rounded-2xl bg-white/[0.02] border border-white/[0.07] p-4 sm:p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <p className="text-[10px] font-semibold text-gray-500 tracking-[0.25em] uppercase">
                    Discussion Stream
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {history.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border transition-colors duration-200 ${
                        msg.speaker === "You"
                          ? "bg-blue-500/[0.07] border-blue-500/20"
                          : "bg-violet-500/[0.06] border-violet-500/15"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                          msg.speaker === "You" 
                            ? "bg-blue-500/15 border border-blue-500/25" 
                            : "bg-violet-500/15 border border-violet-500/25"
                        }`}>
                          {msg.avatar}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                            msg.speaker === "You" ? "text-blue-400" : "text-violet-400"
                          }`}>
                            {msg.speaker}
                          </p>
                          <p className="text-sm text-gray-200 leading-relaxed">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}