import { useState, useRef, useEffect } from "react";
import Performance from "./PerformanceDashboard.jsx";
import { getAuth } from "firebase/auth";

export default function Navbar({ user, streak, onLogout, onNavigateHome }) {
  const [showPerformance, setShowPerformance] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const auth = getAuth();
  const uid = user?.uid || auth.currentUser?.uid;

  // Deterministic DiceBear avatar based on uid or email
  const avatarSeed = uid || user?.email || "guest";
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
    avatarSeed
  )}&backgroundColor=1e1b4b,312e81,4c1d95&radius=20`;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setShowDropdown(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isVerified = Boolean(user?.emailVerified || user?.verified);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-6 py-3 flex justify-between items-center selection:bg-red-500/30">
        {/* Brand Logo / Action */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none active:scale-[0.98] transition-transform"
        >
          <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-md shadow-red-900/40 group-hover:scale-110 group-hover:shadow-red-500/50 transition-all duration-200">
            Ω
          </div>
          <h1 className="text-lg font-black tracking-wider text-white uppercase group-hover:text-red-400 transition-colors duration-200">
            GD{" "}
            <span className="text-red-500 group-hover:text-white transition-colors duration-200">
              Arena
            </span>
          </h1>
        </div>

        {/* Global Navigation Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Animated Streak Badge */}
          <button
            onClick={() => setShowCalendar(true)}
            className="relative flex items-center gap-1.5 bg-gradient-to-r from-orange-500/15 to-amber-500/10 hover:from-orange-500/25 hover:to-amber-500/20 border border-orange-500/30 hover:border-orange-400/50 px-2.5 sm:px-3 py-1.5 rounded-xl text-orange-300 select-none shadow-[0_0_12px_-3px_rgba(249,115,22,0.35)] cursor-pointer transition-all duration-200 active:scale-95 group"
            title="View Streak Calendar"
          >
            <span className="text-sm group-hover:animate-bounce">🔥</span>
            <span className="font-mono text-xs font-bold tracking-tight">
              {streak || 0}d
            </span>
            {/* subtle pulse ring */}
            <span className="absolute inset-0 rounded-xl ring-1 ring-orange-400/20 animate-pulse pointer-events-none" />
          </button>

          {/* Performance Button (desktop) */}
          <button
            onClick={() => setShowPerformance(true)}
            className="hidden sm:flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 active:bg-slate-850 text-slate-200 hover:text-white border border-slate-700/80 hover:border-indigo-500/50 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-indigo-500/20 cursor-pointer active:scale-95 group"
          >
            <svg
              className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            Performance
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="flex items-center gap-1.5 p-1 pr-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/70 hover:border-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer active:scale-95 group"
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              {/* DiceBear Avatar + glow */}
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-indigo-400/60 transition-all duration-300 group-hover:scale-105 shadow-md"
                  loading="lazy"
                />
                {/* hover glow */}
                <div className="absolute inset-0 rounded-lg bg-indigo-500/0 group-hover:bg-indigo-500/20 blur-md transition-all duration-300 pointer-events-none" />
                {/* Verified indicator */}
                {isVerified && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center"
                    title="Verified"
                  >
                    <svg
                      className="w-2 h-2 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </div>

              <svg
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu with entrance animation */}
            {showDropdown && (
              <div
                className="absolute right-0 mt-2.5 w-60 origin-top-right bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl shadow-black/50 z-50
                animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
                style={{
                  animation: "dropdownIn 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                }}
              >
                {/* Header */}
                <div className="px-3.5 py-3 border-b border-slate-800/80 mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={avatarUrl}
                      alt=""
                      className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Signed in as
                      </p>
                      <p className="text-xs text-slate-200 truncate font-medium mt-0.5">
                        {user?.email || "User Account"}
                      </p>
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile-only items */}
                <button
                  onClick={() => {
                    setShowCalendar(true);
                    setShowDropdown(false);
                  }}
                  className="sm:hidden w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition-all active:scale-[0.98]"
                >
                  <span className="text-orange-400 text-sm">🔥</span>
                  Streak Calendar
                </button>

                <button
                  onClick={() => {
                    setShowPerformance(true);
                    setShowDropdown(false);
                  }}
                  className="sm:hidden w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition-all active:scale-[0.98]"
                >
                  <span className="text-indigo-400 text-sm">📊</span>
                  Analytics Overview
                </button>

                {/* Sign Out */}
                <button
                  onClick={() => {
                    onLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Performance Modal */}
      {showPerformance && (
        <Performance uid={uid} onClose={() => setShowPerformance(false)} />
      )}

      {/* Streak Calendar Modal – plug in your calendar component here */}
      {/* {showCalendar && (
        <YourCalendarComponent
          streak={streak}
          onClose={() => setShowCalendar(false)}
        />
      )} */}

      {/* Local keyframes for dropdown entrance (safe fallback) */}
      <style>{`
        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}