// React Hooks
import { useState, useRef, useEffect } from "react";
import axios from "axios";

// Icons
import { FaMicrophone, FaSpinner } from "react-icons/fa";

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

  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [latestStreak, setLatestStreak] = useState(0);

  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const audioRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const recognitionTimerRef = useRef(null);
  const fullSpeechRef = useRef("");

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

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      recognitionRef.current._shouldRestart = false;
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    fullSpeechRef.current = "";
    setListening(false);
  };

  const speakText = (text) => {
    try {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      speech.pitch = 0.9;
      speech.rate = 0.95;
      window.speechSynthesis.speak(speech);
    } catch (err) {
      console.error("SpeechSynthesis error:", err);
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
      const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/gd/start`
);
      setTopic(res.data.topic);

      setHistory([
        { speaker: "Player 1", text: res.data.agents["Player 1"], avatar: "🤖" },
        { speaker: "Player 2", text: res.data.agents["Player 2"], avatar: "🤖" },
      ]);

      speakText(res.data.agents["Player 1"]);
      speakText(res.data.agents["Player 2"]);

      if (audioRef.current) audioRef.current.pause();
      setStep("gd");
    } catch (error) {
      console.error("Failed to start GD:", error);
    }
  };

  const handleUserSpeech = async (userSpeech) => {
    setHistory((prev) => [...prev, { speaker: "You", text: userSpeech, avatar: "👤" }]);
    setLoadingAI(true); // Fixed bug: was previously firing loadingAI(true) instead of state setter

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

      speakText(ai.data["Player 1"]);
      speakText(ai.data["Player 2"]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  const startSpeaking = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech Recognition not supported.");
      return;
    }

    window.speechSynthesis.cancel();
    if (audioRef.current) audioRef.current.pause();

    fullSpeechRef.current = "";

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    const recognition = new SR();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          fullSpeechRef.current += " " + e.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e.error);
      stopListening();
    };

    recognition.onend = () => {
      if (listening) {
        try {
          recognition.start();
        } catch {
          setListening(false);
        }
      }
    };

    try {
      recognition.start();
      setListening(true);
    } catch (e) {
      console.error("Start failed:", e);
      setListening(false);
    }

    recognitionTimerRef.current = setTimeout(() => {
      stopListening();
    }, 4 * 60 * 1000);
  };

  const stopListening = () => {
    if (recognitionTimerRef.current) {
      clearTimeout(recognitionTimerRef.current);
      recognitionTimerRef.current = null;
    }

    const recognition = recognitionRef.current;
    if (!recognition) return;

    try {
      recognition.onend = null;
      recognition.onerror = null;
      recognition.stop();
    } catch {}

    setTimeout(() => {
      const speech = fullSpeechRef.current.trim();
      if (speech) handleUserSpeech(speech);

      fullSpeechRef.current = "";
      recognitionRef.current = null;
      setListening(false);
    }, 300);
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
    return <div className="text-white">Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white select-none">
      <audio ref={audioRef} src={introMusic} />

      {/* REFACTORED MODULAR COUNTDOWN COMPONENT */}
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl px-10 py-8 w-[340px] text-center">
            <h2 className="text-6xl font-black text-orange-400">{latestStreak}</h2>
            <p className="text-xs font-semibold text-gray-400 mt-2 uppercase tracking-widest">
              Day Streak
            </p>

            <p className="text-gray-400 text-sm mt-4">
              {latestStreak === 1 && "Nice start. Consistency begins today."}
              {latestStreak >= 2 && latestStreak <= 3 && "You're building momentum."}
              {latestStreak >= 4 && latestStreak <= 6 && "Strong consistency. Keep going."}
              {latestStreak >= 7 && "Excellent discipline. Don't break the chain."}
            </p>

            <div className="mt-6">
              <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(latestStreak * 10, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* REFACTORED MODULAR NAVBAR COMPONENT */}
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
          <div className="fixed inset-0 flex items-center justify-center z-[999]">
            <div className="absolute inset-0 bg-black/80" onClick={() => setShowHowToPlay(false)} />

            <div className="relative w-full max-w-2xl rounded-2xl bg-gray-900 border border-red-800 p-10">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="absolute top-5 right-5 text-red-500 hover:text-red-300 text-2xl font-black cursor-pointer"
              >
                ✖
              </button>

              <h2 className="text-3xl font-black text-center tracking-widest text-red-500 mb-8">
                HOW TO PLAY
              </h2>

              <div className="space-y-6">
                {[
                  ["1", "ENTER PLAYGROUND — Begin your interactive session."],
                  ["2", "PRESS ENTER — The system prepares your environment."],
                  ["3", "COUNTDOWN STARTS — Getting everything ready for you."],
                  ["4", "TOPIC GENERATED — AI participants join the discussion."],
                  ["5", "SPEAK & SUBMIT — Share your points, then press STOP."],
                ].map(([num, text], i) => (
                  <div key={i} className="flex gap-5 items-start">
                    <span className="text-red-500 text-3xl font-black">{num}</span>
                    <div className="flex-1">
                      <p className="text-red-400 font-bold tracking-wide">{text.split(" — ")[0]}</p>
                      <p className="text-gray-300 mt-1 text-sm">{text.split(" — ")[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY AREA */}
        <main className="flex-1 container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            {step === "enter" && (
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black tracking-widest text-red-500">
                    WELCOME TO THE ARENA
                  </h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Enter a world where every word matters. Face intelligent agents in a battle of
                    wits. Only the strongest survive.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleEnter}
                    className="w-full sm:w-auto px-12 py-5 text-xl font-bold bg-red-700 hover:bg-red-800 rounded-xl transition cursor-pointer shadow-lg shadow-red-900/30"
                  >
                    ENTER PLAYGROUND
                  </button>
                  <button
                    onClick={() => setShowHowToPlay(true)}
                    className="w-full sm:w-auto px-10 py-5 text-xl font-bold border border-gray-700 hover:bg-gray-800 rounded-xl transition cursor-pointer"
                  >
                    HOW TO PLAY
                  </button>
                </div>
              </div>
            )}

            {step === "audio" && (
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-900/20 rounded-full border border-red-900/50">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-300 font-medium">SYSTEM CALIBRATING</span>
                  </div>
                  <p className="text-gray-400 text-lg">Prepare yourself. The challenge awaits.</p>
                </div>
                <button
                  onClick={() => setShowCountdown(true)}
                  className="px-14 py-5 text-xl font-black bg-green-700 hover:bg-green-800 rounded-xl transition cursor-pointer flex items-center gap-3 mx-auto uppercase tracking-wider shadow-lg shadow-green-950/50"
                >
                  START MATCH
                </button>
              </div>
            )}

            {step === "gd" && (
              <div className="space-y-6">
                <div className="bg-gray-800/40 border border-red-900/50 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-red-400 tracking-wide">ACTIVE TOPIC</h2>
                  </div>
                  <p className="text-2xl font-light text-gray-200">{topic}</p>
                </div>

                {/* CONTROL PANEL */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-black/30 rounded-2xl p-4 border border-gray-800 gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                      onClick={listening ? stopListening : startSpeaking}
                      disabled={loadingAI}
                      className={`w-full sm:w-auto cursor-pointer flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold transition ${
                        listening
                          ? "bg-red-600 hover:bg-red-700 animate-pulse"
                          : loadingAI
                          ? "bg-gray-700 cursor-not-allowed text-gray-500"
                          : "bg-blue-700 hover:bg-blue-800"
                      }`}
                    >
                      <FaMicrophone className="text-xl" />
                      <span>{listening ? "STOP" : "SPEAK"}</span>
                    </button>

                    <button
                      onClick={handleExit}
                      className="cursor-pointer px-6 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-white font-bold transition"
                    >
                      EXIT
                    </button>
                  </div>

                  {loadingAI && (
                    <div className="flex items-center gap-3 text-yellow-400 py-2 sm:py-0">
                      <FaSpinner className="animate-spin text-xl" />
                      <span className="font-medium tracking-wide">PLAYERS PROCESSING...</span>
                    </div>
                  )}
                </div>

                {/* CHAT INTERFACE LOG */}
                <div className="bg-black/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-gray-800"></div>
                    <span className="text-sm font-bold text-gray-500 tracking-widest">
                      DISCUSSION LOG
                    </span>
                    <div className="flex-1 h-px bg-gray-800"></div>
                  </div>

                  <div className="h-96 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-800">
                    {history.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-5 rounded-xl ${
                          msg.speaker === "You"
                            ? "bg-blue-900/10 border-l-4 border-blue-500"
                            : "bg-purple-900/10 border-l-4 border-purple-500"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl select-none">{msg.avatar}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-sm uppercase tracking-wider">
                                {msg.speaker}
                              </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-[15px]">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* FOOTER WATERMARK */}
      <span className="fixed bottom-4 right-4 z-[99999] flex items-center px-3 py-1.5 rounded-full bg-gray-800/80 backdrop-blur-md border border-white/5 shadow-md">
        <span className="flex items-center gap-2 leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
          <span className="text-gray-400 text-[10px] tracking-wider uppercase leading-none">
            Developed by
          </span>
          <span className="text-white text-xs font-semibold leading-none">Abhay</span>
        </span>
      </span>
    </div>
  );
}