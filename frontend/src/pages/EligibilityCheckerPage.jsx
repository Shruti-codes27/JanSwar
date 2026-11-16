import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  IndianRupee, 
  MapPin, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  FileText,
  RotateCcw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_INDIAN_STATES } from '../utils/indianData';
import { checkEligibility } from '../services/api';

export default function EligibilityCheckerPage({ 
  currentState, 
  preselectedScheme = null 
}) {
  const [formData, setFormData] = useState({
    state: currentState?.name || "Uttar Pradesh",
    age: 62,
    gender: "All",
    annual_income: 60000,
    occupation: "Farmer",
    is_disabled: false,
    has_bpl_card: true
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const occupationsList = [
    "Farmer",
    "Agricultural Worker",
    "Daily Wage Laborer",
    "Small Business Owner / Shopkeeper",
    "Artisan / Craftsperson",
    "Student",
    "Senior Citizen / Retired",
    "Homemaker",
    "Unemployed Youth",
    "Unorganized Worker"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await checkEligibility(formData);
      setResults(data);
      setHasEvaluated(true);

      // Trigger celebratory confetti if high match
      if (data.eligible_schemes && data.eligible_schemes.length > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error("Eligibility check error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      state: currentState?.name || "Uttar Pradesh",
      age: 60,
      gender: "All",
      annual_income: 50000,
      occupation: "Farmer",
      is_disabled: false,
      has_bpl_card: true
    });
    setResults(null);
    setHasEvaluated(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold border border-orange-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
          <span>Interactive Citizen Eligibility Matcher</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
          Check Your Scheme Eligibility
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Enter a few simple details to instantly see which welfare schemes match your age, state, and family profile.
        </p>
      </div>

      {/* Official Disclaimer Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Important Notice: </strong>
          This tool provides informational guidance based on publicly notified scheme rules. Final eligibility verification and benefit sanctioning always belong to the designated government departments and local verification officers.
        </div>
      </div>

      {/* 2-Column Layout: Form on Left, Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900 font-serif">
              Citizen Profile
            </h3>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
            
            {/* State */}
            <div>
              <label className="block mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>Your State of Residence (राज्य):</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 font-bold text-slate-900"
              >
                {ALL_INDIAN_STATES.map((st) => (
                  <option key={st.code} value={st.name}>
                    {st.name} ({st.native})
                  </option>
                ))}
              </select>
            </div>

            {/* Age Slider + Number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  <span>Age (उम्र):</span>
                </label>
                <span className="text-sm font-black text-orange-600 font-mono">
                  {formData.age} years
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-1.5">Gender (लिंग):</label>
              <div className="grid grid-cols-3 gap-2">
                {['Female', 'Male', 'All'].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.gender === g
                        ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g === 'Female' ? 'महिला (Female)' : g === 'Male' ? 'पुरुष (Male)' : 'सभी (Any)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Occupation */}
            <div>
              <label className="block mb-1.5 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-orange-600" />
                <span>Primary Occupation (व्यवसाय):</span>
              </label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 font-medium"
              >
                {occupationsList.map((occ) => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            {/* Annual Income */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-orange-600" />
                  <span>Annual Family Income (वार्षिक आय):</span>
                </label>
                <span className="text-xs font-mono font-bold text-slate-900">
                  ₹{formData.annual_income.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                step="10000"
                min="0"
                max="2500000"
                value={formData.annual_income}
                onChange={(e) => setFormData({ ...formData, annual_income: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 font-bold"
              />
            </div>

            {/* Special checkboxes */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.has_bpl_card}
                  onChange={(e) => setFormData({ ...formData, has_bpl_card: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-orange-600"
                />
                <span className="text-xs text-slate-700">Family holds BPL / Antyodaya / Ration Card</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.is_disabled}
                  onChange={(e) => setFormData({ ...formData, is_disabled: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-orange-600"
                />
                <span className="text-xs text-slate-700">Person with Benchmark Disability (Divyangjan)</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-102 flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Matching Criteria..." : "Check My Matching Schemes"}</span>
            </button>

          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {!hasEvaluated ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl">
                📋
              </div>
              <h3 className="text-xl font-black text-slate-900 font-serif">
                Fill the profile to find schemes
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                We'll match your age, income, and state against the exact guidelines of both Central and State welfare programs.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Score summary banner */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Evaluation Complete</span>
                  <h3 className="text-xl font-black text-slate-900 font-serif">
                    {results?.eligible_schemes?.length || 0} Highly Eligible Schemes Found
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluated against {results?.total_evaluated || 0} schemes for {formData.state} and All India.
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex flex-col items-center justify-center font-black border border-emerald-200 shrink-0">
                  <span className="text-xl">{results?.eligible_schemes?.length || 0}</span>
                  <span className="text-[9px] uppercase">Matched</span>
                </div>
              </div>

              {/* Eligible Schemes List */}
              {results?.eligible_schemes && results.eligible_schemes.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>High Likelihood Schemes (उच्च पात्रता):</span>
                  </h4>

                  {results.eligible_schemes.map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-white rounded-3xl p-6 border-2 border-emerald-500/40 shadow-sm space-y-3.5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {item.scheme.category} • {item.scheme.state_applicability}
                          </span>
                          <h4 className="text-lg font-black text-slate-900 mt-1 font-serif">
                            {item.scheme.name}
                          </h4>
                          {item.scheme.name_hi && (
                            <p className="text-xs font-bold text-orange-700">{item.scheme.name_hi}</p>
                          )}
                        </div>

                        <div className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                          {item.match_score}% Match
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-amber-50 text-amber-950 text-xs font-semibold">
                        🎁 Benefits: {item.scheme.benefits}
                      </div>

                      {/* Why you match */}
                      <div className="space-y-1.5 text-xs">
                        <span className="font-bold text-slate-900 block">Why you matched (पात्रता का कारण):</span>
                        <ul className="space-y-1 text-slate-700">
                          {item.matched_criteria.map((mc, mIdx) => (
                            <li key={mIdx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{mc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Required Documents */}
                      {item.scheme.required_documents && item.scheme.required_documents.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 text-xs">
                          <span className="font-bold text-slate-900 block mb-1">Required Papers (कागजात):</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.scheme.required_documents.map((doc, dIdx) => (
                              <span key={dIdx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px]">
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action */}
                      {item.scheme.official_website && (
                        <div className="pt-2 flex justify-end">
                          <a
                            href={item.scheme.official_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
                          >
                            <span>Open Official Application Portal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Partially Eligible Schemes */}
              {results?.partially_eligible_schemes && results.partially_eligible_schemes.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Other Potential Schemes (Conditional / Verification Needed):</span>
                  </h4>

                  {results.partially_eligible_schemes.slice(0, 4).map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-slate-900 text-sm">{item.scheme.name}</h5>
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          {item.match_score}%
                        </span>
                      </div>
                      <p className="text-slate-600">{item.scheme.short_description}</p>
                      
                      {item.missing_criteria && item.missing_criteria.length > 0 && (
                        <div className="p-2 rounded-xl bg-slate-50 text-slate-600 text-[11px]">
                          <strong>Pending Verification: </strong>
                          {item.missing_criteria.join("; ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
