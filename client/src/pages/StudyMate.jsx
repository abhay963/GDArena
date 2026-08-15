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
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import DocumentWorkspace from "../components/DocumentWorkspace";
import StudyMateChat from "../components/StudyMateChat";
import StudyMateFeatures from "../components/StudyMateFeatures";
import api from "../services/api";

const ease = [0.22, 1, 0.36, 1];

function AmbientParticles() {
  const particles = Array.from({ length: 22 }, (_, index) => ({
    id: index,
    left: `${(index * 41) % 100}%`,
    top: `${(index * 53) % 100}%`,
    delay: (index % 7) * 0.55,
    duration: 6 + (index % 6),
    size: index % 3 === 0 ? 3 : 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-violet-300/25"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [0, -32, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function StudyMate() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const progressTimerRef = useRef(null);

  const [user, setUser] = useState(null);

  // Document upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Library
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [selectingDocument, setSelectingDocument] = useState(false);

  // Chat
  const [chatSessionId, setChatSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [asking, setAsking] = useState(false);
  const [askMessage, setAskMessage] = useState("");

  const auth = getAuth();

  // Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Load library
  const loadDocuments = async (uid) => {
    if (!uid) return;
    try {
      setLoadingDocuments(true);
      const response = await api.get(
        `/api/chats/documents?userId=${encodeURIComponent(uid)}`
      );
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    if (user?.uid) loadDocuments(user.uid);
  }, [user?.uid]);

  // Load chat for document
  const loadChatForDocument = async (uid, selectedDocumentId) => {
    if (!uid || !selectedDocumentId) return;
    try {
      setSelectingDocument(true);
      setAskMessage("");

      const chatResponse = await api.get(
        `/api/chats/document?userId=${encodeURIComponent(
          uid
        )}&documentId=${encodeURIComponent(selectedDocumentId)}`
      );

      let chat = chatResponse.data.chat;

      if (!chat) {
        const createResponse = await api.post("/api/chats", {
          userId: uid,
          documentId: selectedDocumentId,
        });
        chat = createResponse.data.chat;
      }

      setChatSessionId(chat.id);

      const messagesResponse = await api.get(
        `/api/chats/${chat.id}?userId=${encodeURIComponent(uid)}`
      );
      setChatMessages(messagesResponse.data.messages || []);
    } catch (error) {
      console.error("Failed to load chat:", error);
      setChatMessages([]);
      setChatSessionId(null);
    } finally {
      setSelectingDocument(false);
    }
  };

  // Select document
  const selectDocument = async (document) => {
    if (!user?.uid || !document?.id) return;

    setDocumentId(document.id);
    setUploadedDocument({
      id: document.id,
      originalName: document.file_name || document.originalName,
      fileType: document.file_type || document.fileType,
      status: document.status,
      processingStage: document.processing_stage || document.processingStage,
      progress: Number(document.progress) || 0,
      chunks: Number(document.total_chunks || document.totalChunks || 0),
      processedChunks: Number(
        document.processed_chunks || document.processedChunks || 0
      ),
      errorMessage: document.error_message || document.errorMessage || null,
    });
    setDisplayProgress(Number(document.progress) || 0);
    setSelectedFile(null);
    setAnswer("");
    setSources([]);
    setQuestion("");
    setAskMessage("");

    await loadChatForDocument(user.uid, document.id);
  };

  // Processing polling
  useEffect(() => {
    if (!documentId) return;

    let cancelled = false;
    let timeoutId = null;

    const pollStatus = async () => {
      try {
        const response = await api.get(`/api/documents/status/${documentId}`);
        if (cancelled) return;

        const document = response.data.document;
        setUploadedDocument((previous) => ({
          ...previous,
          id: document.id,
          originalName: document.fileName,
          fileType: document.fileType,
          status: document.status,
          processingStage: document.processingStage,
          progress: Number(document.progress) || 0,
          chunks: Number(document.totalChunks) || 0,
          processedChunks: Number(document.processedChunks) || 0,
          errorMessage: document.errorMessage || null,
        }));

        if (document.status === "completed" || document.status === "failed") {
          return;
        }
        timeoutId = setTimeout(pollStatus, 1800);
      } catch (error) {
        if (!cancelled) timeoutId = setTimeout(pollStatus, 2500);
      }
    };

    pollStatus();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [documentId]);

  // Smooth progress
  useEffect(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (!uploadedDocument) {
      setDisplayProgress(0);
      return;
    }

    const target = Number(uploadedDocument.progress) || 0;
    progressTimerRef.current = setInterval(() => {
      setDisplayProgress((current) => {
        if (current >= target) {
          clearInterval(progressTimerRef.current);
          return target;
        }
        const difference = target - current;
        const step = difference > 20 ? 3 : difference > 8 ? 2 : 1;
        return Math.min(target, current + step);
      });
    }, 100);

    return () => clearInterval(progressTimerRef.current);
  }, [uploadedDocument?.progress]);

  // File validation
  const validateAndSetFile = (file) => {
    if (!file) return;
    const allowedTypes = ["pdf", "ppt", "pptx", "txt"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !allowedTypes.includes(extension)) {
      setUploadMessage(
        "Unsupported file type. Please upload PDF, PPT, PPTX, or TXT."
      );
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadMessage("File is too large. Maximum size is 20 MB.");
      return;
    }

    setSelectedFile(file);
    setUploadMessage("");
    setAnswer("");
    setSources([]);
    setQuestion("");
    setAskMessage("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a document first.");
      return;
    }
    if (!user?.uid) {
      setUploadMessage("Please sign in before uploading a document.");
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

      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("userId", user.uid);

      const response = await api.post("/api/documents/upload", formData);
      const uploaded = response.data.document;

      setDocumentId(uploaded.id);
      setUploadedDocument(uploaded);
      setDisplayProgress(Number(uploaded.progress) || 0);
      setUploadMessage(
        response.data.message || "Document uploaded successfully."
      );
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await loadDocuments(user.uid);
      await loadChatForDocument(user.uid, uploaded.id);
    } catch (error) {
      if (error.response?.status === 409 && error.response?.data?.duplicate) {
        const existing = error.response.data.document;
        setDocumentId(existing.id);
        setUploadedDocument({
          id: existing.id,
          originalName: existing.originalName,
          fileType: existing.fileType,
          status: existing.status,
          processingStage: existing.processingStage,
          progress: Number(existing.progress) || 0,
          chunks: Number(existing.totalChunks) || 0,
          processedChunks: Number(existing.processedChunks) || 0,
          errorMessage: existing.errorMessage || null,
        });
        setDisplayProgress(Number(existing.progress) || 0);
        setUploadMessage(
          "This document is already in your StudyMate library. Opening it..."
        );
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await loadDocuments(user.uid);
        await loadChatForDocument(user.uid, existing.id);
        return;
      }

      console.error("Upload failed:", error);
      setUploadMessage(
        error.response?.data?.message || "Failed to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  // Ask
  const handleAsk = async () => {
    const currentQuestion = question.trim();
    if (!currentQuestion) {
      setAskMessage("Please enter a question.");
      return;
    }
    if (!user?.uid) {
      setAskMessage("Please sign in before asking questions.");
      return;
    }

    const isDocumentMode = Boolean(documentId);

    if (isDocumentMode && uploadedDocument?.status !== "completed") {
      setAskMessage(
        "Your document is still being prepared. You can use General AI by starting a new chat, or wait until this document is ready."
      );
      return;
    }

    try {
      setAsking(true);
      setAskMessage("");
      setAnswer("");

      if (isDocumentMode) {
        const response = await api.post("/api/documents/ask", {
          documentId,
          question: currentQuestion,
        });

        const generatedAnswer = response.data.answer || "";
        const timestamp = new Date().toISOString();

        setChatMessages((previous) => [
          ...previous,
          {
            id: `local-user-${Date.now()}`,
            role: "user",
            content: currentQuestion,
            created_at: timestamp,
          },
          {
            id: `local-assistant-${Date.now()}`,
            role: "assistant",
            content: generatedAnswer,
            created_at: new Date().toISOString(),
          },
        ]);

        setAnswer(generatedAnswer);
        setSources(response.data.sources || []);
        setQuestion("");

        let sessionId = chatSessionId;
        if (!sessionId) {
          const chatResponse = await api.post("/api/chats", {
            userId: user.uid,
            documentId,
          });
          sessionId = chatResponse.data.chat.id;
          setChatSessionId(sessionId);
        }

        await api.post("/api/chats/message", {
          userId: user.uid,
          chatSessionId: sessionId,
          role: "user",
          content: currentQuestion,
        });

        await api.post("/api/chats/message", {
          userId: user.uid,
          chatSessionId: sessionId,
          role: "assistant",
          content: generatedAnswer,
        });

        await loadDocuments(user.uid);
        return;
      }

      // General AI
      const response = await api.post("/api/studymate/chat", {
        userId: user.uid,
        question: currentQuestion,
      });

      const generatedAnswer = response.data.answer || "";
      const timestamp = new Date().toISOString();

      setChatMessages((previous) => [
        ...previous,
        {
          id: `local-general-user-${Date.now()}`,
          role: "user",
          content: currentQuestion,
          created_at: timestamp,
        },
        {
          id: `local-general-assistant-${Date.now()}`,
          role: "assistant",
          content: generatedAnswer,
          created_at: new Date().toISOString(),
        },
      ]);

      setAnswer(generatedAnswer);
      setSources([]);
      setQuestion("");
    } catch (error) {
      console.error("StudyMate question failed:", error);
      setAskMessage(
        error.response?.data?.message || "Failed to generate an answer."
      );
    } finally {
      setAsking(false);
    }
  };

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const formatFileName = (name) => {
    if (!name) return "Untitled document";
    if (name.length <= 26) return name;
    return `${name.slice(0, 23)}...`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "";
    }
  };

  const isReady = uploadedDocument?.status === "completed";
  const processing =
    uploadedDocument?.status === "processing" || uploading;

  return (
    <div className="relative min-h-screen bg-[#030305] text-white overflow-hidden selection:bg-violet-500/30">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -left-[15%] w-[780px] h-[780px] rounded-full bg-violet-600/[0.08] blur-[180px]" />
        <div className="absolute -bottom-[30%] -right-[12%] w-[720px] h-[720px] rounded-full bg-cyan-500/[0.05] blur-[180px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-fuchsia-600/[0.03] blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,#030305_85%)]" />
      </div>

      <AmbientParticles />

      <Navbar
        user={user}
        streak={0}
        onLogout={handleLogout}
        onNavigateHome={() => navigate("/hero")}
        activeProduct="studysync"
      />

      <main className="relative z-10 mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Compact hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="mb-7 sm:mb-9"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.06] mb-3">
                <FiBookOpen className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-violet-300/90">
                  Document intelligence
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.04em] leading-tight">
                <span className="text-white">Your knowledge.</span>{" "}
                <span className="bg-gradient-to-r from-violet-300 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  Understood.
                </span>
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/35 leading-relaxed">
                Chat freely or upload study material for grounded answers from
                your own knowledge base.
              </p>
            </div>

            {/* Quick status pill */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs ${
                  isReady
                    ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300/90"
                    : documentId
                    ? "border-violet-500/20 bg-violet-500/[0.08] text-violet-300/90"
                    : "border-white/10 bg-white/[0.03] text-white/40"
                }`}
              >
                {isReady ? (
                  <FiCheckCircle className="w-3.5 h-3.5" />
                ) : documentId ? (
                  <FiLoader className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FiMessageCircle className="w-3.5 h-3.5" />
                )}
                <span>
                  {isReady
                    ? "Document ready"
                    : documentId
                    ? `Processing ${displayProgress}%`
                    : "General AI"}
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Main workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-5 items-start">
          {/* ─── Library sidebar ─── */}
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease }}
            className="rounded-2xl border border-white/[0.07] bg-[#0a0a0f]/85 backdrop-blur-2xl overflow-hidden xl:sticky xl:top-24 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-3 border-b border-white/[0.05]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-white/90">Library</p>
                  <p className="text-[11px] text-white/30 mt-0.5">
                    {documents.length}{" "}
                    {documents.length === 1 ? "document" : "documents"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startGeneralChat}
                  className="w-8 h-8 rounded-lg border border-violet-400/20 bg-violet-500/10 flex items-center justify-center text-violet-300 hover:bg-violet-500/20 transition"
                  title="New General AI chat"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>

              {/* General AI card */}
              <button
                type="button"
                onClick={startGeneralChat}
                className={`w-full text-left rounded-xl border px-3 py-2.5 transition-all ${
                  !documentId
                    ? "border-violet-400/25 bg-gradient-to-br from-violet-500/15 to-cyan-500/5 shadow-[0_0_20px_rgba(139,92,246,0.08)]"
                    : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      !documentId
                        ? "bg-violet-500/20 text-violet-300"
                        : "bg-white/[0.04] text-white/35"
                    }`}
                  >
                    <FiMessageCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-white/80 font-medium">
                      General AI
                    </p>
                    <p className="text-[10px] text-white/30">No document needed</p>
                  </div>
                  {!documentId && (
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                  )}
                </div>
              </button>
            </div>

            {/* Document list */}
            <div className="p-2 max-h-[480px] overflow-y-auto scrollbar-thin">
              {loadingDocuments ? (
                <div className="py-14 flex flex-col items-center gap-3">
                  <FiLoader className="w-5 h-5 text-violet-400 animate-spin" />
                  <p className="text-xs text-white/30">Loading library…</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <div className="w-11 h-11 mx-auto rounded-xl bg-violet-500/10 border border-violet-400/15 flex items-center justify-center mb-3">
                    <FiLayers className="text-violet-300/70 w-5 h-5" />
                  </div>
                  <p className="text-sm text-white/55">Empty library</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-white/25">
                    Upload a PDF, PPT or TXT to build your knowledge base.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {documents.map((document) => {
                    const active = document.id === documentId;
                    const ready = document.status === "completed";

                    return (
                      <button
                        type="button"
                        key={document.id}
                        onClick={() => selectDocument(document)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all group ${
                          active
                            ? "border-violet-400/25 bg-violet-500/[0.1]"
                            : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex gap-2.5">
                          <div
                            className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                              active
                                ? "bg-violet-500/20 text-violet-300"
                                : "bg-white/[0.04] text-white/30 group-hover:text-white/50"
                            }`}
                          >
                            <FiFileText className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-1.5">
                              <p className="text-[13px] text-white/75 truncate flex-1 leading-snug">
                                {formatFileName(
                                  document.file_name || document.originalName
                                )}
                              </p>
                              {ready ? (
                                <FiCheckCircle className="shrink-0 mt-0.5 text-emerald-400/75 w-3 h-3" />
                              ) : (
                                <FiLoader className="shrink-0 mt-0.5 text-violet-400/60 w-3 h-3 animate-spin" />
                              )}
                            </div>

                            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-white/25">
                              <span className="uppercase">
                                {document.file_type
                                  ?.split("/")
                                  .pop()
                                  ?.toUpperCase() || "DOC"}
                              </span>
                              <span>·</span>
                              <span>{formatDate(document.created_at)}</span>
                            </div>

                            {!ready && document.status === "processing" && (
                              <div className="mt-1.5 h-0.5 rounded-full bg-white/[0.06] overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${Math.min(
                                      96,
                                      Number(document.progress) || 8
                                    )}%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <FiChevronRight
                            className={`shrink-0 mt-2.5 w-3 h-3 transition ${
                              active
                                ? "text-violet-300"
                                : "text-white/10 group-hover:text-white/25"
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer note */}
            <div className="px-4 py-3 border-t border-white/[0.05] bg-white/[0.01]">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-white/20">
                <FiClock className="w-3 h-3" />
                Persistent
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-white/25">
                Documents & chats stay available across sessions.
              </p>
            </div>
          </motion.aside>

          {/* ─── Main content column ─── */}
          <div className="min-w-0 space-y-4">
            {/* Upload workspace */}
            <DocumentWorkspace
              selectedFile={selectedFile}
              uploading={uploading}
              uploadMessage={uploadMessage}
              isDragging={isDragging}
              documentId={documentId}
              uploadedDocument={{
                ...uploadedDocument,
                progress: displayProgress,
              }}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleUpload={handleUpload}
              removeFile={removeFile}
            />

            {/* Restoring indicator */}
            <AnimatePresence>
              {selectingDocument && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-violet-400/15 bg-violet-500/[0.06]"
                >
                  <FiLoader className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                  <span className="text-xs text-white/40">
                    Restoring conversation…
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats strip – only when a document is active */}
            {uploadedDocument && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2"
              >
                {[
                  {
                    icon: FiFileText,
                    label: "Document",
                    value: formatFileName(uploadedDocument.originalName),
                  },
                  {
                    icon: FiDatabase,
                    label: "Chunks",
                    value:
                      uploadedDocument.chunks ||
                      uploadedDocument.totalChunks ||
                      0,
                  },
                  {
                    icon: FiMessageCircle,
                    label: "Messages",
                    value: chatMessages.length,
                  },
                  {
                    icon: isReady ? FiCheckCircle : FiLoader,
                    label: "Status",
                    value: isReady
                      ? "Ready"
                      : processing
                      ? `${displayProgress}%`
                      : uploadedDocument.status || "Processing",
                    spin: !isReady,
                    accent: isReady,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-3"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/25">
                      <stat.icon
                        className={`w-3 h-3 ${
                          stat.accent
                            ? "text-emerald-400/80"
                            : stat.spin
                            ? "text-violet-400 animate-spin"
                            : ""
                        }`}
                      />
                      {stat.label}
                    </div>
                    <p className="mt-1.5 text-sm text-white/65 truncate">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Chat */}
            <StudyMateChat
              documentId={documentId}
              uploadedDocument={uploadedDocument}
              question={question}
              setQuestion={setQuestion}
              answer={answer}
              sources={sources}
              asking={asking}
              askMessage={askMessage}
              handleAsk={handleAsk}
              chatSessionId={chatSessionId}
              chatMessages={chatMessages}
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-10">
          <StudyMateFeatures />
        </div>

        {/* Footer status */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mt-8 pb-4"
        >
          <div className="flex items-center gap-2 text-[13px] text-white/25 tracking-wide text-center">
            {isReady ? (
              <>
                <FiCheckCircle className="text-emerald-400/55 w-4 h-4" />
                Knowledge base ready — ask anything about your document.
              </>
            ) : documentId ? (
              <>
                <FiLoader className="text-violet-400/55 w-4 h-4 animate-spin" />
                Preparing your document for AI…
              </>
            ) : (
              <>
                <FiMessageCircle className="text-violet-400/45 w-4 h-4" />
                General AI is live. Upload a document anytime for grounded
                answers.
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default StudyMate;