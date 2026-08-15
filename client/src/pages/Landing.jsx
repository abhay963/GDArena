import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
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
  Cpu,
  Mic,
  BarChart3,
  Shuffle,
  Quote,
  Activity,
  Globe,
  FileText,
  BookOpen,
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
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [liveUsers, setLiveUsers] = useState(1420);

  const currentTopic =
    "Impact of LLMs on Software Engineering Salaries";

  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 500], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    const interval = setInterval(() => {
      setLiveUsers((prev) =>
        prev + (Math.random() > 0.5 ? 1 : -1)
      );
    }, 3500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const scrollToSection = (id) => {
    setIsOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 28,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const features = [
    {
      icon: Cpu,
      title: "AI Group Discussions",
      desc: "Dynamic AI participants that challenge, support, and evolve with every argument you make.",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: Mic,
      title: "Real-Time Voice",
      desc: "Speak naturally. Ultra-low latency speech recognition that feels like a live room.",
      color: "from-rose-500 to-orange-500",
    },
    {
      icon: BarChart3,
      title: "Deep Analytics",
      desc: "Confidence, participation, vocabulary depth, and growth tracked with precision.",
      color: "from-orange-500 to-amber-500",
    },
    {
      icon: Shuffle,
      title: "Smart Topics",
      desc: "Endless technical, business, social & abstract GD topics generated on demand.",
      color: "from-red-600 to-pink-500",
    },
    {
      icon: FileText,
      title: "PDF Knowledge Base",
      desc: "Upload notes & textbooks. Instantly transform them into an interactive AI brain.",
      color: "from-rose-600 to-red-500",
    },
    {
      icon: BookOpen,
      title: "Document Q&A",
      desc: "Ask anything in natural language. Answers grounded strictly in your files.",
      color: "from-red-500 to-rose-600",
    },
    {
      icon: Search,
      title: "Semantic RAG",
      desc: "Finds the exact paragraphs that matter before generating every response.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Brain,
      title: "Study Companion",
      desc: "Revise faster, clarify concepts, and prepare from your own material 24/7.",
      color: "from-rose-500 to-red-600",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Create Account",
      desc: "Sign up in seconds with email or Google.",
    },
    {
      step: "02",
      title: "Practice GDs",
      desc: "Jump into AI-powered group discussions with your voice.",
    },
    {
      step: "03",
      title: "Upload & Study",
      desc: "Drop PDFs into StudySync and build your knowledge base.",
    },
    {
      step: "04",
      title: "Ask Anything",
      desc: "Query your documents and get precise, cited answers.",
    },
    {
      step: "05",
      title: "Level Up",
      desc: "Track progress, close gaps, and walk in placement-ready.",
    },
  ];

  const pipeline = [
    {
      icon: FileText,
      label: "PDF",
    },
    {
      icon: Layers,
      label: "Extract",
    },
    {
      icon: Layers,
      label: "Chunk",
    },
    {
      icon: Database,
      label: "Embed",
    },
    {
      icon: Search,
      label: "Retrieve",
    },
    {
      icon: MessageCircle,
      label: "Answer",
    },
  ];

  const testimonials = [
    {
      quote:
        "Cleared my campus GD round with confidence. The AI room felt more real than any practice group I joined.",
      author: "Ananya Iyer",
      role: "Tier-1 Campus",
      rating: 5,
    },
    {
      quote:
        "StudySync turned my 200-page OS notes into something I could actually interrogate. Game changer for revision.",
      author: "Rohan Malhotra",
      role: "MBA Aspirant",
      rating: 5,
    },
    {
      quote:
        "Finally a platform that treats both communication and knowledge with equal seriousness. Feels premium.",
      author: "Sarah Jenkins",
      role: "Software Engineer",
      rating: 5,
    },
  ];

  return (
    <div className="premium-page bg-[#030014] text-gray-100 min-h-screen font-sans selection:bg-red-500/30 selection:text-red-200 antialiased overflow-x-hidden">

      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

        <div
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[140px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />

        <div
          className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] bg-rose-500/15 rounded-full blur-[130px] animate-pulse"
          style={{ animationDuration: "11s" }}
        />

        <div
          className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "14s" }}
        />

      </div>


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#030014]/85 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl shadow-black/40"
            : "bg-transparent py-5"
        }`}
      >

        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">

          {/* Logo */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >

            <div className="relative">

              <div className="absolute inset-0 bg-red-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />

              <div className="relative w-10 h-10 bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Terminal className="w-5 h-5 text-white" />
              </div>

            </div>

            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
              GD Arena
            </span>

          </motion.div>


          {/* Desktop Navigation */}

          <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full px-1.5 py-1.5 backdrop-blur-md">

            {[
              "Home",
              "Features",
              "StudySync",
              "How It Works",
              "Metrics",
            ].map((item) => (

              <button
                key={item}
                onClick={() => {

                  if (item === "Home") {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  } else if (item === "Features") {
                    scrollToSection("features");
                  } else if (item === "StudySync") {
                    scrollToSection("studysync");
                  } else if (item === "How It Works") {
                    scrollToSection("how-it-works");
                  } else {
                    scrollToSection("stats");
                  }

                }}
                className="px-4 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
              >
                {item}
              </button>

            ))}

          </div>


          {/* Desktop Auth */}

          <div className="hidden lg:flex items-center gap-3">

            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-neutral-300 hover:text-white px-4 py-2 transition-colors"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="relative group overflow-hidden text-sm bg-white text-black font-bold px-5 py-2.5 rounded-full shadow-lg shadow-white/10 hover:shadow-white/20 transition-all"
            >

              <span className="relative z-10 flex items-center gap-1.5">
                Sign Up
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-rose-100 opacity-0 group-hover:opacity-100 transition-opacity" />

            </button>

          </div>


          {/* Mobile Menu */}

          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

        </div>


        {/* Mobile Menu Content */}

        <AnimatePresence>

          {isOpen && (

            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="lg:hidden bg-[#030014]/98 backdrop-blur-xl border-b border-white/10 overflow-hidden"
            >

              <div className="px-6 py-6 flex flex-col gap-1">

                {[
                  "Home",
                  "Features",
                  "StudySync",
                  "How It Works",
                  "Login",
                ].map((item) => (

                  <button
                    key={item}
                    onClick={() => {

                      if (item === "Home") {
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                        setIsOpen(false);
                      } else if (item === "Login") {
                        navigate("/login");
                        setIsOpen(false);
                      } else if (item === "Features") {
                        scrollToSection("features");
                      } else if (item === "StudySync") {
                        scrollToSection("studysync");
                      } else {
                        scrollToSection("how-it-works");
                      }

                    }}
                    className="text-left text-neutral-300 py-3 px-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    {item}
                  </button>

                ))}

                <button
                  onClick={() => navigate("/signup")}
                  className="mt-3 w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3.5 rounded-xl font-bold"
                >
                  Sign Up Free
                </button>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero-premium relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-5 md:px-8 overflow-hidden">

        {/* Grid */}

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_40%,transparent_100%)]" />


        <motion.div
          style={{
            y: heroY,
            opacity: heroOpacity,
          }}
          className="relative z-10 max-w-6xl mx-auto text-center"
        >

          {/* Badge */}

          <motion.div
            initial={{
              opacity: 0,
              y: -16,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
            }}
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-red-500/10 via-rose-500/10 to-orange-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-8 backdrop-blur-md"
          >

            <span className="relative flex h-2 w-2">

              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />

              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />

            </span>

            <span className="text-xs font-semibold tracking-widest uppercase text-red-200">
              AI-Powered Placement Preparation
            </span>

          </motion.div>


          {/* Heading */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6"
          >

            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-500">
              Prepare Smarter.
            </span>

            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-orange-400">
              Speak Better.
            </span>

            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500">
              Get Placement Ready.
            </span>

          </motion.h1>


          {/* Description */}

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.25,
            }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Practice realistic AI group discussions and turn every PDF into
            an interactive knowledge base with StudySync.
          </motion.p>


          {/* CTA */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.35,
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >

            <button
              onClick={() => navigate("/signup")}
              className="group relative w-full sm:w-auto overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all active:scale-[0.98]"
            >

              <span className="relative z-10 flex items-center justify-center gap-2">

                Start Practicing Free

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-rose-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />

            </button>


            <button
              onClick={() => scrollToSection("studysync")}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.07] text-white font-semibold px-8 py-4 rounded-2xl backdrop-blur-md transition-all"
            >

              <BookOpen className="w-4 h-4 text-rose-400" />

              Explore StudySync

              <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />

            </button>

          </motion.div>


          {/* =================================================
              STUDY DISCUSSION LOTTIE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative w-full flex justify-center mb-6"
          >

            {/* Glow */}

            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">

              <div className="w-[350px] h-[300px] bg-red-600/20 rounded-full blur-[100px]" />

            </div>


            {/* Animation */}

            <div className="relative z-10">

              <DotLottieReact
                data={JSON.stringify(studyDiscussionAnimation)}
                autoplay
                loop
                style={{
                  width: "min(600px, 90vw)",
                  height: "min(450px, 65vw)",
                }}
              />

            </div>

          </motion.div>


          {/* Live Users */}

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.6,
            }}
            className="inline-flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-xl mb-16"
          >

            <div className="relative">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">

                <Globe className="w-5 h-5 text-red-400" />

              </div>

              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#030014] animate-pulse" />

            </div>


            <div className="text-left">

              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold flex items-center gap-1.5">

                <Activity className="w-3 h-3" />

                {liveUsers} Online Now

              </div>


              <div className="text-sm text-neutral-200 font-medium truncate max-w-[260px]">

                Live:{" "}

                <span className="text-rose-400">
                  "{currentTopic}"
                </span>

              </div>

            </div>

          </motion.div>

        </motion.div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="relative py-28 px-5 md:px-8"
      >

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

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
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-400 mb-4"
            >

              <Sparkles className="w-3.5 h-3.5" />

              Platform Capabilities

            </motion.div>


            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">

              Built for{" "}

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
                Placement Success
              </span>

            </h2>


            <p className="text-neutral-400 max-w-xl mx-auto text-lg">
              Two pillars. One platform. Everything you need to walk in
              prepared.
            </p>

          </div>


          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: "-80px",
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >

            {features.map((feature, index) => {

              const Icon = feature.icon;

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    transition: {
                      duration: 0.25,
                    },
                  }}
                  className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 rounded-2xl p-6 transition-all duration-300 overflow-hidden"
                >

                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}
                  />


                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >

                    <Icon className="w-5 h-5 text-white" />

                  </div>


                  <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                    {feature.title}
                  </h3>


                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {feature.desc}
                  </p>

                </motion.div>
              );

            })}

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          STUDYSYNC
      ===================================================== */}

      <section
        id="studysync"
        className="relative py-28 px-5 md:px-8 border-y border-white/5 overflow-hidden"
      >

        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/20 via-transparent to-red-950/10 pointer-events-none" />


        <div className="max-w-7xl mx-auto relative">

          {/* Header */}

          <div className="text-center mb-16">

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            >

              <Zap className="w-3.5 h-3.5" />

              New Experience

            </motion.div>


            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">

              Meet{" "}

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                StudySync
              </span>

            </h2>


            <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Upload notes, textbooks, or interview material. StudySync turns
              them into a living knowledge base you can talk to.
            </p>

          </div>


          {/* Pipeline */}

          <div className="mb-20">

            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-2">

              {pipeline.map((node, index) => {

                const Icon = node.icon;

                return (
                  <React.Fragment key={index}>

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
                      }}
                      transition={{
                        delay: index * 0.07,
                      }}
                      whileHover={{
                        scale: 1.05,
                      }}
                      className="flex flex-col items-center gap-2.5 bg-white/[0.04] border border-white/10 hover:border-rose-500/40 rounded-2xl px-5 py-4 min-w-[90px] transition-colors"
                    >

                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center">

                        <Icon className="w-5 h-5 text-rose-400" />

                      </div>


                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                        {node.label}
                      </span>

                    </motion.div>


                    {index < pipeline.length - 1 && (

                      <div className="hidden md:flex items-center text-neutral-600">

                        <ChevronRight className="w-5 h-5" />

                      </div>

                    )}

                  </React.Fragment>
                );

              })}

            </div>


            <div className="flex flex-wrap justify-center gap-3 mt-8">

              <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/15 text-red-300 border border-red-500/25 px-3.5 py-1.5 rounded-full">
                Powered by RAG
              </span>

              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-neutral-400 border border-white/10 px-3.5 py-1.5 rounded-full">
                LangChain · Gemini · pgvector
              </span>

            </div>

          </div>


          {/* Chat + Technical Pipeline */}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">

            {/* Chat */}

            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              className="lg:col-span-3 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl shadow-black/40"
            >

              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/5">

                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">

                  <FileText className="w-6 h-6 text-red-400" />

                </div>


                <div>

                  <div className="font-semibold text-white">
                    Operating Systems Notes.pdf
                  </div>

                  <div className="text-xs text-neutral-500">
                    Active · Fully indexed
                  </div>

                </div>


                <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 font-medium">

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

                  Ready

                </div>

              </div>


              <div className="space-y-4">

                {/* User */}

                <div className="flex justify-end">

                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">

                    <p className="text-sm text-neutral-200">
                      What are the necessary conditions for deadlock?
                    </p>

                  </div>

                </div>


                {/* AI */}

                <div className="flex justify-start">

                  <div className="bg-gradient-to-br from-rose-600/20 to-red-600/10 border border-rose-500/30 rounded-2xl rounded-tl-md px-4 py-3 max-w-[90%]">

                    <p className="text-sm text-neutral-200 leading-relaxed mb-3">
                      Based on your uploaded notes, deadlock can occur when
                      four conditions exist simultaneously: mutual exclusion,
                      hold and wait, no preemption, and circular wait.
                    </p>


                    <div className="bg-black/30 rounded-xl p-3 space-y-2">

                      <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                        Retrieved Sources
                      </div>


                      <div className="text-xs text-neutral-400 border-l-2 border-rose-500/50 pl-2.5">
                        §4.2 — "A resource can be held by only one process at a
                        time."
                      </div>


                      <div className="text-xs text-neutral-400 border-l-2 border-rose-500/50 pl-2.5">
                        §4.3 — "Processes holding resources may request
                        additional ones."
                      </div>


                      <div className="text-xs text-neutral-400 border-l-2 border-rose-500/50 pl-2.5">
                        §4.4 — "Circular wait must be broken to prevent
                        deadlock."
                      </div>


                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium pt-1">

                        <Search className="w-3 h-3" />

                        3 relevant sections retrieved

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>


            {/* Technical Side */}

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              className="lg:col-span-2 flex flex-col gap-4"
            >

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex-1">

                <h3 className="text-lg font-bold text-white mb-1">
                  From PDF → Answer
                </h3>


                <p className="text-sm text-neutral-400 mb-5">
                  Every response is grounded in your documents — never
                  generic.
                </p>


                <div className="space-y-2.5">

                  {[
                    "PDF Upload",
                    "LangChain Pipeline",
                    "Smart Chunking",
                    "Gemini Embeddings",
                    "Neon + pgvector",
                    "Semantic Retrieval",
                    "Grounded AI Response",
                  ].map((label, index) => (

                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >

                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-white/5 flex items-center justify-center text-[11px] font-bold text-rose-300 shrink-0">
                        {index + 1}
                      </div>


                      <div className="flex-1 text-sm text-neutral-300 font-medium bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2">
                        {label}
                      </div>

                    </div>

                  ))}

                </div>

              </div>


              {/* Security */}

              <div className="bg-gradient-to-br from-red-600/10 to-rose-600/5 border border-red-500/20 rounded-2xl p-5">

                <div className="flex items-start gap-3">

                  <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />

                  <div>

                    <div className="text-sm font-semibold text-white mb-1">
                      Your documents stay yours
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Embeddings & retrieval run on your material only. Answers
                      cite exact source sections.
                    </p>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TWO PILLARS
      ===================================================== */}

      <section className="relative py-28 px-5 md:px-8">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">

            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">

              One Platform.{" "}

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
                Two Superpowers.
              </span>

            </h2>

            <p className="text-neutral-400 text-lg">
              Master how you speak. Master what you know.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* GD Arena */}

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              whileHover={{
                y: -6,
              }}
              className="relative group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/40 via-[#0a0618] to-[#030014] p-8 md:p-10"
            >

              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-[80px] opacity-50 group-hover:opacity-80 transition-opacity" />


              <div className="relative">

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-6 shadow-lg shadow-red-500/30">

                  <Bot className="w-7 h-7 text-white" />

                </div>


                <h3 className="text-2xl md:text-3xl font-black text-white mb-1">
                  GD Arena
                </h3>


                <p className="text-red-300 font-semibold text-sm uppercase tracking-widest mb-6">
                  Master Communication
                </p>


                <ul className="space-y-3 mb-8">

                  {[
                    "AI group discussions",
                    "Real-time voice interaction",
                    "Live performance analytics",
                    "Unlimited smart topics",
                  ].map((text) => (

                    <li
                      key={text}
                      className="flex items-center gap-3 text-neutral-300 text-sm"
                    >

                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />

                      {text}

                    </li>

                  ))}

                </ul>


                <button
                  onClick={() => navigate("/signup")}
                  className="w-full group/btn bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                >

                  Practice GDs

                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />

                </button>

              </div>

            </motion.div>


            {/* StudySync */}

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.1,
              }}
              whileHover={{
                y: -6,
              }}
              className="relative group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-rose-950/30 via-[#0a0618] to-[#030014] p-8 md:p-10"
            >

              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/15 rounded-full blur-[80px] opacity-50 group-hover:opacity-80 transition-opacity" />


              <div className="relative">

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30">

                  <BookOpen className="w-7 h-7 text-white" />

                </div>


                <h3 className="text-2xl md:text-3xl font-black text-white mb-1">
                  StudySync
                </h3>


                <p className="text-rose-300 font-semibold text-sm uppercase tracking-widest mb-6">
                  Master Knowledge
                </p>


                <ul className="space-y-3 mb-8">

                  {[
                    "PDF upload & understanding",
                    "RAG-powered Q&A",
                    "Semantic document search",
                    "Cited, grounded answers",
                  ].map((text) => (

                    <li
                      key={text}
                      className="flex items-center gap-3 text-neutral-300 text-sm"
                    >

                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />

                      {text}

                    </li>

                  ))}

                </ul>


                <button
                  onClick={() => scrollToSection("studysync")}
                  className="w-full group/btn bg-white/5 border border-white/15 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                >

                  Explore StudySync

                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />

                </button>

              </div>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="relative py-28 px-5 md:px-8 border-y border-white/5 bg-white/[0.015]"
      >

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Your Placement Workflow
            </h2>

            <p className="text-neutral-400 text-lg max-w-lg mx-auto">
              Five steps from zero to placement-ready.
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

            {steps.map((step, index) => (

              <motion.div
                key={index}
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
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className="relative group"
              >

                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500/30 to-transparent mb-3 select-none group-hover:from-red-400/50 transition-all">
                  {step.step}
                </div>


                <h4 className="text-base font-bold text-white mb-2">
                  {step.title}
                </h4>


                <p className="text-sm text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ===================================================== */}

      <section
        id="stats"
        className="relative py-24 px-5 md:px-8"
      >

        <div className="max-w-5xl mx-auto">

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-red-950/30 via-rose-950/20 to-transparent p-10 md:p-14">

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent" />


            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">

              {[
                {
                  value: "10,000+",
                  label: "Discussions",
                },
                {
                  value: "5,000+",
                  label: "Learners",
                },
                {
                  value: "100+",
                  label: "GD Topics",
                },
                {
                  value: "95%",
                  label: "Satisfaction",
                },
              ].map((stat, index) => (

                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                >

                  <div className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 mb-1">
                    {stat.value}
                  </div>


                  <div className="text-xs md:text-sm text-neutral-400 font-bold uppercase tracking-widest">
                    {stat.label}
                  </div>

                </motion.div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <section className="relative py-28 px-5 md:px-8">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">

            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Trusted by Placement Aspirants
            </h2>

            <p className="text-neutral-400">
              Students, MBA candidates & professionals preparing for what
              comes next.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {testimonials.map((testimonial, index) => (

              <motion.div
                key={index}
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
                }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -4,
                }}
                className="relative bg-white/[0.03] border border-white/5 hover:border-white/15 rounded-2xl p-7 transition-all duration-300"
              >

                <div className="flex gap-1 mb-4">

                  {[...Array(testimonial.rating)].map((_, starIndex) => (

                    <Star
                      key={starIndex}
                      className="w-3.5 h-3.5 fill-rose-400 text-rose-400"
                    />

                  ))}

                </div>


                <Quote className="w-8 h-8 text-red-500/15 absolute top-6 right-6" />


                <p className="text-neutral-300 text-sm leading-relaxed mb-6 relative z-10">
                  "{testimonial.quote}"
                </p>


                <div>

                  <div className="text-sm font-bold text-white">
                    {testimonial.author}
                  </div>

                  <div className="text-xs text-neutral-500">
                    {testimonial.role}
                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="relative py-32 px-5 md:px-8 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-t from-red-950/30 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />


        <div className="relative max-w-3xl mx-auto text-center">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5">

              Ready to Become{" "}

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-orange-400">
                Placement Ready?
              </span>

            </h2>


            <p className="text-neutral-400 text-lg mb-10 max-w-md mx-auto">
              Practice. Study. Improve. Walk into every round prepared.
            </p>


            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

              <button
                onClick={() => navigate("/signup")}
                className="group relative overflow-hidden bg-white text-black font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all active:scale-[0.98]"
              >

                <span className="relative z-10 flex items-center gap-2">

                  Start Free Today

                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

                </span>

              </button>


              <button
                onClick={() => scrollToSection("studysync")}
                className="flex items-center gap-2 bg-white/5 border border-white/15 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-2xl transition-all"
              >

                <BookOpen className="w-4 h-4 text-rose-400" />

                Explore StudySync

              </button>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="relative border-t border-white/5 py-12 px-5 md:px-8 bg-[#02000a]">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">

              <Terminal className="w-4 h-4 text-white" />

            </div>


            <div>

              <div className="text-sm font-bold text-white">
                GD Arena
              </div>

              <div className="text-xs text-neutral-500">
                AI-powered placement preparation
              </div>

            </div>

          </div>


          {/* Links */}

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-neutral-400">

            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="hover:text-white transition-colors"
            >
              About
            </button>


            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-white transition-colors"
            >
              Features
            </button>


            <button
              onClick={() => scrollToSection("studysync")}
              className="hover:text-white transition-colors"
            >
              StudySync
            </button>


            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Privacy
            </a>


            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Terms
            </a>

          </div>


          {/* Copyright */}

          <div className="text-xs text-neutral-600">
            © 2026 GD Arena. All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}