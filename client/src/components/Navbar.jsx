import { useState, useRef, useEffect } from "react";
import Performance from "./PerformanceDashboard.jsx";
// Imported your calendar component
import { getAuth } from "firebase/auth";

export default function Navbar({ user, streak, onLogout, onNavigateHome }) {
  const [showPerformance, setShowPerformance] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false); // State for the calendar modal
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const auth = getAuth();
  const uid = user?.uid || auth.currentUser?.uid;

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

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-3.5 flex justify-between items-center selection:bg-red-500/30">
        
        {/* Brand Logo / Action */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-md shadow-red-900/30 group-hover:scale-105 transition-transform duration-200">
            Ω
          </div>
          <h1 className="text-lg font-black tracking-wider text-white uppercase group-hover:text-red-500 transition-colors duration-200">
            GD <span className="text-red-500 group-hover:text-white transition-colors duration-200">Arena</span>
          </h1>
        </div>

        {/* Global Navigation Controls */}
        <div className="flex items-center gap-4">
          
          {/* Active Fire Streak Counter (Clickable Trigger) */}
          <div 
            onClick={() => setShowCalendar(true)}
            className="flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 hover:border-orange-500/40 px-3 py-1.5 rounded-xl text-orange-400 select-none shadow-sm cursor-pointer transition-all duration-150 active:scale-95"
            title="View Streak Calendar"
          >
            <span className="text-sm animate-pulse">🔥</span>
            <span className="font-mono text-xs font-bold tracking-tight">{streak || 0}d</span>
          </div>

          {/* Performance Trigger Action Button */}
          <button
            onClick={() => setShowPerformance(true)}
            className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-850 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 shadow-sm cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Performance
          </button>

          {/* User Profile Navigation Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/60 hover:border-slate-700 transition focus:outline-none cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner">
                {user?.email ? user.email.charAt(0) : "U"}
              </div>
              <svg 
                className={`w-3.5 h-3.5 text-slate-400 mr-1.5 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Menu Items */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl animate-fade-in z-50">
                <div className="px-3 py-2 border-b border-slate-800/60 mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Authenticated As</p>
                  <p className="text-xs text-slate-300 truncate font-medium mt-0.5">{user?.email || "User Account"}</p>
                </div>

                {/* Mobile-only Calendar fallback menu item */}
                <button
                  onClick={() => {
                    setShowCalendar(true);
                    setShowDropdown(false);
                  }}
                  className="sm:hidden w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
                >
                  <span className="text-orange-400">🔥</span> Streak Calendar
                </button>

                {/* Mobile-only Performance fallback menu item */}
                <button
                  onClick={() => {
                    setShowPerformance(true);
                    setShowDropdown(false);
                  }}
                  className="sm:hidden w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
                >
                  <span className="text-indigo-400">📊</span> Analytics Overview
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out Session
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* Embedded Performance Modal */}
      {showPerformance && (
        <Performance
          uid={uid}
          onClose={() => setShowPerformance(false)}
        />
      )}

      {/* Embedded Streak Calendar Modal */}
  
    </>
  );
}