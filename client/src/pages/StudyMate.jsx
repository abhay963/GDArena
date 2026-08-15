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
 
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import DocumentWorkspace from "../components/DocumentWorkspace";
import StudyMateChat from "../components/StudyMateChat";
import StudyMateFeatures from "../components/StudyMateFeatures";
import api from "../services/api";

const ease = [0.22, 1, 0.36, 1];

function AmbientParticles() {
  const particles = Array.from(
    { length: 18 },
    (_, index) => ({
      id: index,
      left: `${(index * 37) % 100}%`,
      top: `${(index * 61) % 100}%`,
      delay: (index % 6) * 0.7,
      duration: 5 + (index % 5),
    })
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute w-[2px] h-[2px] rounded-full bg-violet-300/20"
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

function StudyMate() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const progressTimerRef = useRef(null);

  const [user, setUser] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [documentId, setDocumentId] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [displayProgress, setDisplayProgress] = useState(0);

  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [selectingDocument, setSelectingDocument] = useState(false);

  const [chatSessionId, setChatSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [asking, setAsking] = useState(false);
  const [askMessage, setAskMessage] = useState("");

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  const loadDocuments = async (uid) => {
    if (!uid) return;

    try {
      setLoadingDocuments(true);

      const response = await api.get(
        `/api/chats/documents?userId=${encodeURIComponent(uid)}`
      );

      setDocuments(
        response.data.documents || []
      );
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

  const loadChatForDocument = async (
    uid,
    selectedDocumentId
  ) => {
    if (!uid || !selectedDocumentId) {
      return;
    }

    try {
      setSelectingDocument(true);
      setAskMessage("");

      const chatResponse =
        await api.get(
          `/api/chats/document?userId=${encodeURIComponent(
            uid
          )}&documentId=${encodeURIComponent(
            selectedDocumentId
          )}`
        );

      let chat =
        chatResponse.data.chat;

      if (!chat) {
        const createResponse =
          await api.post(
            "/api/chats",
            {
              userId: uid,
              documentId:
                selectedDocumentId,
            }
          );

        chat =
          createResponse.data.chat;
      }

      setChatSessionId(chat.id);

      const messagesResponse =
        await api.get(
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

  const selectDocument = async (
    document
  ) => {
    if (!user?.uid || !document?.id) {
      return;
    }

    setDocumentId(document.id);

    setUploadedDocument({
      id: document.id,
      originalName:
        document.file_name ||
        document.originalName,
      fileType:
        document.file_type ||
        document.fileType,
      status:
        document.status,
      processingStage:
        document.processing_stage ||
        document.processingStage,
      progress:
        document.progress || 0,
      chunks:
        document.total_chunks ||
        document.totalChunks ||
        0,
    });

    setDisplayProgress(
      document.progress || 0
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

  useEffect(() => {
    if (!documentId) {
      return;
    }

    let cancelled = false;

    const pollStatus = async () => {
      try {
        const response =
          await api.get(
            `/api/documents/status/${documentId}`
          );

        if (cancelled) {
          return;
        }

        const document =
          response.data.document;

        setUploadedDocument(
          (previous) => ({
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
              document.progress,
            chunks:
              document.totalChunks || 0,
            processedChunks:
              document.processedChunks || 0,
            errorMessage:
              document.errorMessage,
          })
        );

        if (
          document.status ===
            "completed" ||
          document.status === "failed"
        ) {
          return;
        }

        setTimeout(
          pollStatus,
          1800
        );
      } catch (error) {
        if (!cancelled) {
          setTimeout(
            pollStatus,
            2500
          );
        }
      }
    };

    pollStatus();

    return () => {
      cancelled = true;
    };
  }, [documentId]);

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
        setDisplayProgress(
          (current) => {
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
          }
        );
      }, 100);

    return () => {
      clearInterval(
        progressTimerRef.current
      );
    };
  }, [
    uploadedDocument?.progress,
  ]);

  const validateAndSetFile = (
    file
  ) => {
    if (!file) {
      return;
    }

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

    const maxSize =
      20 * 1024 * 1024;

    if (file.size > maxSize) {
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
        uploaded.progress || 0
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
            existing.progress || 0,
          chunks:
            existing.totalChunks || 0,
          processedChunks:
            existing.processedChunks ||
            0,
        });

        setDisplayProgress(
          existing.progress || 0
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

  const handleAsk = async () => {
    if (!documentId) {
      setAskMessage(
        "Please select or upload a document before asking a question."
      );
      return;
    }

    if (!question.trim()) {
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

    if (
      uploadedDocument?.status !==
      "completed"
    ) {
      setAskMessage(
        "Your document is still being prepared. You can ask questions once processing is complete."
      );
      return;
    }

    try {
      setAsking(true);
      setAskMessage("");

      const currentQuestion =
        question.trim();

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
        response.data.answer || "";

      const newUserMessage = {
        id: `local-user-${Date.now()}`,
        role: "user",
        content:
          currentQuestion,
        created_at:
          new Date().toISOString(),
      };

      const newAssistantMessage = {
        id: `local-assistant-${Date.now()}`,
        role: "assistant",
        content:
          generatedAnswer,
        created_at:
          new Date().toISOString(),
      };

      setChatMessages(
        (previous) => [
          ...previous,
          newUserMessage,
          newAssistantMessage,
        ]
      );

      setAnswer(
        generatedAnswer
      );

      setSources(
        response.data.sources || []
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
          chatResponse.data.chat.id;

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

  const formatFileName = (
    name
  ) => {
    if (!name) {
      return "Untitled document";
    }

    if (name.length <= 28) {
      return name;
    }

    return `${name.slice(
      0,
      25
    )}...`;
  };

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "";
    }

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

  return (
    <div className="relative min-h-screen bg-[#030305] text-white overflow-hidden selection:bg-violet-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[25%] -left-[10%] w-[700px] h-[700px] rounded-full bg-violet-600/[0.07] blur-[170px]" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[650px] h-[650px] rounded-full bg-cyan-500/[0.045] blur-[170px]" />
        <div className="absolute inset-0 opacity-[0.018] bg-[linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#030305_82%)]" />
      </div>

      <AmbientParticles />

      <Navbar
        user={user}
        streak={0}
        onLogout={handleLogout}
        onNavigateHome={() =>
          navigate("/hero")
        }
        activeProduct="studysync"
      />

      <main className="relative z-10 mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            ease,
          }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-violet-500/15 bg-violet-500/[0.04]">
            <FiBookOpen
            className="w-4 h-4 text-violet-400" />

            <span className="text-xs uppercase tracking-[0.2em] text-violet-400/80">
              AI document intelligence
            </span>
          </div>

          <h1 className="mt-7 text-4xl sm:text-5xl lg:text-[4.5rem] font-semibold tracking-[-0.065em] leading-[0.98]">
            <span className="text-white">
              Your knowledge.
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
              Understood.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-8 text-white/40">
            Upload your study material once. Keep it forever.
            Return anytime and continue the conversation with
            your own knowledge base.
          </p>
        </motion.section>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[310px_minmax(0,1fr)] gap-5 items-start">
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
              duration: 0.6,
              ease,
            }}
            className="rounded-[28px] border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl overflow-hidden lg:sticky lg:top-24"
          >
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Your library
                  </p>

                  <p className="text-xs text-white/30 mt-1">
                    {documents.length}{" "}
                    {documents.length === 1
                      ? "document"
                      : "documents"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setDocumentId(null);
                    setUploadedDocument(null);
                    setChatSessionId(null);
                    setChatMessages([]);
                    setAnswer("");
                    setSources([]);
                    setQuestion("");
                    setAskMessage("");
                    setSelectedFile(null);
                  }}
                  className="w-9 h-9 rounded-xl border border-violet-400/15 bg-violet-500/[0.08] flex items-center justify-center text-violet-300 hover:bg-violet-500/[0.14] transition"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className="p-3 max-h-[560px] overflow-y-auto">
              {loadingDocuments ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <FiLoader className="w-5 h-5 text-violet-400 animate-spin" />

                  <p className="mt-3 text-xs text-white/30">
                    Loading your library...
                  </p>
                </div>
              ) : documents.length === 0 ? (
                <div className="py-12 px-5 text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-500/[0.07] border border-violet-400/10 flex items-center justify-center">
                    <FiDatabase className="text-violet-300/70" />
                  </div>

                  <p className="mt-4 text-sm text-white/60">
                    Your library is empty
                  </p>

                  <p className="mt-2 text-xs leading-5 text-white/25">
                    Upload a document and it will
                    stay available here.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {documents.map((document) => {
                    const active =
                      document.id ===
                      documentId;

                    const ready =
                      document.status ===
                      "completed";

                    return (
                      <button
                        key={document.id}
                        onClick={() =>
                          selectDocument(
                            document
                          )
                        }
                        className={`w-full text-left p-3 rounded-2xl border transition-all ${
                          active
                            ? "border-violet-400/20 bg-violet-500/[0.09]"
                            : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                              active
                                ? "bg-violet-500/15 text-violet-300"
                                : "bg-white/[0.04] text-white/30"
                            }`}
                          >
                            <FiFileText />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <p className="text-sm text-white/75 truncate flex-1">
                                {formatFileName(
                                  document.file_name ||
                                    document.originalName
                                )}
                              </p>

                              {ready ? (
                                <FiCheckCircle className="shrink-0 mt-0.5 text-emerald-400/80 w-3.5 h-3.5" />
                              ) : (
                                <FiLoader className="shrink-0 mt-0.5 text-violet-400/70 w-3.5 h-3.5 animate-spin" />
                              )}
                            </div>

                            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-white/25">
                              <span>
                                {document.file_type
                                  ?.split("/")
                                  .pop()
                                  ?.toUpperCase() ||
                                  "DOC"}
                              </span>

                              <span>
                                •
                              </span>

                              <span>
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
                                        document.progress ||
                                          8
                                      )}%`,
                                    }}
                                  />
                                </div>
                              )}
                          </div>

                          <FiChevronRight
                            className={`shrink-0 mt-3 w-3.5 h-3.5 transition ${
                              active
                                ? "text-violet-300"
                                : "text-white/10"
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-white/20">
                <FiClock />
                Persistent knowledge
              </div>

              <p className="mt-2 text-xs leading-5 text-white/25">
                Your uploaded documents and chats remain
                available for future sessions.
              </p>
            </div>
          </motion.aside>

          <div className="min-w-0">
            <DocumentWorkspace
              selectedFile={selectedFile}
              uploading={uploading}
              uploadMessage={uploadMessage}
              isDragging={isDragging}
              documentId={documentId}
              uploadedDocument={{
                ...uploadedDocument,
                progress:
                  displayProgress,
              }}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleUpload={handleUpload}
              removeFile={removeFile}
            />

            <AnimatePresence>
              {selectingDocument && (
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
                    y: 8,
                  }}
                  className="mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl border border-violet-400/10 bg-violet-500/[0.045]"
                >
                  <FiLoader className="w-4 h-4 text-violet-400 animate-spin" />

                  <span className="text-xs text-white/40">
                    Restoring your conversation...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {uploadedDocument && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/25">
                    <FiFileText />
                    Document
                  </div>

                  <p className="mt-2 text-sm text-white/65 truncate">
                    {formatFileName(
                      uploadedDocument.originalName
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/25">
                    <FiDatabase />
                    Chunks
                  </div>

                  <p className="mt-2 text-sm text-white/65">
                    {uploadedDocument.chunks ||
                      uploadedDocument.totalChunks ||
                      0}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/25">
                    <FiMessageCircle />
                    Messages
                  </div>

                  <p className="mt-2 text-sm text-white/65">
                    {chatMessages.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/25">
                    {isReady ? (
                      <FiCheckCircle className="text-emerald-400/80" />
                    ) : (
                      <FiLoader className="text-violet-400 animate-spin" />
                    )}
                    Status
                  </div>

                  <p className="mt-2 text-sm text-white/65">
                    {isReady
                      ? "Ready"
                      : processing
                      ? `${displayProgress}%`
                      : uploadedDocument.status ||
                        "Processing"}
                  </p>
                </div>
              </motion.div>
            )}

            <div className="mt-6">
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
                chatSessionId={
                  chatSessionId
                }
                chatMessages={
                  chatMessages
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <StudyMateFeatures />
        </div>

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
            duration: 0.6,
          }}
          className="flex items-center justify-center mt-10 pb-4"
        >
          <div className="flex items-center gap-2 text-sm text-white/25 tracking-wide text-center">
            {isReady ? (
              <>
                <FiCheckCircle className="text-emerald-400/60" />
                Your knowledge base is ready. Ask anything.
              </>
            ) : documentId ? (
              <>
                <FiLoader className="text-violet-400/60 animate-spin" />
                Preparing your document for AI...
              </>
            ) : (
              "Upload your material to unlock document-grounded learning"
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default StudyMate;