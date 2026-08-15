import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import Navbar from "../components/Navbar";

import {
  FiArrowRight,
  FiArrowUpRight,
  FiBookOpen,
  FiCheck,
  FiCloud,
  FiFileText,
  FiFolder,
  FiInfo,
  FiMessageCircle,
  FiMousePointer,
  FiUploadCloud,
  FiX,
  FiZap,
} from "react-icons/fi";

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease,
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* =========================================================
   FLOATING PARTICLES
========================================================= */

function AmbientParticles() {
  const particles = Array.from({ length: 22 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 7,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute w-[2px] h-[2px] rounded-full bg-violet-300/30"
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            opacity: [0, 0.35, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   DOCUMENT ICON
========================================================= */

function DocumentIcon({ fileName }) {
  const extension = fileName?.split(".").pop()?.toLowerCase();

  let label = "DOC";

  if (extension === "pdf") {
    label = "PDF";
  } else if (extension === "ppt" || extension === "pptx") {
    label = "PPT";
  } else if (extension === "txt") {
    label = "TXT";
  }

  return (
    <div
      className="
        relative
        w-12
        h-12
        rounded-xl
        bg-violet-500/10
        border
        border-violet-500/15
        flex
        items-center
        justify-center
      "
    >
      <FiFileText className="w-5.5 h-5.5 text-violet-400" />

      <span
        className="
          absolute
          -bottom-1
          -right-1
          px-1.5
          py-0.5
          rounded
          bg-[#09090c]
          border
          border-violet-500/20
          text-[10px]
          font-bold
          text-violet-400
        "
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   PROCESSING PIPELINE
========================================================= */

function IntelligencePipeline() {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-center gap-3 sm:gap-5">

        {/* DOCUMENT */}

        <div className="flex flex-col items-center gap-2.5">
          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-violet-500/[0.07]
              border
              border-violet-500/15
              flex
              items-center
              justify-center
            "
          >
            <FiFileText className="w-5 h-5 text-violet-400" />
          </div>

          <span className="text-xs uppercase tracking-[0.16em] text-white/35">
            Document
          </span>
        </div>

        {/* LINE */}

        <div className="w-10 sm:w-16 h-px bg-gradient-to-r from-violet-500/20 to-cyan-400/30 relative">
          <motion.div
            animate={{
              x: [0, 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              -top-[3px]
              left-0
              w-1.5
              h-1.5
              rounded-full
              bg-cyan-300
            "
          />
        </div>

        {/* RAG */}

        <div className="flex flex-col items-center gap-2.5">
          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-cyan-500/[0.06]
              border
              border-cyan-500/15
              flex
              items-center
              justify-center
            "
          >
            <FiZap className="w-5 h-5 text-cyan-400" />
          </div>

          <span className="text-xs uppercase tracking-[0.16em] text-white/35">
            Retrieval
          </span>
        </div>

        {/* LINE */}

        <div className="w-10 sm:w-16 h-px bg-gradient-to-r from-cyan-400/30 to-violet-400/30 relative">
          <motion.div
            animate={{
              x: [0, 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
            className="
              absolute
              -top-[3px]
              left-0
              w-1.5
              h-1.5
              rounded-full
              bg-violet-300
            "
          />
        </div>

        {/* AI */}

        <div className="flex flex-col items-center gap-2.5">
          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-violet-500/[0.07]
              border
              border-violet-500/15
              flex
              items-center
              justify-center
            "
          >
            <FiMessageCircle className="w-5 h-5 text-violet-400" />
          </div>

          <span className="text-xs uppercase tracking-[0.16em] text-white/35">
            AI Answer
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STUDYSYNC
========================================================= */

function StudyMate() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  /* =======================================================
     AUTH
  ======================================================= */

  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  /* =======================================================
     FILE STATE
  ======================================================= */

  const [selectedFile, setSelectedFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [uploadMessage, setUploadMessage] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  /* =======================================================
     FILE SELECTION
  ======================================================= */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    validateAndSetFile(file);
  };

  /* =======================================================
     FILE VALIDATION
  ======================================================= */

  const validateAndSetFile = (file) => {
    const allowedTypes = [
      "pdf",
      "ppt",
      "pptx",
      "txt",
    ];

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!allowedTypes.includes(extension)) {
      setUploadMessage(
        "Unsupported file type. Please upload PDF, PPT, PPTX, or TXT."
      );

      return;
    }

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
      setUploadMessage(
        "File is too large. Maximum size is 20 MB."
      );

      return;
    }

    setSelectedFile(file);
    setUploadMessage("");
  };

  /* =======================================================
     DRAG & DROP
  ======================================================= */

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    validateAndSetFile(file);
  };

  /* =======================================================
     UPLOAD
  ======================================================= */

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage(
        "Please select a document first."
      );

      return;
    }

    try {
      setUploading(true);
      setUploadMessage("");

      const formData = new FormData();

      formData.append(
        "document",
        selectedFile
      );

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/documents/upload`,
        formData
      );

      console.log(
        "Uploaded document:",
        response.data.document
      );

      setUploadMessage(
        response.data.message ||
          "Document uploaded successfully."
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error(
        "Upload failed:",
        error
      );

      setUploadMessage(
        error.response?.data?.message ||
          "Failed to upload document."
      );

    } finally {
      setUploading(false);
    }
  };

  /* =======================================================
     REMOVE FILE
  ======================================================= */

  const removeFile = () => {
    setSelectedFile(null);
    setUploadMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        relative
        min-h-screen
        bg-[#030305]
        text-white
        overflow-hidden
        selection:bg-violet-500/30
      "
    >

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none">

        {/* Violet glow */}

        <div
          className="
            absolute
            -top-[25%]
            -left-[10%]
            w-[700px]
            h-[700px]
            rounded-full
            bg-violet-600/[0.07]
            blur-[170px]
          "
        />

        {/* Cyan glow */}

        <div
          className="
            absolute
            -bottom-[25%]
            right-[-10%]
            w-[650px]
            h-[650px]
            rounded-full
            bg-cyan-500/[0.045]
            blur-[170px]
          "
        />

        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
            bg-[linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)]
            bg-[size:80px_80px]
          "
        />

        {/* Vignette */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(ellipse_at_center,transparent_20%,#030305_82%)]
          "
        />
      </div>

      {/* Particles */}

      <AmbientParticles />

      {/* =====================================================
          SHARED NAVBAR
      ====================================================== */}

      <Navbar
        user={user}
        streak={0}
        onLogout={handleLogout}
        onNavigateHome={() => navigate("/hero")}
        activeProduct="studysync"
      />

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
          px-5
          sm:px-8
          py-12
          sm:py-16
        "
      >

        {/* ===================================================
            HERO
        ==================================================== */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center"
        >

          <motion.div variants={fadeUp}>

            <div
              className="
                inline-flex
                items-center
                gap-2.5
                px-4
                py-2
                rounded-full
                border
                border-violet-500/15
                bg-violet-500/[0.04]
              "
            >
              <FiBookOpen className="w-4 h-4 text-violet-400" />

              <span className="text-xs uppercase tracking-[0.2em] text-violet-400/80">
                AI document intelligence
              </span>
            </div>

          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="
              mt-8
              text-4xl
              sm:text-5xl
              lg:text-[4.6rem]
              font-semibold
              tracking-[-0.065em]
              leading-[0.98]
            "
          >
            <span className="text-white">
              Your knowledge.
            </span>

            <br />

            <span
              className="
                bg-gradient-to-r
                from-violet-300
                via-violet-400
                to-cyan-300
                bg-clip-text
                text-transparent
              "
            >
              Understood.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="
              mx-auto
              mt-7
              max-w-2xl
              text-base
              sm:text-lg
              leading-8
              text-white/40
            "
          >
            Upload your study material and turn static
            documents into an intelligent conversation.
            Find answers grounded in what you actually uploaded.
          </motion.p>

        </motion.div>

        {/* ===================================================
            UPLOAD WORKSPACE
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease,
          }}
          className="
            relative
            max-w-4xl
            mx-auto
            mt-14
          "
        >

          {/* Outer glow */}

          <div
            className="
              absolute
              -inset-5
              rounded-[38px]
              bg-violet-500/[0.025]
              blur-2xl
              pointer-events-none
            "
          />

          {/* Main container */}

          <div
            className="
              relative
              rounded-[30px]
              border
              border-white/[0.07]
              bg-[#08080b]/90
              shadow-[0_40px_120px_rgba(0,0,0,0.45)]
              overflow-hidden
            "
          >

            {/* Top accent */}

            <div
              className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-48
                h-px
                bg-gradient-to-r
                from-transparent
                via-violet-400/60
                to-transparent
              "
            />

            {/* =================================================
                DROP AREA
            ================================================== */}

            <div className="p-6 sm:p-9">

              <motion.div
                animate={{
                  borderColor: isDragging
                    ? "rgba(167,139,250,0.45)"
                    : "rgba(255,255,255,0.07)",
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative
                  min-h-[360px]
                  rounded-[24px]
                  border
                  border-dashed
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  overflow-hidden
                  transition-all
                  duration-300
                  ${
                    isDragging
                      ? "bg-violet-500/[0.06]"
                      : "bg-white/[0.012]"
                  }
                `}
              >

                {/* Decorative glow */}

                <div
                  className="
                    absolute
                    top-1/2
                    left-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    w-60
                    h-60
                    rounded-full
                    bg-violet-500/[0.05]
                    blur-[90px]
                  "
                />

                {/* Decorative orbit */}

                <div
                  className="
                    absolute
                    w-56
                    h-56
                    rounded-full
                    border
                    border-violet-400/[0.04]
                  "
                />

                <div
                  className="
                    absolute
                    w-40
                    h-40
                    rounded-full
                    border
                    border-cyan-400/[0.04]
                  "
                />

                {/* Content */}

                <div className="relative z-10">

                  <motion.div
                    animate={{
                      y: isDragging
                        ? -6
                        : [0, -4, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: isDragging
                        ? 0
                        : Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      mx-auto
                      w-18
                      h-18
                      rounded-[22px]
                      bg-violet-500/[0.08]
                      border
                      border-violet-500/15
                      flex
                      items-center
                      justify-center
                      shadow-[0_0_50px_rgba(139,92,246,0.08)]
                    "
                  >
                    {isDragging ? (
                      <FiUploadCloud className="w-8 h-8 text-violet-300" />
                    ) : (
                      <FiCloud className="w-8 h-8 text-violet-400" />
                    )}
                  </motion.div>

                  <p className="text-xl font-semibold text-white mt-7">
                    {isDragging
                      ? "Drop your document here"
                      : "Bring your knowledge into StudySync"}
                  </p>

                  <p className="text-[15px] text-white/40 mt-3 max-w-md mx-auto leading-7">
                    Drop a file here or choose one from
                    your device. StudySync will prepare
                    it for AI-powered questions.
                  </p>

                  {/* File input */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.ppt,.pptx,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                    id="document-upload"
                  />

                  <label
                    htmlFor="document-upload"
                    className="
                      inline-flex
                      items-center
                      gap-2.5
                      mt-8
                      px-6
                      py-3.5
                      rounded-xl
                      bg-gradient-to-r
                      from-violet-600
                      to-violet-500
                      hover:from-violet-500
                      hover:to-violet-400
                      text-white
                      text-sm
                      font-semibold
                      cursor-pointer
                      shadow-[0_12px_40px_rgba(139,92,246,0.18)]
                      hover:shadow-[0_16px_50px_rgba(139,92,246,0.28)]
                      transition-all
                    "
                  >
                    <FiFolder className="w-4 h-4" />

                    Choose document

                    <FiArrowRight className="w-4 h-4" />
                  </label>

                  <p className="text-xs text-white/30 mt-5">
                    PDF · PPT · PPTX · TXT

                    <span className="mx-2.5">
                      •
                    </span>

                    Maximum 20 MB
                  </p>

                </div>

              </motion.div>

              {/* =================================================
                  SELECTED FILE
              ================================================== */}

              <AnimatePresence>
                {selectedFile && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    className="
                      mt-5
                      rounded-2xl
                      border
                      border-violet-500/15
                      bg-violet-500/[0.035]
                      p-5
                    "
                  >

                    <div className="flex items-center gap-4">

                      <DocumentIcon
                        fileName={selectedFile.name}
                      />

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2.5">

                          <p className="truncate text-sm font-semibold text-white">
                            {selectedFile.name}
                          </p>

                          <FiCheck className="flex-shrink-0 w-4 h-4 text-emerald-400" />

                        </div>

                        <p className="text-xs text-white/40 mt-1.5">

                          {(
                            selectedFile.size /
                            (1024 * 1024)
                          ).toFixed(2)}{" "}
                          MB

                          <span className="mx-2">
                            •
                          </span>

                          Ready for processing

                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={removeFile}
                        disabled={uploading}
                        className="
                          w-9
                          h-9
                          rounded-lg
                          border
                          border-white/[0.06]
                          bg-white/[0.025]
                          flex
                          items-center
                          justify-center
                          text-white/30
                          hover:text-white
                          hover:bg-white/[0.05]
                          transition-all
                        "
                      >
                        <FiX className="w-4 h-4" />
                      </button>

                    </div>

                    {/* Upload */}

                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={uploading}
                      className="
                        group
                        mt-5
                        w-full
                        h-12
                        rounded-xl
                        bg-gradient-to-r
                        from-violet-600
                        to-indigo-500
                        hover:from-violet-500
                        hover:to-indigo-400
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        text-sm
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-2.5
                        transition-all
                        shadow-[0_10px_35px_rgba(139,92,246,0.12)]
                      "
                    >

                      {uploading ? (
                        <>
                          <motion.div
                            animate={{
                              rotate: 360,
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="
                              w-4
                              h-4
                              rounded-full
                              border-2
                              border-white/30
                              border-t-white
                            "
                          />

                          Processing document...
                        </>
                      ) : (
                        <>
                          <FiUploadCloud className="w-4 h-4" />

                          Upload to StudySync

                          <FiArrowUpRight
                            className="
                              w-4
                              h-4
                              group-hover:translate-x-0.5
                              group-hover:-translate-y-0.5
                              transition-transform
                            "
                          />
                        </>
                      )}

                    </button>

                  </motion.div>
                )}
              </AnimatePresence>

              {/* =================================================
                  MESSAGE
              ================================================== */}

              <AnimatePresence>
                {uploadMessage && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="
                      mt-5
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-white/[0.06]
                      bg-white/[0.025]
                      px-5
                      py-4
                    "
                  >
                    <FiInfo className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />

                    <p className="text-sm text-white/50 leading-6">
                      {uploadMessage}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* =================================================
                INTELLIGENCE PIPELINE
            ================================================== */}

            <div
              className="
                border-t
                border-white/[0.05]
                px-6
                sm:px-9
                py-7
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.2em] text-violet-400/60">
                    How StudySync thinks
                  </p>

                  <p className="text-sm text-white/40 mt-1.5">
                    Your documents become searchable knowledge.
                  </p>

                </div>

                <FiZap className="w-5 h-5 text-violet-400/50" />

              </div>

              <IntelligencePipeline />

            </div>

          </div>

        </motion.div>

        {/* ===================================================
            FEATURE STRIP
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.45,
            ease,
          }}
          className="
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-px
            max-w-4xl
            mx-auto
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.06]
            bg-white/[0.04]
          "
        >

          {/* FEATURE 1 */}

          <div className="bg-[#08080b] p-5 sm:p-6">

            <div className="flex items-center gap-3.5">

              <div
                className="
                  w-10
                  h-10
                  rounded-lg
                  bg-violet-500/[0.07]
                  border
                  border-violet-500/10
                  flex
                  items-center
                  justify-center
                "
              >
                <FiFileText className="w-4.5 h-4.5 text-violet-400" />
              </div>

              <div>

                <p className="text-sm font-semibold text-white/80">
                  Your material
                </p>

                <p className="text-xs text-white/35 mt-1">
                  PDFs, notes & slides
                </p>

              </div>

            </div>

          </div>

          {/* FEATURE 2 */}

          <div className="bg-[#08080b] p-5 sm:p-6">

            <div className="flex items-center gap-3.5">

              <div
                className="
                  w-10
                  h-10
                  rounded-lg
                  bg-cyan-500/[0.07]
                  border
                  border-cyan-500/10
                  flex
                  items-center
                  justify-center
                "
              >
                <FiZap className="w-4.5 h-4.5 text-cyan-400" />
              </div>

              <div>

                <p className="text-sm font-semibold text-white/80">
                  Grounded retrieval
                </p>

                <p className="text-xs text-white/35 mt-1">
                  Find relevant context
                </p>

              </div>

            </div>

          </div>

          {/* FEATURE 3 */}

          <div className="bg-[#08080b] p-5 sm:p-6">

            <div className="flex items-center gap-3.5">

              <div
                className="
                  w-10
                  h-10
                  rounded-lg
                  bg-emerald-500/[0.07]
                  border
                  border-emerald-500/10
                  flex
                  items-center
                  justify-center
                "
              >
                <FiMessageCircle className="w-4.5 h-4.5 text-emerald-400" />
              </div>

              <div>

                <p className="text-sm font-semibold text-white/80">
                  AI answers
                </p>

                <p className="text-xs text-white/35 mt-1">
                  Ask questions naturally
                </p>

              </div>

            </div>

          </div>

        </motion.div>

        {/* ===================================================
            FOOTER NOTE
        ==================================================== */}

        <div className="flex items-center justify-center gap-2.5 mt-10">

          <FiMousePointer className="w-4 h-4 text-white/20" />

          <p className="text-sm text-white/30 tracking-wide">
            Upload your material to unlock document-grounded learning
          </p>

        </div>

      </main>

    </div>
  );
}

export default StudyMate;