import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.database import init_db
from backend.routes import schemes, eligibility, voice, chat, languages

# Base directories
BASE_DIR = Path(__file__).resolve().parent
AUDIO_CACHE_DIR = BASE_DIR / "audio_cache"
os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)

app = FastAPI(
    title="JanSwar API – AI Voice Assistant for Government Welfare Schemes",
    description="Multilingual voice assistant backend for rural and elderly citizens to discover schemes and check eligibility.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory for generated TTS audio playback
app.mount("/audio", StaticFiles(directory=str(AUDIO_CACHE_DIR)), name="audio")

# Include Routers
app.include_router(schemes.router)
app.include_router(eligibility.router)
app.include_router(voice.router)
app.include_router(chat.router)
app.include_router(languages.router)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "JanSwar Backend",
        "version": "1.0.0",
        "tts_ready": True,
        "asr_ready": True,
        "supported_languages_count": 28,
        "supported_states_count": 36
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
