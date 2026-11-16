from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.services.speech_to_text import stt_service
from backend.services.text_to_speech import tts_service

router = APIRouter(prefix="/api/voice", tags=["Voice"])

class SynthesizeRequest(BaseModel):
    text: str
    language_code: Optional[str] = "hi-IN"
    slow: Optional[bool] = False

@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language_code: str = Form("hi-IN")
):
    """
    Accept user voice recording (WAV, WEBM, MP3) and transcribe to text using Speech-to-Text.
    """
    try:
        contents = await file.read()
        if not contents or len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty audio recording submitted")

        result = stt_service.transcribe_audio_bytes(
            audio_bytes=contents,
            language_code=language_code,
            filename=file.filename or "recording.wav"
        )
        return result
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "transcript": "",
            "engine": "asr-exception-handler"
        }

@router.post("/synthesize")
def synthesize_speech(payload: SynthesizeRequest):
    """
    Convert text to speech in user's selected Indian language using TTS service.
    Returns audio URL for playback.
    """
    res = tts_service.synthesize(
        text=payload.text,
        language_code=payload.language_code or "hi-IN",
        slow=payload.slow or False
    )
    if not res.get("success"):
        raise HTTPException(status_code=500, detail=res.get("error", "TTS synthesis failed"))
    return res
