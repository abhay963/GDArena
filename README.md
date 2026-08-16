<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=800&size=38&duration=2800&pause=900&color=6366F1&center=true&vCenter=true&width=850&height=70&lines=GD+ARENA;AI-Powered+Interview+Preparation;Practice+%7C+Learn+%7C+Analyze+%7C+Improve" alt="GD Arena" />

<br/>

<p>
  <b>One platform for Group Discussion practice + AI-powered learning.</b>
</p>

<br/>

<a href="https://gd-arena-cgh4.vercel.app/">
<img src="https://img.shields.io/badge/🚀%20LIVE%20DEMO-6366F1?style=for-the-badge" />
</a>
&nbsp;
<a href="https://github.com/abhay963/GD-ARENA-frontend">
<img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>

<br/><br/>

<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
<img src="https://img.shields.io/badge/Groq-F55036?style=flat-square" />
<img src="https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square" />
<img src="https://img.shields.io/badge/pgvector-336791?style=flat-square" />

</div>

---

## ⚡ What is GD Arena?

**GD Arena** is an AI-powered platform built for placement and interview preparation.

```text
                    ┌─────────────────────┐
                    │      GD ARENA       │
                    │  AI Interview Prep  │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
       ┌─────────────────┐           ┌─────────────────┐
       │   🗣️ GD ARENA   │           │  📚 STUDYMATE   │
       │                 │           │                 │
       │ AI Discussions  │           │ PDF → RAG → AI  │
       │ Voice Practice  │           │ Vector Search   │
       │ AI Participants │           │ AI Study Tutor  │
       └────────┬────────┘           └────────┬────────┘
                │                             │
                ▼                             ▼
          📊 ANALYTICS                 🧠 KNOWLEDGE
                │                             │
                └──────────────┬──────────────┘
                               ▼
                         🚀 BETTER PREP
```

---

# 🗣️ GD Arena

### Practice real Group Discussions with AI.

```text
👤 User
  │
  ├── 🎤 Voice
  │
  ▼
Deepgram STT
  │
  ▼
WebSocket
  │
  ▼
Node.js + Express
  │
  ▼
Groq LLM
  │
  ▼
🤖 AI Participants
  │
  ▼
💬 Real-Time Discussion
  │
  ▼
📊 Performance Analysis
```

### Features

* 🤖 AI-powered participants
* 🎙️ Streaming voice interaction
* ⚡ Real-time conversation
* 🧠 Context-aware responses
* 📊 Performance analytics
* 🔥 Daily streaks
* 📜 Discussion history

---

# 📚 StudyMate

### Turn your PDFs into an AI-powered study assistant.

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
PostgreSQL + pgvector
  │
  ▼
🔎 Semantic Search
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
```

### Features

* 📄 PDF upload
* ✂️ Intelligent chunking
* 🧠 Gemini embeddings
* 🔎 Vector similarity search
* 🗄️ PostgreSQL + pgvector
* 🔗 LangChain RAG
* 🤖 LLM-powered answers
* 📖 Document-grounded responses

---

# 🧠 RAG Architecture

```text
                    USER QUESTION
                          │
                          ▼
                  ┌───────────────┐
                  │    Embedding  │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   pgvector    │
                  │ Vector Search │
                  └───────┬───────┘
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
                    📚 StudyMate
```

---

# 🏗️ System Architecture

```text
                         🌐 CLIENT
                            │
                            ▼
                   ┌─────────────────┐
                   │  React + Vite   │
                   └────────┬────────┘
                            │
                  REST API / WebSocket
                            │
                            ▼
                   ┌─────────────────┐
                   │ Node + Express  │
                   └───────┬─┬───────┘
                           │ │
              ┌────────────┘ └─────────────┐
              ▼                            ▼
        ┌───────────┐                ┌────────────┐
        │  GD AI    │                │  StudyMate │
        │   Groq    │                │  LangChain │
        └─────┬─────┘                └──────┬─────┘
              │                             │
              │                             ▼
              │                       Gemini Embeddings
              │                             │
              │                             ▼
              │                    ┌──────────────────┐
              └───────────────────►│ PostgreSQL       │
                                   │      +           │
                                   │    pgvector      │
                                   └──────────────────┘
