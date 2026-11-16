# JanSwar (जनस्वर) – AI-Powered Voice Assistant for Government Welfare Schemes

> **"Making government welfare information accessible to everyone, one conversation at a time."**  
> **"आपकी आवाज़ • आपका अधिकार • आपकी सरकारी योजनाएं"**

JanSwar is a modern, accessible, full-stack voice assistant web application designed to help elderly citizens, rural communities, and people who have difficulty reading or navigating government websites discover welfare benefits in their native language and regional dialect.

---

## 🌟 Key Features

1. **State-Wise & 22+ Indian Languages Architecture**
   - **Step 1:** The citizen selects their State or Union Territory (all 28 Indian States & 8 UTs supported: Maharashtra, Uttar Pradesh, Bihar, Tamil Nadu, Karnataka, Punjab, Rajasthan, West Bengal, Gujarat, Kerala, Odisha, Assam, Jharkhand, Chhattisgarh, Haryana, Delhi, etc.).
   - **Step 2:** The system automatically configures the primary and commonly spoken regional languages of that state, while also allowing selection of any of the 22 Eighth Schedule Indian languages or regional dialects (Bhojpuri, Haryanvi, Rajasthani, Chhattisgarhi, Maithili, etc.).
   - Prioritizes schemes specifically launched by the citizen's State Government alongside national Central schemes.

2. **The 5-Stage Voice Pipeline: SPEAK → UNDERSTAND → SEARCH → CHECK ELIGIBILITY → RESPOND**
   - **SPEAK:** Browser microphone requests permission and records audio.
   - **UNDERSTAND:** Transcribes speech in the citizen's native language using browser Web Speech API / Python Speech-to-Text. Identifies intent (pension, farming, medical, housing, maternity, student scholarships, loans).
   - **SEARCH:** Queries the structured SQLite welfare database (67+ verified schemes) filtered by State and category.
   - **CHECK ELIGIBILITY:** Evaluates age, family income, and occupational criteria.
   - **RESPOND:** Formulates a respectful, simple explanation and synthesizes natural spoken audio (TTS) so the citizen can listen.

3. **High Accessibility for Elderly Citizens**
   - Extra-large microphone button with visual ripple animation.
   - Built-in font scaler (`A-`, `A`, `A+`) to enlarge text for elderly readers.
   - High Contrast toggle for visually impaired citizens.
   - Spoken audio player with Play/Pause, Replay, and 0.8x slow speech speed control.
   - Clear document checklist (Aadhaar, bank passbook, ration card) and guidance on where to apply (local Gram Panchayat, CSC centre, Aaple Sarkar, e-Mitra).

4. **Zero-Failure Architecture & 100% Workable Features**
   - Works reliably with zero crash risk even when external GPU or cloud LLM API keys are unset.
   - Curated Intelligent Multi-Lingual Knowledge Engine returns verified scheme rules without hallucinating official criteria.
   - Both live FastAPI backend and embedded client-side fallback ensure all features (voice recognition, search, filters, eligibility checker, audio playback) are always operable.

---

## 🏗️ Technology Stack

- **Frontend:**
  - React.js 19 with Vite
  - Tailwind CSS 3.4
  - Lucide React icons
  - Canvas Confetti for eligibility celebration
  - Web Speech API (SpeechRecognition & SpeechSynthesis)
  - Responsive, high-contrast accessible UI
- **Backend:**
  - Python 3
  - FastAPI with CORS and static audio mounting
  - Pydantic v2 data models
  - SQLite database (`janswar.db`) seeded with 67+ Central & State schemes
  - Google Text-to-Speech (`gTTS`)
  - SpeechRecognition (ASR)
- **Database:**
  - SQLite database storing structured scheme records, eligibility criteria, required documents, and anonymous interaction logs.

---

## 📁 Project Structure

```
JanSwar/
├── backend/
│   ├── main.py                  # FastAPI application entry point & CORS
│   ├── database.py              # SQLite schema & automatic seeding
│   ├── models.py                # Pydantic models for API validation
│   ├── data/
│   │   ├── schemes.json         # Master database of 67+ Central & State schemes
│   │   ├── states_languages.json# 28 States, 8 UTs & 22+ languages
│   │   └── janswar.db           # SQLite database file
│   ├── routes/
│   │   ├── schemes.py           # Schemes directory APIs
│   │   ├── eligibility.py       # Eligibility calculator API
│   │   ├── voice.py             # Audio transcription & TTS APIs
│   │   ├── chat.py              # Conversational AI Assistant API
│   │   └── languages.py         # Geo & language metadata APIs
│   ├── services/
│   │   ├── speech_to_text.py    # Speech-to-Text handler
│   │   ├── text_to_speech.py    # Multi-lingual TTS audio generator
│   │   ├── scheme_search.py     # Search, filter, and intent detection
│   │   ├── eligibility_engine.py# Criteria evaluator & reason matcher
│   │   └── ai_assistant.py      # Conversational pipeline & response formatter
│   ├── audio_cache/             # Generated MP3 spoken audio files
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header with font controls & state pill
│   │   │   ├── Footer.jsx               # National helplines & disclaimers
│   │   │   ├── StateLanguageSelector.jsx# 2-step State & Language selector
│   │   │   ├── VoiceWaveform.jsx        # Audio waveform visualizer
│   │   │   ├── AudioPlayer.jsx          # Accessible audio controls
│   │   │   ├── SchemeCard.jsx           # Scheme details with badges & links
│   │   │   └── DemoPromptPills.jsx      # Quick-click sample voice queries
│   │   ├── pages/
│   │   │   ├── HomePage.jsx             # Hero, 4-step workflow, benefits
│   │   │   ├── VoiceAssistantPage.jsx   # Core voice assistant interface
│   │   │   ├── SchemesPage.jsx          # Searchable schemes directory
│   │   │   ├── EligibilityCheckerPage.jsx# Interactive questionnaire & confetti
│   │   │   └── AboutPage.jsx            # Project mission, pipeline, privacy
│   │   ├── services/
│   │   │   └── api.js                   # Backend API client with embedded resilience
│   │   ├── utils/
│   │   │   ├── speech.js                # Web Speech API helpers
│   │   │   └── indianData.js            # States, languages, sample queries
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── run_backend.bat              # One-click Windows startup script for backend
├── run_frontend.bat             # One-click Windows startup script for frontend
├── test_janswar_api.py          # Automated end-to-end test suite
└── README.md
```

---

## 🚀 How to Run the Application

### 1. Start the Backend (FastAPI)
Double-click `run_backend.bat` or run:
```bash
cd "c:\Users\manoh\OneDrive\Desktop\JanSwar"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Endpoint: `http://127.0.0.1:8000`
- Interactive API Documentation (Swagger): `http://127.0.0.1:8000/docs`

### 2. Start the Frontend (Vite + React)
Double-click `run_frontend.bat` or run:
```bash
cd "c:\Users\manoh\OneDrive\Desktop\JanSwar\frontend"
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔒 Security and Privacy Guarantees

- **Audio Permissions:** The microphone is only accessed with explicit user authorization.
- **Ephemeral Audio:** Voice recordings are processed in ephemeral memory and not permanently stored.
- **No Sensitive ID Harvesting:** The system never asks for Aadhaar OTPs, bank passwords, or PINs.
- **Official Guidance Disclaimer:** Results provide advisory matching based on public government guidelines; official decisions belong to designated government authorities.
