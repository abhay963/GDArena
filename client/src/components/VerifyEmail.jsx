import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reload } from "firebase/auth";
import { FiMail, FiRefreshCw, FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";

import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

import {
  resendVerificationEmail,
  logout,
} from "../services/auth.service";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Wait for Firebase to restore the logged-in user
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 text-red-500 animate-spin mx-auto" />

          <p className="mt-4 text-gray-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // If there is no logged-in user, redirect to login
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  // Check whether email has been verified
  const handleCheckVerification = async () => {
    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        navigate("/login", { replace: true });
        return;
      }

      // Refresh Firebase user information
      await reload(currentUser);

      console.log(
        "Email verification status:",
        currentUser.emailVerified
      );

      if (currentUser.emailVerified) {
        toast.success("Email verified successfully!");

        navigate("/hero", { replace: true });
      } else {
        toast.error(
          "Email is not verified yet. Please check your inbox."
        );
      }
    } catch (error) {
      console.error(
        "Verification Check Error:",
        error
      );

      toast.error(
        "Unable to check verification status."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResend = async () => {
    try {
      setResending(true);

      await resendVerificationEmail();

      toast.success(
        "Verification email sent again!"
      );
    } catch (error) {
      console.error(
        "Resend Verification Error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to resend verification email."
      );
    } finally {
      setResending(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );

      toast.error("Failed to logout.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-gray-200 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">

          {/* Email Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <FiMail className="w-8 h-8 text-red-500" />
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-2xl font-bold text-white">
            Verify Your Email
          </h1>

          {/* Description */}
          <p className="mt-3 text-gray-400 text-sm">
            We've sent a verification link to:
          </p>

          {/* Email */}
          <p className="mt-2 text-white font-semibold break-all">
            {user.email}
          </p>

          {/* Instructions */}
          <p className="mt-5 text-gray-500 text-sm leading-6">
            Please check your inbox and click the
            verification link. After verifying your
            email, come back here and click the button
            below.
          </p>

          {/* Check Verification */}
          <button
            onClick={handleCheckVerification}
            disabled={loading}
            className="w-full mt-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Checking...
              </>
            ) : (
              "I've Verified My Email"
            )}
          </button>

          {/* Resend */}
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full mt-3 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 font-semibold transition-all flex items-center justify-center gap-2"
          >
            {resending ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <FiRefreshCw />
                Resend Verification Email
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-6 text-sm text-gray-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <FiLogOut />
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}