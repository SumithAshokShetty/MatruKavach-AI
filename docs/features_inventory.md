# MatruKavach AI - Feature Inventory & Technical Stack

This document tracks all implemented product features and the underlying technology stack used across the MatruKavach AI project.

---

## 🛠️ Technology Stack

### Backend
* **Core Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python) for building high-performance, asynchronous REST APIs.
* **Database & ORM:** [SQLModel](https://sqlmodel.tiangolo.com/) (combining SQLAlchemy & Pydantic) on top of an **SQLite** database (`database.db`, `matrukavach.db`).
* **AI & Agent Orchestration:** 
  * [LangGraph](https://langchain-ai.github.io/langgraph/) (`StateGraph`) for building the multi-agent clinical and environmental intelligence graph.
  * [LangChain](https://www.langchain.com/) & `langchain-google-genai` integration with **Google Gemini 2.5 Flash** for structured outputs and conversational reasoning.
* **Real-time Event Streaming:** [python-socketio](https://python-socketio.readthedocs.io/en/latest/) for emitting and handling WebSocket events.
* **Audio Processing:** `ffmpeg` for converting `.oga` Telegram voice notes into `.wav` audio files.
* **External API Integrations:**
  * **Open-Meteo API:** Dynamic weather forecasts (temperature, apparent temperature, weather conditions) and Air Quality forecasts (PM2.5 AQI).
  * **OpenStreetMap Nominatim:** Reverse-geocoding coordinates (latitude and longitude) into human-readable locations.
  * **Telegram Bot API:** Interfacing with users for automated alerts, language selection, chats, and prescriptions.

### Frontend
* **Core Framework:** [Next.js](https://nextjs.org/) (React framework using TypeScript and App Router).
* **Styling & Theme:** Vanilla CSS / [TailwindCSS](https://tailwindcss.com/) for fully responsive custom layouts.
* **Animations:** [Framer Motion](https://www.framer.com/motion/) for smooth layout transitions and UI micro-animations.
* **Icons:** [Lucide React](https://lucide.dev/) for dashboard and tool symbols.
* **WebSockets:** [Socket.io Client](https://socket.io/docs/v4/client-api/) for real-time listener binding.

---

## 📋 Feature Inventory

### 1. Planetary Intelligence & Clinical AI Risk Module
* **Real-time Geo-Environmental Monitoring:** Automatically retrieves environmental metrics—temperature, feels-like heat index, air quality index (AQI PM2.5 levels), and toxin exposure indexes—by reverse-geocoding the coordinates of the user's current GPS location via OSM Nominatim and Open-Meteo services ([main.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/main.py#L60-L85), [page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/asha/assess/page.tsx#L35-L67)).
* **AI Multi-Agent Maternal Risk Assessment:** Runs an orchestrator utilizing a multi-agent LangGraph workflow ([graph.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/agents/graph.py)) that compounds clinical vitals with planetary metrics. It outputs an overall risk score (1-10) and level (Low, Moderate, High, Critical) ([orchestrator.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/agents/orchestrator.py#L21-L63)).
* **Multi-Factor Clinical Alert Tagging:** Flags anomalies like Preeclampsia Risk, Anemia, Severe Anemia, Elevated Blood Glucose, and Gestational Diabetes ([clinical.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/agents/clinical.py#L14-L54)).
* **AI-Generated Clinical Trace & Dietary Guidance:** Provides structured clinical explanations detailing how environmental conditions compounded vitals, alongside categorized actionable plans (Clinical Dietary Plan, Environmental Safety Protocols, Medication & Monitoring) ([graph.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/agents/graph.py#L71-L171), [nutrition.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/agents/nutrition.py#L4-L34)).
* **Autonomous Tool-Routing ReAct Loop with Fallback Resilience:** Migrated the graph into a true ReAct loop using native LangChain tool binding. Features a robust multi-tier model fallback gateway (Groq GPT-OSS-120b ➔ Groq Qwen3.6-27b ➔ Google Gemini-2.5-flash) with safe exception handlers and a deterministic rule-engine fallback that directly invokes clinical and env tools if API connectivity fails.
* **Human-in-the-Loop (HITL) Checkpointing & Cache Resetting:** Implemented checkpoint persistence with `MemorySaver()`, interrupting the graph right before recommendations are compiled to allow doctor reviews. Built thread-reset handlers in [orchestrator.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/agents/orchestrator.py) to clear checkpointer cache before new assessments, forcing fresh runs from the `START` node.

### 2. ASHA Worker Module
* **Patient Search & Dashboard Directory:** Lists active mothers with profile summaries (ID, age, location, and gestational age) along with text-based searches and filters ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/asha/page.tsx#L30-L81)).
* **Vital Record Submission Form:** Interface to input maternal vitals (systolic/diastolic blood pressure, weight, hemoglobin, random glucose, and other physical symptoms) to request real-time AI Risk assessments ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/asha/assess/page.tsx#L190-L277)).
* **Interactive Assessment Timeline:** A historical log showing all past risk analyses, clinical alerts, and a control to delete outdated assessment records ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/asha/mother/%5Bid%5D/page.tsx#L165-L218)).
* **ASHA Consultation Journal:** Allows logging frontline observation notes associated with specific assessment instances ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/asha/assess/page.tsx#L384-L412)).
* **Health Record Document Repository:** Upload and preview system-stored reports/records in formats like PDF or images ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/asha/mother/%5Bid%5D/page.tsx#L226-L263)).

### 3. Doctor Module
* **Maternal Patient Records Hub:** Provides doctors with a global directory to search for registered mothers ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/doctor/page.tsx#L30-L91)).
* **Clinical Consultation & Prescription Creator:** A workspace to log clinical vitals, select health conditions (Stable, Monitor Closely, High Risk, Critical Admission Required), schedule check-up dates, write observations, and construct Medication (Rx) / Nutrition plans ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/doctor/%5Bmother_id%5D/page.tsx#L184-L234)).
* **Past Consultations History:** Visualizes the timeline of previous clinical notes and prescriptions issued ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/doctor/%5Bmother_id%5D/page.tsx#L237-L287)).
* **AI Conversations Summarizer:** Utilizes Gemini AI to automatically summarize patient chats from the past 14 days, identifying patient symptoms and emergency concerns ([orchestrator.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/agents/orchestrator.py#L65-L102), [page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/doctor/%5Bmother_id%5D/page.tsx#L406-L432)).

### 4. Mothers / Patients Telegram Integration Module
* **Interactive Bot Onboarding ("MatruKavach Saathi"):** Connects a user's Telegram `chat_id` to their clinical Maternity ID and captures language preferences (English, Hindi, Marathi) via interactive callback buttons ([telegram_bot.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/routers/telegram_bot.py#L122-L166)).
* **Voice Note Consultation:** Accepts and converts voice notes, performing speech transcripts and translation when matching non-English audio inputs ([telegram_bot.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/routers/telegram_bot.py#L48-L64)).
* **Dynamic Translation Engine:** Empathetically translates medical instructions from doctors/health workers to the mother's preferred language, and translates mother's text back to English ([telegram_bot.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/routers/telegram_bot.py#L66-L91)).
* **Emergency Keyword Scanning & Critical Alerts:** Audits inbound chats for priority keywords (such as bleeding, severe pain, contractions, water broke, headache, vomiting). If matched, it escalates priority to RED and broadcasts alert notifications to WebSockets ([telegram_bot.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/routers/telegram_bot.py#L28-L32), [telegram_bot.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/routers/telegram_bot.py#L181-L210)).
* **Prescription & Plan Push Deliveries:** Formats and pushes prescriptions (including vitals, nutrition recommendations, drug plans, and visit dates) to the patient on Telegram ([telegram_bot.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/routers/telegram_bot.py#L243-L274)).

### 5. System Administration Module
* **Operational Stats & Workloads Dashboard:** Summarizes database metrics (total counts, fully/partially assigned mothers) and displays progress-bar graphs comparing patient counts per Doctor and ASHA worker ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/admin/page.tsx#L98-L115), [page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/admin/page.tsx#L160-L193)).
* **Interactive Care-Team Assigner:** Enables real-time allocation and adjustment of ASHA Workers and Doctors assigned to each mother via dynamic dropdown menus ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/admin/page.tsx#L200-L255)).
* **Care-Team Directories:** Provides panels to browse system registered Doctors and ASHA Workers details, including contact details and workload counts ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/admin/page.tsx#L258-L318)).

### 6. Core Communication Infrastructure
* **Bidirectional Live Chat Window:** Multi-role chat UI that retrieves historical logs, supports text inputs, and displays real-time incoming messages using Socket.io WebSocket events ([ChatWindow.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/components/ChatWindow.tsx)).
* **Priority Color-Coded Toasts:** Renders visual highlights (RED glow/yellow/green alerts) in chat boxes and desktop notification popups depending on the urgency level of inbound patient messages ([ChatWindow.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/components/ChatWindow.tsx#L133-L137), [LiveAlerts.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/components/LiveAlerts.tsx#L70-L78)).

### 7. Multi-Language Portal Localization
* **Dynamic Client-Side Localization Context:** Exposes translations and selected language state across all app routing pages to support 7 major languages—English, Hindi, Marathi, Kannada, Telugu, Tamil, Bengali—persisting preferences in browser `localStorage` ([LanguageContext.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/components/LanguageContext.tsx)).
* **Integrated Language Selector UI:** Provides a custom-styled, interactive globe dropdown menu in both desktop and mobile layouts for real-time localization of headers, footers, dashboard widgets, forms, history logs, and care plans ([Header.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/components/layout/Header.tsx)).

### 8. Voice-Driven Guided Intake (Sarvam AI Integration)
* **Unified Speech-to-Text Pipeline (Step 1):** Ingests recorded browser audio files via a dedicated `/voice/process` endpoint, converting spoken audio using Sarvam AI's high-efficiency `saaras:v3` model in transcription mode ([voice.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/routers/voice.py)).
* **Multi-Portal LLM Value Extraction (Step 2):** Processes raw transcript text through Sarvam's `sarvam-30b` LLM model. Uses distinct system instructions and strict validation schemas to parse form inputs for either ASHA workers or Doctors, returning raw minified JSON payloads directly back to the client.
* **Interactive Guided Voice UI:** Renders a step-by-step vocal questionnaire inside both portals, featuring progress timelines and live recording states using HTML5 MediaRecorder API ([VoiceAssistant.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/components/VoiceAssistant.tsx)).
* **Dynamic Output Stack & Conditional Form Rendering:** Automatically hides standard text input fields when voice intake is active, replacing them with a live captured read-only answers grid below the guided question step. Integrated custom tan flat line-art `<Mic />` icon tab buttons to style intake mode selections.

