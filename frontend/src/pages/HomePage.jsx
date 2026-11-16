import React from 'react';
import { 
  Mic, 
  Search, 
  MapPin, 
  Languages, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  Award, 
  HeartHandshake, 
  Activity, 
  CheckCircle2, 
  Sprout, 
  Home, 
  HelpCircle,
  Volume2
} from 'lucide-react';
import { ALL_INDIAN_STATES } from '../utils/indianData';

export default function HomePage({ 
  onNavigate, 
  currentState, 
  currentLanguage, 
  onOpenStateModal,
  featuredSchemes = []
}) {
  const steps = [
    {
      num: "01",
      title: "SPEAK (बोलिए)",
      desc: "Tap the big microphone and speak in your mother tongue or regional dialect. No English or typing required.",
      icon: Mic,
      color: "from-orange-500 to-amber-600"
    },
    {
      num: "02",
      title: "UNDERSTAND (समझिए)",
      desc: "Our AI model listens, recognizes your dialect, and identifies whether you need pension, healthcare, or farming aid.",
      icon: Sparkles,
      color: "from-blue-600 to-indigo-700"
    },
    {
      num: "03",
      title: "SEARCH & MATCH (खोजिए)",
      desc: "Searches verified Central and State government schemes matching your state, age, and family background.",
      icon: Search,
      color: "from-emerald-600 to-teal-700"
    },
    {
      num: "04",
      title: "LISTEN & ACT (सुनिए)",
      desc: "JanSwar speaks the answer aloud, explains exactly which documents you need and how to apply at your local Panchayat.",
      icon: Volume2,
      color: "from-purple-600 to-pink-700"
    }
  ];

  const whyMatters = [
    {
      title: "Eliminates Literacy Barriers",
      desc: "Over 250 million rural and elderly citizens struggle to navigate complex English websites. JanSwar enables anyone who can speak to discover their rights.",
      icon: Users
    },
    {
      title: "Tailored to Your State & Language",
      desc: "Choose from 28 Indian States & 8 UTs. JanSwar prioritizes schemes announced by your state government along with national schemes in your native tongue.",
      icon: MapPin
    },
    {
      title: "Zero Hallucination Guarantee",
      desc: "Answers are grounded strictly in official government scheme rules, official welfare gazettes, and verified benefit amounts.",
      icon: ShieldCheck
    },
    {
      title: "Full Spoken Audio Guidance",
      desc: "Designed for elderly citizens with low vision or cataracts. Every explanation is read aloud clearly at a comfortable speaking pace.",
      icon: Volume2
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-white to-white pt-10 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* National Emblem & State Pill */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <button
                  onClick={onOpenStateModal}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-950 text-xs font-bold border border-orange-200 hover:bg-orange-200 transition-colors shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span>State: {currentState?.name || "All India"}</span>
                  <span className="text-orange-400">•</span>
                  <span>{currentLanguage?.name} ({currentLanguage?.native})</span>
                  <span className="underline ml-1">Change</span>
                </button>

                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  AI Voice Assistant Active
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] font-serif">
                Your Voice. <span className="text-orange-600">Your Rights.</span> <br />
                Your Government Benefits.
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Discover government welfare schemes through simple conversations in your own language. Built specially for elderly, rural citizens, and families who deserve their rightful support.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('voice')}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-800 text-white font-bold text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-0.5"
                >
                  <Mic className="w-6 h-6 animate-pulse" />
                  <span>Start Speaking (बोलना शुरू करें)</span>
                </button>

                <button
                  onClick={() => onNavigate('schemes')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition-all"
                >
                  <Search className="w-5 h-5 text-slate-500" />
                  <span>Explore Schemes (योजनाएं देखें)</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-serif">30+</div>
                  <div className="text-[11px] text-slate-500 font-medium">Verified Schemes</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-serif">28 States</div>
                  <div className="text-[11px] text-slate-500 font-medium">& 8 Union Territories</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-serif">22+ Langs</div>
                  <div className="text-[11px] text-slate-500 font-medium">& Regional Dialects</div>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Representative Illustration Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-amber-300 rounded-3xl blur-xl opacity-30 animate-pulse-subtle"></div>

                <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
                  
                  {/* Visual Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
                        🇮🇳
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Interaction</div>
                        <div className="text-sm font-bold text-slate-900">{currentState?.name || "India"} • {currentLanguage?.name}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Active
                    </span>
                  </div>

                  {/* Simulated Citizen Voice Bubble */}
                  <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                        👵
                      </div>
                      <span>नागरिक ने कहा (Citizen Said):</span>
                    </div>
                    <p className="text-sm font-serif italic text-slate-900 bg-white/70 p-2.5 rounded-xl border border-amber-200/50">
                      "मुझे बुढ़ापे की पेंशन के बारे में जानना है, मेरी उम्र 62 साल है।"
                    </p>
                  </div>

                  {/* Simulated JanSwar Response Bubble */}
                  <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 shadow-md">
                    <div className="flex items-center justify-between text-xs font-bold text-orange-400">
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4 text-orange-400 animate-pulse" />
                        <span>जनस्वर उत्तर (JanSwar Responds):</span>
                      </div>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">
                        TTS Spoken
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      "नमस्ते! आपकी उम्र 62 वर्ष है, इसलिए आप <strong>वृद्धावस्था पेंशन योजना</strong> के पात्र हैं। इसमें आपको प्रति माह आर्थिक सहायता सीधे बैंक खाते में मिलती है।"
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-amber-300 flex items-center justify-between">
                      <span>आवश्यक कागजात: आधार कार्ड, बैंक खाता पासबुक</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  </div>

                  {/* Interactive Micro-CTA */}
                  <button
                    onClick={() => onNavigate('voice')}
                    className="w-full py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 font-bold text-xs border border-orange-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Try it yourself with your voice</span>
                    <ArrowRight className="w-4 h-4 text-orange-600" />
                  </button>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. How JanSwar Works (SPEAK → UNDERSTAND → SEARCH → CHECK ELIGIBILITY → RESPOND) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            How JanSwar Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            SPEAK → UNDERSTAND → SEARCH → CHECK ELIGIBILITY → RESPOND
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black font-mono text-slate-200 group-hover:text-orange-500 transition-colors">
                      {st.num}
                    </span>
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${st.color} text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Why JanSwar Matters for Rural & Elderly Communities */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                Digital Inclusion for All
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-serif leading-tight">
                Why JanSwar Matters for India
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Billions of rupees in government welfare schemes remain unclaimed each year simply because citizens do not know they qualify or cannot navigate complicated online portals.
              </p>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <blockquote className="text-amber-200 text-xs italic font-serif leading-relaxed">
                  "Making government welfare information accessible to everyone, one conversation at a time."
                </blockquote>
              </div>
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300"
              >
                <span>Read our full architecture and mission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyMatters.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-slate-800/70 p-5 rounded-2xl border border-slate-700/80 space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-orange-600/20 text-orange-400 w-fit">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 4. Supported States & Languages Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-white border border-orange-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-orange-800 text-xs font-bold border border-orange-200">
              <Languages className="w-3.5 h-3.5 text-orange-600" />
              <span>State-Wise & Multi-Lingual Architecture</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Currently Selected: {currentState?.name} ({currentLanguage?.name})
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Switch anytime to explore welfare schemes in Maharashtra, Uttar Pradesh, Bihar, Tamil Nadu, Karnataka, Punjab, Bengal, Gujarat, and all other Indian States.
            </p>
          </div>

          <button
            onClick={onOpenStateModal}
            className="shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition-transform hover:scale-102"
          >
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>Select Another State or Language</span>
          </button>
        </div>
      </section>

      {/* 5. Featured Welfare Schemes Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Direct Assistance</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Featured Government Schemes
            </h2>
          </div>

          <button
            onClick={() => onNavigate('schemes')}
            className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
          >
            <span>View All Schemes Database</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
              Senior Citizens
            </span>
            <h3 className="text-lg font-bold text-slate-900">Old Age Pension Schemes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monthly pension assistance ranging from ₹1,000 to ₹3,000 for senior citizens aged 60+ (Central IGNOAPS and State pensions).
            </p>
            <div className="pt-2 text-xs font-bold text-orange-600">
              Benefits: Lifelong direct DBT to bank account
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Farmers
            </span>
            <h3 className="text-lg font-bold text-slate-900">PM-KISAN Samman Nidhi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ₹6,000 per year directly to farmer families across India in three 4-monthly installments of ₹2,000.
            </p>
            <div className="pt-2 text-xs font-bold text-orange-600">
              Benefits: ₹6,000/yr assured support
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
              Health & Healthcare
            </span>
            <h3 className="text-lg font-bold text-slate-900">Ayushman Bharat (PM-JAY)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Free hospitalization cover up to ₹5 Lakh per family per year, plus universal free coverage for all senior citizens aged 70+.
            </p>
            <div className="pt-2 text-xs font-bold text-orange-600">
              Benefits: ₹5,00,000 cashless treatment
            </div>
          </div>
        </div>
      </section>

      {/* 6. Big CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-8 sm:p-12 shadow-2xl overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-3xl sm:text-4xl font-black font-serif">
              Ready to find your government welfare benefits?
            </h3>
            <p className="text-sm sm:text-base text-orange-100">
              Just press the microphone button and speak in your language. JanSwar is waiting to assist you.
            </p>
            <button
              onClick={() => onNavigate('voice')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold text-base shadow-xl hover:bg-amber-50 transition-all transform hover:scale-105"
            >
              <Mic className="w-5 h-5 text-orange-600 animate-bounce" />
              <span>Open Voice Assistant Now</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