```

---

# 🛠️ Tech Stack

<div align="center">

### Frontend

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,js,html,css" height="55"/>

<br/><br/>

### Backend

<img src="https://skillicons.dev/icons?i=nodejs,express,js" height="55"/>

<br/><br/>

### Database & Authentication

<img src="https://skillicons.dev/icons?i=postgresql,firebase" height="55"/>

<br/><br/>

### AI / RAG

<img src="https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logoColor=white" />
<img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge" />
<img src="https://img.shields.io/badge/Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/pgvector-336791?style=for-the-badge" />
<img src="https://img.shields.io/badge/Deepgram-101010?style=for-the-badge" />

<br/><br/>

### Deployment

<img src="https://skillicons.dev/icons?i=vercel" height="55"/>

<img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" />
<img src="https://img.shields.io/badge/Neon-00E599?style=for-the-badge" />

</div>

---

# 🔥 Core Stack

| Area              | Technology        |
| :---------------- | :---------------- |
| 🎨 UI             | React + Vite      |
| 🎨 Styling        | Tailwind CSS      |
| ✨ Animation       | Framer Motion     |
| 🔌 Backend        | Node.js + Express |
| 🤖 GD AI          | Groq              |
| 🧠 RAG            | LangChain         |
| 📐 Embeddings     | Gemini            |
| 🔎 Vector DB      | pgvector          |
| 🗄️ Database      | PostgreSQL / Neon |
| 🔐 Authentication | Firebase          |
| 🎙️ Speech        | Deepgram          |
| 📡 Real-Time      | WebSocket         |
| 📊 Charts         | Recharts          |
| ▲ Frontend        | Vercel            |
| 🚂 Backend        | Railway           |

---

# 📈 Performance

```text
              GD SESSION
                   │
                   ▼
              Transcript
                   │
                   ▼
            AI Analysis
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
    Messages      Words      Score
       │           │           │
       └───────────┼───────────┘
                   ▼
              PostgreSQL
                   │
                   ▼
              📊 Dashboard
```

**Track**

`Sessions` · `Messages` · `Words` · `Average Score` · `Best Score` · `Improvement` · `Streak`

---

# 📁 Project Structure

```text
GD-Arena/
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── Landing/
│       │   ├── StudyMate/
│       │   └── Performance/
│       ├── services/
│       ├── hooks/
│       ├── firebase/
│       ├── routes/
│       └── App.jsx
│
└── server/
    ├── controllers/
    ├── routes/
    ├── services/
    │   ├── AI/
    │   ├── RAG/
    │   ├── Embeddings/
    │   └── ...
    ├── middleware/
    ├── config/
    ├── db/
    └── server.js
```

---

# 🌐 Deployment

```text
             🌍 INTERNET
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
     ▲ Vercel            🚂 Railway
     Frontend             Backend
        │                   │
        └─────────┬─────────┘
                  │
          ┌───────┼────────┐
          ▼       ▼        ▼
       Firebase  Groq    NeonDB
         Auth     AI    + pgvector
```

---

# 🚀 Live Demo

<div align="center">

<a href="https://gd-arena-cgh4.vercel.app/">

<img src="https://img.shields.io/badge/🚀%20TRY%20GD%20ARENA-6366F1?style=for-the-badge&logo=vercel&logoColor=white" />

</a>

<br/><br/>

**https://gd-arena-cgh4.vercel.app/**

</div>

---

# 🗺️ Roadmap

```text
          CURRENT
             │
             ▼
    ┌─────────────────┐
    │ 🗣️ GD Arena     │
    │ 📚 StudyMate    │
    │ 📊 Analytics    │
    │ 🔥 Streaks      │
    └────────┬────────┘
             │
             ▼
       NEXT GENERATION
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
 🎯 AI      📈 Deep   🧠 Personalized
 Coaching   Analytics   Learning
```

* [x] AI Group Discussions
* [x] Voice interaction
* [x] Performance analytics
* [x] Daily streaks
* [x] PDF upload
* [x] RAG pipeline
* [x] Gemini embeddings
* [x] pgvector search
* [x] LangChain integration
* [ ] Advanced speaking analysis
* [ ] Personalized AI coaching
* [ ] Advanced StudyMate features

---

# 👨‍💻 Author

<div align="center">

### Abhay Kumar Yadav

<a href="https://github.com/abhay963">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>

<a href="https://www.linkedin.com/in/abhay9631">
<img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>

<br/><br/>

⭐ **If you like GD Arena, consider giving it a star!**

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=6366F1&height=100&section=footer"/>

### `Practice • Learn • Analyze • Improve`

**Built with React · Node.js · PostgreSQL · LangChain · AI**

</div>
