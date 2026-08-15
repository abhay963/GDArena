import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  FiBookOpen,
} from "react-icons/fi";

import Navbar from "../components/Navbar";

import DocumentWorkspace from "../components/DocumentWorkspace";
import StudyMateChat from "../components/StudyMateChat";
import StudyMateFeatures from "../components/StudyMateFeatures";

import api from "../services/api";


// =========================================================
// ANIMATION
// =========================================================

const ease = [0.22, 1, 0.36, 1];


// =========================================================
// AMBIENT PARTICLES
// =========================================================

function AmbientParticles() {

  const particles = Array.from(
    { length: 18 },
    (_, index) => ({
      id: index,

      left:
        `${(index * 37) % 100}%`,

      top:
        `${(index * 61) % 100}%`,

      delay:
        (index % 6) * 0.7,

      duration:
        5 + (index % 5),
    })
  );


  return (
    <div
      className="
        fixed
        inset-0
        pointer-events-none
        overflow-hidden
        z-0
      "
    >

      {particles.map((particle) => (

        <motion.span
          key={particle.id}
          className="
            absolute
            w-[2px]
            h-[2px]
            rounded-full
            bg-violet-300/20
          "
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            opacity: [
              0,
              0.35,
              0,
            ],

            y: [
              0,
              -25,
              0,
            ],
          }}
          transition={{
            duration:
              particle.duration,

            delay:
              particle.delay,

            repeat:
              Infinity,

            ease:
              "easeInOut",
          }}
        />

      ))}

    </div>
  );
}


// =========================================================
// STUDYMATE
// =========================================================

