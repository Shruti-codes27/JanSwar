import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StateLanguageSelector from './components/StateLanguageSelector';
import HomePage from './pages/HomePage';
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import SchemesPage from './pages/SchemesPage';
import EligibilityCheckerPage from './pages/EligibilityCheckerPage';
import AboutPage from './pages/AboutPage';
import { ALL_INDIAN_STATES, ALL_LANGUAGES_LIST } from './utils/indianData';
import { checkBackendHealth } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  // Default to Uttar Pradesh / Hindi or Maharashtra / Marathi
  const [currentState, setCurrentState] = useState(ALL_INDIAN_STATES[0]);
  const [currentLanguage, setCurrentLanguage] = useState(ALL_INDIAN_STATES[0].languages[0]);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState(1.0);
  const [highContrast, setHighContrast] = useState(false);
  const [selectedSchemeForEligibility, setSelectedSchemeForEligibility] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    // Check backend health
    checkBackendHealth().then((health) => {
      if (health && health.status === "healthy") {
        setBackendStatus("connected");
      } else {
        setBackendStatus("resilient-mode");
      }
    });

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const handleCheckEligibilityForScheme = (scheme) => {
    setSelectedSchemeForEligibility(scheme);
    setActivePage('eligibility');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors ${
      highContrast ? 'high-contrast bg-black text-white' : 'bg-[#fdfbf7] text-slate-900'
    }`}>
      
      {/* Navbar with accessibility controls */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        currentState={currentState}
        currentLanguage={currentLanguage}
        onOpenStateModal={() => setIsStateModalOpen(true)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* Main Page Area */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onNavigate={(page) => setActivePage(page)}
            currentState={currentState}
            currentLanguage={currentLanguage}
            onOpenStateModal={() => setIsStateModalOpen(true)}
          />
        )}

        {activePage === 'voice' && (
          <VoiceAssistantPage
            currentState={currentState}
            currentLanguage={currentLanguage}
            onOpenStateModal={() => setIsStateModalOpen(true)}
            onCheckEligibilityForScheme={handleCheckEligibilityForScheme}
          />
        )}

        {activePage === 'schemes' && (
          <SchemesPage
            currentState={currentState}
            onCheckEligibilityForScheme={handleCheckEligibilityForScheme}
          />
        )}

        {activePage === 'eligibility' && (
          <EligibilityCheckerPage
            currentState={currentState}
            preselectedScheme={selectedSchemeForEligibility}
          />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* State & Multi-Lingual Dialect Selector Modal */}
      <StateLanguageSelector
        isOpen={isStateModalOpen}
        onClose={() => setIsStateModalOpen(false)}
        currentState={currentState}
        onSelectState={(state) => setCurrentState(state)}
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => setCurrentLanguage(lang)}
      />

      {/* Footer */}
      <Footer onNavigate={(page) => setActivePage(page)} />

    </div>
  );
}
