<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=42&duration=2500&pause=1000&color=6366F1&center=true&vCenter=true&width=800&height=80&lines=GD+ARENA;AI-Powered+Interview+Preparation;Practice.+Learn.+Analyze.+Improve." alt="GD Arena" />

<br/>

<h3>🎯 Your AI-Powered Interview Preparation Arena</h3>

<p>
Practice Group Discussions with AI.
<br/>
Learn from your PDFs with RAG.
<br/>
Track your performance and improve every day.
</p>

<br/>

<a href="https://gd-arena-cgh4.vercel.app/">
<img src="https://img.shields.io/badge/🚀%20LIVE%20DEMO-6366F1?style=for-the-badge" />
</a>
<a href="https://github.com/abhay963/GD-ARENA-frontend">
<img src="https://img.shields.io/badge/Frontend-GitHub-181717?style=for-the-badge&logo=github" />
</a>

<br/><br/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-API-000000?style=flat-square&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
<img src="https://img.shields.io/badge/Groq-AI-F55036?style=flat-square" />
<img src="https://img.shields.io/badge/LangChain-RAG-1C3C3C?style=flat-square" />
<img src="https://img.shields.io/badge/pgvector-Vector%20Search-336791?style=flat-square" />

</div>

---

# 🧠 What is GD Arena?

**GD Arena** is an AI-powered interview preparation platform built to help students prepare for the two sides of technical and placement preparation:

> 🗣️ **Communicate better**
> 📚 **Learn smarter**

Instead of being just another chatbot, GD Arena combines **AI Group Discussions, real-time voice interaction, performance analytics, streak tracking, and an AI-powered PDF study assistant** into one platform.

```text
                         ┌─────────────────────┐
                         │      GD ARENA        │
                         │ AI Interview Prep    │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┴──────────────────┐
                 │                                     │
                 ▼                                     ▼
        ┌──────────────────┐                  ┌──────────────────┐
        │    🗣️ GD Arena   │                  │   📚 StudyMate   │
        │                  │                  │                  │
        │ AI Group         │                  │ PDF → RAG → AI   │
        │ Discussions      │                  │                  │
        └────────┬─────────┘                  └────────┬─────────┘
                 │                                     │
                 ▼                                     ▼
          Communication                         Knowledge
            Practice                             Assistant
                 │                                     │
                 └──────────────────┬──────────────────┘
                                    ▼
                           📈 Better Preparation
```

---

# ✨ The Platform

<div align="center">

|      🗣️ GD Arena     |      📚 StudyMate     |   📈 Performance  |
| :-------------------: | :-------------------: | :---------------: |
|  AI Group Discussions | PDF-based AI Learning | Track Improvement |
| Real-Time Interaction |  RAG-powered Answers  | Session Analytics |
|    AI Participants    |    Semantic Search    |   Daily Streaks   |

</div>

---

# 🗣️ GD Arena

### Practice Group Discussions without needing a group.

GD Arena creates an interactive discussion environment where users can participate in AI-powered group discussions.

### Features

* 🤖 AI-powered discussion participants
* 🎙️ Voice-based interaction
* ⚡ Real-time conversation
* 🧠 Context-aware AI responses
* 💬 Multi-participant discussion
* 📊 Performance analysis
* 📜 Discussion history
* 🔥 Daily practice streaks

### Discussion Flow

```text
             👤 USER
               │
               ▼
        🎙️ Speak / Type
               │
               ▼
      ┌─────────────────┐
      │ Speech / Message│
      │    Processing   │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │    Express API  │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │    Groq LLM     │
      │  AI Discussion  │
      └────────┬────────┘
               │
               ▼
       🤖 AI Participants
               │
               ▼
        💬 Next Response
               │
               └───────────────┐
                               │
                               ▼
                         🔄 Discussion
```

---

# 🎙️ Real-Time Voice Pipeline

GD Arena is designed around a streaming voice architecture instead of relying entirely on browser-native speech recognition.

```text
🎤 Microphone
      │
      ▼
 MediaRecorder
      │
      ▼
 WebSocket
      │
      ▼
 Node.js Server
      │
      ▼
 Deepgram Streaming STT
      │
      ├──────────────► Interim Transcript
      │
      └──────────────► Final Transcript
                              │
                              ▼
                       GD Discussion Engine
                              │
                              ▼
                           Groq AI
                              │
                              ▼
                        🤖 AI Response
```

This allows the conversation pipeline to support continuous speech processing and a more natural discussion experience.

---

# 📚 StudyMate

## Your PDFs. Your Knowledge Base. Your AI Tutor.

**StudyMate** is the knowledge-learning side of GD Arena.

Upload a PDF and turn it into an interactive AI-powered study assistant.

Instead of sending the entire document to an LLM every time, StudyMate uses a **Retrieval-Augmented Generation (RAG)** pipeline.

