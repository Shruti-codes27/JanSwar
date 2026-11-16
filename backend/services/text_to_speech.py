import os
import hashlib
from pathlib import Path
from gtts import gTTS

BASE_DIR = Path(__file__).resolve().parent.parent
AUDIO_CACHE_DIR = BASE_DIR / "audio_cache"

# Map language codes to gTTS language codes
GTTS_LANG_MAP = {
    "hi-IN": "hi",
    "hi": "hi",
    "en-IN": "en",
    "en": "en",
    "mr-IN": "mr",
    "mr": "mr",
    "bn-IN": "bn",
    "bn": "bn",
    "ta-IN": "ta",
    "ta": "ta",
    "te-IN": "te",
    "te": "te",
    "gu-IN": "gu",
    "gu": "gu",
    "kn-IN": "kn",
    "kn": "kn",
    "ml-IN": "ml",
    "ml": "ml",
    "pa-IN": "pa",
    "pa": "pa",
    "ur-IN": "ur",
    "ur": "ur",
    "ne-IN": "ne",
    "ne": "ne",
    # Dialects mapped to base language phonetics
    "bho": "hi",
    "bgc": "hi",
    "mwr": "hi",
    "hne": "hi",
    "mai-IN": "hi",
    "mag": "hi",
    "awa": "hi",
    "or-IN": "hi",
    "as-IN": "bn"
}

class TextToSpeechService:
    def __init__(self):
        os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)

    def synthesize(self, text: str, language_code: str = "hi-IN", slow: bool = False) -> dict:
        """
        Synthesize text to MP3 audio using gTTS.
        Caches file based on MD5 of (text + language + slow).
        Returns filename and relative URL.
        """
        if not text or not text.strip():
            return {"success": False, "error": "Empty text provided"}

        clean_text = text.strip()
        # Truncate if too long for safety
        if len(clean_text) > 1000:
            clean_text = clean_text[:1000]

        target_lang = GTTS_LANG_MAP.get(language_code, "hi")

        # Generate unique cache hash
        cache_key = f"{clean_text}_{target_lang}_{slow}"
        hash_digest = hashlib.md5(cache_key.encode("utf-8")).hexdigest()
        filename = f"speech_{hash_digest}.mp3"
        file_path = AUDIO_CACHE_DIR / filename

        try:
            # If cached file exists, return directly
            if not file_path.exists():
                tts = gTTS(text=clean_text, lang=target_lang, slow=slow)
                tts.save(str(file_path))

            return {
                "success": True,
                "filename": filename,
                "audio_url": f"/audio/{filename}",
                "language": target_lang
            }
        except Exception as e:
            print(f"TTS synthesis error for lang {target_lang}: {e}")
            # Try English fallback if specific Indian language fails
            try:
                if target_lang != "en":
                    tts_fallback = gTTS(text=clean_text, lang="en", slow=slow)
                    fallback_filename = f"speech_fb_{hash_digest}.mp3"
                    fb_path = AUDIO_CACHE_DIR / fallback_filename
                    tts_fallback.save(str(fb_path))
                    return {
                        "success": True,
                        "filename": fallback_filename,
                        "audio_url": f"/audio/{fallback_filename}",
                        "language": "en",
                        "note": "Fell back to English synthesizer"
                    }
            except Exception as e2:
                print(f"TTS fallback failed: {e2}")

            return {
                "success": False,
                "error": str(e),
                "audio_url": None
            }

tts_service = TextToSpeechService()
