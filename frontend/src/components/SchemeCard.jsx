import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  IndianRupee, 
  MapPin, 
  Users, 
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';

export default function SchemeCard({ scheme, onCheckEligibility }) {
  const [expanded, setExpanded] = useState(false);

  if (!scheme) return null;

  // Category color theme
  const getCategoryTheme = (cat) => {
    switch (cat) {
      case 'Senior Citizens':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Farmers':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Women Empowerment':
        return 'bg-pink-50 text-pink-800 border-pink-200';
      case 'Girl Child Welfare':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Health and Healthcare':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Rural Development':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Students':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const isStateSpecific = scheme.state_applicability && scheme.state_applicability !== 'All India';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      
      {/* Top Header */}
      <div className="p-5 sm:p-6 pb-4">
        
        {/* Badges row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getCategoryTheme(scheme.category)}`}>
              {scheme.category}
            </span>

            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
              isStateSpecific 
                ? 'bg-orange-50 text-orange-800 border-orange-200' 
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}>
              <MapPin className="w-3 h-3" />
              <span>{scheme.state_applicability}</span>
            </span>
          </div>

          {scheme.verified && (
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Gov Verified
            </span>
          )}
        </div>

        {/* Scheme Name & Hindi Name */}
        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
          {scheme.name}
        </h3>
        {scheme.name_hi && (
          <p className="text-sm font-semibold text-orange-700 mt-1 font-serif">
            {scheme.name_hi}
          </p>
        )}

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
          {scheme.short_description}
        </p>

        {/* Key Benefits Highlight Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/80">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-orange-600 text-white shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-900">
                Key Benefits (मुख्य लाभ):
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                {scheme.benefits}
              </p>
            </div>
          </div>
        </div>

        {/* Eligibility Pill Summary */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Age: {scheme.min_age !== null ? `${scheme.min_age}+ yrs` : 'Any age'}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Gender: {scheme.gender || 'All'}</span>
          </div>

          {scheme.income_criteria && (
            <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 truncate max-w-full">
              <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{scheme.income_criteria}</span>
            </div>
          )}
        </div>

        {/* Collapsible Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3.5 text-xs animate-fadeIn">
            
            {/* Required Documents */}
            {scheme.required_documents && scheme.required_documents.length > 0 && (
              <div>
                <span className="font-bold text-slate-900 block mb-1.5 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-orange-600" />
                  Required Documents (आवश्यक कागजात):
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {scheme.required_documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-slate-700 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Application Information */}
            {scheme.application_info && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">How to Apply (आवेदन प्रक्रिया):</span>
                <p className="leading-relaxed">{scheme.application_info}</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1 transition-colors"
        >
          <span>{expanded ? 'Less Details' : 'View Documents & Rules'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2">
          {onCheckEligibility && (
            <button
              onClick={() => onCheckEligibility(scheme)}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-102"
            >
              Check Eligibility
            </button>
          )}

          {scheme.official_website && (
            <a
              href={scheme.official_website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-orange-600 transition-colors"
              title="Open Official Government Portal"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

    </div>
  );
}
