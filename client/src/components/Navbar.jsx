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
  const [streakMonth, setStreakMonth] = useState(() => new Date());

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

       

        const fetchedStreak =
          data?.streak ??
          data?.currentStreak ??
          data?.current_streak ??
          0;

        setCurrentStreak(Number(fetchedStreak) || 0);
      } catch (error) {
       

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
     STREAK CALENDAR
  ========================================================= */

  const today = new Date();
  const calendarYear = streakMonth.getFullYear();
  const calendarMonth = streakMonth.getMonth();

  const calendarMonthLabel = streakMonth.toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const isToday = (date) =>
    date.getFullYear() === todayOnly.getFullYear() &&
    date.getMonth() === todayOnly.getMonth() &&
    date.getDate() === todayOnly.getDate();

  const isFutureDay = (date) => date > todayOnly;

  // The streak API currently exposes the CONTINUOUS streak number.
  // Therefore, the calendar can reliably highlight the current chain.
  // Past days outside that chain are shown as missed.
  const isStreakDay = (date) => {
    if (date > todayOnly || currentStreak <= 0) return false;

    const diff = Math.floor(
      (todayOnly.getTime() - date.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return diff >= 0 && diff < currentStreak;
  };

  const isMissedDay = (date) =>
    date <= todayOnly && !isStreakDay(date);

  const getCalendarDays = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const daysInMonth = new Date(
      calendarYear,
      calendarMonth + 1,
      0
    ).getDate();

    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const days = [];

    for (let i = 0; i < mondayOffset; i += 1) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(new Date(calendarYear, calendarMonth, day));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  const isCurrentMonth =
    calendarYear === todayOnly.getFullYear() &&
    calendarMonth === todayOnly.getMonth();

  const missedDaysInView = calendarDays.filter(
    (date) => date && isMissedDay(date)
  ).length;

  const activeDaysInView = calendarDays.filter(
    (date) => date && isStreakDay(date)
  ).length;

  const goToPreviousMonth = () => {
    setStreakMonth(new Date(calendarYear, calendarMonth - 1, 1));
  };

  const goToNextMonth = () => {
    if (isCurrentMonth) return;

    setStreakMonth(new Date(calendarYear, calendarMonth + 1, 1));
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

              {/* =================================================
                  PREMIUM STREAK CALENDAR
              ================================================== */}

              <AnimatePresence>
                {showStreakPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: -12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 30,
                    }}
                    className="absolute right-0 top-12 z-[100] w-[430px] max-w-[calc(100vw-20px)] overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#09090c]/[0.98] shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
                  >
                    {/* =================================================
                        AMBIENT LIGHT
                    ================================================== */}
                    <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-orange-500/[0.09] blur-[80px]" />
                    <div className="pointer-events-none absolute -bottom-32 -left-28 h-72 w-72 rounded-full bg-red-500/[0.06] blur-[90px]" />
                    <div className="pointer-events-none absolute left-1/2 top-0 h-px w-36 -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />

                    {/* =================================================
                        HEADER
                    ================================================== */}
                    <div className="relative border-b border-white/[0.06] px-6 pb-5 pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <motion.div
                              animate={{
                                scale: [1, 1.08, 1],
                                rotate: [0, -3, 3, 0],
                              }}
                              transition={{
                                duration: 2.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="relative z-10 flex h-14 w-14 items-center justify-center rounded-[18px] border border-orange-300/15 bg-orange-400/[0.08]"
                            >
                              <span className="text-[30px]">🔥</span>
                            </motion.div>

                            <motion.span
                              animate={{
                                scale: [0.7, 1.25, 0.7],
                                opacity: [0.15, 0.55, 0.15],
                              }}
                              transition={{
                                duration: 2.2,
                                repeat: Infinity,
                              }}
                              className="absolute inset-0 rounded-[18px] bg-orange-400/20 blur-xl"
                            />
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-300/50">
                              Your consistency
                            </p>

                            <div className="mt-1 flex items-end gap-2">
                              <motion.span
                                key={currentStreak}
                                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="text-[38px] font-bold leading-none tracking-[-0.04em] text-white"
                              >
                                {currentStreak}
                              </motion.span>

                              <span className="mb-0.5 text-[13px] font-medium text-white/35">
                                day streak
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-1.5">
                          <div className="flex items-center gap-2">
                            <motion.span
                              animate={{
                                scale: [0.7, 1, 0.7],
                                opacity: [0.35, 1, 0.35],
                              }}
                              transition={{
                                duration: 1.7,
                                repeat: Infinity,
                              }}
                              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                            />
                            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-300/75">
                              {currentStreak > 0 ? "On track" : "Start today"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <p className="max-w-[270px] text-[12px] leading-relaxed text-white/30">
                          {currentStreak > 0
                            ? "You are keeping the chain alive. Don't let a blank day break it."
                            : "One focused session today is all it takes to start your streak."}
                        </p>

                        <motion.div
                          animate={{ y: [0, -3, 0], opacity: [0.35, 0.8, 0.35] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-[22px]"
                        >
                          {currentStreak > 0 ? "✨" : "🚀"}
                        </motion.div>
                      </div>
                    </div>

                    {/* =================================================
                        CALENDAR
                    ================================================== */}
                    <div className="relative px-6 py-6">
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/20">
                            Activity
                          </p>

                          <motion.p
                            key={calendarMonthLabel}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mt-1 text-[22px] font-semibold tracking-[-0.025em] text-white/90"
                          >
                            {calendarMonthLabel}
                          </motion.p>
                        </div>

                        <div className="flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-1">
                          <button
                            type="button"
                            onClick={goToPreviousMonth}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-white/35 transition-all hover:bg-white/[0.06] hover:text-white active:scale-90"
                            aria-label="Previous month"
                          >
                            <span className="-mt-0.5 text-[25px] leading-none">‹</span>
                          </button>

                          <button
                            type="button"
                            onClick={goToNextMonth}
                            disabled={isCurrentMonth}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-white/35 transition-all hover:bg-white/[0.06] hover:text-white active:scale-90 disabled:pointer-events-none disabled:opacity-15"
                            aria-label="Next month"
                          >
                            <span className="-mt-0.5 text-[25px] leading-none">›</span>
                          </button>
                        </div>
                      </div>

                      {/* Week labels */}
                      <div className="mb-2 grid grid-cols-7 gap-2.5">
                        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                          (day) => (
                            <div
                              key={day}
                              className="flex h-7 items-center justify-center text-[11px] font-bold tracking-[0.12em] text-white/30"
                            >
                              {day}
                            </div>
                          )
                        )}
                      </div>

                      {/* Calendar cells */}
                      <div className="grid grid-cols-7 gap-2.5">
                        {calendarDays.map((date, index) => {
                          if (!date) {
                            return (
                              <div
                                key={`empty-${index}`}
                                className="aspect-square"
                              />
                            );
                          }

                          const active = isStreakDay(date);
                          const missed = isMissedDay(date);
                          const todayCell = isToday(date);
                          const future = isFutureDay(date);

                          return (
                            <motion.div
                              key={date.toISOString()}
                              initial={{
                                opacity: 0,
                                scale: 0.72,
                                y: 8,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                              }}
                              transition={{
                                delay: index * 0.018,
                                type: "spring",
                                stiffness: 460,
                                damping: 26,
                              }}
                              className="relative aspect-square"
                            >
                              <motion.div
                                whileHover={
                                  !future
                                    ? {
                                        scale: 1.07,
                                        y: -2,
                                      }
                                    : undefined
                                }
                                transition={{
                                  type: "spring",
                                  stiffness: 480,
                                  damping: 24,
                                }}
                                className={`absolute inset-0 overflow-hidden rounded-[16px] border ${
                                  active
                                    ? "border-orange-200/40 bg-gradient-to-br from-orange-300/95 via-orange-400/90 to-red-500/80 shadow-[0_12px_34px_rgba(249,115,22,0.26),inset_0_1px_0_rgba(255,255,255,0.2)]"
                                    : missed
                                    ? "border-red-400/15 bg-gradient-to-br from-red-500/[0.075] to-red-900/[0.035] hover:border-red-300/25 hover:bg-red-400/[0.08]"
                                    : "border-white/[0.05] bg-white/[0.018]"
                                }`}
                              >
                                {/* =================================================
                                    MAINTAINED STREAK DAY
                                    IMPORTANT: no date, no label — ONLY trophy + sparkle
                                ================================================== */}
                                {active && (
                                  <>
                                    {/* Moving premium shine */}
                                    <motion.div
                                      animate={{
                                        x: ["-180%", "190%"],
                                      }}
                                      transition={{
                                        duration: 2.4,
                                        repeat: Infinity,
                                        repeatDelay: 2.6,
                                        ease: "easeInOut",
                                      }}
                                      className="absolute inset-y-0 left-0 w-[55%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    />

                                    {/* Main sparkle */}
                                    <motion.span
                                      animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0.2, 1.45, 0.2],
                                        rotate: [0, 90, 180],
                                      }}
                                      transition={{
                                        duration: 1.45,
                                        repeat: Infinity,
                                        delay: (index % 4) * 0.22,
                                        ease: "easeInOut",
                                      }}
                                      className="absolute right-2 top-1 text-[18px] font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.95)]"
                                    >
                                      ✦
                                    </motion.span>

                                    {/* Secondary sparkle */}
                                    <motion.span
                                      animate={{
                                        opacity: [0.05, 1, 0.05],
                                        scale: [0.3, 1.25, 0.3],
                                        y: [3, -4, 3],
                                      }}
                                      transition={{
                                        duration: 1.7,
                                        repeat: Infinity,
                                        delay: 0.55 + (index % 3) * 0.18,
                                        ease: "easeInOut",
                                      }}
                                      className="absolute left-2 bottom-2 text-[14px] font-bold text-yellow-50 drop-shadow-[0_0_8px_rgba(255,237,160,0.9)]"
                                    >
                                      ✧
                                    </motion.span>

                                    {/* Tiny sparkle */}
                                    <motion.span
                                      animate={{
                                        opacity: [0, 0.9, 0],
                                        scale: [0.3, 1, 0.3],
                                      }}
                                      transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: 0.9 + (index % 2) * 0.2,
                                      }}
                                      className="absolute left-3 top-2 text-[9px] text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                                    >
                                      •
                                    </motion.span>

                                    {/* Trophy only */}
                                    <motion.span
                                      animate={{
                                        y: [1, -4, 1],
                                        rotate: [0, -6, 6, 0],
                                        scale: [1, 1.12, 1],
                                      }}
                                      transition={{
                                        duration: 2.1,
                                        repeat: Infinity,
                                        delay: (index % 5) * 0.1,
                                        ease: "easeInOut",
                                      }}
                                      className="absolute inset-0 flex items-center justify-center text-[30px] leading-none drop-shadow-[0_7px_15px_rgba(255,255,255,0.35)]"
                                    >
                                      🏆
                                    </motion.span>
                                  </>
                                )}

                                {/* =================================================
                                    PREVIOUS MISSED DAY
                                    IMPORTANT: no date, no label — ONLY crying emoji
                                ================================================== */}
                                {missed && !todayCell && (
                                  <>
                                    {/* Soft breathing red glow */}
                                    <motion.div
                                      animate={{
                                        opacity: [0.08, 0.22, 0.08],
                                        scale: [0.96, 1.04, 0.96],
                                      }}
                                      transition={{
                                        duration: 2.4,
                                        repeat: Infinity,
                                        delay: (index % 4) * 0.18,
                                        ease: "easeInOut",
                                      }}
                                      className="absolute inset-0 rounded-[16px] bg-red-500/[0.12]"
                                    />

                                    {/* Small falling tear */}
                                    <motion.span
                                      animate={{
                                        opacity: [0, 1, 0],
                                        y: [-5, 6, 11],
                                        x: [0, 1, -1],
                                      }}
                                      transition={{
                                        duration: 1.7,
                                        repeat: Infinity,
                                        delay: (index % 5) * 0.16,
                                        ease: "easeIn",
                                      }}
                                      className="absolute left-[57%] top-[44%] z-10 text-[9px]"
                                    >
                                      💧
                                    </motion.span>

                                    {/* Weeping emoji only */}
                                    <motion.span
                                      animate={{
                                        y: [1, 3, 1],
                                        rotate: [-3, 3, -3],
                                        scale: [1, 1.05, 1],
                                      }}
                                      transition={{
                                        duration: 2.25,
                                        repeat: Infinity,
                                        delay: (index % 5) * 0.12,
                                        ease: "easeInOut",
                                      }}
                                      className="absolute inset-0 flex items-center justify-center text-[29px] leading-none drop-shadow-[0_7px_15px_rgba(248,113,113,0.32)]"
                                    >
                                      😭
                                    </motion.span>
                                  </>
                                )}

                                {/* =================================================
                                    TODAY BUT NOT YET MAINTAINED
                                    This is the only current-day state where a date
                                    remains visible. Future dates also show dates.
                                ================================================== */}
                                {todayCell && !active && (
                                  <>
                                    <motion.span
                                      animate={{
                                        opacity: [0.45, 1, 0.45],
                                        scale: [0.95, 1.08, 0.95],
                                      }}
                                      transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                      }}
                                      className="absolute bottom-[24%] left-1/2 -translate-x-1/2 text-[22px] leading-none"
                                    >
                                      🎯
                                    </motion.span>

                                    <span className="absolute top-[20%] left-1/2 -translate-x-1/2 text-[18px] font-extrabold tabular-nums text-orange-200">
                                      {date.getDate()}
                                    </span>
                                  </>
                                )}

                                {/* =================================================
                                    FUTURE DAY
                                    Future dates remain clean and visible.
                                ================================================== */}
                                {future && (
                                  <span className="absolute inset-0 flex items-center justify-center text-[18px] font-semibold tabular-nums text-white/30">
                                    {date.getDate()}
                                  </span>
                                )}
                              </motion.div>

                              {/* Today ring */}
                              {todayCell && (
                                <motion.span
                                  animate={{
                                    opacity: [0.3, 0.8, 0.3],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                  }}
                                  className="pointer-events-none absolute -inset-1.5 rounded-[18px] ring-2 ring-orange-300/45"
                                />
                              )}
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Month stats */}
                      <div className="mt-7 grid grid-cols-2 gap-2">
                        <div className="rounded-2xl border border-orange-400/[0.08] bg-orange-400/[0.035] px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[15px]">🔥</span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">
                              Maintained
                            </span>
                          </div>
                          <p className="mt-1 text-[22px] font-bold tabular-nums text-orange-200/90">
                            {activeDaysInView}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-red-400/[0.07] bg-red-400/[0.025] px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[15px]">😭</span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">
                              Missed
                            </span>
                          </div>
                          <p className="mt-1 text-[22px] font-bold tabular-nums text-white/60">
                            {missedDaysInView}
                          </p>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="mt-5 flex items-center justify-center gap-5 text-[10px] font-medium text-white/25">
                        <div className="flex items-center gap-1.5">
                          <span>🔥</span>
                          <span>Maintaining</span>
                        </div>
                        <span className="h-3 w-px bg-white/[0.07]" />
                        <div className="flex items-center gap-1.5">
                          <span>😭</span>
                          <span>Missed</span>
                        </div>
                        <span className="h-3 w-px bg-white/[0.07]" />
                        <div className="flex items-center gap-1.5">
                          <span>⏳</span>
                          <span>Today</span>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================== */}
                    <div className="relative border-t border-white/[0.06] bg-white/[0.015] px-6 py-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ duration: 2.4, repeat: Infinity }}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-400/[0.05] text-lg"
                        >
                          {currentStreak > 0 ? "⚡" : "🚀"}
                        </motion.div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-white/65">
                            {currentStreak > 0
                              ? "Keep the fire alive."
                              : "Your streak is waiting."}
                          </p>
                          <p className="mt-0.5 text-[10px] leading-relaxed text-white/25">
                            {currentStreak > 0
                              ? "One more session tomorrow makes the chain stronger."
                              : "Complete one focused session today to begin."}
                          </p>
                        </div>

                        {currentStreak > 0 && (
                          <div className="relative shrink-0 text-[18px]">
                            <motion.span
                              animate={{
                                opacity: [0.2, 1, 0.2],
                                scale: [0.6, 1.2, 0.6],
                              }}
                              transition={{ duration: 1.6, repeat: Infinity }}
                            >
                              ✨
                            </motion.span>
                          </div>
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