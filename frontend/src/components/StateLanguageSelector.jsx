import React, { useState } from 'react';
import { 
  MapPin, 
  Languages, 
  Search, 
  Check, 
  X, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  Globe2
} from 'lucide-react';
import { ALL_INDIAN_STATES, ALL_LANGUAGES_LIST } from '../utils/indianData';

export default function StateLanguageSelector({ 
  isOpen, 
  onClose, 
  currentState, 
  onSelectState, 
  currentLanguage, 
  onSelectLanguage 
}) {
  const [step, setStep] = useState(1); // 1 = Select State, 2 = Select Language
  const [tempState, setTempState] = useState(currentState || ALL_INDIAN_STATES[0]);
  const [tempLang, setTempLang] = useState(currentLanguage || ALL_LANGUAGES_LIST[0]);
  const [searchStateQuery, setSearchStateQuery] = useState("");
  const [searchLangQuery, setSearchLangQuery] = useState("");

  if (!isOpen) return null;

  // Filter states
  const filteredStates = ALL_INDIAN_STATES.filter(s => 
    s.name.toLowerCase().includes(searchStateQuery.toLowerCase()) ||
    s.native.toLowerCase().includes(searchStateQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchStateQuery.toLowerCase())
  );

  // Suggested languages for selected state
  const stateLanguages = tempState?.languages || [];
  
  // All other languages filtered
  const filteredAllLanguages = ALL_LANGUAGES_LIST.filter(l =>
    l.name.toLowerCase().includes(searchLangQuery.toLowerCase()) ||
    l.native.toLowerCase().includes(searchLangQuery.toLowerCase()) ||
    l.code.toLowerCase().includes(searchLangQuery.toLowerCase())
  );

  const handleStateClick = (state) => {
    setTempState(state);
    // Auto-select primary language of the chosen state
    const primary = state.languages[0];
    if (primary) {
      const match = ALL_LANGUAGES_LIST.find(l => l.code === primary.code) || primary;
      setTempLang(match);
    }
    setStep(2);
  };

  const handleConfirm = () => {
    onSelectState(tempState);
    onSelectLanguage(tempLang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/30 text-orange-300 text-xs font-bold border border-orange-500/40">
              Personalized Citizen Settings
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif">
            {step === 1 ? "चरण 1: अपना राज्य चुनें (Step 1: Choose Your State)" : `चरण 2: अपनी भाषा चुनें (${tempState.name})`}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {step === 1 
              ? "Select your state to discover schemes specifically announced by your state government and Central schemes."
              : `Choose the language or regional dialect you want to speak and listen in for ${tempState.name}.`
            }
          </p>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                step === 1 ? 'bg-orange-600 text-white shadow-md' : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>1. State: {tempState.name}</span>
            </button>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                step === 2 ? 'bg-orange-600 text-white shadow-md' : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>2. Language: {tempLang.name} ({tempLang.native})</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <div>
              {/* Search State */}
              <div className="relative mb-5">
                <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchStateQuery}
                  onChange={(e) => setSearchStateQuery(e.target.value)}
                  placeholder="राज्य खोजें / Search State or UT (e.g. Maharashtra, UP, Bihar, Tamil Nadu)..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              {/* State Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredStates.map((st) => {
                  const isSelected = tempState.code === st.code;
                  return (
                    <button
                      key={st.code}
                      onClick={() => handleStateClick(st)}
                      className={`text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50/80 shadow-md ring-2 ring-orange-500/20' 
                          : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-bold">
                          {st.code}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                      </div>
                      <div className="mt-2">
                        <div className="font-bold text-slate-900 text-sm leading-snug">{st.name}</div>
                        <div className="text-xs text-orange-700 font-medium mt-0.5">{st.native}</div>
                      </div>
                      <div className="mt-2 pt-1 border-t border-slate-200/50 text-[10px] text-slate-500">
                        Primary: {st.languages[0]?.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Highlighted Languages for this state */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-900">
                    {tempState.name} में सर्वाधिक बोली जाने वाली भाषाएँ (Recommended for {tempState.name}):
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stateLanguages.map((sl) => {
                    const isSelected = tempLang.code === sl.code;
                    return (
                      <button
                        key={sl.code}
                        onClick={() => setTempLang(sl)}
                        className={`text-left p-4 rounded-2xl border transition-all ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/90 shadow-md ring-2 ring-orange-500/20'
                            : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 font-medium">{sl.name}</span>
                          {sl.isDialect && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                              Regional Dialect
                            </span>
                          )}
                          {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                        </div>
                        <div className="text-lg font-black text-slate-900 font-serif">
                          {sl.native}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* All Indian Languages Option */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-slate-600" />
                    <h4 className="text-sm font-bold text-slate-900">
                      अन्य सभी भारतीय भाषाएँ (All 22+ Indian Languages & Dialects):
                    </h4>
                  </div>
                </div>

                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchLangQuery}
                    onChange={(e) => setSearchLangQuery(e.target.value)}
                    placeholder="भाषा खोजें / Search language (e.g. Marathi, Telugu, Bengali, Tamil, Gujarati)..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1">
                  {filteredAllLanguages.map((al) => {
                    const isSelected = tempLang.code === al.code;
                    return (
                      <button
                        key={al.code}
                        onClick={() => setTempLang(al)}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50 font-bold text-orange-950 ring-1 ring-orange-500'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">{al.native}</div>
                        <div className="text-[10px] text-slate-500">{al.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Selected: <span className="font-bold text-slate-900">{tempState.name}</span> • Language: <span className="font-bold text-orange-600">{tempLang.name} ({tempLang.native})</span>
          </div>

          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Back to State
              </button>
            )}

            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-102"
            >
              <span>Set Preferences & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
