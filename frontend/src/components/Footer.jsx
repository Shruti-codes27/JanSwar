import React from 'react';
import { 
  ShieldCheck, 
  PhoneCall, 
  Languages, 
  Heart, 
  ExternalLink, 
  HelpCircle,
  FileCheck
} from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Disclaimer & Mission Strip */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">
                Official Information & Citizen Empowerment Disclaimer
              </h4>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                JanSwar (जनस्वर) is an AI-powered voice assistant developed to bridge the digital divide for elderly and rural citizens. All scheme rules, financial aids, and required documents are strictly verified against the National Portal of India (india.gov.in) and respective State Government Gazette notifications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              28 States & 22+ Languages Supported
            </span>
          </div>
        </div>

        {/* 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: About JanSwar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white font-serif">
                जन<span className="text-orange-500">स्वर</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                AI Voice GovTech
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Making government welfare information accessible to everyone, one conversation at a time."
            </p>
            <div className="pt-2 text-xs text-slate-400">
              Designed with high accessibility standards for elderly citizens, visually impaired persons, and rural families.
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Explore Portal
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('voice')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  🎙️ Talk to Voice Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('schemes')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  📋 All Government Schemes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('eligibility')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  ✅ Eligibility Checker Wizard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  ℹ️ About Project & Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Welfare Categories */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Scheme Categories
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Senior Citizens (Old Age Pensions)</li>
              <li>Farmers & Agriculture (PM-KISAN)</li>
              <li>Women Empowerment (Ladli Behna, KMUT)</li>
              <li>Healthcare (Ayushman Bharat PM-JAY)</li>
              <li>Rural Development & Pucca Housing (PMAY)</li>
              <li>Merit Scholarships for Students</li>
            </ul>
          </div>

          {/* Col 4: National Citizen Helplines */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              National Helplines
            </h5>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-300">Elder Line (Senior Citizens):</span>
                <span className="font-mono font-bold text-amber-400">14567</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-300">National Women Helpline:</span>
                <span className="font-mono font-bold text-pink-400">181</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-300">Kisan Call Centre (Farmers):</span>
                <span className="font-mono font-bold text-emerald-400">1800-180-1551</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-300">Ayushman Bharat PM-JAY:</span>
                <span className="font-mono font-bold text-sky-400">14555</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Security */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} JanSwar (जनस्वर). Developed for citizen digital empowerment.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Zero Audio Storage • Privacy Preserving • Multi-Dialect Ready</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
