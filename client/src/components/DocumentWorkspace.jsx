import { AnimatePresence, motion } from "framer-motion";

import {
  FiAlertCircle,
  FiArrowUpRight,
  FiCheck,
  FiCheckCircle,
  FiFileText,
  FiLoader,
  FiUploadCloud,
  FiX,
  FiZap,
} from "react-icons/fi";

const ease = [0.22, 1, 0.36, 1];

/* =========================================================
   HELPERS
========================================================= */

function formatBytes(bytes) {
  if (!bytes) return "0 KB";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function getExtension(name) {
  if (!name) return "FILE";

  const parts = name.split(".");

  return (
    parts[parts.length - 1]
      ?.toUpperCase() || "FILE"
  );
}

function getProcessingText(
  document,
  progress
) {
  if (!document) {
    return "Preparing document...";
  }

  if (document.status === "completed") {
    return "Document is ready";
  }

  if (document.status === "failed") {
    return "Document processing failed";
  }

  const stage = document.processingStage;

  if (!stage) {
    return "Preparing your document...";
  }

  const normalized =
    String(stage).toLowerCase();

  if (normalized.includes("extract")) {
    return "Extracting text from your document...";
  }

  if (normalized.includes("chunk")) {
    return "Creating searchable knowledge chunks...";
  }

  if (normalized.includes("embed")) {
    return "Creating AI embeddings...";
  }

  if (normalized.includes("index")) {
    return "Adding knowledge to StudyMate...";
  }

  if (normalized.includes("process")) {
    return "Processing your document...";
  }

  if (progress >= 90) {
    return "Finishing your knowledge base...";
  }

  if (progress >= 50) {
    return "Building your searchable knowledge...";
  }

  if (progress >= 20) {
    return "Preparing document content...";
  }

  return "Preparing your document...";
}

/* =========================================================
   FILE ICON
========================================================= */

function FileIcon({
  extension,
  active = false,
}) {
  return (
    <div
      className={`relative w-12 h-12 shrink-0 rounded-[14px] flex items-center justify-center overflow-hidden border ${
        active
          ? "border-violet-400/15 bg-gradient-to-br from-violet-500/[0.14] to-cyan-500/[0.05]"
          : "border-white/[0.06] bg-white/[0.035]"
      }`}
    >
      {/* Inner glow */}

      {active && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(167,139,250,0.18),transparent_60%)]" />
      )}

      <FiFileText
        className={`relative w-5 h-5 ${
          active
            ? "text-violet-300"
            : "text-white/30"
        }`}
      />

      <span className="absolute bottom-1 right-1 text-[6px] font-bold tracking-wide text-white/15">
        {extension}
      </span>
    </div>
  );
}

/* =========================================================
   UPLOAD ORB
========================================================= */

