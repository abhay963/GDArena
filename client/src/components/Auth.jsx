import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  login,
  signup,
  googleLogin,
  forgotPassword,
} from "../services/auth.service";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiArrowLeft,
  FiCheck,
  FiX,
  FiFileText,
  FiMic,
  FiArrowRight,
} from "react-icons/fi";

import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

/* Premium cinematic image */
const heroImage =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80";

/* --------------------------------
   Password Strength Helper
--------------------------------- */

const WEAK_PASSWORDS = [
  "12345678",
  "password",
  "password123",
  "qwerty123",
  "123456789",
  "qwertyui",
  "admin123",
  "letmein1",
];

function evaluatePassword(password) {
  if (!password) {
    return {
      score: 0,
      label: "",
      color: "bg-gray-600",
      textColor: "text-gray-500",
      width: "0%",
      checks: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      },
      isCommonWeak: false,
    };
  }

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const met = Object.values(checks).filter(Boolean).length;
  const isCommonWeak = WEAK_PASSWORDS.includes(password.toLowerCase());

  let score = met;
  if (isCommonWeak) score = Math.min(score, 1);

  let label = "";
  let color = "bg-gray-600";
  let textColor = "text-gray-500";
  let width = "0%";

  if (score <= 1) {
    label = "Weak";
    color = "bg-red-500";
    textColor = "text-red-400";
    width = "25%";
  } else if (score <= 3) {
    label = "Medium";
    color = "bg-orange-500";
    textColor = "text-orange-400";
    width = "50%";
  } else if (score === 4) {
    label = "Strong";
    color = "bg-emerald-500";
    textColor = "text-emerald-400";
    width = "75%";
  } else {
    label = "Very Strong";
    color = "bg-cyan-400";
    textColor = "text-cyan-300";
    width = "100%";
  }

  return { score, label, color, textColor, width, checks, isCommonWeak };
}

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const strength = useMemo(() => evaluatePassword(password), [password]);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const showStrengthUI = !isLoginPage && password.length > 0;
  const showMatchUI = !isLoginPage && confirmPassword.length > 0;

  /* -------------------------------
          LOGIN / SIGNUP
  -------------------------------- */

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Enter your email Address.");
      return;
    }

    if (!password.trim()) {
      toast.error("Enter your password.");
      return;
    }

    if (!isLoginPage) {
      if (!confirmPassword.trim()) {
        toast.error("Please confirm your password.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      if (strength.score < 4 || strength.isCommonWeak) {
        toast.error("Please create a stronger password.");
        return;
      }
    }

    try {
      setLoading(true);

      if (isLoginPage) {
        await login(email, password);
        toast.success("Login Successful!");
        navigate("/hero", { replace: true });
      } else {
        await signup(email, password);
        toast.success("Account created! Please verify your email.");
        navigate("/verify-email", { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------------
          GOOGLE LOGIN
  -------------------------------- */

  async function handleGoogle() {
    try {
      setLoading(true);
      await googleLogin();
      toast.success("Welcome back!");
      navigate("/hero", { replace: true });
    } catch (err) {
      toast.error(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------------
          FORGOT PASSWORD
  -------------------------------- */

  async function handleForgotPassword() {
    if (!email.trim()) {
      toast.error("Please enter your email first to reset your password.");
      return;
    }

    try {
      await forgotPassword(email);
      toast.success("Password reset email sent successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to send reset email.");
    }
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-zinc-200 flex relative overflow-hidden selection:bg-red-500/20">
      {/* Global keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(0.5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.85; }
        }
        @keyframes ambient-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes particle {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-120px) scale(0.6); opacity: 0; }
        }
        @keyframes border-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          50% { box-shadow: 0 0 20px 2px rgba(239, 68, 68, 0.15); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3.5s ease-in-out infinite; }
        .animate-ambient { animation: ambient-pulse 7s ease-in-out infinite; }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-red-600/[0.08] blur-[140px] animate-ambient" />
        <div className="absolute top-1/4 -right-48 w-[560px] h-[560px] rounded-full bg-violet-600/[0.07] blur-[120px] animate-ambient" style={{ animationDelay: "1.8s" }} />
        <div className="absolute bottom-0 left-1/3 w-[480px] h-[360px] rounded-full bg-red-500/[0.05] blur-[100px] animate-ambient" style={{ animationDelay: "3.2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-white/[0.012] blur-[80px]" />
      </div>

      {/* Subtle floating particles (CSS only) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{
              left: `${8 + i * 7.5}%`,
              bottom: `${5 + (i % 5) * 8}%`,
              animation: `particle ${7 + (i % 4)}s ease-in infinite`,
              animationDelay: `${i * 0.7}s`,
              opacity: 0.35 + (i % 3) * 0.15,
            }}
          />
        ))}
      </div>

      {/* --------------------------------
          BACK BUTTON
      --------------------------------- */}
      <button
        onClick={() => navigate("/")}
        className={`absolute top-6 left-6 z-50 flex items-center gap-2 text-[13px] font-medium text-zinc-500 hover:text-white transition-all duration-300 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
        style={{ transitionDelay: "100ms" }}
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* =================================
          LEFT SIDE — CINEMATIC VISUAL
      ================================== */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        {/* Base image with subtle scale animation */}
        <img
          src={heroImage}
          alt="Students collaborating with AI"
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-[2.2s] ease-out ${
            mounted ? "opacity-55 scale-100" : "opacity-0 scale-110"
          }`}
        />

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05050a] via-[#05050a]/82 to-[#05050a]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-[#05050a]/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_70%,rgba(220,38,38,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(139,92,246,0.09),transparent_50%)]" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Floating product cards */}
        <div className="absolute top-28 right-14 z-20 space-y-5">
          {/* StudyMate card */}
          <div
            className={`group w-[270px] p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-500 hover:border-violet-500/35 hover:bg-white/[0.06] hover:shadow-violet-900/20 animate-float-slow ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "280ms", animationDelay: "0.4s" }}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0 transition-transform duration-400 group-hover:scale-105">
                <FiFileText className="w-[18px] h-[18px] text-violet-400" />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[13.5px] font-semibold text-white tracking-tight">
                  StudyMate
                </p>
                <p className="text-[11.5px] text-zinc-500 mt-0.5 leading-snug">
                  Learn from your knowledge
                </p>
              </div>
            </div>
            <div className="mt-3.5 flex items-center gap-2 text-[10.5px] text-zinc-600">
              <span className="px-2 py-0.5 rounded-md bg-violet-500/12 text-violet-400/90 border border-violet-500/15">
                PDF → AI
              </span>
              <span className="text-zinc-700">→</span>
              <span className="text-zinc-500">Grounded answers</span>
            </div>
          </div>

          {/* GD Arena card */}
          <div
            className={`group w-[270px] p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-500 hover:border-red-500/35 hover:bg-white/[0.06] hover:shadow-red-900/20 animate-float ml-7 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "420ms", animationDelay: "1.1s" }}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0 transition-transform duration-400 group-hover:scale-105">
                <FiMic className="w-[18px] h-[18px] text-red-400" />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[13.5px] font-semibold text-white tracking-tight">
                  GD Arena
                </p>
                <p className="text-[11.5px] text-zinc-500 mt-0.5 leading-snug">
                  Practice. Speak. Improve.
                </p>
              </div>
            </div>
            <div className="mt-3.5 flex items-center gap-2 text-[10.5px] text-zinc-600">
              <span className="px-2 py-0.5 rounded-md bg-red-500/12 text-red-400/90 border border-red-500/15">
                Discussion
              </span>
              <span className="text-zinc-700">→</span>
              <span className="text-zinc-500">AI analysis</span>
            </div>
          </div>
        </div>

        {/* Main left content */}
        <div
          className={`absolute bottom-20 left-14 z-20 max-w-md transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 mb-7 rounded-full bg-white/[0.04] border border-white/[0.09] backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-glow" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 font-medium">
              AI Learning OS
            </span>
          </div>

          <h2 className="text-[3.55rem] font-semibold text-white tracking-[-0.045em] leading-[0.92]">
            Learn.
            <br />
            Practice.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600">
              Grow.
            </span>
          </h2>

          <p className="mt-6 text-[15px] text-zinc-400 leading-relaxed max-w-sm">
            One AI-powered platform for smarter learning, better communication,
            and interview preparation.
          </p>

          {/* Product indicators */}
          <div className="mt-9 flex items-center gap-7">
            <div className="flex items-center gap-2.5 group cursor-default">
              <div className="w-2 h-2 rounded-full bg-violet-400/85 shadow-[0_0_10px_rgba(167,139,250,0.5)] transition-transform group-hover:scale-125" />
              <span className="text-[12.5px] text-zinc-500 font-medium tracking-wide group-hover:text-zinc-300 transition-colors">
                StudyMate
              </span>
            </div>
            <div className="flex items-center gap-2.5 group cursor-default">
              <div className="w-2 h-2 rounded-full bg-red-400/85 shadow-[0_0_10px_rgba(248,113,113,0.5)] transition-transform group-hover:scale-125" />
              <span className="text-[12.5px] text-zinc-500 font-medium tracking-wide group-hover:text-zinc-300 transition-colors">
                GD Arena
              </span>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#05050a] to-transparent pointer-events-none" />
      </div>

      {/* =================================
          RIGHT SIDE — AUTH PANEL
      ================================== */}
      <div className="w-full lg:w-[48%] flex items-center justify-center px-6 sm:px-12 md:px-16 lg:px-20 relative z-10">
        <div
          className={`w-full max-w-[390px] my-auto transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "220ms" }}
        >
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-[1.9rem] font-semibold text-white tracking-tight leading-none">
              {isLoginPage ? "Welcome back." : "Build your edge."}
            </h1>
            <p className="mt-3.5 text-[14.5px] text-zinc-500 leading-relaxed">
              {isLoginPage
                ? "Continue your journey with AI-powered learning."
                : "Learn smarter. Speak better. Perform better."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div
              className={`relative group transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "320ms" }}
            >
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-zinc-600 group-focus-within:text-red-400 transition-colors duration-300" />
              <input
                type="email"
                value={email}
                disabled={loading}
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[50px] pl-11 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[14px] text-white placeholder:text-zinc-600 outline-none focus:border-red-500/55 focus:bg-white/[0.055] focus:ring-[3px] focus:ring-red-500/15 transition-all duration-300 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div
              className={`space-y-2.5 transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "380ms" }}
            >
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-zinc-600 group-focus-within:text-red-400 transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[50px] pl-11 pr-11 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[14px] text-white placeholder:text-zinc-600 outline-none focus:border-red-500/55 focus:bg-white/[0.055] focus:ring-[3px] focus:ring-red-500/15 transition-all duration-300 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors duration-200"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-[15px] h-[15px]" />
                  ) : (
                    <FiEye className="w-[15px] h-[15px]" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {showStrengthUI && (
                <div className="space-y-2.5 pt-1 animate-[fade-in_0.35s_ease-out]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600 font-medium">
                      Strength
                    </span>
                    <span
                      className={`text-[11.5px] font-medium transition-colors duration-300 ${strength.textColor}`}
                    >
                      {strength.label}
                    </span>
                  </div>

                  <div className="h-[3px] w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>

                  <ul className="grid gap-1.5 pt-0.5">
                    {[
                      { key: "length", label: "At least 8 characters" },
                      { key: "uppercase", label: "One uppercase letter" },
                      { key: "lowercase", label: "One lowercase letter" },
                      { key: "number", label: "One number" },
                      { key: "special", label: "One special character" },
                    ].map(({ key, label }) => {
                      const met = strength.checks[key];
                      return (
                        <li
                          key={key}
                          className={`flex items-center gap-2 text-[11.5px] transition-all duration-200 ${
                            met ? "text-emerald-400/90" : "text-zinc-600"
                          }`}
                        >
                          <span
                            className={`flex items-center justify-center w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                              met
                                ? "bg-emerald-500/20 text-emerald-400 scale-100"
                                : "bg-white/[0.04] text-zinc-700 scale-95"
                            }`}
                          >
                            {met ? (
                              <FiCheck className="w-2 h-2" />
                            ) : (
                              <FiX className="w-2 h-2" />
                            )}
                          </span>
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            {!isLoginPage && (
              <div
                className={`space-y-2 animate-[fade-in_0.35s_ease-out] transition-all duration-500 ${
                  mounted ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: "420ms" }}
              >
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-zinc-600 group-focus-within:text-red-400 transition-colors duration-300" />
                  <input
                    type="password"
                    value={confirmPassword}
                    disabled={loading}
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-[50px] pl-11 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[14px] text-white placeholder:text-zinc-600 outline-none focus:border-red-500/55 focus:bg-white/[0.055] focus:ring-[3px] focus:ring-red-500/15 transition-all duration-300 disabled:opacity-50"
                  />
                </div>

                {showMatchUI && (
                  <div
                    className={`flex items-center gap-2 text-[11.5px] transition-colors duration-200 ${
                      passwordsMatch ? "text-emerald-400/90" : "text-red-400/90"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-3.5 h-3.5 rounded-full ${
                        passwordsMatch
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {passwordsMatch ? (
                        <FiCheck className="w-2 h-2" />
                      ) : (
                        <FiX className="w-2 h-2" />
                      )}
                    </span>
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </div>
                )}
              </div>
            )}

            {/* Forgot Password */}
            {isLoginPage && (
              <div
                className={`flex justify-end -mt-1 transition-all duration-500 ${
                  mounted ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: "440ms" }}
              >
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[12.5px] text-zinc-500 hover:text-red-400 transition-colors duration-200 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Primary CTA */}
            <div
              className={`transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "480ms" }}
            >
              <button
                type="submit"
                disabled={loading}
                className="relative w-full h-[50px] mt-1 rounded-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.985] transition-transform duration-200"
              >
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-[length:200%_100%] animate-shimmer" />
                {/* Hover light sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.25),transparent_55%)]" />
                {/* Soft outer glow on hover */}
                <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-red-500/40 to-red-400/30 blur-sm -z-10" />
                <div className="relative flex items-center justify-center gap-2.5 text-[14.5px] font-semibold text-white tracking-tight">
                  {loading ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      {isLoginPage ? "Enter the Arena" : "Start Your Journey"}
                      <FiArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Divider */}
            <div
              className={`relative flex items-center py-3.5 transition-all duration-500 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "520ms" }}
            >
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="px-4 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-medium">
                or
              </span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            {/* Google */}
            <div
              className={`transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "560ms" }}
            >
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full h-[50px] rounded-xl border border-white/[0.09] bg-white/[0.025] hover:bg-white/[0.055] hover:border-white/[0.14] transition-all duration-300 flex items-center justify-center gap-3 text-[14px] font-medium text-zinc-300 disabled:opacity-50 active:scale-[0.985]"
              >
                <FcGoogle className="w-[18px] h-[18px]" />
                Continue with Google
              </button>
            </div>
          </form>

          {/* Toggle */}
          <p
            className={`mt-9 text-center text-[13.5px] text-zinc-500 transition-all duration-500 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            {isLoginPage ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => navigate(isLoginPage ? "/signup" : "/login")}
              className="ml-1.5 text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
            >
              {isLoginPage ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      {/* Mobile ambient */}
      <div className="lg:hidden pointer-events-none absolute top-0 right-0 w-72 h-72 bg-red-600/[0.07] blur-[90px] animate-ambient" />
      <div className="lg:hidden pointer-events-none absolute bottom-20 left-0 w-56 h-56 bg-violet-600/[0.05] blur-[80px] animate-ambient" style={{ animationDelay: "2s" }} />
    </div>
  );
}