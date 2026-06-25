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
  const [listening, setListening] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  // Tracks whose turn it is to drive the automated loop
  // Options: "idle" | "player1" | "player2" | "user"
  const [currentTurn, setCurrentTurn] = useState("idle");

  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [latestStreak, setLatestStreak] = useState(0);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const audioRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const fullSpeechRef = useRef("");

  // Storage for text payloads that need to be read sequentially
  const pendingPlayer1Text = useRef("");
  const pendingPlayer2Text = useRef("");

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

  // Turn management supervisor loop
  useEffect(() => {
    if (step !== "gd") return;

    if (currentTurn === "player1" && pendingPlayer1Text.current) {
      speakText(pendingPlayer1Text.current, () => {
        pendingPlayer1Text.current = "";
        setCurrentTurn("player2");
      });
    } else if (currentTurn === "player2" && pendingPlayer2Text.current) {
      speakText(pendingPlayer2Text.current, () => {
        pendingPlayer2Text.current = "";
        setCurrentTurn("user");
      });
    } else if (currentTurn === "user") {
      startAutomaticListening();
    }
  }, [currentTurn, step]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    };
  }, []);

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis.cancel();
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    fullSpeechRef.current = "";
    setListening(false);
    setCurrentTurn("idle");
  };

  const speakText = (text, onComplete) => {
    try {
      window.speechSynthesis.cancel(); // Clear any hung speech items
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      speech.pitch = 0.9;
      speech.rate = 0.95;
      
      speech.onend = () => {
        if (onComplete) onComplete();
      };
      speech.onerror = () => {
        if (onComplete) onComplete();
      };

      window.speechSynthesis.speak(speech);
    } catch (err) {
      console.error("SpeechSynthesis error:", err);
      if (onComplete) onComplete();
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

      setHistory([
        { speaker: "Player 1", text: res.data.agents["Player 1"], avatar: "🤖" },
        { speaker: "Player 2", text: res.data.agents["Player 2"], avatar: "🤖" },
      ]);

      if (audioRef.current) audioRef.current.pause();
      setStep("gd");

      // Queue text segments and hand execution off to the layout lifecycle controller
      pendingPlayer1Text.current = res.data.agents["Player 1"];
      pendingPlayer2Text.current = res.data.agents["Player 2"];
      setCurrentTurn("player1");
    } catch (error) {
      console.error("Failed to start GD:", error);
    }
  };

  const handleUserSpeech = async (userSpeech) => {
    setHistory((prev) => [...prev, { speaker: "You", text: userSpeech, avatar: "👤" }]);
    setLoadingAI(true);
    setCurrentTurn("idle");

    try {
      const ai = await axios.post(`${import.meta.env.VITE_API_URL}/api/gd`, {
        userSpeech,
        topic,
        history: history.map((h) => ({
          ...h,
          speaker: h.speaker.replace("Agent", "Player"),
        })),
      });

      setHistory((prev) => [
        ...prev,
        { speaker: "Player 1", text: ai.data["Player 1"], avatar: "🤖" },
        { speaker: "Player 2", text: ai.data["Player 2"], avatar: "🤖" },
      ]);

      pendingPlayer1Text.current = ai.data["Player 1"];
      pendingPlayer2Text.current = ai.data["Player 2"];
      setCurrentTurn("player1");
    } catch (error) {
      console.error("Failed to get AI response:", error);
      // Attempt self-healing recovery step if backend crashes
      setCurrentTurn("user");
    } finally {
      setLoadingAI(false);
    }
  };

  const startAutomaticListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    fullSpeechRef.current = "";

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    const recognition = new SR();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    // Reset silence tracker whenever valid text returns
    const resetSilenceTimeout = () => {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        stopAutomaticListening();
      }, 3000); // 3 seconds of continuous silence yields control back
    };

    recognition.onstart = () => {
      setListening(true);
      resetSilenceTimeout();
    };

    recognition.onresult = (e) => {
      resetSilenceTimeout();
      let interimTranscript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          fullSpeechRef.current += " " + e.results[i][0].transcript;
        } else {
          interimTranscript += e.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error error:", e.error);
      // Don't kill context on soft empty sounds, recycle back gracefully
      if (e.error === "no-speech") {
        stopAutomaticListening();
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Start speech capture runtime exception:", e);
      setListening(false);
    }
  };

  const stopAutomaticListening = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.onend = null;
        recognition.onerror = null;
        recognition.stop();
      } catch {}
    }

    setListening(false);
    recognitionRef.current = null;

    const speech = fullSpeechRef.current.trim();
    if (speech) {
      handleUserSpeech(speech);
    } else {
      // User didn't say anything; prompt conversational loop recycling fallback
      setCurrentTurn("user");
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
        <p className="text-sm tracking-wider uppercase font-medium">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-8 w-[340px] text-center shadow-2xl">
            <h2 className="text-6xl font-black text-orange-500 tracking-tight">{latestStreak}</h2>
            <p className="text-xs font-bold text-orange-400 mt-2 uppercase tracking-widest">
              Day Streak
            </p>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              {latestStreak === 1 && "Nice start. Consistency begins today."}
              {latestStreak >= 2 && latestStreak <= 3 && "You're building momentum."}
              {latestStreak >= 4 && latestStreak <= 6 && "Strong consistency. Keep going."}
              {latestStreak >= 7 && "Excellent discipline. Don't break the chain."}
            </p>
            <div className="mt-6">
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
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
                ["2", "Press Start Match", "The workspace prepares audio tracks and initializes variables."],
                ["3", "AI Group Discussion Starts", "AI participants converse automatically back-to-back using automated voice generation."],
                ["4", "Your Voice Turn Indicator", "When it is your turn, a live prompt instructs you to contribute points."],
                ["5", "Automatic Silence Submission", "Just speak naturally. Pause talking for 3 seconds to complete processing automatically."],
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
                  Enter an arena where clear communication matters. Coordinate alongside artificial intelligence players in a collaborative discussion round. Take your position.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <button
                  onClick={handleEnter}
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

          {/* STEP: AUDIO SYSTEM CALIBRATION */}
          {step === "audio" && (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-950/30 rounded-full border border-red-900/40">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">System Calibrating</span>
                </div>
                <p className="text-gray-400 text-sm">Prepare your device audio controls. Your match starts shortly.</p>
              </div>
              <button
                onClick={() => setShowCountdown(true)}
                className="px-10 py-4 text-sm font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl transition tracking-wider uppercase cursor-pointer shadow-md"
              >
                Start Match
              </button>
            </div>
          )}

          {/* STEP: RUNTIME DISCUSSION SCREEN */}
          {step === "gd" && (
            <div className="space-y-6">
              {/* Target Matrix Topic Header */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 backdrop-blur-sm">
                <p className="text-xs font-bold text-red-400 tracking-widest uppercase mb-1">Active Topic</p>
                <p className="text-xl font-medium text-gray-200 leading-relaxed">{topic}</p>
              </div>

              {/* Status Turn Information Feed Notification */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-900/30 rounded-xl p-4 border border-gray-800/80 gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {currentTurn === "user" && listening ? (
                    <div className="px-6 py-3.5 bg-red-600 text-white text-xs font-bold tracking-wider uppercase rounded-xl flex items-center gap-2 animate-pulse shadow-md shadow-red-900/30">
                      <span>🎤 It's your turn to speak</span>
                    </div>
                  ) : currentTurn === "player1" || currentTurn === "player2" ? (
                    <div className="px-6 py-3.5 bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-bold tracking-wider uppercase rounded-xl">
                      <span>🤖 AI Participant Speaking...</span>
                    </div>
                  ) : (
                    <div className="px-6 py-3.5 bg-gray-900 text-gray-400 text-xs font-bold tracking-wider uppercase rounded-xl">
                      <span>Waiting turn configuration...</span>
                    </div>
                  )}

                  <button
                    onClick={handleExit}
                    className="cursor-pointer px-5 py-3.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-gray-300 font-bold text-xs tracking-wider uppercase transition"
                  >
                    Exit Arena
                  </button>
                </div>

                {loadingAI && (
                  <div className="flex items-center gap-2 text-yellow-500 text-xs font-medium bg-yellow-500/5 border border-yellow-500/10 px-3 py-1.5 rounded-lg">
                    <FaSpinner className="animate-spin" />
                    <span className="tracking-wider uppercase">Evaluating Text Input...</span>
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

      {/* LOWER STICKY FOOTER */}
      <span className="fixed bottom-4 right-4 z-[9999] flex items-center px-3 py-1.5 rounded-full bg-gray-900/90 backdrop-blur-sm border border-gray-800 shadow-lg">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-gray-500 text-[9px] tracking-wider uppercase">Developed by</span>
          <span className="text-gray-200 text-xs font-semibold">Abhay</span>
        </span>
      </span>
    </div>
  );
}