import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Mic, 
  Languages, 
  MapPin, 
  Users, 
  HeartHandshake, 
  Lock, 
  Server, 
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export default function AboutPage() {
  const benefitsList = [
    {
      target: "Elderly Citizens (वरिष्ठ नागरिक)",
      benefit: "No need to read small font sizes, click through complex CAPTCHAs, or struggle with English menus. They can simply ask about old-age pensions, Ayushman health cards, and bus concessions in their regional voice."
    },
    {
      target: "Rural & Agricultural Communities (ग्रामीण व किसान परिवार)",
      benefit: "Direct voice access to PM-KISAN, crop insurance, Rythu Bandhu, Krishi Sinchayee, and rural housing schemes right from their smartphone."
    },
    {
      target: "Women & Self-Help Groups (महिला सशक्तिकरण)",
      benefit: "Immediate discovery of Ladli Behna, Kalaignar Magalir, Gruha Lakshmi, PM Matru Vandana, and Ujjwala gas subsidies without middleman exploitation."
    },
    {
      target: "Students & Youth (छात्र व बेरोजगार युवा)",
      benefit: "Information on merit-cum-means scholarships, state student credit cards, and unemployment skill allowances."
    }
  ];

  const techPipeline = [
    { step: "1. Voice Capture", desc: "Browser Web Audio API requests explicit microphone consent and streams audio securely." },
    { step: "2. Speech Recognition (ASR)", desc: "Converts regional dialect and spoken language into clean text." },
    { step: "3. Intent & Demographic Parser", desc: "Extracts age, state, caste category, and welfare domain." },
    { step: "4. Database Matcher", desc: "Searches SQLite database of Central and State schemes matching the citizen's residency." },
    { step: "5. Grounded Explanation Engine", desc: "Explains eligibility rules, financial benefits, and documents using plain, respectful language." },
    { step: "6. Text-to-Speech (TTS)", desc: "Generates natural speech in the citizen's native voice so they can listen." }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fadeIn">
      
      {/* Hero Mission */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold border border-orange-200">
          About the Project • जनस्वर परिचय
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
          About JanSwar (जनस्वर)
        </h1>
        <p className="text-lg sm:text-xl text-orange-700 font-serif italic">
          "Making government welfare information accessible to everyone, one conversation at a time."
        </p>
      </div>

      {/* 1. What is JanSwar & Why Was It Developed? */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-black text-slate-900 font-serif">
          What is JanSwar and Why Was It Developed?
        </h2>
        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            India operates some of the world's most expansive and generous social security systems, spanning hundreds of Central and State welfare programs with billions of rupees in annual budget outlays.
          </p>
          <p>
            However, there exists a profound <strong>digital accessibility divide</strong>. Millions of elderly citizens, rural families, and people who have difficulty reading or typing in English cannot navigate dense government web portals, multi-level dropdowns, or complex official PDFs. Many rely on unauthorized intermediaries who charge exorbitant fees for basic information.
          </p>
          <p>
            <strong>JanSwar (Voice of the People)</strong> was engineered to tear down these barriers. It turns citizen assistance into a natural, spoken conversation. A citizen can simply pick their state, press the microphone, and speak in their mother tongue—whether Hindi, Marathi, Bengali, Tamil, Telugu, Punjabi, Gujarati, Kannada, or regional dialects—and JanSwar immediately tells them what schemes they qualify for, what benefits they will receive, and which simple documents to bring to their local Panchayat.
          </p>
        </div>
      </div>

      {/* 2. Who Benefits From JanSwar? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 font-serif">
          Who Will Benefit From JanSwar?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefitsList.map((b, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{b.target}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {b.benefit}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. How Does AI Help? (The End-to-End Pipeline) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Technical Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif">
            How Does AI & Speech Engineering Help?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            JanSwar connects Automatic Speech Recognition, structured scheme databases, and multi-lingual voice synthesis into a zero-failure pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {techPipeline.map((tp, idx) => (
            <div key={idx} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
              <div className="text-xs font-bold text-orange-400">{tp.step}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{tp.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
          <strong className="text-amber-300 font-bold">Strict Grounding Rule: </strong>
          The AI system is strictly instructed to draw all scheme names, eligibility criteria, and benefit numbers from verified database records. If information is unavailable or unverified, it explicitly indicates so instead of fabricating an answer.
        </div>
      </div>

      {/* 4. Privacy, Security & Government Disclaimers */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              Security, Privacy & Trust Guarantees
            </h2>
            <p className="text-xs text-slate-500">How citizen privacy and security are safeguarded by design</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block">Explicit Microphone Consent</strong>
            <span>Audio is only accessed when you deliberately tap the microphone button. Microphone permissions can be revoked in your browser settings at any moment.</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block">Zero Permanent Audio Retention</strong>
            <span>Spoken audio recordings are processed in ephemeral memory and discarded. We do not maintain biometric voice profiles or audio recordings of citizens.</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block">No Sensitive ID Harvesting</strong>
            <span>JanSwar never asks for your bank password, OTP, or full 12-digit Aadhaar number. It only asks for basic demographic filters (age, state, occupation).</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block">Informational Guidance Notice</strong>
            <span>JanSwar provides advisory matching. Official benefit sanctioning always remains the jurisdiction of the respective Central or State Government departments.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
