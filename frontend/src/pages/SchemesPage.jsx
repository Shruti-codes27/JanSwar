import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  X,
  FileText
} from 'lucide-react';
import SchemeCard from '../components/SchemeCard';
import { SCHEME_CATEGORIES, ALL_INDIAN_STATES } from '../utils/indianData';
import { fetchSchemes } from '../services/api';

export default function SchemesPage({ 
  currentState, 
  onCheckEligibilityForScheme 
}) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState(currentState?.name || "All India");
  const [searchQuery, setSearchQuery] = useState("");

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await fetchSchemes({
        category: selectedCategory,
        state: selectedState,
        query: searchQuery
      });
      setSchemes(data);
    } catch (e) {
      console.error("Error loading schemes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
  }, [selectedCategory, selectedState]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSchemes();
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedState("All India");
    setSearchQuery("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold border border-orange-200">
          <FileText className="w-3.5 h-3.5 text-orange-600" />
          <span>National & State Welfare Directory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
          Government Welfare Schemes
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Explore officially verified Central and State government schemes across pensions, healthcare, agriculture, housing, and education.
        </p>
      </div>

      {/* Filter and Search Controls Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        
        {/* Search Bar + State Select */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <form onSubmit={handleSearchSubmit} className="md:col-span-8 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="योजना खोजें / Search schemes by name or keywords (e.g. Pension, Kisan, Ayushman)..."
              className="w-full pl-11 pr-24 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* State Filter Dropdown */}
          <div className="md:col-span-4 relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-800 appearance-none cursor-pointer"
            >
              <option value="All India">All India / All States (संपूर्ण भारत)</option>
              {ALL_INDIAN_STATES.map((st) => (
                <option key={st.code} value={st.name}>
                  {st.name} ({st.native})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Category Pills Strip */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Filter by Category:
            </span>

            {(selectedCategory !== "All" || selectedState !== "All India" || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SCHEME_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm font-bold text-slate-700">
          Showing <span className="text-orange-600 font-black">{schemes.length}</span> verified welfare schemes
          {selectedState !== "All India" && <span> for <strong>{selectedState}</strong></span>}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      {loading ? (
        <div className="text-center py-20 space-y-3">
          <RefreshCw className="w-8 h-8 text-orange-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Loading verified government schemes...</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl font-bold">
            🔍
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-serif">No matching schemes found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Try resetting your search query or selecting "All India" to view all available schemes across categories.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onCheckEligibility={onCheckEligibilityForScheme}
            />
          ))}
        </div>
      )}

    </div>
  );
}
