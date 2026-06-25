import { useState } from "react";
import { FaSkull, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import StreakCalendar from "./StreakCalendar";

export default function Navbar({ user, streak, onLogout, onNavigateHome }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-800 bg-black/40 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => {
            if (onNavigateHome) onNavigateHome();
            setMobileMenuOpen(false);
          }}
        >
          <FaSkull className="text-3xl text-red-500 transform group-hover:scale-110 transition-transform duration-200" />
          <h1 className="text-2xl font-black tracking-wider text-red-500 bg-clip-text">
            GD ARENA
          </h1>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-6">
          {/* Streak Indicator */}
          <div className="relative">
            <div
              onClick={() => setShowCalendar(true)}
              className="cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all duration-200 select-none"
            >
              <span className="text-yellow-400 font-bold">🔥 {streak}</span>
              <span className="text-xs text-yellow-300 font-medium tracking-wide">day streak</span>
            </div>

            {showCalendar && (
              <StreakCalendar streak={streak} onClose={() => setShowCalendar(false)} />
            )}
          </div>

          {/* User Email Info */}
          {user?.email && (
            <span className="text-sm font-medium text-gray-400 border-l border-gray-800 pl-6">
              {user.email}
            </span>
          )}

          {/* Logout Action */}
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 transition-all duration-200 cursor-pointer"
          >
            <FaSignOutAlt className="text-lg" />
          </button>
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <div className="md:hidden flex items-center gap-4">
          {/* Quick Streak view for Mobile */}
          <div 
            onClick={() => setShowCalendar(true)}
            className="cursor-pointer px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold text-sm"
          >
            🔥 {streak}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-400 hover:text-white text-xl focus:outline-none"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* MOBILE DROP-DOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-950 border-b border-gray-800 transition-all duration-300">
          <div className="px-6 pt-2 pb-6 space-y-4 flex flex-col">
            {user?.email && (
              <div className="text-xs font-semibold text-gray-500 tracking-wider uppercase pt-2">
                Logged in as: <span className="text-gray-300 normal-case block mt-1 text-sm">{user.email}</span>
              </div>
            )}
            
            <hr className="border-gray-900" />
            
            <button
              onClick={() => {
                setShowCalendar(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 text-yellow-400 font-medium flex items-center gap-2"
            >
              🔥 View Streak History
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full text-left py-2.5 px-4 rounded-xl font-bold bg-red-950/30 text-red-400 border border-red-900/40 flex items-center justify-center gap-2 hover:bg-red-900/40 transition"
            >
              <FaSignOutAlt />
              SIGN OUT
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}