import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Terminal,
  Menu,
  X,
  ArrowRight,
  MessageSquare,
  Bot,
  Sparkles,
  Cpu,
  Mic,
  Zap,
  BarChart3,
  Shuffle,
  GraduationCap,
  Quote,
  Activity,
  Globe
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  // --- NAVBAR STATES & FUNCTIONS ---
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Dynamic simulation data for the new Interactive System Badge
  const [liveUsers, setLiveUsers] = useState(1420);
  const [currentTopic, setCurrentTopic] = useState("Impact of LLMs on Software Engineering Salaries");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Minor random counter animation to make the live element feel genuine
    const interval = setInterval(() => {
      setLiveUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const scrollToSection = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // --- DATA FOR SECTIONS ---
  const features = [
    {
      icon: Cpu,
      title: "AI-Powered Group Discussions",
      description: "Practice with intelligent AI participants that respond dynamically to your arguments.",
    },
    {
      icon: Mic,
      title: "Real-Time Voice Interaction",
      description: "Speak naturally using your microphone with instant, low-latency speech recognition.",
    },
    {
      icon: Zap,
      title: "Daily Streak System",
      description: "Build consistency, log your practice daily, and track your ongoing communication habits.",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track confidence, participation metrics, vocabulary depth, and communication growth.",
    },
    {
      icon: Shuffle,
      title: "Smart Topic Generator",
      description: "Generate unlimited, trending GD topics across technical, economic, and abstract domains.",
    },
    {
      icon: GraduationCap,
      title: "Placement Preparation",
      description: "Prepare accurately for competitive campus placements, corporate hiring, and MBA interview rounds.",
    },
  ];

  const steps = [
    { step: "01", title: "Create Account", desc: "Sign up instantly using Email or secure Google Authentication." },
    { step: "02", title: "Start Discussion", desc: "Choose your domain and let the AI generate a relevant, live GD topic." },
    { step: "03", title: "Speak Your Thoughts", desc: "Activate your microphone and use voice recognition to participate seamlessly." },
    { step: "04", title: "Get Feedback", desc: "Receive instant AI-powered analysis and clear technical improvement suggestions." },
  ];

  const statMetrics = [
    { value: "10,000+", label: "Discussions Completed" },
    { value: "5,000+", label: "Active Learners" },
    { value: "100+", label: "GD Topics" },
    { value: "95%", label: "User Satisfaction" },
  ];

  const testimonials = [
    { quote: "GD Arena helped me clear my campus placement GD round. The environment felt incredibly realistic.", author: "Ananya Iyer", role: "Student, Tier-1 Campus" },
    { quote: "The AI participants make the discussion feel genuine. They react logically to your counterpoints.", author: "Rohan Malhotra", role: "MBA Aspirant" },
    { quote: "An excellent platform to build confidence, minimize public speaking anxiety, and improve structural thinking.", author: "Sarah Jenkins", role: "Software Engineer" },
  ];

  return (
    <div className="bg-[#030014] text-gray-100 min-h-screen font-sans selection:bg-red-500/30 selection:text-red-200 antialiased overflow-x-hidden">
      
      {/* ==================== NAVBAR ==================== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#030014]/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-9 h-9 bg-gradient-to-tr from-red-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400 tracking-wider uppercase">
              GD Arena
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm text-neutral-400 font-medium">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection("how-it-works")} className="hover:text-white transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollToSection("stats")} className="hover:text-white transition-colors cursor-pointer">Metrics</button>
            <button onClick={() => scrollToSection("testimonials")} className="hover:text-white transition-colors cursor-pointer">Testimonials</button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => navigate("/login")} className="text-sm font-medium text-neutral-300 hover:text-white transition-colors px-4 py-2">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="text-sm bg-white text-black hover:bg-neutral-200 transition-all duration-200 px-5 py-2.5 rounded-xl font-bold shadow-md cursor-pointer">
              Sign Up
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#030014]/95 border-b border-white/10 backdrop-blur-lg px-6 py-6 flex flex-col space-y-4">
            <button onClick={() => { window.scrollTo({ top: 0 }); setIsOpen(false); }} className="text-left text-neutral-300 py-2">Home</button>
            <button onClick={() => scrollToSection("features")} className="text-left text-neutral-300 py-2">Features</button>
            <button onClick={() => scrollToSection("how-it-works")} className="text-left text-neutral-300 py-2">How It Works</button>
            <button onClick={() => navigate("/login")} className="text-left text-neutral-300 py-2">Login</button>
            <button onClick={() => navigate("/signup")} className="w-full text-center bg-red-600 text-white py-3 rounded-xl font-medium">Sign Up</button>
          </div>
        )}
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-red-300 mb-6 backdrop-blur-sm tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Next-Gen Placement Preparation</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500 leading-[1.15] mb-6 uppercase"
          >
            Master Group Discussions <br />with <span className="bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text">AI-Powered Practice</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-neutral-400 max-w-3xl mx-auto font-normal leading-relaxed mb-10"
          >
            Practice real-world group discussions with intelligent AI participants, receive instant speech insights, maintain coding-like consistency streaks, and clear evaluation filters.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-3xl mx-auto mb-20"
          >
            <button 
              onClick={() => navigate("/signup")} 
              className="w-full lg:w-auto shrink-0 cursor-pointer bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all group"
            >
              <span>Start Practicing Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* HIGH-END SYSTEM ACTIVITY HUB COMPONENT */}
            <div className="w-full lg:w-auto flex items-center space-x-4 bg-white/[0.02] border border-white/10 px-5 py-3 rounded-xl backdrop-blur-md text-left">
              <div className="flex items-center justify-center relative w-10 h-10 rounded-lg bg-red-500/10 shrink-0">
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
                <Globe className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-xs truncate">
                <div className="text-neutral-400 font-medium flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <Activity className="w-3 h-3 text-neutral-500" />
                  <span>{liveUsers} Debaters Online</span>
                </div>
                <div className="text-neutral-200 font-semibold truncate max-w-[240px] md:max-w-[320px] mt-0.5">
                  Live: <span className="text-rose-400 font-normal">"{currentTopic}"</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual Discussion Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 md:p-12 max-w-4xl mx-auto backdrop-blur-sm shadow-2xl shadow-red-500/5"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex -space-x-4 select-none">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, delay: i * 0.4 }}
                    className={`w-14 h-14 rounded-full border-2 border-[#030014] flex items-center justify-center text-white font-bold bg-gradient-to-tr shadow-md ${
                      i % 2 === 0 ? "from-red-600 to-rose-600" : "from-rose-600 to-orange-500"
                    }`}
                  >
                    <Bot className="w-5 h-5" />
                  </motion.div>
                ))}
              </div>

              <div className="flex-1 space-y-3 w-full">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/5 border border-white/10 rounded-2xl rounded-tr-none p-4 text-xs text-left max-w-md ml-auto flex items-start space-x-2 backdrop-blur-sm"
                >
                  <MessageSquare className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-neutral-300">
                    <span className="text-red-300 font-bold uppercase tracking-wider">Player 1 (AI):</span> I strongly agree with the proposition. Digital transformation frameworks speed up continuous delivery channels...
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-red-600/10 border border-red-500/30 rounded-2xl rounded-tl-none p-4 text-xs text-left max-w-md mr-auto flex items-start space-x-2 backdrop-blur-sm"
                >
                  <MessageSquare className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-neutral-200">
                    <span className="text-rose-300 font-bold uppercase tracking-wider">You (User):</span> Valid point, but we must also factor in information security infrastructure limitations and active data bottlenecks encountered...
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase">Engineered to Perfect Public Speech</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">Get absolute metrics tailored for strict corporate and technical assessment environments.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -6, borderColor: "rgba(225, 29, 72, 0.4)" }}
              className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl transition-all duration-300 group backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600/20 transition-colors">
                <feat.icon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-200 uppercase tracking-wide">{feat.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <section id="how-it-works" className="py-24 bg-white/[0.01] border-y border-white/5 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase">Four Simple Steps to Success</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">From secure authentication straight into conversational practice evaluation in moments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="text-6xl font-black bg-gradient-to-b from-red-600/20 to-transparent bg-clip-text text-transparent mb-2 group-hover:from-red-500/40 transition-all duration-300 select-none">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold mb-2 text-neutral-200 uppercase tracking-wide">{item.title}</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STATISTICS SECTION ==================== */}
      <section id="stats" className="py-20 max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-red-900/10 via-rose-900/10 to-transparent border border-white/5 rounded-3xl p-8 md:p-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center backdrop-blur-sm">
          {statMetrics.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-neutral-400 font-bold tracking-widest uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section id="testimonials" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Praised by Career Builders</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl relative flex flex-col justify-between backdrop-blur-sm"
            >
              <Quote className="w-8 h-8 text-red-500/10 absolute top-6 left-6 select-none pointer-events-none" />
              <p className="text-neutral-300 text-sm italic leading-relaxed mb-6 z-10">"{t.quote}"</p>
              <div>
                <h5 className="text-sm font-bold text-neutral-200 uppercase tracking-wide">{t.author}</h5>
                <p className="text-xs text-neutral-500 mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-red-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        <h2 className="text-3xl md:text-6xl font-black mb-4 tracking-tight uppercase">Ready to Become GD Ready?</h2>
        <p className="text-neutral-400 mb-8 max-w-lg mx-auto">Build consistency patterns. Outperform expectations.</p>
        <button 
          onClick={() => navigate("/signup")}
          className="mx-auto bg-white text-black font-bold px-8 py-4 rounded-xl flex items-center space-x-2 hover:bg-neutral-200 transition-all active:scale-95 cursor-pointer shadow-xl shadow-black/40 group"
        >
          <span>Start Free Today</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#02000a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-neutral-500 font-medium">
            &copy; 2026 GD Arena. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-neutral-400 font-medium">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-white transition-colors">About</button>
            <button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">Features</button>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}