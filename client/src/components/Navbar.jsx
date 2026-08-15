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
  FiX,
  FiZap,
} from "react-icons/fi";

import Performance from "./PerformanceDashboard.jsx";

export default function Navbar({
  user,
  streak,
  onLogout,
  onNavigateHome,
  activeProduct = "gd",
}) {
  const [showPerformance, setShowPerformance] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

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

  const isStudySync = activeProduct === "studysync";

  /* =========================================================
     CLOSE DROPDOWN OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
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
     PRODUCT CONFIG
  ========================================================= */

  const product = isStudySync
    ? {
        name: "StudySync",
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
     NAVIGATION
  ========================================================= */

  const goHome = () => {
    setShowDropdown(false);

    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    setShowDropdown(false);

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
        {/* subtle top light */}

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
              isStudySync
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
                  isStudySync
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
                    isStudySync
                      ? "text-violet-400"
                      : "text-red-400"
                  }
                `}
              />

              {/* tiny glow */}

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
                    isStudySync
                      ? "bg-violet-500/20"
                      : "bg-red-500/20"
                  }
                `}
              />
            </div>

            {/* Brand text */}

            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                  {isStudySync ? "Study" : "GD"}
                </span>

                <span
                  className={`
                    text-[17px]
                    font-semibold
                    tracking-[-0.02em]
                    ${
                      isStudySync
                        ? "text-violet-400"
                        : "text-red-400"
                    }
                  `}
                >
                  {isStudySync
                    ? "Sync"
                    : "Arena"}
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
            {/* GD ARENA */}

            <button
              type="button"
              onClick={() => {
                if (isStudySync) {
                  window.location.href = "/hero";
                }
              }}
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
                ${
                  !isStudySync
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }
              `}
            >
              {!isStudySync && (
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
                      !isStudySync
                        ? "text-red-400"
                        : "text-white/30"
                    }
                  `}
                />

                <span>GD Arena</span>
              </span>
            </button>

            {/* STUDYSYNC */}

            <button
              type="button"
              onClick={() => {
                if (!isStudySync) {
                  window.location.href =
                    "/studymate";
                }
              }}
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
                ${
                  isStudySync
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }
              `}
            >
              {isStudySync && (
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
                      isStudySync
                        ? "text-violet-400"
                        : "text-white/30"
                    }
                  `}
                />

                <span>StudySync</span>
              </span>
            </button>
          </div>

          {/* =================================================
              RIGHT
          ================================================== */}

          <div className="flex items-center gap-2.5">
            {/* AI STATUS */}

            <div
              className="
                hidden
                lg:flex
                items-center
                gap-2.5
                px-3.5
                py-2.5
                rounded-xl
                border
                border-emerald-500/10
                bg-emerald-500/[0.035]
              "
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />

                <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-xs uppercase tracking-[0.16em] text-emerald-400/70">
                AI Online
              </span>
            </div>

            {/* STREAK */}

            <button
              type="button"
              onClick={() => {
                // Calendar hook can be connected later.
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
              "
            >
              <span className="text-base transition-transform duration-200 group-hover:scale-110">
                🔥
              </span>

              <span className="text-sm font-semibold tabular-nums text-orange-300">
                {streak || 0}
              </span>

              <span className="hidden sm:inline text-xs text-orange-300/50 uppercase tracking-wider">
                days
              </span>
            </button>

            {/* PERFORMANCE */}

            <button
              type="button"
              onClick={() =>
                setShowPerformance(true)
              }
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
                onClick={() =>
                  setShowDropdown((value) => !value)
                }
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
                  ${
                    showDropdown
                      ? "border-white/[0.14] bg-white/[0.05]"
                      : "border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.045]"
                  }
                `}
              >
                {/* Avatar */}

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

                  {/* Verified */}

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

              {/* =================================================
                  DROPDOWN
              ================================================== */}

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
                          isStudySync
                            ? "via-violet-400/60"
                            : "via-red-400/60"
                        }
                        to-transparent
                      `}
                    />

                    {/* Profile header */}

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
                            {user?.email ||
                              "User Account"}
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
                            isStudySync
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
                              isStudySync
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
                                isStudySync
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
            {/* GD */}

            <button
              type="button"
              onClick={() => {
                if (isStudySync) {
                  window.location.href = "/hero";
                }
              }}
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
                ${
                  !isStudySync
                    ? "bg-red-500/[0.08] text-red-300 border border-red-500/10"
                    : "text-white/35"
                }
              `}
            >
              <FiMessageCircle className="w-3.5 h-3.5" />
              GD Arena
            </button>

            {/* StudySync */}

            <button
              type="button"
              onClick={() => {
                if (!isStudySync) {
                  window.location.href =
                    "/studymate";
                }
              }}
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
                ${
                  isStudySync
                    ? "bg-violet-500/[0.08] text-violet-300 border border-violet-500/10"
                    : "text-white/35"
                }
              `}
            >
              <FiBookOpen className="w-3.5 h-3.5" />
              StudySync
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
            onClose={() =>
              setShowPerformance(false)
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}