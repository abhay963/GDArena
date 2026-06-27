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
      toast.error("Enter your email.");
      return;
    }
    if (!password.trim()) {
      toast.error("Enter your password.");
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
        toast.success("Login Successful");
      } else {
        await signup(email, password);
        toast.success("Account Created Successfully");
      }
      navigate("/hero", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      setLoading(true);
      await googleLogin();
      toast.success("Welcome");
      navigate("/hero", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      toast.error("Enter your email first.");
      return;
    }
    try {
      await forgotPassword(email);
      toast.success("Password reset email sent.");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#030014] text-gray-200 flex overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
      >
        <FiArrowLeft />
        Back
      </button>

      <div className="flex w-full h-screen">
        {/* LEFT SIDE - IMAGE */}
        <div className="hidden lg:flex w-1/2 relative bg-black">
          <img
            src={gdImage}
            alt="GD Arena"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          
          <div className="absolute bottom-12 left-12 z-10">
            <h2 className="text-5xl font-bold text-white tracking-tight">
              GD Arena
            </h2>
            <p className="text-xl text-gray-300 mt-2">
              Compete. Improve. Win.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-hidden">
          {/* Scrollable & Smaller Container */}
          <div className="w-full max-w-xs lg:max-w-sm h-[90vh] overflow-y-auto custom-scroll py-8">
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  {isLoginPage ? "Welcome Back" : "Join GD Arena"}
                </h1>
                <p className="text-gray-400">
                  {isLoginPage
                    ? "Sign in to continue your journey"
                    : "Create your account and start competing"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    disabled={loading}
                    placeholder="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-red-500 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    disabled={loading}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-red-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Confirm Password */}
                {!isLoginPage && (
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password"
                      value={confirmPassword}
                      disabled={loading}
                      placeholder="Confirm Password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                )}

                {isLoginPage && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-red-400 hover:underline transition"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-60 transition font-medium text-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Please Wait...
                    </>
                  ) : isLoginPage ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-3">
                  <div className="flex-1 border-t border-white/10" />
                  <span className="px-4 text-xs text-gray-500 font-medium">OR</span>
                  <div className="flex-1 border-t border-white/10" />
                </div>

                {/* Google Login */}
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl border border-white/10 hover:bg-white/5 transition flex items-center justify-center gap-3 font-medium"
                >
                  <FcGoogle size={22} />
                  Continue with Google
                </button>
              </form>

              {/* Toggle Login/Signup */}
              <p className="text-center text-sm text-gray-400">
                {isLoginPage ? "Don't have an account?" : "Already have an account?"}
                <button
                  className="ml-1.5 text-red-400 hover:underline font-medium"
                  onClick={() =>
                    navigate(isLoginPage ? "/signup" : "/login")
                  }
                >
                  {isLoginPage ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}