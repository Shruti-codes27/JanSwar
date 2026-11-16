// Browser Web Speech API & Multi-Lingual Speech Utilities for JanSwar

export const BCP47_SPEECH_MAP = {
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
  "or-IN": "hi-IN",
  "as-IN": "bn-IN",
  "bho": "hi-IN",
  "bgc": "hi-IN",
  "mwr": "hi-IN",
  "hne": "hi-IN",
  "mai-IN": "hi-IN"
};

export class SpeechRecognitionManager {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isSupported = !!SpeechRecognition;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.isListening = false;

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
    }
  }

  startListening({ languageCode = "hi-IN", onResult, onEnd, onError, onStart }) {
    if (!this.recognition) {
      if (onError) onError(new Error("Web Speech API is not supported in this browser."));
      return false;
    }

    if (this.isListening) {
      try {
        this.recognition.abort();
      } catch (e) {
        console.warn("Speech abort error", e);
      }
    }

    const bcpCode = BCP47_SPEECH_MAP[languageCode] || "hi-IN";
    this.recognition.lang = bcpCode;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStart) onStart();
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (onResult) {
        onResult({
          final: finalTranscript,
          interim: interimTranscript,
          isFinal: finalTranscript.length > 0
        });
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      this.isListening = false;
      if (onError) onError(e);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn("Stop error", e);
      }
      this.isListening = false;
    }
  }
}

export const speechRecognizer = new SpeechRecognitionManager();

// Browser-native Speech Synthesis in citizen's regional voice
export const speakWithBrowser = (text, languageCode = "hi-IN", onEnd) => {
  if (!('speechSynthesis' in window)) return false;

  window.speechSynthesis.cancel(); // Stop any ongoing speech

  // Strip markdown, emojis, asterisks so speech is crystal clear
  const cleanText = text
    .replace(/[*#_`]/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .trim();

  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const targetCode = BCP47_SPEECH_MAP[languageCode] || "hi-IN";
  utterance.lang = targetCode;
  utterance.rate = 0.95; // comfortable rate for elderly comprehension
  utterance.pitch = 1.0;

  // Find native regional voice
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = targetCode.split('-')[0].toLowerCase();
  
  const voice = voices.find(v => v.lang.toLowerCase() === targetCode.toLowerCase()) ||
                voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
                voices.find(v => v.lang.includes("IN"));
  
  if (voice) {
    utterance.voice = voice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopBrowserSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
