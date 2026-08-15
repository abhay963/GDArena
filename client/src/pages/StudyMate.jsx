import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  FiBookOpen,
  FiFileText,
  FiMessageCircle,
  FiClock,
  FiCheckCircle,
  FiLoader,
  FiPlus,
  FiChevronRight,
  FiDatabase,
  FiUploadCloud,
  FiLayers,
  FiSearch,
  FiX,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import DocumentWorkspace from "../components/DocumentWorkspace";
import StudyMateChat from "../components/StudyMateChat";
import StudyMateFeatures from "../components/StudyMateFeatures";
import api from "../services/api";

const ease = [0.22, 1, 0.36, 1];

/* =========================================================
   BACKGROUND
========================================================= */

function AmbientParticles() {
  const particles = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    left: `${(index * 41) % 100}%`,
    top: `${(index * 53) % 100}%`,
    delay: (index % 7) * 0.55,
    duration: 6 + (index % 6),
    size: index % 3 === 0 ? 3 : 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-violet-300/25"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [0, -32, 0],
            scale: [1, 1.4, 1],
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
   DOCUMENT STATUS
========================================================= */

function DocumentStatus({ document }) {
  if (!document) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/15 bg-violet-500/[0.06]">
        <FiMessageCircle className="w-3.5 h-3.5 text-violet-400" />

        <span className="text-[10px] font-medium text-violet-300/80">
          General AI
        </span>
      </div>
    );
  }

  if (document.status === "completed") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06]">
        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />

        <span className="text-[10px] font-medium text-emerald-300/80">
          Document ready
        </span>
      </div>
    );
  }

  if (document.status === "failed") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/15 bg-red-500/[0.06]">
        <FiX className="w-3.5 h-3.5 text-red-400" />

        <span className="text-[10px] font-medium text-red-300/80">
          Processing failed
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/15 bg-cyan-500/[0.06]">
      <FiLoader className="w-3.5 h-3.5 text-cyan-400 animate-spin" />

      <span className="text-[10px] font-medium text-cyan-300/80">
        Preparing document
      </span>
    </div>
  );
}

/* =========================================================
   STUDYMATE
========================================================= */

