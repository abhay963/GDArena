import { useState } from "react";
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
} from "react-icons/fi";

import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

import gdImage from "../assets/images/gdimage.png";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!isLoginPage && !confirmPassword.trim()) {
      toast.error("Please confirm your password.");
      return;
    }
    if (!isLoginPage && password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      if (isLoginPage) {
        await login(email, password);
        toast.success("Login Successful!");
      } else {
        await signup(email, password);
        toast.success("Account Created Successfully!");
      }
      navigate("/hero", { replace: true });
    } catch (err) {
      toast.error(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  }

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

      {/* RIGHT SIDE - FORM CONTAINER */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 overflow-y-auto">
        <div className="w-full max-w-sm space-y-8 my-auto">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white transition-all duration-300">
              {isLoginPage ? "Welcome Back" : "Join GD Arena"}
            </h1>
            <p className="text-sm text-gray-400">
              {isLoginPage
                ? "Sign in to continue your journey"
                : "With thousands of competitors looking to climb."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password (Signup Only) */}
            {!isLoginPage && (
              <div className="relative group animate-fadeIn">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="password"
                  value={confirmPassword}
                  disabled={loading}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-red-500 focus:bg-white/[0.07] transition-all disabled:opacity-50"
                />
              </div>
            )}

            {/* Forgot Password Link */}
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
              <span className="px-4 text-xs text-gray-500 font-bold tracking-wider">OR</span>
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

          {/* Toggle Login/Signup */}
          <p className="text-center text-sm text-gray-400 pt-2">
            {isLoginPage ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="ml-1.5 text-red-400 hover:text-red-300 hover:underline font-semibold transition-colors"
              onClick={() => navigate(isLoginPage ? "/signup" : "/login")}
            >
              {isLoginPage ? "Sign Up" : "Sign In"}
            </button>
          </p>
          
        </div>
      </div>
    </div>
  );
}