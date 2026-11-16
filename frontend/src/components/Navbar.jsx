import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MapPin, 
  Languages, 
  Menu, 
  X, 
  Sun, 
  Eye, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Info, 
  Home
} from 'lucide-react';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  currentState, 
  currentLanguage, 
  onOpenStateModal,
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'voice', label: 'Talk to JanSwar', icon: Mic, highlight: true },
    { id: 'schemes', label: 'Government Schemes', icon: FileText },
    { id: 'eligibility', label: 'Check Eligibility', icon: CheckCircle2 },
    { id: 'about', label: 'About Us', icon: Info },
  ];

  const handleFontChange = (delta) => {
    let nextScale = Math.round((fontSize + delta) * 10) / 10;
    if (nextScale < 0.9) nextScale = 0.9;
    if (nextScale > 1.3) nextScale = 1.3;
    setFontSize(nextScale);
    document.documentElement.style.setProperty('--font-scale', nextScale.toString());
  };

  const handleResetFont = () => {
    setFontSize(1.0);
    document.documentElement.style.setProperty('--font-scale', '1');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors">
      {/* Top Gov Accessibility Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">भारत सरकार जनकल्याण सहायता | JanSwar Voice Portal</span>
          </div>

          {/* Accessibility controls for elderly */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-800 rounded px-2 py-0.5 border border-slate-700">
              <span className="mr-1.5 text-slate-400 font-mono text-[10px]">TEXT SIZE:</span>
              <button 
                onClick={() => handleFontChange(-0.1)} 
                className="px-1.5 py-0.5 hover:text-amber-400 font-bold transition-colors"
                title="Decrease font size"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <button 
                onClick={handleResetFont} 
                className="px-1.5 py-0.5 hover:text-amber-400 font-bold border-x border-slate-700 transition-colors"
                title="Reset font size"
                aria-label="Normal font size"
              >
                A
              </button>
              <button 
                onClick={() => handleFontChange(0.1)} 
                className="px-1.5 py-0.5 hover:text-amber-400 font-bold transition-colors"
                title="Increase font size"
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>

            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                highContrast ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title="Toggle High Contrast for low vision"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{highContrast ? 'High Contrast ON' : 'High Contrast'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Emblem */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* National Emblem & Voice Badge */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <Mic className="w-6 h-6 text-white animate-pulse-subtle" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-serif">
                  जन<span className="text-orange-600">स्वर</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold border border-orange-200">
                  JanSwar
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                बोलिए • जानिए • अपना अधिकार पाइए
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activePage === link.id;
              
              if (link.highlight) {
                return (
                  <button
                    key={link.id}
                    onClick={() => setActivePage(link.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 ${
                      isActive 
                        ? 'bg-orange-600 text-white ring-2 ring-orange-500 ring-offset-2'
                        : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-orange-500/25 hover:shadow-md hover:scale-102'
                    }`}
                  >
                    <Icon className="w-4 h-4 animate-bounce" />
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => setActivePage(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-100 text-orange-600'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-75" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* State & Language Selector Pill */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenStateModal}
              className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/80 text-slate-800 transition-all duration-200 shadow-sm"
              title="Click to change your State and Preferred Language"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <MapPin className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
                <span>{currentState?.name || "All India"}</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Languages className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-orange-700 font-bold">{currentLanguage?.native || "हिन्दी"}</span>
              </div>
              <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-amber-200 text-amber-800 font-mono">
                Change
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenStateModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>{currentState?.code || "IN"}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <div className="pb-3 border-b border-slate-100">
            <button
              onClick={() => {
                onOpenStateModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-left"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">State: {currentState?.name || "All India"}</div>
                  <div className="text-xs text-orange-700 font-medium">Language: {currentLanguage?.name} ({currentLanguage?.native})</div>
                </div>
              </div>
              <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded font-bold">Change</span>
            </button>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activePage === link.id;

            return (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