function StudyMate() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const progressTimerRef = useRef(null);

  const [user, setUser] = useState(null);

  /* =======================================================
     DOCUMENT UPLOAD
  ======================================================= */

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [documentId, setDocumentId] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [displayProgress, setDisplayProgress] = useState(0);

  /* =======================================================
     LIBRARY
  ======================================================= */

  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [selectingDocument, setSelectingDocument] = useState(false);

  /* =======================================================
     CHAT
  ======================================================= */

  const [chatSessionId, setChatSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);

  const [asking, setAsking] = useState(false);
  const [askMessage, setAskMessage] = useState("");

  const auth = getAuth();

  /* =========================================================
     AUTH
  ========================================================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  /* =========================================================
     LOAD DOCUMENT LIBRARY
  ========================================================= */

  const loadDocuments = async (uid) => {
    if (!uid) return;

    try {
      setLoadingDocuments(true);

      const response = await api.get(
        `/api/chats/documents?userId=${encodeURIComponent(uid)}`
      );

      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error(
        "Failed to load documents:",
        error
      );
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      loadDocuments(user.uid);
    }
  }, [user?.uid]);

  /* =========================================================
     LOAD CHAT FOR DOCUMENT
  ========================================================= */

  const loadChatForDocument = async (
    uid,
    selectedDocumentId
  ) => {
    if (!uid || !selectedDocumentId) return;

    try {
      setSelectingDocument(true);
      setAskMessage("");

      const chatResponse = await api.get(
        `/api/chats/document?userId=${encodeURIComponent(
          uid
        )}&documentId=${encodeURIComponent(
          selectedDocumentId
        )}`
      );

      let chat = chatResponse.data.chat;

      if (!chat) {
        const createResponse = await api.post(
          "/api/chats",
          {
            userId: uid,
            documentId: selectedDocumentId,
          }
        );

        chat = createResponse.data.chat;
      }

      setChatSessionId(chat.id);

      const messagesResponse = await api.get(
        `/api/chats/${chat.id}?userId=${encodeURIComponent(
          uid
        )}`
      );

      setChatMessages(
        messagesResponse.data.messages || []
      );
    } catch (error) {
      console.error(
        "Failed to load chat:",
        error
      );

      setChatMessages([]);
      setChatSessionId(null);
    } finally {
      setSelectingDocument(false);
    }
  };

  /* =========================================================
     SELECT DOCUMENT
  ========================================================= */

  const selectDocument = async (document) => {
    if (!user?.uid || !document?.id) return;

    setDocumentId(document.id);

    setUploadedDocument({
      id: document.id,

      originalName:
        document.file_name ||
        document.originalName,

      fileType:
        document.file_type ||
        document.fileType,

      status: document.status,

      processingStage:
        document.processing_stage ||
        document.processingStage,

      progress:
        Number(document.progress) || 0,

      chunks:
        Number(
          document.total_chunks ||
            document.totalChunks ||
            0
        ),

      processedChunks:
        Number(
          document.processed_chunks ||
            document.processedChunks ||
            0
        ),

      errorMessage:
        document.error_message ||
        document.errorMessage ||
        null,
    });

    setDisplayProgress(
      Number(document.progress) || 0
    );

    setSelectedFile(null);

    setAnswer("");
    setSources([]);
    setQuestion("");
    setAskMessage("");

    await loadChatForDocument(
      user.uid,
      document.id
    );
  };

  /* =========================================================
     DOCUMENT STATUS POLLING
  ========================================================= */

  useEffect(() => {
    if (!documentId) return;

    let cancelled = false;
    let timeoutId = null;

    const pollStatus = async () => {
      try {
        const response = await api.get(
          `/api/documents/status/${documentId}`
        );

        if (cancelled) return;

        const document =
          response.data.document;

        setUploadedDocument((previous) => ({
          ...previous,

          id: document.id,

          originalName:
            document.fileName,

          fileType:
            document.fileType,

          status:
            document.status,

          processingStage:
            document.processingStage,

          progress:
            Number(document.progress) || 0,

          chunks:
            Number(document.totalChunks) || 0,

          processedChunks:
            Number(
              document.processedChunks
            ) || 0,

          errorMessage:
            document.errorMessage ||
            null,
        }));

        if (
          document.status === "completed" ||
          document.status === "failed"
        ) {
          return;
        }

        timeoutId = setTimeout(
          pollStatus,
          1800
        );
      } catch (error) {
        if (!cancelled) {
          timeoutId = setTimeout(
            pollStatus,
            2500
          );
        }
      }
    };

    pollStatus();

    return () => {
      cancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [documentId]);

  /* =========================================================
     SMOOTH PROGRESS
  ========================================================= */

  useEffect(() => {
    if (progressTimerRef.current) {
      clearInterval(
        progressTimerRef.current
      );
    }

    if (!uploadedDocument) {
      setDisplayProgress(0);
      return;
    }

    const target =
      Number(
        uploadedDocument.progress
      ) || 0;

    progressTimerRef.current =
      setInterval(() => {
        setDisplayProgress((current) => {
          if (current >= target) {
            clearInterval(
              progressTimerRef.current
            );

            return target;
          }

          const difference =
            target - current;

          const step =
            difference > 20
              ? 3
              : difference > 8
              ? 2
              : 1;

          return Math.min(
            target,
            current + step
          );
        });
      }, 100);

    return () =>
      clearInterval(
        progressTimerRef.current
      );
  }, [uploadedDocument?.progress]);

  /* =========================================================
     FILE VALIDATION
  ========================================================= */

  const validateAndSetFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "pdf",
      "ppt",
      "pptx",
      "txt",
    ];

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      !extension ||
      !allowedTypes.includes(extension)
    ) {
      setUploadMessage(
        "Unsupported file type. Please upload PDF, PPT, PPTX, or TXT."
      );

      return;
    }

    if (
      file.size >
      20 * 1024 * 1024
    ) {
      setUploadMessage(
        "File is too large. Maximum size is 20 MB."
      );

      return;
    }

    setSelectedFile(file);

    setUploadMessage("");
    setAnswer("");
    setSources([]);
    setQuestion("");
    setAskMessage("");
  };

  const handleFileChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (
    event
  ) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (
    event
  ) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (
    event
  ) => {
    event.preventDefault();
    setIsDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      validateAndSetFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================================================
     UPLOAD
  ========================================================= */

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage(
        "Please select a document first."
      );

      return;
    }

    if (!user?.uid) {
      setUploadMessage(
        "Please sign in before uploading a document."
      );

      return;
    }

    try {
      setUploading(true);

      setUploadMessage("");
      setAnswer("");
      setSources([]);
      setAskMessage("");
      setQuestion("");
      setDisplayProgress(0);

      const formData =
        new FormData();

      formData.append(
        "document",
        selectedFile
      );

      formData.append(
        "userId",
        user.uid
      );

      const response =
        await api.post(
          "/api/documents/upload",
          formData
        );

      const uploaded =
        response.data.document;

      setDocumentId(
        uploaded.id
      );

      setUploadedDocument(
        uploaded
      );

      setDisplayProgress(
        Number(
          uploaded.progress
        ) || 0
      );

      setUploadMessage(
        response.data.message ||
          "Document uploaded successfully."
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }

      await loadDocuments(
        user.uid
      );

      await loadChatForDocument(
        user.uid,
        uploaded.id
      );
    } catch (error) {
      if (
        error.response?.status ===
          409 &&
        error.response?.data
          ?.duplicate
      ) {
        const existing =
          error.response.data.document;

        setDocumentId(
          existing.id
        );

        setUploadedDocument({
          id: existing.id,

          originalName:
            existing.originalName,

          fileType:
            existing.fileType,

          status:
            existing.status,

          processingStage:
            existing.processingStage,

          progress:
            Number(
              existing.progress
            ) || 0,

          chunks:
            Number(
              existing.totalChunks
            ) || 0,

          processedChunks:
            Number(
              existing.processedChunks
            ) || 0,

          errorMessage:
            existing.errorMessage ||
            null,
        });

        setDisplayProgress(
          Number(
            existing.progress
          ) || 0
        );

        setUploadMessage(
          "This document is already in your StudyMate library. Opening it..."
        );

        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value =
            "";
        }

        await loadDocuments(
          user.uid
        );

        await loadChatForDocument(
          user.uid,
          existing.id
        );

        return;
      }

      console.error(
        "Upload failed:",
        error
      );

      setUploadMessage(
        error.response?.data
          ?.message ||
          "Failed to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  /* =========================================================
     ASK AI
  ========================================================= */

  const handleAsk = async () => {
    const currentQuestion =
      question.trim();

    if (!currentQuestion) {
      setAskMessage(
        "Please enter a question."
      );

      return;
    }

    if (!user?.uid) {
      setAskMessage(
        "Please sign in before asking questions."
      );

      return;
    }

    const isDocumentMode =
      Boolean(documentId);

    if (
      isDocumentMode &&
      uploadedDocument?.status !==
        "completed"
    ) {
      setAskMessage(
        "Your document is still being prepared. Please wait until indexing is complete."
      );

      return;
    }

    try {
      setAsking(true);
      setAskMessage("");
      setAnswer("");

      /* =====================================================
         DOCUMENT RAG
      ===================================================== */

      if (isDocumentMode) {
        const response =
          await api.post(
            "/api/documents/ask",
            {
              documentId,
              question:
                currentQuestion,
            }
          );

        const generatedAnswer =
          response.data.answer ||
          "";

        const timestamp =
          new Date().toISOString();

        setChatMessages(
          (previous) => [
            ...previous,

            {
              id: `local-user-${Date.now()}`,
              role: "user",
              content:
                currentQuestion,
              created_at:
                timestamp,
            },

            {
              id: `local-assistant-${Date.now()}`,
              role: "assistant",
              content:
                generatedAnswer,
              created_at:
                new Date().toISOString(),
            },
          ]
        );

        setAnswer(
          generatedAnswer
        );

        setSources(
          response.data.sources ||
            []
        );

        setQuestion("");

        let sessionId =
          chatSessionId;

        if (!sessionId) {
          const chatResponse =
            await api.post(
              "/api/chats",
              {
                userId:
                  user.uid,
                documentId,
              }
            );

          sessionId =
            chatResponse.data
              .chat.id;

          setChatSessionId(
            sessionId
          );
        }

        await api.post(
          "/api/chats/message",
          {
            userId:
              user.uid,

            chatSessionId:
              sessionId,

            role: "user",

            content:
              currentQuestion,
          }
        );

        await api.post(
          "/api/chats/message",
          {
            userId:
              user.uid,

            chatSessionId:
              sessionId,

            role: "assistant",

            content:
              generatedAnswer,
          }
        );

        await loadDocuments(
          user.uid
        );

        return;
      }

      /* =====================================================
         GENERAL AI
      ===================================================== */

      const response =
        await api.post(
          "/api/studymate/chat",
          {
            userId:
              user.uid,

            question:
              currentQuestion,
          }
        );

      const generatedAnswer =
        response.data.answer ||
        "";

      const timestamp =
        new Date().toISOString();

      setChatMessages(
        (previous) => [
          ...previous,

          {
            id: `local-general-user-${Date.now()}`,
            role: "user",
            content:
              currentQuestion,
            created_at:
              timestamp,
          },

          {
            id: `local-general-assistant-${Date.now()}`,
            role: "assistant",
            content:
              generatedAnswer,
            created_at:
              new Date().toISOString(),
          },
        ]
      );

      setAnswer(
        generatedAnswer
      );

      setSources([]);

      setQuestion("");
    } catch (error) {
      console.error(
        "StudyMate question failed:",
        error
      );

      setAskMessage(
        error.response?.data
          ?.message ||
          "Failed to generate an answer."
      );
    } finally {
      setAsking(false);
    }
  };

  /* =========================================================
     GENERAL AI
  ========================================================= */

  const startGeneralChat = () => {
    setDocumentId(null);
    setUploadedDocument(null);
    setChatSessionId(null);

    setChatMessages([]);

    setAnswer("");
    setSources([]);
    setQuestion("");
    setAskMessage("");

    setSelectedFile(null);
    setUploadMessage("");
    setDisplayProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout =
    async () => {
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

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatFileName =
    (name) => {
      if (!name) {
        return "Untitled document";
      }

      if (name.length <= 24) {
        return name;
      }

      return `${name.slice(
        0,
        21
      )}...`;
    };

  const formatDate =
    (date) => {
      if (!date) return "";

      try {
        return new Date(
          date
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
          }
        );
      } catch {
        return "";
      }
    };

  const isReady =
    uploadedDocument?.status ===
    "completed";

  const processing =
    uploadedDocument?.status ===
      "processing" ||
    uploading;

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="relative min-h-screen bg-[#030305] text-white overflow-hidden selection:bg-violet-500/30">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -left-[15%] w-[780px] h-[780px] rounded-full bg-violet-600/[0.08] blur-[180px]" />

        <div className="absolute -bottom-[30%] -right-[12%] w-[720px] h-[720px] rounded-full bg-cyan-500/[0.05] blur-[180px]" />

        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-fuchsia-600/[0.03] blur-[160px]" />

        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,#030305_85%)]" />
      </div>

      <AmbientParticles />

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar
        user={user}
        streak={0}
        onLogout={handleLogout}
        onNavigateHome={() =>
          navigate("/hero")
        }
        activeProduct="studymate"
      />

      {/* =====================================================
          PAGE
      ====================================================== */}

      <main className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ===================================================
            SIMPLE PAGE HEADER
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
            ease,
          }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-400/10 flex items-center justify-center">
                  <FiBookOpen className="w-3.5 h-3.5 text-violet-400" />
                </div>

                <span className="text-[10px] uppercase tracking-[0.2em] text-violet-300/60">
                  StudyMate AI
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.035em] text-white">
                Study with your
                <span className="ml-2 bg-gradient-to-r from-violet-300 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  documents.
                </span>
              </h1>

              <p className="mt-1.5 text-sm text-white/30">
                Select a document on the left or upload a new one to start asking.
              </p>
            </div>

            <DocumentStatus
              document={
                uploadedDocument
              }
            />
          </div>
        </motion.div>

        {/* ===================================================
            MAIN APPLICATION
        ==================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-[285px_minmax(0,1fr)] gap-5 items-start">
          {/* =================================================
              LEFT — DOCUMENT SIDEBAR
          ================================================== */}

          <motion.aside
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.55,
              ease,
            }}
            className="lg:sticky lg:top-24 rounded-[22px] border border-white/[0.07] bg-[#09090d]/90 backdrop-blur-2xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
          >
            {/* Sidebar header */}

            <div className="p-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/85">
                    Your documents
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/25">
                    {documents.length}{" "}
                    {documents.length ===
                    1
                      ? "document"
                      : "documents"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="w-9 h-9 rounded-xl border border-violet-400/15 bg-violet-500/[0.08] text-violet-300 flex items-center justify-center hover:bg-violet-500/[0.15] hover:border-violet-400/25 transition"
                  title="Upload document"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* General AI */}

            <div className="p-2 border-b border-white/[0.05]">
              <button
                type="button"
                onClick={
                  startGeneralChat
                }
                className={`w-full text-left rounded-xl p-3 border transition-all ${
                  !documentId
                    ? "border-violet-400/20 bg-gradient-to-r from-violet-500/[0.12] to-cyan-500/[0.04]"
                    : "border-transparent hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      !documentId
                        ? "bg-violet-500/15 text-violet-300"
                        : "bg-white/[0.04] text-white/30"
                    }`}
                  >
                    <FiMessageCircle className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-white/80">
                      General AI
                    </p>

                    <p className="text-[10px] text-white/25 mt-0.5">
                      Ask anything
                    </p>
                  </div>

                  {!documentId && (
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                  )}
                </div>
              </button>
            </div>

            {/* Documents */}

            <div className="p-2 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
              {loadingDocuments ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <FiLoader className="w-5 h-5 text-violet-400 animate-spin" />

                  <p className="mt-3 text-xs text-white/25">
                    Loading documents...
                  </p>
                </div>
              ) : documents.length ===
                0 ? (
                <div className="py-14 px-4 text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl border border-violet-400/10 bg-violet-500/[0.06] flex items-center justify-center">
                    <FiLayers className="w-5 h-5 text-violet-300/60" />
                  </div>

                  <p className="mt-4 text-sm text-white/45">
                    No documents yet
                  </p>

                  <p className="mt-1.5 text-[10px] leading-5 text-white/20">
                    Upload your first study document to start chatting with it.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {documents.map(
                    (document) => {
                      const active =
                        document.id ===
                        documentId;

                      const ready =
                        document.status ===
                        "completed";

                      return (
                        <button
                          key={
                            document.id
                          }
                          type="button"
                          onClick={() =>
                            selectDocument(
                              document
                            )
                          }
                          className={`group w-full text-left rounded-xl p-3 border transition-all ${
                            active
                              ? "border-violet-400/20 bg-violet-500/[0.10]"
                              : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.025]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                                active
                                  ? "bg-violet-500/15 text-violet-300"
                                  : "bg-white/[0.035] text-white/25 group-hover:text-white/45"
                              }`}
                            >
                              <FiFileText className="w-4 h-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-[12px] font-medium text-white/70 truncate">
                                  {formatFileName(
                                    document.file_name ||
                                      document.originalName
                                  )}
                                </p>

                                {ready ? (
                                  <FiCheckCircle className="shrink-0 w-3 h-3 text-emerald-400/75" />
                                ) : (
                                  <FiLoader className="shrink-0 w-3 h-3 text-violet-400/60 animate-spin" />
                                )}
                              </div>

                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="text-[9px] uppercase text-white/20">
                                  {document.file_type
                                    ?.split(
                                      "/"
                                    )
                                    .pop()
                                    ?.toUpperCase() ||
                                    "DOC"}
                                </span>

                                <span className="text-white/10">
                                  •
                                </span>

                                <span className="text-[9px] text-white/20">
                                  {formatDate(
                                    document.created_at
                                  )}
                                </span>
                              </div>

                              {!ready &&
                                document.status ===
                                  "processing" && (
                                  <div className="mt-2 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                                    <motion.div
                                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
                                      initial={{
                                        width: 0,
                                      }}
                                      animate={{
                                        width: `${Math.min(
                                          96,
                                          Number(
                                            document.progress
                                          ) ||
                                            8
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                )}
                            </div>

                            <FiChevronRight
                              className={`w-3 h-3 shrink-0 ${
                                active
                                  ? "text-violet-300"
                                  : "text-white/10 group-hover:text-white/25"
                              }`}
                            />
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* Sidebar footer */}

            <div className="px-4 py-3 border-t border-white/[0.05] bg-white/[0.01]">
              <div className="flex items-center gap-1.5">
                <FiClock className="w-3 h-3 text-white/20" />

                <span className="text-[9px] uppercase tracking-[0.14em] text-white/20">
                  Saved automatically
                </span>
              </div>
            </div>
          </motion.aside>

          {/* =================================================
              RIGHT — STUDYMATE WORKSPACE
          ================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              delay: 0.05,
              ease,
            }}
            className="min-w-0"
          >
            {/* =================================================
                ACTIVE DOCUMENT BAR
            ================================================== */}

            <div className="mb-4 rounded-[20px] border border-white/[0.07] bg-[#09090d]/85 backdrop-blur-xl px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${
                      documentId
                        ? "bg-cyan-500/[0.08] border border-cyan-400/10"
                        : "bg-violet-500/[0.08] border border-violet-400/10"
                    }`}
                  >
                    {documentId ? (
                      <FiFileText className="w-4 h-4 text-cyan-300" />
                    ) : (
                      <FiMessageCircle className="w-4 h-4 text-violet-300" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                      Current workspace
                    </p>

                    <p className="text-sm font-medium text-white/75 truncate">
                      {documentId
                        ? formatFileName(
                            uploadedDocument?.originalName
                          )
                        : "General AI"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {documentId &&
                    uploadedDocument && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] text-white/20">
                        <FiDatabase className="w-3 h-3" />

                        {uploadedDocument.chunks ||
                          0}{" "}
                        chunks
                      </span>
                    )}

                  <DocumentStatus
                    document={
                      uploadedDocument
                    }
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                UPLOAD SECTION
            ================================================== */}

            <div className="rounded-[24px] border border-white/[0.07] bg-[#09090d]/90 backdrop-blur-xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
              <div className="px-5 sm:px-6 py-4 border-b border-white/[0.05]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <FiUploadCloud className="w-4 h-4 text-violet-400" />

                      <span className="text-[10px] uppercase tracking-[0.18em] text-violet-300/60">
                        Add study material
                      </span>
                    </div>

                    <h2 className="mt-1.5 text-lg font-semibold text-white/90">
                      Upload a document
                    </h2>
                  </div>

                  <span className="hidden sm:block text-[10px] text-white/20">
                    PDF · PPT · PPTX · TXT
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <DocumentWorkspace
                  selectedFile={
                    selectedFile
                  }
                  uploading={
                    uploading
                  }
                  uploadMessage={
                    uploadMessage
                  }
                  isDragging={
                    isDragging
                  }
                  documentId={
                    documentId
                  }
                  uploadedDocument={{
                    ...uploadedDocument,
                    progress:
                      displayProgress,
                  }}
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
                  handleUpload={
                    handleUpload
                  }
                  removeFile={
                    removeFile
                  }
                />
              </div>
            </div>

            {/* =================================================
                RESTORING CHAT
            ================================================== */}

            <AnimatePresence>
              {selectingDocument && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 6,
                  }}
                  className="mt-3 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-violet-400/10 bg-violet-500/[0.04]"
                >
                  <FiLoader className="w-3.5 h-3.5 text-violet-400 animate-spin" />

                  <span className="text-xs text-white/35">
                    Opening your conversation...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* =================================================
                CHAT SECTION
            ================================================== */}

            <div className="mt-5">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/[0.08] border border-violet-400/10 flex items-center justify-center">
                    <FiMessageCircle className="w-3.5 h-3.5 text-violet-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white/80">
                      Ask StudyMate
                    </p>

                    <p className="text-[10px] text-white/20">
                      {documentId
                        ? "Answers are grounded in your document"
                        : "Ask anything without a document"}
                    </p>
                  </div>
                </div>

                {chatMessages.length >
                  0 && (
                  <span className="text-[9px] uppercase tracking-wider text-white/15">
                    {chatMessages.length} messages
                  </span>
                )}
              </div>

              <StudyMateChat
                documentId={
                  documentId
                }
                uploadedDocument={
                  uploadedDocument
                }
                question={
                  question
                }
                setQuestion={
                  setQuestion
                }
                answer={
                  answer
                }
                sources={
                  sources
                }
                asking={
                  asking
                }
                askMessage={
                  askMessage
                }
                handleAsk={
                  handleAsk
                }
                chatSessionId={
                  chatSessionId
                }
                chatMessages={
                  chatMessages
                }
              />
            </div>

            {/* =================================================
                PROCESSING STATUS
            ================================================== */}

            <AnimatePresence>
              {processing && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 6,
                  }}
                  className="mt-4 flex items-center gap-3 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.025] px-4 py-3"
                >
                  <FiLoader className="w-4 h-4 text-cyan-400 animate-spin" />

                  <div>
                    <p className="text-xs font-medium text-white/45">
                      Preparing your document
                    </p>

                    <p className="text-[10px] text-white/20 mt-0.5">
                      {displayProgress}% processed. You can ask questions once indexing is complete.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        {/* ===================================================
            FEATURES — BELOW APP
        ==================================================== */}

        <div className="mt-14">
          <StudyMateFeatures />
        </div>

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="flex items-center justify-center py-8"
        >
          <div className="flex items-center gap-2 text-[11px] text-white/20 text-center">
            {isReady ? (
              <>
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400/50" />

                Your document is ready. Ask anything about it.
              </>
            ) : documentId ? (
              <>
                <FiLoader className="w-3.5 h-3.5 text-violet-400/50 animate-spin" />

                Preparing your document for AI...
              </>
            ) : (
              <>
                <FiMessageCircle className="w-3.5 h-3.5 text-violet-400/40" />

                Select a document or start with General AI.
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default StudyMate;