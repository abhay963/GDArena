import { useEffect, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiActivity,
  FiBarChart2,
  FiBookOpen,
  FiChevronDown,
  FiCheck,
  FiLogOut,
  FiMessageCircle,
  FiZap,
} from "react-icons/fi";

import Performance from "./PerformanceDashboard.jsx";
import { getStreak } from "../services/streak.service.js";

export default function Navbar({
  user,
  streak,
  onLogout,
  onNavigateHome,
  activeProduct = "gd",
}) {
  const [showPerformance, setShowPerformance] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const dropdownRef = useRef(null);
  const streakRef = useRef(null);

  const auth = getAuth();
  const uid = user?.uid || auth.currentUser?.uid;

  /* =========================================================
     USER AVATAR
  ========================================================= */

  const avatarSeed = uid || user?.email || "guest";

  const avatarUrl =
    `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
      avatarSeed
    )}&backgroundColor=09090b,18181b,1e1b4b,312e81&radius=22`;

  const isVerified = Boolean(
    user?.emailVerified || user?.verified
  );

  /* =========================================================
     PRODUCT
     
     Supports BOTH:
     - "studymate"
     - old "studysync"
     
     So you don't have to immediately change the parent.
  ========================================================= */

  const isStudyMate =
    activeProduct === "studymate" ||
    activeProduct === "studysync";

  /* =========================================================
     FETCH STREAK
  ========================================================= */

  useEffect(() => {
    if (!uid) return;

    const fetchStreak = async () => {
      try {
        const data = await getStreak(uid);

        console.log("🔥 Streak API response:", data);

        const fetchedStreak =
          data?.streak ??
          data?.currentStreak ??
          data?.current_streak ??
          0;

        setCurrentStreak(Number(fetchedStreak) || 0);
      } catch (error) {
        console.error("❌ Failed to fetch streak:", error);

        setCurrentStreak(Number(streak) || 0);
      }
    };

    fetchStreak();
  }, [uid, streak]);

  /* =========================================================
     PRODUCT CONFIG
  ========================================================= */

  const product = isStudyMate
    ? {
        name: "StudyMate",
        shortName: "Study",
        icon: FiBookOpen,
        accent: "violet",
        description: "Knowledge intelligence",
      }
    : {
        name: "GD Arena",
        shortName: "GD",
        icon: FiMessageCircle,
        accent: "red",
        description: "AI discussion arena",
      };

  const ProductIcon = product.icon;

  /* =========================================================
     CLOSE DROPDOWNS OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

      if (
        streakRef.current &&
        !streakRef.current.contains(event.target)
      ) {
        setShowStreakPopup(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     ESCAPE
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowDropdown(false);
        setShowStreakPopup(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goHome = () => {
    setShowDropdown(false);
    setShowStreakPopup(false);

    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const goToGDArena = () => {
    setShowDropdown(false);
    setShowStreakPopup(false);

    window.location.href = "/hero";
  };

  const goToStudyMate = () => {
    setShowDropdown(false);
    setShowStreakPopup(false);

    window.location.href = "/studymate";
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    setShowDropdown(false);
    setShowStreakPopup(false);

    if (onLogout) {
      await onLogout();
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <motion.header
        initial={{
          opacity: 0,
          y: -12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          sticky
          top-0
          z-50
          w-full
          border-b
          border-white/[0.06]
          bg-[#030305]/80
          backdrop-blur-2xl
        "
      >
        {/* Top light */}

        <div
          className={`
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-48
            h-px
            bg-gradient-to-r
            from-transparent
            ${
              isStudyMate
                ? "via-violet-400/50"
                : "via-red-400/50"
            }
            to-transparent
          `}
        />

        <div
          className="
            relative
            mx-auto
            max-w-[1400px]
            px-4
            sm:px-6
            lg:px-8
            h-[72px]
            flex
            items-center
            justify-between
          "
        >
          {/* =================================================
              LEFT — BRAND
          ================================================== */}

          <button
            type="button"
            onClick={goHome}
            className="
              group
              flex
              items-center
              gap-3
              select-none
              outline-none
              cursor-pointer
            "
          >
            {/* Logo */}

            <div
              className={`
                relative
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                border
                transition-all
                duration-300
                ${
                  isStudyMate
                    ? "bg-violet-500/[0.09] border-violet-400/15 group-hover:bg-violet-500/[0.15] group-hover:border-violet-400/30"
                    : "bg-red-500/[0.09] border-red-400/15 group-hover:bg-red-500/[0.15] group-hover:border-red-400/30"
                }
              `}
            >
              <ProductIcon
                className={`
                  w-5
                  h-5
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  ${
                    isStudyMate
                      ? "text-violet-400"
                      : "text-red-400"
                  }
                `}
              />

              <div
                className={`
                  absolute
                  inset-0
                  rounded-xl
                  blur-lg
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-300
                  ${
                    isStudyMate
                      ? "bg-violet-500/20"
                      : "bg-red-500/20"
                  }
                `}
              />
            </div>

            {/* Brand */}

            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                  {isStudyMate ? "Study" : "GD"}
                </span>

                <span
                  className={`
                    text-[17px]
                    font-semibold
                    tracking-[-0.02em]
                    ${
                      isStudyMate
                        ? "text-violet-400"
                        : "text-red-400"
                    }
                  `}
                >
                  {isStudyMate ? "Mate" : "Arena"}
                </span>
              </div>

              <p className="hidden sm:block text-[11px] uppercase tracking-[0.18em] text-white/35 mt-0.5">
                {product.description}
              </p>
            </div>
          </button>

          {/* =================================================
              CENTER — PRODUCT SWITCHER
          ================================================== */}

          <div
            className="
              hidden
              md:flex
              absolute
              left-1/2
              -translate-x-1/2
              items-center
              p-1.5
              rounded-2xl
              border
              border-white/[0.06]
              bg-white/[0.025]
            "
          >
            {/* =================================================
                GD ARENA
            ================================================== */}

            <button
              type="button"
              onClick={goToGDArena}
              className={`
                relative
                flex
                items-center
                gap-2.5
                px-4
                py-2.5
                rounded-xl
                text-sm
                font-medium
                transition-all
                duration-300
                cursor-pointer
                ${
                  !isStudyMate
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }
              `}
            >
              {!isStudyMate && (
                <motion.div
                  layoutId="activeProduct"
                  className="
                    absolute
                    inset-0
                    rounded-xl
                    bg-red-500/[0.09]
                    border
                    border-red-500/15
                  "
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2.5">
                <FiMessageCircle
                  className={`
                    w-4
                    h-4
                    ${
                      !isStudyMate
                        ? "text-red-400"
                        : "text-white/30"
                    }
                  `}
                />

                <span>GD Arena</span>
              </span>
            </button>

            {/* =================================================
                STUDYMATE
            ================================================== */}

            <button
              type="button"
              onClick={goToStudyMate}
              className={`
                relative
                flex
                items-center
                gap-2.5
                px-4
                py-2.5
                rounded-xl
                text-sm
                font-medium
                transition-all
                duration-300
                cursor-pointer
                ${
                  isStudyMate
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }
              `}
            >
              {isStudyMate && (
                <motion.div
                  layoutId="activeProduct"
                  className="
                    absolute
                    inset-0
                    rounded-xl
                    bg-violet-500/[0.09]
                    border
                    border-violet-500/15
                  "
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2.5">
                <FiBookOpen
                  className={`
                    w-4
                    h-4
                    ${
                      isStudyMate
                        ? "text-violet-400"
                        : "text-white/30"
                    }
                  `}
                />

                <span>StudyMate</span>
              </span>
            </button>
          </div>

          {/* =================================================
              RIGHT
          ================================================== */}

          <div className="flex items-center gap-2.5">

            {/* =================================================
                STREAK
            ================================================== */}

            <div
              className="relative"
              ref={streakRef}
            >
              <button
                type="button"
                onClick={() => {
                  setShowStreakPopup((prev) => !prev);
                  setShowDropdown(false);
                }}
                title="Current streak"
                className="
                  group
                  relative
                  flex
                  items-center
                  gap-2
                  h-10
                  px-3.5
                  rounded-xl
                  border
                  border-orange-500/10
                  bg-orange-500/[0.045]
                  hover:bg-orange-500/[0.08]
                  hover:border-orange-400/20
                  transition-all
                  duration-200
                  active:scale-95
                  cursor-pointer
                "
              >
                <span className="text-base transition-transform duration-200 group-hover:scale-110">
                  🔥
                </span>

                <span className="text-sm font-semibold tabular-nums text-orange-300">
                  {currentStreak}
                </span>

                <span className="hidden sm:inline text-xs text-orange-300/50 uppercase tracking-wider">
                  days
                </span>
              </button>

              {/* STREAK POPUP */}

              <AnimatePresence>
                {showStreakPopup && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -6,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.16,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                      absolute
                      right-0
                      top-[48px]
                      w-[230px]
                      rounded-2xl
                      border
                      border-orange-400/[0.10]
                      bg-[#0a0a0d]/95
                      backdrop-blur-2xl
                      shadow-[0_30px_80px_rgba(0,0,0,0.55)]
                      overflow-hidden
                      z-[100]
                    "
                  >
                    <div
                      className="
                        absolute
                        top-0
                        left-1/2
                        -translate-x-1/2
                        w-20
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-orange-400/60
                        to-transparent
                      "
                    />

                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            w-11
                            h-11
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            bg-orange-500/[0.08]
                            border
                            border-orange-400/[0.10]
                          "
                        >
                          <span className="text-2xl">
                            🔥
                          </span>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                            Current streak
                          </p>

                          <p className="mt-1 text-xl font-bold text-orange-300">
                            {currentStreak} days
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/[0.05]">
                        {currentStreak > 0 ? (
                          <p className="text-xs leading-relaxed text-white/40">
                            Keep going! Don't break your streak.
                          </p>
                        ) : (
                          <p className="text-xs leading-relaxed text-white/40">
                            Start practicing today to build your streak.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* =================================================
                ANALYTICS
            ================================================== */}

            <button
              type="button"
              onClick={() => setShowPerformance(true)}
              className="
                hidden
                sm:flex
                items-center
                gap-2.5
                h-10
                px-3.5
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                hover:bg-white/[0.05]
                hover:border-indigo-400/20
                text-white/50
                hover:text-white
                transition-all
                duration-200
                active:scale-95
                cursor-pointer
              "
            >
              <FiBarChart2 className="w-4 h-4 text-indigo-400" />

              <span className="text-sm font-medium">
                Analytics
              </span>
            </button>

            {/* =================================================
                PROFILE
            ================================================== */}

            <div
              className="relative"
              ref={dropdownRef}
            >
              <button
                type="button"
                onClick={() => {
                  setShowDropdown((value) => !value);
                  setShowStreakPopup(false);
                }}
                aria-expanded={showDropdown}
                aria-haspopup="menu"
                className={`
                  group
                  flex
                  items-center
                  gap-2
                  p-1.5
                  pr-2.5
                  rounded-xl
                  border
                  bg-white/[0.025]
                  transition-all
                  duration-200
                  active:scale-95
                  cursor-pointer
                  ${
                    showDropdown
                      ? "border-white/[0.14] bg-white/[0.05]"
                      : "border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.045]"
                  }
                `}
              >
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="Profile avatar"
                    className="
                      w-9
                      h-9
                      rounded-lg
                      object-cover
                      bg-black
                      ring-1
                      ring-white/[0.08]
                      group-hover:ring-white/[0.16]
                      transition-all
                      duration-300
                    "
                    loading="lazy"
                  />

                  {isVerified && (
                    <span
                      className="
                        absolute
                        -right-1
                        -bottom-1
                        flex
                        items-center
                        justify-center
                        w-4
                        h-4
                        rounded-full
                        bg-emerald-500
                        border-2
                        border-[#08080a]
                      "
                      title="Verified account"
                    >
                      <FiCheck className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </span>
                  )}
                </div>

                <FiChevronDown
                  className={`
                    hidden
                    sm:block
                    w-3.5
                    h-3.5
                    text-white/35
                    transition-transform
                    duration-200
                    ${
                      showDropdown
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {/* DROPDOWN */}

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -6,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.16,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                      absolute
                      right-0
                      mt-2.5
                      w-[280px]
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-[#0a0a0d]/95
                      backdrop-blur-2xl
                      shadow-[0_30px_80px_rgba(0,0,0,0.55)]
                      overflow-hidden
                      z-[100]
                    "
                  >
                    {/* Top accent */}

                    <div
                      className={`
                        absolute
                        top-0
                        left-1/2
                        -translate-x-1/2
                        w-24
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        ${
                          isStudyMate
                            ? "via-violet-400/60"
                            : "via-red-400/60"
                        }
                        to-transparent
                      `}
                    />

                    {/* Profile */}

                    <div className="p-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={avatarUrl}
                          alt=""
                          className="
                            w-11
                            h-11
                            rounded-xl
                            object-cover
                            ring-1
                            ring-white/10
                          "
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">
                            Signed in as
                          </p>

                          <p className="mt-1.5 text-sm text-white/85 truncate font-medium">
                            {user?.email || "User Account"}
                          </p>

                          {isVerified && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />

                              <span className="text-xs text-emerald-400/80">
                                Verified account
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-white/[0.05]" />

                    {/* Current product */}

                    <div className="p-2">
                      <div
                        className={`
                          flex
                          items-center
                          gap-3
                          px-3
                          py-3
                          rounded-xl
                          ${
                            isStudyMate
                              ? "bg-violet-500/[0.05]"
                              : "bg-red-500/[0.05]"
                          }
                        `}
                      >
                        <div
                          className={`
                            w-9
                            h-9
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            ${
                              isStudyMate
                                ? "bg-violet-500/10 text-violet-400"
                                : "bg-red-500/10 text-red-400"
                            }
                          `}
                        >
                          <ProductIcon className="w-4.5 h-4.5" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white/80">
                            {product.name}
                          </p>

                          <p className="text-xs text-white/35 mt-0.5">
                            Current workspace
                          </p>
                        </div>

                        <div className="ml-auto">
                          <FiZap
                            className={`
                              w-4
                              h-4
                              ${
                                isStudyMate
                                  ? "text-violet-400/50"
                                  : "text-red-400/50"
                              }
                            `}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mobile analytics */}

                    <div className="sm:hidden px-2 pb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPerformance(true);
                          setShowDropdown(false);
                        }}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-3
                          rounded-xl
                          text-left
                          text-white/55
                          hover:text-white
                          hover:bg-white/[0.04]
                          transition-all
                          cursor-pointer
                        "
                      >
                        <FiActivity className="w-4.5 h-4.5 text-indigo-400" />

                        <span className="text-sm font-medium">
                          Performance Analytics
                        </span>
                      </button>
                    </div>

                    <div className="h-px bg-white/[0.05]" />

                    {/* Logout */}

                    <div className="p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-3
                          rounded-xl
                          text-left
                          text-red-400/80
                          hover:text-red-300
                          hover:bg-red-500/[0.06]
                          transition-all
                          active:scale-[0.98]
                          cursor-pointer
                        "
                      >
                        <FiLogOut className="w-4.5 h-4.5" />

                        <span className="text-sm font-medium">
                          Sign out
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE PRODUCT BAR
        ====================================================== */}

        <div className="md:hidden border-t border-white/[0.04]">
          <div className="flex items-center justify-center gap-1.5 px-4 py-2.5">

            {/* GD ARENA */}

            <button
              type="button"
              onClick={goToGDArena}
              className={`
                flex
                flex-1
                max-w-[160px]
                items-center
                justify-center
                gap-2
                py-2
                rounded-lg
                text-xs
                font-medium
                transition-all
                cursor-pointer
                ${
                  !isStudyMate
                    ? "bg-red-500/[0.08] text-red-300 border border-red-500/10"
                    : "text-white/35"
                }
              `}
            >
              <FiMessageCircle className="w-3.5 h-3.5" />

              GD Arena
            </button>

            {/* STUDYMATE */}

            <button
              type="button"
              onClick={goToStudyMate}
              className={`
                flex
                flex-1
                max-w-[160px]
                items-center
                justify-center
                gap-2
                py-2
                rounded-lg
                text-xs
                font-medium
                transition-all
                cursor-pointer
                ${
                  isStudyMate
                    ? "bg-violet-500/[0.08] text-violet-300 border border-violet-500/10"
                    : "text-white/35"
                }
              `}
            >
              <FiBookOpen className="w-3.5 h-3.5" />

              StudyMate
            </button>
          </div>
        </div>
      </motion.header>

      {/* =====================================================
          PERFORMANCE MODAL
      ====================================================== */}

      <AnimatePresence>
        {showPerformance && (
          <Performance
            uid={uid}
            onClose={() => setShowPerformance(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}