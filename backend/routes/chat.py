from fastapi import APIRouter
from backend.models import VoiceQueryRequest, VoiceAssistantResponse
from backend.services.ai_assistant import process_conversational_turn

router = APIRouter(prefix="/api/chat", tags=["AI Assistant"])

@router.post("/assistant", response_model=VoiceAssistantResponse)
def ask_assistant(payload: VoiceQueryRequest):
    """
    Core conversational voice assistant endpoint:
    Processes citizen inquiry, maintains interactive interview context,
    asks eligibility questions in citizen's regional language,
    synthesizes spoken audio in that exact language, and returns matched schemes.
    """
    response = process_conversational_turn(
        transcript=payload.text or "",
        state=payload.state or "All India",
        language_code=payload.language_code or "hi-IN",
        language_name=payload.language_name or "Hindi",
        stage=payload.stage or "init",
        user_profile=payload.user_profile or {}
    )
    return response