```text
                 📄 PDF
                   │
                   ▼
            Text Extraction
                   │
                   ▼
              Chunking
                   │
                   ▼
         Gemini Embeddings
                   │
                   ▼
          Vector Embeddings
                   │
                   ▼
             PostgreSQL
             + pgvector
                   │
                   ▼
             🔎 Similarity
               Search
                   │
                   ▼
           Relevant Chunks
                   │
                   ▼
              LangChain
                   │
                   ▼
                LLM
                   │
                   ▼
            🤖 StudyMate
                   │
                   ▼
            📖 Answer
```

---

# 🧠 StudyMate RAG Architecture

The RAG pipeline is built around four major stages:

### 01 — Ingestion

```text
PDF
 ↓
Multer Upload
 ↓
PDF Text Extraction
```

### 02 — Processing

```text
Extracted Text
 ↓
Document Splitting
 ↓
Semantic Chunks
```

### 03 — Embedding & Storage

```text
Chunks
 ↓
Gemini Embedding Model
 ↓
Vector Embeddings
 ↓
PostgreSQL + pgvector
```

### 04 — Retrieval & Generation

```text
User Question
 ↓
Question Embedding
 ↓
Vector Similarity Search
 ↓
Top Relevant Chunks
 ↓
LangChain Retrieval Pipeline
 ↓
LLM
 ↓
Grounded Answer
```

---

# 🔍 Why RAG?

Without RAG:

```text
PDF
 │
 ▼
Send entire document
 │
 ▼
LLM
 │
 ▼
💸 More tokens
🐌 Larger context
🎯 Less focused retrieval
```

With StudyMate:

```text
PDF
 │
 ▼
Chunk + Embed
 │
 ▼
Vector Database
 │
 ▼
User Question
 │
 ▼
Retrieve relevant chunks
 │
 ▼
LLM
 │
 ▼
🎯 Focused answer
```

The system retrieves only the most relevant information before generating the answer.

---

# 🗄️ Vector Database

StudyMate uses:

**PostgreSQL + pgvector**

for storing and searching document embeddings.

```text
┌──────────────────────────────────────────────┐
│                  PostgreSQL                  │
│                                              │
│  Document                                    │
│  ├── id                                      │
│  ├── filename                                │
│  ├── metadata                                │
│  └── content                                 │
│                                              │
│  Embedding                                   │
│  ├── chunk                                    │
│  ├── vector                                   │
│  └── metadata                                │
│                                              │
│                 pgvector                     │
│        🔎 Similarity Search                  │
└──────────────────────────────────────────────┘
```

This allows the application to use relational database capabilities together with vector similarity search.

---

# 🔗 LangChain Pipeline

StudyMate uses LangChain to orchestrate the retrieval and generation workflow.

```text
                    User Query
                        │
                        ▼
                ┌───────────────┐
                │    LangChain  │
                └───────┬───────┘
                        │
                        ▼
                 Query Embedding
                        │
                        ▼
                ┌───────────────┐
                │   pgvector    │
                │ Vector Search  │
                └───────┬───────┘
                        │
                        ▼
                Relevant Documents
                        │
                        ▼
                Context Assembly
                        │
                        ▼
                       LLM
                        │
                        ▼
                  StudyMate 🤖
```

---

# 🧩 Technology Architecture

```text
                         ┌───────────────────────┐
                         │       React App       │
                         │                       │
                         │  GD Arena | StudyMate │
                         └───────────┬───────────┘
                                     │
                              REST / WebSocket
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │    Node.js / Express  │
                         │                       │
                         │  Controllers          │
                         │  Routes               │
                         │  Services             │
                         │  Middleware           │
                         └───────────┬───────────┘
                                     │
               ┌─────────────────────┼─────────────────────┐
               │                     │                     │
               ▼                     ▼                     ▼
        ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
        │   Groq AI   │       │ LangChain   │       │  Firebase   │
        │     LLM     │       │    RAG      │       │    Auth     │
        └─────────────┘       └──────┬──────┘       └─────────────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │ PostgreSQL  │
                              │  + pgvector │
                              │   NeonDB    │
                              └─────────────┘
```

---

# 🛠️ Tech Stack

<div align="center">

### Frontend

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,js,html,css,framer" />

### Backend

<img src="https://skillicons.dev/icons?i=nodejs,express,js" />

### AI / RAG

<img src="https://skillicons.dev/icons?i=python" />

<br/><br/>

<img src="https://img.shields.io/badge/Groq-LLM-F55036?style=for-the-badge" />
<img src="https://img.shields.io/badge/LangChain-RAG-1C3C3C?style=for-the-badge" />
<img src="https://img.shields.io/badge/Gemini-Embeddings-4285F4?style=for-the-badge" />
<img src="https://img.shields.io/badge/pgvector-Vector%20Search-336791?style=for-the-badge" />