function UploadOrb({ isDragging }) {
  return (
    <div className="relative">
      {/* Outer ambient glow */}

      <motion.div
        animate={{
          scale: isDragging
            ? [1, 1.12, 1]
            : [1, 1.05, 1],
          opacity: isDragging
            ? [0.2, 0.45, 0.2]
            : [0.12, 0.22, 0.12],
        }}
        transition={{
          duration: isDragging
            ? 1.2
            : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-4 rounded-full bg-violet-500/20 blur-2xl"
      />

      {/* Orb */}

      <motion.div
        animate={
          isDragging
            ? {
                y: -4,
                scale: 1.06,
              }
            : {
                y: [0, -3, 0],
                scale: [1, 1.015, 1],
              }
        }
        transition={
          isDragging
            ? {
                duration: 0.25,
                ease,
              }
            : {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        className={`relative w-[68px] h-[68px] rounded-[22px] border flex items-center justify-center overflow-hidden ${
          isDragging
            ? "border-violet-300/30 bg-violet-500/[0.12]"
            : "border-white/[0.08] bg-gradient-to-br from-violet-500/[0.10] via-violet-500/[0.04] to-cyan-500/[0.04]"
        }`}
      >
        {/* Top shine */}

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Inner gradient */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(167,139,250,0.18),transparent_55%)]" />

        <FiUploadCloud
          className={`relative w-7 h-7 ${
            isDragging
              ? "text-violet-200"
              : "text-violet-300/80"
          }`}
        />
      </motion.div>
    </div>
  );
}

/* =========================================================
   EMPTY UPLOAD STATE
========================================================= */

function EmptyUpload({
  isDragging,
  fileInputRef,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() =>
        fileInputRef.current?.click()
      }
      className={`group relative min-h-[270px] overflow-hidden rounded-[22px] border cursor-pointer flex flex-col items-center justify-center text-center px-6 transition-all duration-500 ${
        isDragging
          ? "border-violet-400/35 bg-violet-500/[0.07]"
          : "border-white/[0.07] bg-[#0b0b10]/70 hover:border-violet-400/15 hover:bg-[#0d0d13]"
      }`}
    >
      {/* Hidden input */}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.ppt,.pptx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Background glow */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-48 rounded-full bg-violet-600/[0.06] blur-[80px] group-hover:bg-violet-600/[0.10] transition-all duration-700" />

        <div className="absolute -bottom-32 right-0 w-64 h-48 rounded-full bg-cyan-500/[0.035] blur-[80px]" />
      </div>

      {/* Grid */}

      <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Dashed inner boundary */}

      <div
        className={`pointer-events-none absolute inset-3 rounded-[18px] border border-dashed transition-all duration-500 ${
          isDragging
            ? "border-violet-400/20"
            : "border-white/[0.035] group-hover:border-violet-400/[0.10]"
        }`}
      />

      {/* Content */}

      <div className="relative z-10 flex flex-col items-center">
        <UploadOrb
          isDragging={isDragging}
        />

        <div className="mt-6">
          <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-white/80">
            {isDragging
              ? "Release to upload"
              : "Drop your study material here"}
          </h3>

          <p className="mt-2 text-[11px] leading-5 text-white/25">
            {isDragging
              ? "StudyMate will prepare it for AI"
              : "Drag & drop your file or choose one from your device"}
          </p>
        </div>

        {/* Browse button */}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();

            fileInputRef.current?.click();
          }}
          className="mt-5 group/button h-9 px-4 rounded-xl border border-white/[0.08] bg-white/[0.035] hover:bg-white/[0.06] hover:border-violet-400/15 flex items-center gap-2 text-[10px] font-medium text-white/45 hover:text-white/70 transition-all"
        >
          Choose file

          <FiArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover/button:text-violet-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 transition-all" />
        </button>

        {/* Formats */}

        <div className="mt-5 flex items-center gap-2">
          {[
            "PDF",
            "PPT",
            "PPTX",
            "TXT",
          ].map((type) => (
            <span
              key={type}
              className="px-2 py-1 rounded-md border border-white/[0.045] bg-white/[0.018] text-[7px] font-semibold tracking-[0.12em] text-white/20"
            >
              {type}
            </span>
          ))}

          <span className="ml-1 text-[8px] text-white/15">
            Up to 20 MB
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   SELECTED FILE
========================================================= */

