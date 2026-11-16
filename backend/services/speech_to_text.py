import os
import io
import tempfile
from pathlib import Path
import speech_recognition as sr

# Supported language code mapping for Google Speech Recognition
LANG_MAP = {
    "hi-IN": "hi-IN",
    "en-IN": "en-IN",
    "mr-IN": "mr-IN",
    "bn-IN": "bn-IN",
    "te-IN": "te-IN",
    "ta-IN": "ta-IN",
    "gu-IN": "gu-IN",
    "kn-IN": "kn-IN",
    "ml-IN": "ml-IN",
    "pa-IN": "pa-IN",
    "ur-IN": "ur-IN",
    "or-IN": "hi-IN", # fallback to Hindi speech model for Odia if not direct
    "as-IN": "bn-IN", # Assamese uses Bengali acoustic model
    "bho": "hi-IN",   # Bhojpuri dialect
    "bgc": "hi-IN",   # Haryanvi dialect
    "mwr": "hi-IN",   # Rajasthani dialect
    "hne": "hi-IN",   # Chhattisgarhi dialect
    "mai-IN": "hi-IN" # Maithili dialect
}

class SpeechToTextService:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.recognizer.energy_threshold = 300
        self.recognizer.dynamic_energy_threshold = True

    def transcribe_audio_bytes(self, audio_bytes: bytes, language_code: str = "hi-IN", filename: str = "audio.wav") -> dict:
        """
        Transcribe audio bytes using SpeechRecognition.
        Supports WAV, AIFF, FLAC natively, or processes through temporary file.
        """
        sr_lang = LANG_MAP.get(language_code, "hi-IN")
        
        # Save bytes to a temporary file
        suffix = Path(filename).suffix if filename else ".wav"
        if not suffix:
            suffix = ".wav"

        temp_path = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
                temp_file.write(audio_bytes)
                temp_path = temp_file.name

            # Check if file is readable by AudioFile
            try:
                with sr.AudioFile(temp_path) as source:
                    audio_data = self.recognizer.record(source)
                    text = self.recognizer.recognize_google(audio_data, language=sr_lang)
                    return {
                        "success": True,
                        "transcript": text,
                        "language": language_code,
                        "confidence": 0.95,
                        "engine": "google-asr"
                    }
            except Exception as e:
                # If audio decoding failed (e.g. webm without ffmpeg on system), provide graceful message
                error_msg = str(e)
                print(f"ASR audio file decode note: {error_msg}")
                return {
                    "success": False,
                    "error": f"Audio processing note: {error_msg}. Browser Web Speech API will provide real-time transcription.",
                    "transcript": "",
                    "language": language_code,
                    "engine": "asr-fallback"
                }
        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception:
                    pass

# Singleton instance
stt_service = SpeechToTextService()