### Database & Authentication

<img src="https://skillicons.dev/icons?i=postgresql,firebase" />

### Deployment

<img src="https://skillicons.dev/icons?i=vercel" />

<img src="https://img.shields.io/badge/Railway-Backend-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" />
<img src="https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge" />

</div>

---

# 📦 Core Technologies

| Layer                | Technology    | Purpose             |
| -------------------- | ------------- | ------------------- |
| 🎨 Frontend          | React         | Application UI      |
| ⚡ Build              | Vite          | Frontend tooling    |
| 🎭 UI                | Tailwind CSS  | Styling             |
| ✨ Animation          | Framer Motion | UI interactions     |
| 🧠 AI                | Groq          | GD conversations    |
| 🧠 LLM Orchestration | LangChain     | RAG pipeline        |
| 📐 Embeddings        | Gemini        | Document vectors    |
| 🔎 Vector Search     | pgvector      | Semantic retrieval  |
| 🗄️ Database         | PostgreSQL    | Persistent data     |
| ☁️ Database Hosting  | NeonDB        | Managed PostgreSQL  |
| 🔐 Authentication    | Firebase      | User authentication |
| 🎙️ Speech           | Deepgram      | Streaming STT       |
| 🔌 API               | Express.js    | Backend APIs        |
| 🚂 Backend Hosting   | Railway       | Server deployment   |
| ▲ Frontend Hosting   | Vercel        | Frontend deployment |

---

# 📊 Performance Analytics

Every GD session can become data for improvement.

```text
                 GD SESSION
                     │
                     ▼
                Transcript
                     │
                     ▼
             Analysis Service
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      Messages      Words      Score
          │          │          │
          └──────────┼──────────┘
                     ▼
              Performance DB
                     │
                     ▼
             📊 Dashboard
```

### Tracked Metrics

```text
📌 Total Sessions
📌 Total Messages
📌 Total Words
📌 Average Performance
📌 Best Performance
📌 Improvement
📌 Practice Streak
```

---

# 🔥 Streak System

Consistency > last-minute preparation.

```text
       ┌───────────────┐
       │   Practice    │
       │      GD       │
       └───────┬───────┘
               │
               ▼
       Session Completed
               │
               ▼
        Streak Updated
               │
               ▼
          🔥 +1 Day
               │
               ▼
        Keep Practicing
```

---

# 🔐 Authentication

GD Arena uses **Firebase Authentication** for identity management.

```text
              👤 USER
                 │
                 ▼
        Firebase Authentication
                 │
                 ▼
            ID Token
                 │
                 ▼
          Express Backend
                 │
                 ▼
        Protected API Routes
                 │
                 ▼
             Services
```

Authentication is separated from application business logic so that protected backend operations can validate authenticated requests independently.

---

# 🌐 Deployment Architecture

```text
                        🌍 INTERNET
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
             ▲ Vercel                 🚂 Railway
             Frontend                  Backend
                 │                       │
                 │        REST           │
                 └───────────────────────┘
                                         │
                         ┌───────────────┼───────────────┐
                         │               │               │
                         ▼               ▼               ▼
                    Firebase          Groq          NeonDB
                      Auth             AI          PostgreSQL
                                                         │
                                                         ▼
                                                      pgvector
```

---

# 📂 Project Structure

```text
GD-Arena/
│
├── client/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── Auth/
│       │   ├── ProtectedRoute/
│       │   ├── VerifyEmail/
│       │   └── ...
│       │
│       ├── pages/
│       │   ├── Landing/
│       │   ├── Hero/
│       │   ├── StudyMate/
│       │   ├── Performance/
│       │   └── ...
│       │
│       ├── services/
│       │   ├── gd.service.js
│       │   └── ...
│       │
│       ├── hooks/
│       ├── firebase/
│       ├── routes/
│       ├── App.jsx
│       └── main.jsx
│
│
└── server/
    │
    ├── controllers/
    │
    ├── routes/
    │
    ├── services/
    │   ├── AI/
    │   ├── RAG/
    │   ├── Embeddings/
    │   └── ...
    │
    ├── middleware/
    │
    ├── config/
    │
    ├── db/
    │
    ├── uploads/
    │
    ├── utils/
    │
    └── server.js
```

---

# 🔬 RAG vs Traditional Chat

### Traditional Chat

```text
User
 │
 ▼
LLM
 │
 ▼
Generic Answer
```

### StudyMate

```text
                 User
                  │
                  ▼
              Question
                  │
                  ▼
            Query Embedding
                  │
                  ▼
          ┌─────────────────┐
          │    pgvector     │
          │ Semantic Search │
          └────────┬────────┘
                   │
                   ▼
            Relevant Context
                   │
                   ▼
              LangChain
                   │
                   ▼
                  LLM
                   │
                   ▼
          📚 Grounded Answer
```

