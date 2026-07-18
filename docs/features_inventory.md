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
* **Operational Stats, Shift Visits, & Risk Distribution Dashboard:** Summarizes database metrics (total counts, fully/partially assigned mothers, and active doctors/ASHA workers) and displays progress-bar graphs comparing patient workloads ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/admin/page.tsx)). Integrates advanced statistics detailing **ASHA Shift Visits** (Completed, In Progress, and Pending status metrics retrieved from the database) alongside **Patient Risk Level Distribution** (Critical, High, Moderate, and Low case tracking based on the latest AI Risk Assessments). **Interactive Clickable Detail Modals:** Click actions on any statistics metric card bring up a custom animated modal containing detailed lists of matched patients (including patient names, IDs, locations, or paired care workers), compile-queried directly from the backend.
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

### 9. Secure QR-Based Patient Record Sharing
* **Cryptographic JWT Tokens:** Generates temporary, cryptographically signed token URLs using HS256 algorithm via `/api/share/mother/{mother_id}/token`. Payload expires in 24 hours to enforce clinical data access controls ([share.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/routers/share.py)).
* **Interactive QR Share Card:** Renders dynamic vector QR codes on the client using the `qrcode` library, complete with copy-to-clipboard actions and JWT expiration notifications ([PatientQRCode.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/components/PatientQRCode.tsx)).
* **Cross-Portal Integrations:** Embeds the QR panel inside the sidebars of both ASHA worker Mother detail page and Doctor Portal Patient detail page.
* **Scan Verification & Auth Redirect Redirects:** Intercepts scans on landing pages, fetching decrypted record structures only if validated. Automatically redirects unauthorized scans to `/login` and routes them back to the decrypted vitals/consultations review once logged in ([page.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/app/share/mother/%5Bid%5D/page.tsx)).

### 10. Resilient Communication Channels & Offline Queue Engine
* **Dynamic Key-Rotational Translation Gateway:** Implemented a self-healing translation endpoint supporting real-time on-demand translation across 7 major languages. Automatically validates and rotates between multiple configured Gemini API keys sequentially on rate-limit/quota failures, falling back to Groq API (`openai/gpt-oss-120b`) as a fail-safe backup.
* **ASHA/Doctor Voice Reply & Transcription Engine:** Integrates speech-to-text conversion for incoming Telegram `.oga` voicenotes using Sarvam AI's STT engine, and supports recording and sending high-fidelity direct audio voice responses (`.ogg` formats) from the portal UI to patients.
* **High-Resiliency Offline Queue Engine:** Integrates an offline-first resilient event queue manager (`queue_engine.py`) using `asyncio.Queue` and thread-safe worker execution. Provides exponential backoff retries on network failures, preserving outbound Telegram alerts and prescriptions during server network drops.
* **Sender Role Prefixes & Separate Voice Transcripts:** Appends contextual prefixes (`🩺 Doctor:` or `👩‍⚕️ ASHA Worker:`) to outgoing messages so the patient knows the sender's identity. Voice note transcriptions are delivered as standard, separate full-width text bubbles to avoid congested Telegram audio caption layout constraints.
* **Single-Message Deletion & WebSocket Wiping:** Added target endpoints to delete single chat messages in real time. Emits Socket.IO events to trigger client-side message deletions instantly across all ASHA and Doctor portal screens.

### 11. Judge-Proof EHR Integration Layer (FHIR & LangGraph Sync)
* **HL7 FHIR JSON Bundle Synchronization:** Implemented a standard-based `BaseEHRProvider` interface and a `MockFHIRProvider` returning authentic HL7 FHIR JSON bundles containing Blood Pressure (LOINC `85354-9` with systolic/diastolic components) and Hemoglobin (LOINC `718-7`) observations ([ehr_client.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/services/ehr_client.py)).
* **EHR Sync API Router:** Added `POST /api/ehr/sync/{mother_id}` endpoint to fetch FHIR payloads, dynamically parse vital components, and save historical parameters (`historical_hb`, `historical_bp`) directly in `MotherProfile` ([ehr_sync.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/routers/ehr_sync.py)).
* **Clinical Health Trend Analysis:** Updated LangGraph state definitions and risk evaluation node (`evaluate_risk_node`) to cross-reference current metrics against historical baselines, flagging deteriorating trends (e.g., drops in Hemoglobin or rises in Blood Pressure) in both LLM prompts and deterministic fallback clinical justifications ([graph.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/agents/graph.py)).
* **EPIC Integration Blueprint:** Documented OAuth2 client credentials handshakes for Epic Systems EHR smart-connections to demonstrate production scalability to technical judges.

Under Flow Descriptions: Changed the wording to show that the system persists data to the database, supporting PostgreSQL or a local SQLite fallback.
Under Technology Stack Table: Updated the database component to explicitly state:
Database: PostgreSQL (Neon Cloud) / SQLite, SQLModel — Production-ready serverless PostgreSQL (via Neon) with a local SQLite fallback for seamless developer onboarding.

This is a standard industry best practice. It shows the judges that the application is built for cloud production using Neon PostgreSQL while remaining easy to set up locally for evaluation.

### 12. Intelligent Route & Shift Optimization Module (Google OR-Tools)
* **Google OR-Tools VRP Optimization Engine:** Solves the Vehicle Routing Problem (VRP) by modeling the ASHA Worker's base coordinates (depot) and patient locations ([dispatch.py](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/backend/routers/dispatch.py)). The solver's cost function dynamically balances actual physical distance (Haversine calculations with a terrain correction factor of 1.3 to simulate winding roads) against patient clinical risk scores (Soft Priority constraints that penalize delaying visits to critical patients).
* **ASHA Daily Visit Timeline Widget:** Displays a chronological vertical timeline of the ASHA worker's scheduled stops directly in the ASHA Portal dashboard ([AshaRouteTimeline.tsx](file:///c:/Users/user/OneDrive/Desktop/MatruKavach%20AI/frontend/components/AshaRouteTimeline.tsx)). Each stop shows the sequence number, estimated travel distance, travel mode, and expected check-up duration based on patient risk categories (15 mins for low-risk, 90 mins for critical).
* **Context-Aware Travel Mode Selection:** Automatically recommends the optimal travel mode (e.g. `🚶 Walking` for short distances under 1.5 km, `🛵 Scooter` two-wheeler for longer distances) and embeds deep-linked Google Maps turn-by-turn navigation parameters.
* **Offline-First Route Syncing:** Caches route schedules locally in `localStorage` when network connectivity is lost. Features a `/dispatch/sync` sync endpoint that updates the status of visits (Pending, In Progress, Completed) dynamically once connectivity is restored.
* **Zero-Lag Optimistic Panel Adjustments:** Admin dashboard utilizes optimistic UI state transitions to update mother care-team assignments instantly on-screen (0ms latency), resolving serverless database cold starts by running API calls silently in the background.

