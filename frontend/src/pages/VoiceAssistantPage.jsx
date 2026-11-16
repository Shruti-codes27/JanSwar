import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Volume2, 
  RotateCcw, 
  Sparkles, 
  MapPin, 
  Languages, 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  FileText, 
  UserCheck,
  ChevronRight,
  HelpCircle,
  Loader2
} from 'lucide-react';
import VoiceWaveform from '../components/VoiceWaveform';
import AudioPlayer from '../components/AudioPlayer';
import SchemeCard from '../components/SchemeCard';
import DemoPromptPills from '../components/DemoPromptPills';
import { speechRecognizer, speakWithBrowser, stopBrowserSpeech } from '../utils/speech';
import { askVoiceAssistant, uploadVoiceRecording } from '../services/api';

export default function VoiceAssistantPage({ 
  currentState, 
  currentLanguage, 
  onOpenStateModal,
  onCheckEligibilityForScheme 
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("Ready to listen. Tap the big microphone button to speak.");
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [assistantResponse, setAssistantResponse] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [errorNotice, setErrorNotice] = useState(null);

  // Interactive Voice Eligibility Interview State
  const [isInterviewActive, setIsInterviewActive] = useState(true);
  const [currentInterviewStep, setCurrentInterviewStep] = useState("ask_age");
  const [collectedProfile, setCollectedProfile] = useState({});
  const [quickReplies, setQuickReplies] = useState([]);

  // MediaRecorder for backend audio fallback
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // Initialize interview prompts based on selected regional language
    resetInterviewSession();
    return () => {
      speechRecognizer.stopListening();
      stopBrowserSpeech();
    };
  }, [currentState, currentLanguage]);

  const resetInterviewSession = () => {
    setCollectedProfile({});
    setCurrentInterviewStep("ask_age");
    setAssistantResponse(null);
    setAudioUrl(null);
    setTranscript("");

    const isMr = currentLanguage?.code?.startsWith("mr");
    const isTa = currentLanguage?.code?.startsWith("ta");
    const isTe = currentLanguage?.code?.startsWith("te");

    if (isMr) {
      setQuickReplies(["माझे वय ६० वर्षे आहे", "माझे वय ६५ वर्षे आहे", "माझे वय ७० वर्षे आहे", "वय ५० वर्षे"]);
    } else if (isTa) {
      setQuickReplies(["என் வயது 60", "என் வயது 65", "என் வயது 70"]);
    } else if (isTe) {
      setQuickReplies(["నా వయస్సు 60", "నా వయస్సు 65", "నా వయస్సు 70"]);
    } else {
      setQuickReplies(["मेरी उम्र 60 वर्ष है", "मेरी उम्र 65 वर्ष है", "मेरी उम्र 70 वर्ष है", "उम्र 50 वर्ष"]);
    }
  };

  const handleStartListening = async () => {
    setErrorNotice(null);
    setTranscript("");
    setInterimText("");
    stopBrowserSpeech();

    const started = speechRecognizer.startListening({
      languageCode: currentLanguage?.code || "hi-IN",
      onStart: () => {
        setIsRecording(true);
        setRecordingStatus(`🔴 Listening... Speak in ${currentLanguage?.name || "your language"}`);
      },
      onResult: ({ final, interim }) => {
        if (interim) setInterimText(interim);
        if (final) {
          setTranscript(final);
          setInterimText("");
          handleProcessTurn(final);
        }
      },
      onError: (err) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
        startMediaRecorderAudioCapture();
      },
      onEnd: () => {
        setIsRecording(false);
      }
    });

    if (!started) {
      startMediaRecorderAudioCapture();
    }
  };

  const startMediaRecorderAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setRecordingStatus("⚡ Processing audio...");
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

        setIsProcessing(true);
        try {
          const res = await uploadVoiceRecording(audioBlob, currentLanguage?.code || "hi-IN");
          if (res.success && res.transcript) {
            setTranscript(res.transcript);
            handleProcessTurn(res.transcript);
          } else {
            setErrorNotice(res.error || "Could not transcribe audio. You can also type or click an option below.");
            setIsProcessing(false);
            setRecordingStatus("Ready to listen.");
          }
        } catch (e) {
          setErrorNotice("Voice upload error. Please type or click an option.");
          setIsProcessing(false);
          setRecordingStatus("Ready to listen.");
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStatus(`🔴 Recording... Speak in ${currentLanguage?.name || "your language"} and tap stop when done.`);
    } catch (micErr) {
      console.error("Mic access error:", micErr);
      setErrorNotice("Microphone permission was denied. Please allow microphone access or choose from quick options below.");
      setIsRecording(false);
      setRecordingStatus("Microphone unavailable.");
    }
  };

  const handleStopListening = () => {
    setIsRecording(false);
    speechRecognizer.stopListening();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    } else {
      if (interimText && !transcript) {
        setTranscript(interimText);
        handleProcessTurn(interimText);
      }
    }
  };

  const handleProcessTurn = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    setIsProcessing(true);
    setRecordingStatus(`⚡ JanSwar is thinking in ${currentLanguage?.name}...`);
    setErrorNotice(null);

    try {
      const response = await askVoiceAssistant({
        text: queryText,
        state: currentState?.name || "All India",
        language_code: currentLanguage?.code || "hi-IN",
        language_name: currentLanguage?.name || "Hindi",
        stage: currentInterviewStep,
        user_profile: collectedProfile
      });

      setAssistantResponse(response);
      setAudioUrl(response.audio_url);
      setCollectedProfile(response.collected_profile || collectedProfile);
      setCurrentInterviewStep(response.current_step || "complete");
      setQuickReplies(response.quick_replies || []);
      setIsProcessing(false);
      setRecordingStatus(`✅ Spoken response ready in ${currentLanguage?.name}.`);

      // Fall back to browser speech synthesis if backend audio URL is unset
      if (!response.audio_url) {
        speakWithBrowser(response.ai_explanation, currentLanguage?.code || "hi-IN");
      }
    } catch (e) {
      console.error("Error processing turn:", e);
      setIsProcessing(false);
      setErrorNotice("Could not reach voice server. Falling back to local assistant.");
      setRecordingStatus("Ready to listen.");
    }
  };

  const handleQuickReplyClick = (replyText) => {
    setTranscript(replyText);
    handleProcessTurn(replyText);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTranscript(textInput);
    handleProcessTurn(textInput);
    setTextInput("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold border border-orange-200">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Interactive Regional Voice Concierge • संवादात्मक पात्रता मुलाखत</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
          Talk to JanSwar in {currentLanguage?.name} ({currentLanguage?.native})
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          The assistant speaks back in your exact regional language and asks simple questions to determine your government welfare eligibility.
        </p>
      </div>

      {/* State & Language Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>State: <strong className="text-slate-900">{currentState?.name || "All India"}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-orange-50 text-orange-950 px-3 py-1.5 rounded-xl border border-orange-200">
            <Languages className="w-4 h-4 text-orange-600" />
            <span>Language: <strong>{currentLanguage?.name} ({currentLanguage?.native})</strong></span>
          </div>
        </div>

        <button
          onClick={onOpenStateModal}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 underline flex items-center gap-1"
        >
          <span>Change State or Language (राज्य/भाषा बदलें)</span>
        </button>
      </div>

      {/* Interactive Eligibility Interview Steps Tracker */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 rounded-3xl p-5 border border-orange-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Voice Eligibility Interview (पात्रता मुलाखत):
            </h3>
          </div>
          <button
            onClick={resetInterviewSession}
            className="text-xs text-orange-700 hover:text-orange-900 font-bold flex items-center gap-1 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Interview (पुन्हा सुरू करा)</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          <div className={`p-2.5 rounded-2xl border transition-all ${
            collectedProfile.age 
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
              : currentInterviewStep === 'ask_age'
              ? 'bg-orange-600 text-white border-orange-600 shadow-md ring-2 ring-orange-400'
              : 'bg-white/80 text-slate-500 border-slate-200'
          }`}>
            <div className="text-[10px] opacity-75">Step 1</div>
            <div>{collectedProfile.age ? `Age: ${collectedProfile.age} yrs` : '1. Age (वय)'}</div>
          </div>

          <div className={`p-2.5 rounded-2xl border transition-all ${
            collectedProfile.annual_income || collectedProfile.has_bpl_card
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : currentInterviewStep === 'ask_income'
              ? 'bg-orange-600 text-white border-orange-600 shadow-md ring-2 ring-orange-400'
              : 'bg-white/80 text-slate-500 border-slate-200'
          }`}>
            <div className="text-[10px] opacity-75">Step 2</div>
            <div>{collectedProfile.annual_income ? `Income: ₹${collectedProfile.annual_income}` : '2. Income (उत्पन्न)'}</div>
          </div>

          <div className={`p-2.5 rounded-2xl border transition-all ${
            collectedProfile.occupation
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : currentInterviewStep === 'ask_occupation'
              ? 'bg-orange-600 text-white border-orange-600 shadow-md ring-2 ring-orange-400'
              : 'bg-white/80 text-slate-500 border-slate-200'
          }`}>
            <div className="text-[10px] opacity-75">Step 3</div>
            <div>{collectedProfile.occupation ? `${collectedProfile.occupation}` : '3. Work (व्यवसाय)'}</div>
          </div>

          <div className={`p-2.5 rounded-2xl border transition-all ${
            currentInterviewStep === 'complete'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400'
              : 'bg-white/80 text-slate-500 border-slate-200'
          }`}>
            <div className="text-[10px] opacity-75">Step 4</div>
            <div>4. Verdict (पात्र योजना)</div>
          </div>
        </div>
      </div>

      {/* Main Microphone Interaction Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
        
        {errorNotice && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Audio Waveform */}
        <VoiceWaveform 
          isRecording={isRecording} 
          isPlaying={!!audioUrl && !isProcessing} 
          statusText={recordingStatus} 
        />

        {/* Big Accessible Microphone */}
        <div className="my-6 relative flex items-center justify-center">
          {isRecording && (
            <>
              <div className="absolute w-44 h-44 rounded-full bg-rose-500/20 animate-ping"></div>
              <div className="absolute w-36 h-36 rounded-full bg-rose-500/30 animate-pulse"></div>
            </>
          )}

          <button
            onClick={isRecording ? handleStopListening : handleStartListening}
            disabled={isProcessing}
            aria-label={isRecording ? "Stop Recording" : "Start Recording"}
            className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-white transition-all duration-300 shadow-2xl ${
              isRecording
                ? 'bg-gradient-to-br from-rose-600 to-red-700 scale-105 shadow-rose-600/50 ring-4 ring-rose-400'
                : isProcessing
                ? 'bg-slate-700 cursor-not-allowed opacity-90'
                : 'bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 hover:from-orange-600 hover:to-amber-700 hover:scale-105 shadow-orange-500/30'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            ) : isRecording ? (
              <>
                <Square className="w-10 h-10 fill-white mb-1" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-12 h-12 mb-1 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Tap to Speak</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-md">
          {isRecording 
            ? `बोलिए... (${currentLanguage?.native || "मराठी"} मध्ये उत्तर द्या)` 
            : `माइक दाबा आणि ${currentLanguage?.native || "मराठी"} मध्ये उत्तर द्या`}
        </p>

        {/* Live speech transcription */}
        {(interimText || transcript) && (
          <div className="w-full mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-1">
            <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>तुम्ही म्हणालात (You said):</span>
              {isRecording && <span className="text-rose-600 font-mono text-[10px] animate-pulse">● LIVE</span>}
            </div>
            <p className="text-base font-serif font-bold text-slate-900">
              "{transcript || interimText}"
            </p>
          </div>
        )}

        {/* Quick Voice Answer Options in Regional Language */}
        {quickReplies && quickReplies.length > 0 && (
          <div className="w-full mt-6 pt-6 border-t border-slate-200 text-left">
            <div className="text-xs font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>बोलण्यासाठी किंवा निवडण्यासाठी पर्याय (Quick Voice Options):</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReplyClick(reply)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-950 font-bold text-xs border border-orange-200 hover:border-orange-300 shadow-sm transition-all hover:scale-102"
                >
                  <Volume2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>"{reply}"</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fallback Text Input */}
        <form onSubmit={handleManualSubmit} className="w-full mt-6 pt-4 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={`किंवा येथे टाईप करा (Type in ${currentLanguage?.name})...`}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isProcessing}
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

      {/* AI Regional Response Card */}
      {assistantResponse && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
            
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-serif">
                    जनस्वर आवाज उत्तर (JanSwar Regional Voice)
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    Language: <strong className="text-orange-600">{assistantResponse.detected_language} ({currentLanguage?.native})</strong> • State: {currentState?.name}
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                100% {currentLanguage?.name} Voice
              </span>
            </div>

            {/* Regional Spoken Audio Player */}
            {audioUrl && (
              <AudioPlayer 
                audioUrl={audioUrl} 
                title={`${currentLanguage?.name} आवाजात ऐका (Listen in ${currentLanguage?.name})`}
                autoPlay={true}
              />
            )}

            {/* Explanation / Question Box */}
            <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200 text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
              {assistantResponse.ai_explanation}
            </div>

          </div>

          {/* Matched Schemes upon Interview Completion */}
          {assistantResponse.matched_schemes && assistantResponse.matched_schemes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 font-serif flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <span>पात्र ठरलेल्या सरकारी योजना (Your Matched Schemes):</span>
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {assistantResponse.matched_schemes.length} Schemes Sanctioned
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assistantResponse.matched_schemes.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    onCheckEligibility={onCheckEligibilityForScheme}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