function SelectedFile({
  file,
  removeFile,
  handleUpload,
  uploading,
}) {
  const extension =
    getExtension(file.name);

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.985,
        y: 8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.985,
        y: -8,
      }}
      transition={{
        duration: 0.4,
        ease,
      }}
      className="relative overflow-hidden rounded-[22px] border border-violet-400/[0.10] bg-[#0b0b10]"
    >
      {/* Ambient glow */}

      <div className="absolute -top-24 -right-10 w-64 h-48 rounded-full bg-violet-600/[0.07] blur-[80px]" />

      <div className="absolute -bottom-24 left-1/3 w-52 h-40 rounded-full bg-cyan-500/[0.035] blur-[70px]" />

      {/* Top shine */}

      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />

      <div className="relative p-5">
        {/* Header */}

        <div className="flex items-center gap-3.5">
          <div className="relative">
            <FileIcon
              extension={extension}
              active
            />

            <motion.div
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 300,
              }}
              className="absolute -right-1.5 -bottom-1.5 w-5 h-5 rounded-full bg-violet-500 border-[3px] border-[#0b0b10] flex items-center justify-center"
            >
              <FiCheck className="w-2.5 h-2.5 text-white" />
            </motion.div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-[0.18em] text-violet-300/40">
              Selected document
            </p>

            <p className="mt-1 text-[14px] font-medium text-white/80 truncate">
              {file.name}
            </p>

            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[9px] font-semibold tracking-wider text-violet-300/45">
                {extension}
              </span>

              <span className="text-white/10">
                /
              </span>

              <span className="text-[10px] text-white/20">
                {formatBytes(
                  file.size
                )}
              </span>
            </div>
          </div>

          {/* Remove */}

          <button
            type="button"
            onClick={
              removeFile
            }
            disabled={uploading}
            className="w-8 h-8 shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.025] flex items-center justify-center text-white/20 hover:text-white/65 hover:border-white/[0.10] hover:bg-white/[0.05] transition-all disabled:opacity-30"
            title="Remove file"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Divider */}

        <div className="my-5 h-px bg-white/[0.05]" />

        {/* AI preparation hint */}

        <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-white/[0.045] bg-white/[0.018]">
          <div className="w-7 h-7 rounded-lg bg-violet-500/[0.08] border border-violet-400/[0.08] flex items-center justify-center">
            <FiZap className="w-3.5 h-3.5 text-violet-300/70" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-medium text-white/45">
              Ready for AI processing
            </p>

            <p className="mt-0.5 text-[9px] text-white/18">
              StudyMate will extract, chunk and index this document.
            </p>
          </div>
        </div>

        {/* Upload button */}

        <motion.button
          type="button"
          onClick={
            handleUpload
          }
          disabled={uploading}
          whileHover={
            !uploading
              ? {
                  y: -1,
                }
              : {}
          }
          whileTap={
            !uploading
              ? {
                  scale: 0.99,
                }
              : {}
          }
          className="relative overflow-hidden mt-4 w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 hover:from-violet-500 hover:via-violet-400 hover:to-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[11px] font-semibold text-white transition-all shadow-[0_12px_35px_rgba(124,58,237,0.18)]"
        >
          {/* Button shine */}

          {!uploading && (
            <motion.div
              animate={{
                x: [
                  "-120%",
                  "120%",
                ],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
              className="absolute inset-y-0 w-20 bg-white/10 skew-x-[-20deg] blur-sm"
            />
          )}

          {uploading ? (
            <>
              <FiLoader className="relative w-3.5 h-3.5 animate-spin" />

              <span className="relative">
                Preparing document...
              </span>
            </>
          ) : (
            <>
              <FiZap className="relative w-3.5 h-3.5" />

              <span className="relative">
                Upload & prepare for AI
              </span>

              <FiArrowUpRight className="relative w-3.5 h-3.5" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* =========================================================
   PROCESSING STATE
========================================================= */

function ProcessingState({
  document,
  progress,
}) {
  const safeProgress =
    Math.max(
      0,
      Math.min(
        100,
        Number(progress) || 0
      )
    );

  const processingText =
    getProcessingText(
      document,
      safeProgress
    );

  const steps = [
    {
      label: "Extract",
      threshold: 20,
    },
    {
      label: "Chunk",
      threshold: 50,
    },
    {
      label: "Embed",
      threshold: 75,
    },
    {
      label: "Index",
      threshold: 90,
    },
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.985,
        y: 8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease,
      }}
      className="relative overflow-hidden rounded-[22px] border border-cyan-400/[0.09] bg-[#0a0b0f]"
    >
      {/* Ambient glows */}

      <div className="absolute -top-32 left-1/3 w-80 h-56 rounded-full bg-cyan-500/[0.05] blur-[90px]" />

      <div className="absolute -bottom-32 right-0 w-72 h-52 rounded-full bg-violet-600/[0.05] blur-[90px]" />

      {/* Top accent */}

      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      <div className="relative p-5 sm:p-6">
        {/* Header */}

        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-[14px] border border-cyan-400/10 bg-gradient-to-br from-cyan-500/[0.08] to-violet-500/[0.04] flex items-center justify-center">
              <FiFileText className="w-5 h-5 text-cyan-300/70" />
            </div>

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -right-1.5 -top-1.5 w-5 h-5 rounded-full border-2 border-[#0a0b0f] border-t-cyan-300 border-r-cyan-300/30"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-medium text-white/75 truncate">
                {document?.originalName ||
                  "Your document"}
              </p>

              <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-md border border-cyan-400/10 bg-cyan-400/[0.04] text-[7px] uppercase tracking-[0.12em] text-cyan-300/45">
                Processing
              </span>
            </div>

            <p className="mt-1 text-[10px] text-cyan-300/45">
              {processingText}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xl font-semibold tracking-[-0.04em] text-white/80">
              {safeProgress}
              <span className="text-sm text-cyan-300/50">
                %
              </span>
            </p>

            <p className="text-[8px] uppercase tracking-[0.15em] text-white/15">
              complete
            </p>
          </div>
        </div>

        {/* Progress */}

        <div className="mt-6">
          <div className="relative h-2 rounded-full bg-white/[0.045] overflow-hidden">
            <motion.div
              className="relative h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400"
              initial={{
                width: 0,
              }}
              animate={{
                width: `${safeProgress}%`,
              }}
              transition={{
                duration: 0.5,
                ease,
              }}
            >
              {/* Moving shine */}

              <motion.div
                animate={{
                  x: [
                    "-100%",
                    "250%",
                  ],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-y-0 w-20 bg-white/20 blur-sm skew-x-[-20deg]"
              />
            </motion.div>
          </div>

          <div className="mt-2 flex justify-between">
            <span className="text-[9px] text-white/15">
              Building your AI knowledge base
            </span>

            <span className="text-[9px] text-white/15">
              Almost there
            </span>
          </div>
        </div>

        {/* Pipeline */}

        <div className="mt-6">
          <div className="relative grid grid-cols-4 gap-2">
            {/* Connector */}

            <div className="absolute top-[13px] left-3 right-3 h-px bg-white/[0.05]" />

            {steps.map(
              (step, index) => {
                const completed =
                  safeProgress >=
                  step.threshold;

                const active =
                  !completed &&
                  safeProgress >=
                    (steps[
                      index - 1
                    ]?.threshold ||
                      0);

                return (
                  <div
                    key={
                      step.label
                    }
                    className="relative z-10"
                  >
                    <div className="flex justify-center">
                      <div
                        className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                          completed
                            ? "border-cyan-400/20 bg-cyan-400/[0.08]"
                            : active
                            ? "border-violet-400/20 bg-violet-400/[0.07]"
                            : "border-white/[0.06] bg-[#0a0b0f]"
                        }`}
                      >
                        {completed ? (
                          <FiCheck className="w-3 h-3 text-cyan-300/70" />
                        ) : active ? (
                          <FiLoader className="w-3 h-3 text-violet-300/70 animate-spin" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        )}
                      </div>
                    </div>

                    <p
                      className={`mt-2 text-center text-[8px] uppercase tracking-[0.12em] ${
                        completed
                          ? "text-cyan-300/45"
                          : active
                          ? "text-violet-300/45"
                          : "text-white/15"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   COMPLETED STATE
========================================================= */

function CompletedState({
  document,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.985,
        y: 8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease,
      }}
      className="relative overflow-hidden rounded-[22px] border border-emerald-400/[0.09] bg-[#090d0c]"
    >
      {/* Glow */}

      <div className="absolute -top-28 right-0 w-72 h-48 rounded-full bg-emerald-500/[0.05] blur-[85px]" />

      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

      <div className="relative p-5">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-[14px] border border-emerald-400/10 bg-emerald-400/[0.06] flex items-center justify-center">
              <FiFileText className="w-5 h-5 text-emerald-300/70" />
            </div>

            <div className="absolute -right-1.5 -bottom-1.5 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-[#090d0c] flex items-center justify-center">
              <FiCheck className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-[0.18em] text-emerald-300/40">
              Knowledge base ready
            </p>

            <p className="mt-1 text-[14px] font-medium text-white/75 truncate">
              {document?.originalName ||
                "Document"}
            </p>

            <p className="mt-1 text-[10px] text-emerald-300/45">
              Your document is ready to chat with
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-400/[0.08] bg-emerald-400/[0.04]">
            <FiCheckCircle className="w-3 h-3 text-emerald-300/60" />

            <span className="text-[8px] uppercase tracking-wider text-emerald-300/50">
              Ready
            </span>
          </div>
        </div>

        {/* Divider */}

        <div className="my-4 h-px bg-white/[0.04]" />

        {/* Info */}

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-400/[0.04] border border-emerald-400/[0.06] flex items-center justify-center">
            <FiZap className="w-3 h-3 text-emerald-300/50" />
          </div>

          <p className="text-[10px] leading-5 text-white/25">
            StudyMate can now retrieve relevant passages from this document and use them to answer your questions.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   FAILED STATE
========================================================= */

function FailedState({
  document,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.985,
        y: 8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        ease,
      }}
      className="relative overflow-hidden rounded-[22px] border border-red-400/[0.09] bg-[#0d0909]"
    >
      <div className="absolute -top-24 right-0 w-64 h-44 rounded-full bg-red-500/[0.04] blur-[80px]" />

      <div className="relative p-5">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 shrink-0 rounded-[14px] border border-red-400/10 bg-red-400/[0.05] flex items-center justify-center">
            <FiAlertCircle className="w-5 h-5 text-red-300/65" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.18em] text-red-300/40">
              Processing error
            </p>

            <p className="mt-1 text-[14px] font-medium text-white/70">
              We couldn't prepare this document
            </p>

            <p className="mt-1.5 text-[10px] leading-5 text-red-300/40">
              {document?.errorMessage ||
                "Something went wrong while processing your document."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function DocumentWorkspace({
  selectedFile,
  uploading,
  uploadMessage,
  isDragging,
  documentId,
  uploadedDocument,
  fileInputRef,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleUpload,
  removeFile,
}) {
  const hasSelectedFile =
    Boolean(selectedFile);

  const hasDocument =
    Boolean(documentId);

  const status =
    uploadedDocument?.status;

  const progress =
    Number(
      uploadedDocument?.progress
    ) || 0;

  const isProcessing =
    hasDocument &&
    (status === "processing" ||
      uploading);

  const isCompleted =
    hasDocument &&
    status === "completed";

  const isFailed =
    hasDocument &&
    status === "failed";

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {/* =================================================
            SELECTED FILE
        ================================================== */}

        {hasSelectedFile ? (
          <SelectedFile
            key="selected"
            file={selectedFile}
            removeFile={removeFile}
            handleUpload={handleUpload}
            uploading={uploading}
          />
        ) : isProcessing ? (
          /* =================================================
             PROCESSING
          ================================================== */

          <ProcessingState
            key="processing"
            document={
              uploadedDocument
            }
            progress={progress}
          />
        ) : isCompleted ? (
          /* =================================================
             COMPLETED
          ================================================== */

          <CompletedState
            key="completed"
            document={
              uploadedDocument
            }
          />
        ) : isFailed ? (
          /* =================================================
             FAILED
          ================================================== */

          <FailedState
            key="failed"
            document={
              uploadedDocument
            }
          />
        ) : (
          /* =================================================
             EMPTY
          ================================================== */

          <EmptyUpload
            key="empty"
            isDragging={
              isDragging
            }
            fileInputRef={
              fileInputRef
            }
            handleFileChange={
              handleFileChange
            }
            handleDragOver={
              handleDragOver
            }
            handleDragLeave={
              handleDragLeave
            }
            handleDrop={
              handleDrop
            }
          />
        )}
      </AnimatePresence>

      {/* ===================================================
          UPLOAD MESSAGE
      ==================================================== */}

      <AnimatePresence>
        {uploadMessage && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -5,
            }}
            className="overflow-hidden"
          >
            <div
              className={`mt-3 rounded-xl border px-3.5 py-2.5 flex items-start gap-2.5 ${
                uploadMessage
                  .toLowerCase()
                  .includes("success") ||
                uploadMessage
                  .toLowerCase()
                  .includes("already")
                  ? "border-emerald-400/[0.08] bg-emerald-400/[0.025]"
                  : "border-red-400/[0.08] bg-red-400/[0.025]"
              }`}
            >
              {uploadMessage
                .toLowerCase()
                .includes("success") ||
              uploadMessage
                .toLowerCase()
                .includes("already") ? (
                <FiCheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400/60 mt-0.5" />
              ) : (
                <FiAlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400/60 mt-0.5" />
              )}

              <p className="text-[10px] leading-5 text-white/30">
                {uploadMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          FOOTNOTE
      ==================================================== */}

      {!hasDocument &&
        !hasSelectedFile &&
        !uploading && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.3,
            }}
            className="mt-3 flex items-center justify-center gap-2"
          >
            <FiCheck className="w-3 h-3 text-white/10" />

            <span className="text-[9px] text-white/12">
              Files up to 20 MB · Your content stays private
            </span>
          </motion.div>
        )}
    </div>
  );
}

export default DocumentWorkspace;