function StudyMate() {

  const navigate = useNavigate();

  const fileInputRef =
    useRef(null);


  // =======================================================
  // AUTH
  // =======================================================

  const [user, setUser] =
    useState(null);


  const auth =
    getAuth();


  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
        }
      );


    return () =>
      unsubscribe();

  }, [auth]);


  // =======================================================
  // FILE STATE
  // =======================================================

  const [selectedFile, setSelectedFile] =
    useState(null);


  const [uploading, setUploading] =
    useState(false);


  const [uploadMessage, setUploadMessage] =
    useState("");


  const [isDragging, setIsDragging] =
    useState(false);


  // =======================================================
  // DOCUMENT STATE
  // =======================================================

  const [documentId, setDocumentId] =
    useState(null);


  const [uploadedDocument, setUploadedDocument] =
    useState(null);


  // =======================================================
  // RAG / CHAT STATE
  // =======================================================

  const [question, setQuestion] =
    useState("");


  const [answer, setAnswer] =
    useState("");


  const [sources, setSources] =
    useState([]);


  const [asking, setAsking] =
    useState(false);


  const [askMessage, setAskMessage] =
    useState("");


  // =======================================================
  // FILE VALIDATION
  // =======================================================

  const validateAndSetFile = (file) => {

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


    // -----------------------------------------------------
    // FILE TYPE
    // -----------------------------------------------------

    if (
      !extension ||
      !allowedTypes.includes(extension)
    ) {

      setUploadMessage(
        "Unsupported file type. Please upload PDF, PPT, PPTX, or TXT."
      );

      return;
    }


    // -----------------------------------------------------
    // FILE SIZE
    // -----------------------------------------------------

    const maxSize =
      20 * 1024 * 1024;


    if (file.size > maxSize) {

      setUploadMessage(
        "File is too large. Maximum size is 20 MB."
      );

      return;
    }


    // -----------------------------------------------------
    // ACCEPT FILE
    // -----------------------------------------------------

    setSelectedFile(file);

    setUploadMessage("");


    // -----------------------------------------------------
    // RESET PREVIOUS RAG SESSION
    // -----------------------------------------------------

    setDocumentId(null);

    setUploadedDocument(null);

    setQuestion("");

    setAnswer("");

    setSources([]);

    setAskMessage("");
  };


  // =======================================================
  // FILE INPUT
  // =======================================================

  const handleFileChange = (event) => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    validateAndSetFile(file);
  };


  // =======================================================
  // DRAG OVER
  // =======================================================

  const handleDragOver = (event) => {

    event.preventDefault();

    setIsDragging(true);
  };


  // =======================================================
  // DRAG LEAVE
  // =======================================================

  const handleDragLeave = (event) => {

    event.preventDefault();

    setIsDragging(false);
  };


  // =======================================================
  // DROP
  // =======================================================

  const handleDrop = (event) => {

    event.preventDefault();

    setIsDragging(false);


    const file =
      event.dataTransfer.files?.[0];


    if (!file) {
      return;
    }


    validateAndSetFile(file);
  };


  // =======================================================
  // REMOVE SELECTED FILE
  // =======================================================

  const removeFile = () => {

    setSelectedFile(null);

    setUploadMessage("");


    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";
    }
  };


  // =======================================================
  // UPLOAD DOCUMENT
  // =======================================================

  const handleUpload = async () => {

    // -----------------------------------------------------
    // VALIDATE FILE
    // -----------------------------------------------------

    if (!selectedFile) {

      setUploadMessage(
        "Please select a document first."
      );

      return;
    }


    try {

      setUploading(true);

      setUploadMessage("");


      // ---------------------------------------------------
      // RESET PREVIOUS ANSWER
      // ---------------------------------------------------

      setAnswer("");

      setSources([]);

      setAskMessage("");

      setQuestion("");


      // ---------------------------------------------------
      // CREATE FORM DATA
      // ---------------------------------------------------

      const formData =
        new FormData();


      formData.append(
        "document",
        selectedFile
      );


      // ---------------------------------------------------
      // CURRENT BACKEND USER ID
      // ---------------------------------------------------

      if (user?.uid) {

        formData.append(
          "userId",
          user.uid
        );
      }


      // ---------------------------------------------------
      // UPLOAD
      // ---------------------------------------------------

      const response =
        await api.post(
          "/api/documents/upload",
          formData
        );


      console.log(
        "Uploaded document:",
        response.data.document
      );


      // ---------------------------------------------------
      // STORE DOCUMENT
      // ---------------------------------------------------

      const uploaded =
        response.data.document;


      setDocumentId(
        uploaded.id
      );


      setUploadedDocument(
        uploaded
      );


      setUploadMessage(
        response.data.message ||
          "Document uploaded successfully. You can now ask questions."
      );


      // ---------------------------------------------------
      // CLEAR FILE SELECTION
      // ---------------------------------------------------

      setSelectedFile(null);


      if (fileInputRef.current) {

        fileInputRef.current.value =
          "";
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


      setDocumentId(null);

      setUploadedDocument(null);

    } finally {

      setUploading(false);
    }
  };


  // =======================================================
  // ASK STUDYMATE
  // =======================================================

  const handleAsk = async () => {

    // -----------------------------------------------------
    // DOCUMENT REQUIRED
    // -----------------------------------------------------

    if (!documentId) {

      setAskMessage(
        "Please upload a document before asking a question."
      );

      return;
    }


    // -----------------------------------------------------
    // QUESTION REQUIRED
    // -----------------------------------------------------

    if (!question.trim()) {

      setAskMessage(
        "Please enter a question."
      );

      return;
    }


    try {

      setAsking(true);

      setAskMessage("");


      // ---------------------------------------------------
      // ASK BACKEND
      // ---------------------------------------------------

      const response =
        await api.post(
          "/api/documents/ask",
          {
            documentId,

            question:
              question.trim(),
          }
        );


      console.log(
        "StudyMate response:",
        response.data
      );


      // ---------------------------------------------------
      // STORE ANSWER
      // ---------------------------------------------------

      setAnswer(
        response.data.answer ||
          ""
      );


      // ---------------------------------------------------
      // STORE SOURCES
      // ---------------------------------------------------

      setSources(
        response.data.sources ||
          []
      );

    } catch (error) {

      console.error(
        "StudyMate question failed:",
        error
      );


      setAskMessage(
        error.response?.data?.message ||
          "Failed to generate an answer."
      );

    } finally {

      setAsking(false);
    }
  };


  // =======================================================
  // LOGOUT
  // =======================================================

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


  // =======================================================
  // UI
  // =======================================================

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

      {/* =================================================
          BACKGROUND
      ================================================== */}

      <div
        className="
          fixed
          inset-0
          pointer-events-none
          overflow-hidden
        "
      >

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
            -right-[10%]
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


      {/* Ambient particles */}

      <AmbientParticles />


      {/* =================================================
          NAVBAR
      ================================================== */}

      <Navbar
        user={user}
        streak={0}
        onLogout={handleLogout}
        onNavigateHome={() =>
          navigate("/hero")
        }
        activeProduct="studysync"
      />


      {/* =================================================
          MAIN
      ================================================== */}

      <main
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-5
          sm:px-8
          py-12
          sm:py-16
        "
      >

        {/* =================================================
            HERO
        ================================================== */}

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
          className="
            text-center
            max-w-4xl
            mx-auto
          "
        >

          {/* Label */}

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

            <FiBookOpen
              className="
                w-4
                h-4
                text-violet-400
              "
            />

            <span
              className="
                text-xs
                uppercase
                tracking-[0.2em]
                text-violet-400/80
              "
            >
              AI document intelligence
            </span>

          </div>


          {/* Heading */}

          <h1
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

          </h1>


          {/* Description */}

          <p
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
          </p>

        </motion.section>


        {/* =================================================
            DOCUMENT WORKSPACE
        ================================================== */}

        <DocumentWorkspace
          selectedFile={selectedFile}

          uploading={uploading}

          uploadMessage={uploadMessage}

          isDragging={isDragging}

          documentId={documentId}

          uploadedDocument={uploadedDocument}

          fileInputRef={fileInputRef}

          handleFileChange={handleFileChange}

          handleDragOver={handleDragOver}

          handleDragLeave={handleDragLeave}

          handleDrop={handleDrop}

          handleUpload={handleUpload}

          removeFile={removeFile}
        />


        {/* =================================================
            STUDYMATE CHAT
        ================================================== */}

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
        />


        {/* =================================================
            FEATURES
        ================================================== */}

        <StudyMateFeatures />


        {/* =================================================
            FOOTER MESSAGE
        ================================================== */}

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
          className="
            flex
            items-center
            justify-center
            mt-10
            pb-4
          "
        >

          <p
            className="
              text-sm
              text-white/25
              tracking-wide
              text-center
            "
          >

            {documentId
              ? "Your document is ready. Ask anything about it."
              : "Upload your material to unlock document-grounded learning"}

          </p>

        </motion.div>

      </main>

    </div>
  );
}


export default StudyMate;