---

# 🎯 Product Vision

GD Arena is built around one idea:

> **Interview preparation should be interactive, personalized, and measurable.**

The platform brings together:

```text
          📚 LEARN
             │
             ▼
        ┌───────────┐
        │ StudyMate │
        └─────┬─────┘
              │
              ▼
          🧠 KNOWLEDGE
              │
              ▼
          🗣️ PRACTICE
              │
              ▼
        ┌───────────┐
        │ GD Arena  │
        └─────┬─────┘
              │
              ▼
        📊 ANALYZE
              │
              ▼
        📈 IMPROVE
              │
              └───────────────┐
                              │
                              ▼
                         🔄 REPEAT
```

---

# 🚀 Roadmap

### 🗣️ GD Arena

* [x] AI-powered GD
* [x] Firebase Authentication
* [x] Performance analytics
* [x] Streak tracking
* [x] Discussion history
* [x] Voice interaction pipeline
* [x] Streaming speech recognition
* [ ] Advanced communication scoring
* [ ] Filler-word analysis
* [ ] Speaking pace analysis
* [ ] AI participant personalities
* [ ] Difficulty levels
* [ ] Personalized GD recommendations

### 📚 StudyMate

* [x] PDF upload
* [x] PDF text extraction
* [x] Document chunking
* [x] Gemini embeddings
* [x] PostgreSQL vector storage
* [x] pgvector similarity search
* [x] LangChain RAG pipeline
* [x] LLM-powered answers
* [ ] Multi-document knowledge bases
* [ ] Source citations
* [ ] Document summarization
* [ ] Quiz generation
* [ ] Flashcard generation
* [ ] Personalized study plans

---

# 🧪 Engineering Highlights

### ⚙️ Full-Stack Architecture

```text
React
  ↓
REST / WebSocket
  ↓
Node + Express
  ↓
Services
  ↓
AI / RAG / Database
```

### 🧠 AI Architecture

```text
Groq
 └── Real-time GD conversations

LangChain
 └── RAG orchestration

Gemini
 └── Document embeddings

pgvector
 └── Semantic retrieval
```

### 📡 Real-Time Architecture

```text
Browser
  ↓
MediaRecorder
  ↓
WebSocket
  ↓
Node.js
  ↓
Deepgram
  ↓
Transcript
  ↓
GD Engine
```

---

# 🛡️ Security

GD Arena follows a backend-first approach for sensitive operations.

* 🔐 Firebase authentication
* 🛡️ Protected backend routes
* 🔑 Environment-based secrets
* 🚫 No API secrets in frontend code
* 🌐 Configurable CORS
* 🗄️ Server-side database access
* 🔒 Authenticated API communication

---

# ⚡ Getting Started

## Clone

```bash
git clone https://github.com/abhay963/GD-ARENA-frontend.git
cd GD-ARENA-frontend
```

## Install

```bash
npm install
```

## Configure Environment

Create your environment files and configure:

```text
Firebase
Groq
Gemini
Deepgram
NeonDB
Backend API
```

Never commit production secrets.

## Run

```bash
npm run dev
```

---

# 🌍 Live

<div align="center">

<a href="https://gd-arena-cgh4.vercel.app/">

<img src="https://img.shields.io/badge/🚀%20OPEN%20GD%20ARENA-6366F1?style=for-the-badge&logo=vercel&logoColor=white" />

</a>

<br/><br/>

<a href="https://gd-arena-cgh4.vercel.app/">
https://gd-arena-cgh4.vercel.app/
</a>

</div>

---

# 📸 Architecture

<div align="center">

<img src="https://raw.githubusercontent.com/abhay963/GDArena/main/client/src/assets/er.png" width="1000" alt="GD Arena Architecture Diagram" />

</div>

---

# 👨‍💻 Built By

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=Abhay+Kumar+Yadav;Full-Stack+Developer;AI+%26+Backend+Enthusiast" />

<br/>

<a href="https://github.com/abhay963">
<img src="https://img.shields.io/badge/GitHub-Abhay963-181717?style=for-the-badge&logo=github" />
</a>

<a href="https://www.linkedin.com/in/abhay9631">
<img src="https://img.shields.io/badge/LinkedIn-Abhay%20Kumar%20Yadav-0A66C2?style=for-the-badge&logo=linkedin" />
</a>

</div>

---

# ⭐ Support

If GD Arena helped you or you find the project interesting:

**⭐ Star the repository**

**🍴 Fork it**

**🐛 Open an issue**

**💡 Share feedback**

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=6366F1&height=120&section=footer" />

<h3>GD Arena</h3>

<p>
<b>Practice Smarter • Learn Faster • Perform Better</b>
</p>

<p>
Built with ❤️ using React, Node.js, PostgreSQL & AI
</p>

</div>
