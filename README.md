<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4F46E5,50:7C3AED,100:9333EA&height=220&section=header&text=GD%20ARENA&fontSize=64&fontColor=ffffff&fontAlignY=38&desc=AI-Powered%20Interview%20Preparation%20Platform&descAlignY=58&descSize=18&animation=fadeIn" width="100%"/>

<br/>

<h2>🧠 Practice. Learn. Analyze. Improve.</h2>

<p>
  <b>AI-powered Group Discussions + RAG-powered Study Assistant</b>
</p>

<br/>

<a href="https://gd-arena-cgh4.vercel.app/">
<img src="https://img.shields.io/badge/%E2%9C%A8%20LIVE%20DEMO-4F46E5?style=for-the-badge&logo=vercel&logoColor=white" />
</a>
&nbsp;
<a href="https://github.com/abhay963/GD-ARENA-frontend">
<img src="https://img.shields.io/badge/%E2%98%85%20SOURCE%20CODE-111827?style=for-the-badge&logo=github&logoColor=white" />
</a>

<br/><br/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=111827"/>
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>
<img src="https://img.shields.io/badge/Groq-F55036?style=flat-square"/>
<img src="https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square"/>
<img src="https://img.shields.io/badge/pgvector-336791?style=flat-square"/>
<img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=111827"/>

<br/><br/>

<img src="https://komarev.com/ghpvc/?username=abhay963&label=Project%20Views&color=4F46E5&style=flat-square" />

</div>

---

<br/>

# 🎯 The Idea

**GD Arena** brings two important parts of placement preparation into one platform.

<table>
<tr>
<td width="50%" align="center">

## 🗣️ GD Arena

### Practice Communication

AI-powered group discussions with real-time voice interaction, intelligent participants and performance analysis.

**Speak → Discuss → Analyze → Improve**

</td>

<td width="50%" align="center">

## 📚 StudyMate

### Build Knowledge

Upload your study material and interact with it using a RAG-powered AI assistant.

**Upload → Retrieve → Ask → Learn**

</td>
</tr>
</table>

<br/>

<div align="center">

### One platform. Two preparation engines.

```text
                    ┌──────────────────────────┐
                    │        GD ARENA           │
                    │   Interview Preparation   │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
             ┌─────────────┐           ┌─────────────┐
             │  🗣️  GD     │           │  📚 StudyMate│
             │             │           │             │
             │  Practice   │           │    Learn    │
             └──────┬──────┘           └──────┬──────┘
                    │                         │
                    ▼                         ▼
             📊 Analytics              🧠 Knowledge
                    │                         │
                    └───────────┬─────────────┘
                                ▼
                         🚀 Better Preparation
```

</div>

---

# 🗣️ GD Arena

<div align="center">

### Your AI-powered Group Discussion room.

</div>

```text
       🎤 USER
          │
          ▼
   ┌──────────────┐
   │  Microphone  │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │   Deepgram   │
   │  Streaming   │
   │     STT      │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  WebSocket   │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Node / Express│
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │    Groq AI   │
   └──────┬───────┘
          │
          ▼
      🤖 AI
   Participants
          │
          ▼
     💬 Response
          │
          ▼
     📊 Analysis
```

### ✨ Built for realistic practice

|     | Capability                  |
| --- | --------------------------- |
| 🤖  | AI discussion participants  |
| 🎙️ | Streaming voice interaction |
| ⚡   | Real-time communication     |
| 🧠  | Context-aware responses     |
| 📊  | Performance analysis        |
| 🔥  | Daily practice streaks      |
| 📜  | Discussion history          |

---

# 📚 StudyMate

<div align="center">

### Turn your PDFs into an AI-powered knowledge base.

</div>

```text
              📄 PDF
                │
                ▼
        ┌───────────────┐
        │ Text Extraction│
        └───────┬───────┘
                │
                ▼
           ✂️ Chunking
                │
                ▼
       🧠 Gemini Embeddings
                │
                ▼
      ┌───────────────────┐
      │ PostgreSQL        │
      │       +           │
      │     pgvector      │
      └─────────┬─────────┘
                │
                │  🔎 Similarity Search
                │
                ▼
          Relevant Context
                │
                ▼
           🔗 LangChain
                │
                ▼
             🤖 LLM
                │
                ▼
          📚 StudyMate
```

### ✨ RAG-powered learning

* 📄 PDF ingestion
* ✂️ Document chunking
* 🧠 Gemini embeddings
* 🔎 Vector similarity search
* 🗄️ PostgreSQL + pgvector
* 🔗 LangChain orchestration
* 🤖 LLM generation
* 📖 Context-aware answers

---

# 🧠 Inside StudyMate

<div align="center">

```text
                     USER
                      │
                      ▼
               "Explain this topic"
                      │
                      ▼
               Query Embedding
                      │
                      ▼
              ┌───────────────┐
              │   pgvector    │
              │   Retrieval   │
              └───────┬───────┘
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
               Grounded Answer
```

</div>

