import { useState, useMemo } from "react";
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
} from "react-icons/fi";

import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

import gdImage from "../assets/images/gdimage.png";

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
    textColor = "text-cyan-400";
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

    // Signup-only validation
    if (!isLoginPage) {
      if (!confirmPassword.trim()) {
        toast.error("Please confirm your password.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      // Require at least Strong (score >= 4)
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

        toast.success(
          "Account created! Please verify your email."
        );

        navigate("/verify-email", { replace: true });
      }
    } catch (err) {
      toast.error(
        err.message || "An authentication error occurred."
      );
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
      toast.error(
        err.message || "Google sign-in failed."
      );
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------------
          FORGOT PASSWORD
  -------------------------------- */

  async function handleForgotPassword() {
    if (!email.trim()) {
      toast.error(
        "Please enter your email first to reset your password."
      );
      return;
    }

    try {
      await forgotPassword(email);

      toast.success(
        "Password reset email sent successfully."
      );
    } catch (err) {
      toast.error(
        err.message || "Failed to send reset email."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#030014] text-gray-200 flex relative selection:bg-red-500/30">

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* LEFT SIDE - IMAGE */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">

        <img
          src={gdImage}
          alt="GD Arena"
          className="absolute inset-0 w-full h-full object-cover select-none"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#030014]/90 via-[#030014]/40 to-transparent" />

        <div className="absolute bottom-16 left-16 z-10 max-w-md">
          <h2 className="text-5xl font-black text-white tracking-tight uppercase">
            GD Arena
          </h2>

          <p className="text-lg text-gray-400 mt-3 font-medium">
            Compete. Improve. Win.
          </p>
        </div>

      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 overflow-y-auto">

        <div className="w-full max-w-sm space-y-8 my-auto">

          {/* Header */}
          <div className="text-center space-y-2">

            <h1 className="text-3xl font-bold tracking-tight text-white transition-all duration-300">
              {isLoginPage
                ? "Welcome Back"
                : "Join GD Arena"}
            </h1>

            <p className="text-sm text-gray-400">
              {isLoginPage
                ? "Sign in to continue your journey"
                : "With thousands of competitors looking to climb."}
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Email */}
            <div className="relative group">

              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />

              <input
                type="email"
                value={email}
                disabled={loading}
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-red-500 focus:bg-white/[0.07] transition-all disabled:opacity-50"
              />

            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="relative group">

                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-red-500 focus:bg-white/[0.07] transition-all disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>

              </div>

              {/* Password Strength UI (Signup only) */}
              {showStrengthUI && (
                <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
                  {/* Label + Bar */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-medium text-gray-500 tracking-wide uppercase">
                      Password strength
                    </span>
                    <span
                      className={`text-[11px] font-semibold tracking-wide transition-colors duration-300 ${strength.textColor}`}
                    >
                      {strength.label}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ease-out ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>

                  {/* Requirements Checklist */}
                  <ul className="grid grid-cols-1 gap-1.5 pt-1">
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
                          className={`flex items-center gap-2 text-[12px] transition-all duration-200 ${
                            met
                              ? "text-emerald-400"
                              : "text-gray-500"
                          }`}
                        >
                          <span
                            className={`flex items-center justify-center w-4 h-4 rounded-full transition-all duration-200 ${
                              met
                                ? "bg-emerald-500/20 text-emerald-400 scale-100"
                                : "bg-white/5 text-gray-600 scale-95"
                            }`}
                          >
                            {met ? (
                              <FiCheck className="w-2.5 h-2.5" />
                            ) : (
                              <FiX className="w-2.5 h-2.5" />
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
              <div className="space-y-2 animate-fadeIn">
                <div className="relative group">

                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />

                  <input
                    type="password"
                    value={confirmPassword}
                    disabled={loading}
                    placeholder="Confirm Password"
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-red-500 focus:bg-white/[0.07] transition-all disabled:opacity-50"
                  />

                </div>

                {/* Match Status */}
                {showMatchUI && (
                  <div
                    className={`flex items-center gap-2 text-[12px] transition-all duration-200 ${
                      passwordsMatch
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-4 h-4 rounded-full transition-all duration-200 ${
                        passwordsMatch
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {passwordsMatch ? (
                        <FiCheck className="w-2.5 h-2.5" />
                      ) : (
                        <FiX className="w-2.5 h-2.5" />
                      )}
                    </span>
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </div>
                )}
              </div>
            )}

            {/* Forgot Password */}
            {isLoginPage && (
              <div className="text-right">

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-red-400 hover:text-red-300 hover:underline transition-colors font-medium"
                >
                  Forgot Password?
                </button>

              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin w-5 h-5" />
                  Please Wait...
                </>
              ) : isLoginPage ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-4">

              <div className="flex-1 border-t border-white/10" />

              <span className="px-4 text-xs text-gray-500 font-bold tracking-wider">
                OR
              </span>

              <div className="flex-1 border-t border-white/10" />

            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full py-3.5 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-sm active:scale-[0.99] disabled:opacity-50"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>

          </form>

          {/* Toggle Login / Signup */}
          <p className="text-center text-sm text-gray-400 pt-2">

            {isLoginPage
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              className="ml-1.5 text-red-400 hover:text-red-300 hover:underline font-semibold transition-colors"
              onClick={() =>
                navigate(
                  isLoginPage
                    ? "/signup"
                    : "/login"
                )
              }
            >
              {isLoginPage
                ? "Sign Up"
                : "Sign In"}
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}