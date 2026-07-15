// React Hooks
import { useState, useRef, useEffect } from "react";
import axios from "axios";

// Icons
import { FaSpinner } from "react-icons/fa";

// Audio Asset
import introMusic from "../assets/audio/squid game music.mp3";

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

  const audioRef = useRef(null);
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
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

  const handleEnter = () => {
    setStep("audio");
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
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
      if (audioRef.current) audioRef.current.pause();
      
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <p className="text-sm tracking-wider uppercase font-medium">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 flex flex-col overflow-x-hidden selection:bg-red-500/30">
      <audio ref={audioRef} src={introMusic} />

      {/* COUNTDOWN POPUP */}
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl px-8 py-8 w-[340px] text-center shadow-[0_0_40px_rgba(255,161,22,0.12)] overflow-hidden">
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#ffa116]/10 rounded-full blur-[40px] pointer-events-none animate-pulse" />
            <div className="relative flex flex-col items-center justify-center mt-2">
              <div className="relative drop-shadow-[0_0_20px_rgba(255,161,22,0.6)] animate-[pulse_2s_infinite_ease-in-out]">
                <span className="text-6xl select-none">🔥</span>
              </div>
              <h2 className="text-6xl font-extrabold text-[#ffa116] tracking-tight mt-3 drop-shadow-[0_0_25px_rgba(255,114,36,0.5)]">
                {latestStreak}
              </h2>
            </div>
            <p className="text-sm font-semibold text-gray-200 mt-4 tracking-wide">
              Day Streak
            </p>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              {latestStreak === 1 && "Nice start. Consistency begins today."}
              {latestStreak >= 2 && latestStreak <= 3 && "You're building momentum."}
              {latestStreak >= 4 && latestStreak <= 6 && "Strong consistency. Keep going."}
              {latestStreak >= 7 && "Excellent discipline. Don't break the chain."}
            </p>
            <div className="mt-6">
              <div className="h-1.5 w-full bg-[#2e2e2e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff7224] to-[#ffa116] rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,161,22,0.5)]"
                  style={{ width: `${Math.min(latestStreak * 10, 100)}%` }}
                />
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowHowToPlay(false)} />
          <div className="relative w-full max-w-xl rounded-2xl bg-gray-900 border border-gray-800 p-8 shadow-2xl">
            <button
              onClick={() => setShowHowToPlay(false)}
              className="absolute top-5 right-5 text-gray-500 hover:text-white text-xl cursor-pointer transition-colors"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold tracking-wider text-center text-red-500 mb-6 uppercase">
              How To Play
            </h2>
            <div className="space-y-4">
              {[
                ["1", "Enter Playground", "Begin your interactive speech session environment."],
                ["2", "Press Start Match", "The workspace prepares audio tracks and initializes context variables."],
                ["3", "Dynamic Environment", "AI participants converse naturally. Speak at any moment to express your ideas."],
                ["4", "Natural Interruptions", "Starting to speak instantly pauses ongoing AI vocal feedback tracks."],
                ["5", "Fluid Tracking Loop", "Pause for 2.5 seconds to dispatch transcription payloads smoothly to the backend."],
              ].map(([num, title, desc], i) => (
                <div key={i} className="flex gap-4 p-3 bg-gray-950/50 rounded-xl border border-gray-800/40">
                  <span className="text-red-500 font-bold text-lg">{num}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-200">{title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex items-center justify-center max-h-[calc(100vh-80px)] overflow-y-auto">
        <div className="w-full">
          
          {/* STEP: ENTER PLAYGROUND (SPLASH VIEW) */}
          {step === "enter" && (
            <div className="text-center space-y-6 py-4">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-5xl font-black tracking-wide text-red-500 uppercase">
                  Welcome to the Arena
                </h2>
                <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                  Enter an arena where clear communication matters. Coordinate alongside artificial intelligence players in an active collaborative discussion round. Take your position.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <button
                  onClick={() => setShowCountdown(true)}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-red-900/20 text-sm tracking-wider uppercase cursor-pointer"
                >
                  Enter Playground
                </button>
                <button
                  onClick={() => setShowHowToPlay(true)}
                  className="w-full px-8 py-4 text-sm font-bold bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl transition text-gray-300 cursor-pointer uppercase tracking-wider"
                >
                  How to Play
                </button>
              </div>
            </div>
          )}

          {/* STEP: RUNTIME DISCUSSION SCREEN */}
          {step === "gd" && (
            <div className="space-y-9 mt-34">
              {/* Target Matrix Topic Header */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 backdrop-blur-sm ">
                <p className="text-xs font-bold text-red-400 tracking-widest uppercase mb-1">Active Topic</p>
                <p className="text-xl font-medium text-gray-200 leading-relaxed">{topic}</p>
              </div>

              {/* Event Driven Status Bar Notification Indicator */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-900/30 rounded-xl p-4 border border-gray-800/80 gap-4">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  
                  {/* Persistent Listening Banner Badge */}
                  <div className="px-4 py-3 bg-blue-950/40 border border-blue-800/60 text-blue-400 text-xs font-bold tracking-wider uppercase rounded-xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>🎤 Listening...</span>
                  </div>

                  {/* Active Speaker State Banner Display */}
                  {isAiSpeaking ? (
                    <div className="px-4 py-3 bg-purple-900/50 border border-purple-700/40 text-purple-200 text-xs font-bold tracking-wider uppercase rounded-xl">
                      <span>🤖 {activeAiSpeaker} Speaking...</span>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-800 text-gray-400 text-xs font-bold tracking-wider uppercase rounded-xl">
                      <span>Discussion Open</span>
                    </div>
                  )}

                  <button
                    onClick={handleExit}
                    className="cursor-pointer px-4 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-gray-300 font-bold text-xs tracking-wider uppercase transition"
                  >
                    Exit Arena
                  </button>
                </div>

                {loadingAI && (
                  <div className="flex items-center gap-2 text-yellow-500 text-xs font-medium bg-yellow-500/5 border border-yellow-500/10 px-3 py-1.5 rounded-lg">
                    <FaSpinner className="animate-spin" />
                    <span className="tracking-wider uppercase">Processing Response...</span>
                  </div>
                )}
              </div>

              {/* Chat Records Stream Box */}
              <div className="bg-gray-900/20 border border-gray-800 rounded-xl p-5 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase text-center mb-4">
                  Discussion Records Stream
                </p>

                <div className="h-80 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-800">
                  {history.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border ${
                        msg.speaker === "You"
                          ? "bg-blue-950/10 border-blue-900/40"
                          : "bg-purple-950/10 border-purple-900/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl select-none shrink-0">{msg.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            msg.speaker === "You" ? "text-blue-400" : "text-purple-400"
                          }`}>
                            {msg.speaker}
                          </p>
                          <p className="text-sm text-gray-300 leading-relaxed">
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
          )}

        </div>
      </main>

     
    </div>
  );
}