> Instead of blindly sending the entire PDF to the LLM, StudyMate retrieves the most relevant information first.

---

# 🏗️ Architecture

<div align="center">

```text
                         🌐 USER
                            │
                            ▼
                   ┌────────────────┐
                   │ React + Vite   │
                   │ Tailwind CSS   │
                   └───────┬────────┘
                           │
                  REST API / WebSocket
                           │
                           ▼
                   ┌────────────────┐
                   │ Node + Express │
                   └───────┬────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           🤖 Groq     🔗 LangChain   🔐 Firebase
              │            │
              │            ▼
              │       🧠 Gemini
              │       Embeddings
              │            │
              └──────┬─────┘
                     ▼
              ┌───────────────┐
              │  PostgreSQL   │
              │      +        │
              │   pgvector    │
              └───────────────┘
```

</div>

---

# ⚙️ Technology Stack

<div align="center">

## Frontend

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,js,html,css&theme=dark" />

<br/><br/>

## Backend

<img src="https://skillicons.dev/icons?i=nodejs,express,js&theme=dark" />

<br/><br/>

## Database & Authentication

<img src="https://skillicons.dev/icons?i=postgresql,firebase&theme=dark" />

<br/><br/>

## AI / RAG / Voice

<img src="https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logoColor=white"/>
<img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
<img src="https://img.shields.io/badge/pgvector-336791?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Deepgram-101010?style=for-the-badge"/>

<br/><br/>

## Deployment

<img src="https://skillicons.dev/icons?i=vercel&theme=dark" />

<img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white"/>
<img src="https://img.shields.io/badge/Neon-00E599?style=for-the-badge"/>

</div>

---

# 📊 Performance Engine

<div align="center">

```text
             🗣️ GD SESSION
                    │
                    ▼
               Transcript
                    │
                    ▼
             AI Analysis
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
    Messages       Words       Score
       │            │            │
       └────────────┼────────────┘
                    ▼
               PostgreSQL
                    │
                    ▼
              📊 Dashboard
                    │
                    ▼
           📈 Track Progress
```

<br/>

`Sessions` · `Messages` · `Words` · `Average Score` · `Best Score` · `Improvement` · `Streak`

</div>

---

# 🔥 Practice Loop

<div align="center">

### Every session contributes to improvement.

```text
       🗣️ PRACTICE
            ↓
       🤖 AI DISCUSSION
            ↓
       📊 PERFORMANCE
            ↓
       🔎 IDENTIFY GAPS
            ↓
       📚 STUDYMATE
            ↓
       🧠 LEARN
            ↓
       🔄 PRACTICE AGAIN
```

</div>

---

# 🌐 Deployment

<div align="center">

```text
                     🌍 INTERNET
                          │
               ┌──────────┴──────────┐
               ▼                     ▼
          ▲ VERCEL               🚂 RAILWAY
          Frontend                Backend
               │                     │
               └──────────┬──────────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
         🔐 Firebase   🤖 Groq      🗄️ Neon
             Auth        AI        PostgreSQL
                                      │
                                      ▼
                                   pgvector
```

</div>

---

# 🧩 Project Structure

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

# 🚀 Quick Start

```bash
git clone https://github.com/abhay963/GD-ARENA-frontend.git

cd GD-ARENA-frontend

npm install

npm run dev
```

### Environment

Configure the required environment variables for:

```text
Firebase
Groq
Gemini
Deepgram
NeonDB
Backend API
```

> 🔒 Never commit secrets or production credentials.

---

# 🎥 Product

<div align="center">

<a href="https://gd-arena-cgh4.vercel.app/">

<img src="https://img.shields.io/badge/🚀%20ENTER%20THE%20ARENA-4F46E5?style=for-the-badge&logo=vercel&logoColor=white" />

</a>

<br/><br/>

### https://gd-arena-cgh4.vercel.app/

</div>

---

# 🗺️ Roadmap

<div align="center">

|    🗣️ GD Arena   |    📚 StudyMate   |    📈 Intelligence    |
| :---------------: | :---------------: | :-------------------: |
|   AI Discussions  |      PDF RAG      |    Advanced Scoring   |
| Voice Interaction |   Vector Search   |   Speaking Analysis   |
|    Performance    | Gemini Embeddings | Personalized Coaching |
|      Streaks      |     LangChain     |  Improvement Insights |

</div>

---

# 👨‍💻 Author

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=soft&color=gradient&height=100&section=header&text=Abhay%20Kumar%20Yadav&fontSize=30&fontColor=ffffff&animation=fadeIn" />

<a href="https://github.com/abhay963">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/>
</a>

<a href="https://www.linkedin.com/in/abhay9631">
<img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/>
</a>

<br/><br/>

⭐ **If you like GD Arena, give it a star!**

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4F46E5,50:7C3AED,100:9333EA&height=140&section=footer&animation=fadeIn" />

### `Practice • Learn • Analyze • Improve`

**GD Arena**

<sub>Built with React · Node.js · PostgreSQL · LangChain · AI</sub>

</div>
