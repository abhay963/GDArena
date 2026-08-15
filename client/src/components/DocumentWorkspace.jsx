import { AnimatePresence, motion } from "framer-motion";

import {
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiCloud,
  FiFileText,
  FiFolder,
  FiInfo,
  FiZap,
  FiUploadCloud,
  FiX,
  FiMessageCircle,
  FiLoader,
  FiDatabase,
  FiScissors,
} from "react-icons/fi";


// =========================================================
// ANIMATION
// =========================================================

const ease = [0.22, 1, 0.36, 1];


// =========================================================
// DOCUMENT ICON
// =========================================================

function DocumentIcon({
  fileName,
}) {

  const extension =
    fileName
      ?.split(".")
      .pop()
      ?.toLowerCase();


  let label = "DOC";


  if (extension === "pdf") {

    label = "PDF";

  } else if (
    extension === "ppt" ||
    extension === "pptx"
  ) {

    label = "PPT";

  } else if (
    extension === "txt"
  ) {

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
        flex-shrink-0
      "
    >

      <FiFileText
        className="
          w-5
          h-5
          text-violet-400
        "
      />


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


// =========================================================
// PROCESSING STAGE CONFIG
// =========================================================

const stageConfig = {

  uploading: {
    label: "Uploading document",
    description: "Sending your document to StudySync",
    icon: FiUploadCloud,
  },

  extracting: {
    label: "Extracting document",
    description: "Reading the content from your document",
    icon: FiFileText,
  },

  chunking: {
    label: "Creating knowledge chunks",
    description: "Breaking your document into searchable pieces",
    icon: FiScissors,
  },

  embedding: {
    label: "Generating embeddings",
    description: "Converting chunks into searchable vectors",
    icon: FiZap,
  },

  storing: {
    label: "Storing knowledge",
    description: "Saving vectors in the knowledge database",
    icon: FiDatabase,
  },

  complete: {
    label: "Document ready",
    description: "Your document is ready for questions",
    icon: FiCheck,
  },

  failed: {
    label: "Processing failed",
    description: "Something went wrong while preparing your document",
    icon: FiX,
  },

};


// =========================================================
// PROCESSING PIPELINE
// =========================================================

function IntelligencePipeline({
  processing = false,
  processingStage = "uploading",
}) {

  const activeStage =
    processingStage;


  const stages = [
    {
      key: "document",
      label: "Document",
      icon: FiFileText,
    },

    {
      key: "retrieval",
      label: "Retrieval",
      icon: FiZap,
    },

    {
      key: "answer",
      label: "AI Answer",
      icon: FiMessageCircle,
    },
  ];


  return (
    <div className="mt-8">

      <div
        className="
          flex
          items-center
          justify-center
          gap-3
          sm:gap-5
        "
      >

        {stages.map(
          (stage, index) => {

            const Icon =
              stage.icon;


            return (
              <div
                key={stage.key}
                className="
                  flex
                  items-center
                  gap-3
                  sm:gap-5
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    items-center
                    gap-2.5
                  "
                >

                  <motion.div
                    animate={
                      processing &&
                      index === 0
                        ? {
                            boxShadow: [
                              "0 0 0 rgba(139,92,246,0)",
                              "0 0 25px rgba(139,92,246,0.15)",
                              "0 0 0 rgba(139,92,246,0)",
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className={`
                      w-11
                      h-11
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      border
                      ${
                        index === 1
                          ? `
                            bg-cyan-500/[0.06]
                            border-cyan-500/15
                          `
                          : `
                            bg-violet-500/[0.07]
                            border-violet-500/15
                          `
                      }
                    `}
                  >

                    <Icon
                      className={`
                        w-5
                        h-5
                        ${
                          index === 1
                            ? "text-cyan-400"
                            : "text-violet-400"
                        }
                      `}
                    />

                  </motion.div>


                  <span
                    className="
                      text-xs
                      uppercase
                      tracking-[0.16em]
                      text-white/35
                    "
                  >
                    {stage.label}
                  </span>

                </div>


                {index <
                  stages.length - 1 && (

                  <div
                    className="
                      w-10
                      sm:w-16
                      h-px
                      bg-gradient-to-r
                      from-violet-500/20
                      to-cyan-400/30
                      relative
                    "
                  >

                    <motion.div
                      animate={{
                        x: [
                          0,
                          50,
                          0,
                        ],
                        opacity: [
                          0,
                          1,
                          0,
                        ],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay:
                          index * 0.6,
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

                )}

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}


// =========================================================
// PROCESSING STATUS CARD
// =========================================================

function ProcessingStatus({
  processingStage,
  processingProgress = 0,
  totalChunks = 0,
  processedChunks = 0,
  processingError = null,
}) {

  const config =
    stageConfig[
      processingStage
    ] ||
    stageConfig.uploading;


  const Icon =
    config.icon;


  const isEmbedding =
    processingStage ===
    "embedding";


  const isChunking =
    processingStage ===
    "chunking";


  const isFailed =
    processingStage ===
    "failed";


  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
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

      {/* =================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <div
          className={`
            w-11
            h-11
            rounded-xl
            flex
            items-center
            justify-center
            flex-shrink-0
            ${
              isFailed
                ? `
                  bg-red-500/[0.08]
                  border
                  border-red-500/15
                `
                : `
                  bg-violet-500/[0.08]
                  border
                  border-violet-500/15
                `
            }
          `}
        >

          {isFailed ? (

            <FiX
              className="
                w-5
                h-5
                text-red-400
              "
            />

          ) : (

            <motion.div
              animate={{
                rotate:
                  processingStage !==
                  "complete"
                    ? 360
                    : 0,
              }}
              transition={{
                duration: 1.5,
                repeat:
                  processingStage !==
                  "complete"
                    ? Infinity
                    : 0,
                ease: "linear",
              }}
            >

              <Icon
                className="
                  w-5
                  h-5
                  text-violet-400
                "
              />

            </motion.div>

          )}

        </div>


        <div
          className="
            min-w-0
            flex-1
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <p
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              {config.label}
            </p>


            {!isFailed && (

              <span
                className="
                  px-2
                  py-0.5
                  rounded-full
                  bg-violet-400/10
                  text-violet-300
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                "
              >
                Live
              </span>

            )}

          </div>


          <p
            className="
              text-xs
              text-white/40
              mt-1.5
            "
          >
            {processingError ||
              config.description}
          </p>

        </div>


        <div
          className="
            text-right
            flex-shrink-0
          "
        >

          <p
            className="
              text-lg
              font-semibold
              text-white
            "
          >
            {processingProgress}%
          </p>

        </div>

      </div>


      {/* =================================================
          PROGRESS BAR
      ================================================== */}

      <div
        className="
          mt-5
          h-2
          rounded-full
          bg-white/[0.04]
          overflow-hidden
        "
      >

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width:
              `${processingProgress}%`,
          }}
          transition={{
            duration: 0.5,
            ease,
          }}
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-violet-600
            via-violet-400
            to-cyan-400
          "
        />

      </div>


      {/* =================================================
          REAL CHUNK PROGRESS
      ================================================== */}

      {(isEmbedding ||
        isChunking) && (

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            text-xs
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-white/35
            "
          >

            <FiFileText
              className="
                w-3.5
                h-3.5
              "
            />

            {isEmbedding
              ? "Embedding chunks"
              : "Document chunks"}

          </div>


          <span
            className="
              font-medium
              text-white/60
            "
          >

            {processedChunks}

            {" / "}

            {totalChunks}

            {" chunks"}

          </span>

        </div>

      )}


      {/* =================================================
          EMBEDDING DETAIL
      ================================================== */}

      {isEmbedding &&
        totalChunks > 0 && (

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-white/[0.05]
            bg-black/20
            px-4
            py-3
          "
        >

          <span
            className="
              text-xs
              text-white/30
            "
          >
            Gemini vector generation
          </span>


          <span
            className="
              text-xs
              font-medium
              text-violet-300
            "
          >

            {processedChunks}
            {" / "}
            {totalChunks}

          </span>

        </div>

      )}


      {/* =================================================
          CHUNKING DETAIL
      ================================================== */}

      {isChunking &&
        totalChunks > 0 && (

        <div
          className="
            mt-3
            rounded-xl
            border
            border-white/[0.05]
            bg-black/20
            px-4
            py-3
            flex
            items-center
            justify-between
          "
        >

          <span
            className="
              text-xs
              text-white/30
            "
          >
            Knowledge chunks created
          </span>


          <span
            className="
              text-xs
              font-medium
              text-violet-300
            "
          >

            {totalChunks}

          </span>

        </div>

      )}

    </motion.div>
  );
}


// =========================================================
// DOCUMENT WORKSPACE
// =========================================================

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

  // =======================================================
  // REAL PROCESSING STATE
  // =======================================================

  processingStage = "uploading",

  processingProgress = 0,

  totalChunks = 0,

  processedChunks = 0,

  processingError = null,

}) {

  const isProcessing =
    uploading ||
    (
      documentId &&
      processingStage !==
        "complete" &&
      processingStage !==
        "failed"
    );


  return (

    <motion.section
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

      {/* =================================================
          OUTER GLOW
      ================================================== */}

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


      {/* =================================================
          MAIN CARD
      ================================================== */}

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

        {/* =================================================
            TOP ACCENT
        ================================================== */}

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
            CONTENT
        ================================================== */}

        <div className="p-6 sm:p-9">

          {/* =================================================
              DROP AREA
          ================================================== */}

          <motion.div
            animate={{
              borderColor:
                isDragging
                  ? "rgba(167,139,250,0.45)"
                  : "rgba(255,255,255,0.07)",
            }}
            onDragOver={
              handleDragOver
            }
            onDragLeave={
              handleDragLeave
            }
            onDrop={
              handleDrop
            }
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
              px-6

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


            <div
              className="
                relative
                z-10
              "
            >

              {/* Upload icon */}

              <motion.div
                animate={{
                  y:
                    isDragging
                      ? -6
                      : [0, -4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat:
                    isDragging
                      ? 0
                      : Infinity,
                  ease: "easeInOut",
                }}
                className="
                  mx-auto
                  w-[72px]
                  h-[72px]
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

                  <FiUploadCloud
                    className="
                      w-8
                      h-8
                      text-violet-300
                    "
                  />

                ) : (

                  <FiCloud
                    className="
                      w-8
                      h-8
                      text-violet-400
                    "
                  />

                )}

              </motion.div>


              {/* Heading */}

              <p
                className="
                  text-xl
                  font-semibold
                  text-white
                  mt-7
                "
              >

                {isDragging
                  ? "Drop your document here"
                  : "Bring your knowledge into StudySync"}

              </p>


              {/* Description */}

              <p
                className="
                  text-[15px]
                  text-white/40
                  mt-3
                  max-w-md
                  mx-auto
                  leading-7
                "
              >

                Drop a file here or choose one from
                your device. StudySync will prepare
                it for AI-powered questions.

              </p>


              {/* =================================================
                  FILE INPUT
              ================================================== */}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.ppt,.pptx,.txt"
                className="hidden"
                onChange={
                  handleFileChange
                }
                id="document-upload"
              />


              {/* =================================================
                  CHOOSE DOCUMENT
              ================================================== */}

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

                <FiFolder
                  className="
                    w-4
                    h-4
                  "
                />

                Choose document

                <FiArrowRight
                  className="
                    w-4
                    h-4
                  "
                />

              </label>


              {/* Supported formats */}

              <p
                className="
                  text-xs
                  text-white/30
                  mt-5
                "
              >

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

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <DocumentIcon
                    fileName={
                      selectedFile.name
                    }
                  />


                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2.5
                      "
                    >

                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        {selectedFile.name}
                      </p>

                    </div>


                    <p
                      className="
                        text-xs
                        text-white/40
                        mt-1.5
                      "
                    >

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
                    onClick={
                      removeFile
                    }
                    disabled={
                      isProcessing
                    }
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
                      disabled:opacity-30
                    "
                  >

                    <FiX
                      className="
                        w-4
                        h-4
                      "
                    />

                  </button>

                </div>


                {/* =================================================
                    UPLOAD BUTTON
                ================================================== */}

                <button
                  type="button"
                  onClick={
                    handleUpload
                  }
                  disabled={
                    uploading
                  }
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

                      Uploading...

                    </>

                  ) : (

                    <>

                      <FiUploadCloud
                        className="
                          w-4
                          h-4
                        "
                      />

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
              REAL PROCESSING STATUS
          ================================================== */}

          <AnimatePresence>

            {documentId &&
              isProcessing && (

                <ProcessingStatus

                  processingStage={
                    processingStage
                  }

                  processingProgress={
                    processingProgress
                  }

                  totalChunks={
                    totalChunks
                  }

                  processedChunks={
                    processedChunks
                  }

                  processingError={
                    processingError
                  }

                />

              )}

          </AnimatePresence>


          {/* =================================================
              UPLOAD MESSAGE
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

                <FiInfo
                  className="
                    w-4
                    h-4
                    text-violet-400
                    mt-0.5
                    flex-shrink-0
                  "
                />


                <p
                  className="
                    text-sm
                    text-white/50
                    leading-6
                  "
                >
                  {uploadMessage}
                </p>

              </motion.div>

            )}

          </AnimatePresence>


          {/* =================================================
              COMPLETED DOCUMENT
          ================================================== */}

          <AnimatePresence>

            {documentId &&
              uploadedDocument &&
              processingStage ===
                "complete" && (

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
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
                    mt-6
                    rounded-2xl
                    border
                    border-emerald-500/15
                    bg-emerald-500/[0.035]
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >

                    <div
                      className="
                        w-11
                        h-11
                        rounded-xl
                        bg-emerald-500/[0.08]
                        border
                        border-emerald-500/15
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      "
                    >

                      <FiCheck
                        className="
                          w-5
                          h-5
                          text-emerald-400
                        "
                      />

                    </div>


                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-white
                          "
                        >
                          Document ready
                        </p>


                        <span
                          className="
                            px-2
                            py-0.5
                            rounded-full
                            bg-emerald-400/10
                            text-emerald-400
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wider
                          "
                        >
                          Indexed
                        </span>

                      </div>


                      <p
                        className="
                          text-xs
                          text-white/40
                          mt-1.5
                          truncate
                        "
                      >
                        {
                          uploadedDocument.originalName
                        }
                      </p>

                    </div>


                    <div
                      className="
                        text-right
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-white
                        "
                      >

                        {
                          uploadedDocument.chunks ??
                          totalChunks
                        }

                      </p>


                      <p
                        className="
                          text-[10px]
                          uppercase
                          tracking-wider
                          text-white/30
                        "
                      >
                        chunks
                      </p>

                    </div>

                  </div>

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

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-violet-400/60
                "
              >
                How StudySync thinks
              </p>


              <p
                className="
                  text-sm
                  text-white/40
                  mt-1.5
                "
              >
                Your documents become searchable knowledge.
              </p>

            </div>


            <FiZap
              className="
                w-5
                h-5
                text-violet-400/50
              "
            />

          </div>


          <IntelligencePipeline
            processing={
              isProcessing
            }
            processingStage={
              processingStage
            }
          />

        </div>

      </div>

    </motion.section>
  );
}


export default DocumentWorkspace;