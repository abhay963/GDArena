// React hook
import { useState } from "react";

// React Router
import { useNavigate } from "react-router-dom";

// Authentication services
import {
  login,
  signup,
  googleLogin,
} from "../services/auth.service";

// Icons
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiAlertTriangle,
  FiArrowLeft,
} from "react-icons/fi";

import { FcGoogle } from "react-icons/fc";
import { Terminal } from "lucide-react";

// Images
import gdimage from "../assets/images/gdimage.png";

export default function Auth() {
  // Navigation hook
  const navigate = useNavigate();

  // Email input state
  const [email, setEmail] = useState("");

  // Password input state
  const [password, setPassword] = useState("");

  // true = Login
  // false = Signup
  const [isLogin, setIsLogin] = useState(true);

  // Error message
  const [error, setError] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  // Show / Hide password
  const [showPassword, setShowPassword] = useState(false);

  // Handles Email Login / Signup
  const handleEmailAuth = async (e) => {
    e.preventDefault();

    setError("");

    // Validate inputs
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    // Password validation during signup
    if (!isLogin && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Login existing user
      if (isLogin) {
        await login(email, password);
      }
      // Create new account
      else {
        await signup(email, password);
      }

      // Redirect after successful authentication
      navigate("/hero");
    } catch (err) {
      // Display Firebase error
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handles Google Authentication
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await googleLogin();

      // Redirect after successful authentication
      navigate("/hero");
    } catch (err) {
      // Display Firebase error
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="min-h-screen bg-[#030014] text-gray-100 overflow-x-hidden">
      {/* ==================== NAVBAR ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030014]/90 backdrop-blur-md border-b border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-red-600 to-rose-500 rounded-xl flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              GD Arena
            </span>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <FiArrowLeft />
            Back to Home
          </button>
        </div>
      </nav>

      <div className="flex min-h-screen pt-20">
        {/* ==================== LEFT SIDE ==================== */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(at_center,#4c1d16_0%,transparent_70%)]" />

          <div className="absolute top-20 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />

          <div className="absolute bottom-32 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-md text-center px-8">
            <img
              src={gdimage}
              alt="GD Arena"
              className="mx-auto w-full max-w-[420px] drop-shadow-2xl"
            />

            <div className="mt-10 space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                Level Up Your
                <br />
                Communication Skills
              </h2>

              <p className="text-neutral-400 text-lg">
                Join thousands practicing with AI-powered group discussions
              </p>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT SIDE ==================== */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h1>

              <p className="text-neutral-400">
                {isLogin
                  ? "Welcome back to GD Arena"
                  : "Start your journey to mastering group discussions"}
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl">
              <form
                onSubmit={handleEmailAuth}
                className="space-y-6"
              >
                {/* Email */}
                <div>
                  <label className="text-sm text-neutral-400 block mb-2">
                    Email
                  </label>

                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-neutral-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm text-neutral-400 block mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      disabled={loading}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-neutral-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-400"
                    >
                      {showPassword ? (
                        <FiEyeOff size={20} />
                      ) : (
                        <FiEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex gap-3 text-sm bg-red-900/30 border border-red-500/30 p-4 rounded-2xl text-red-400">
                    <FiAlertTriangle className="mt-0.5" />

                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:brightness-110 font-semibold rounded-2xl transition-all active:scale-[0.985] disabled:opacity-70 flex items-center justify-center gap-2 text-lg shadow-lg shadow-red-600/40"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" />

                      {isLogin
                        ? "Signing In..."
                        : "Creating Account..."}
                    </>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
                            {/* Divider */}
              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />

                <span className="text-xs text-neutral-500 font-medium">
                  OR
                </span>

                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-4 border border-white/10 hover:bg-white/5 rounded-2xl flex items-center justify-center gap-3 font-medium transition-all active:scale-[0.985]"
              >
                <FcGoogle size={24} />

                Continue with Google
              </button>

              {/* Toggle Login / Signup */}
              <p className="text-center mt-8 text-neutral-400">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-neutral-500 mt-8">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}