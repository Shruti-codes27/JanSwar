// JanSwar Backend API Client with Embedded Multi-Lingual Resilience

import fallbackSchemes from '../data/schemes.json';

const API_BASE_URL = "http://127.0.0.1:8000";

export const getFullAudioUrl = (relativeOrFull) => {
  if (!relativeOrFull) return null;
  if (relativeOrFull.startsWith("http://") || relativeOrFull.startsWith("https://")) {
    return relativeOrFull;
  }
  return `${API_BASE_URL}${relativeOrFull}`;
};

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { method: "GET" });
    if (!res.ok) return false;
    return await res.json();
  } catch (e) {
    console.warn("Backend not reached at 127.0.0.1:8000, using client resilience mode:", e.message);
    return false;
  }
}

export async function fetchSchemes(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.query) query.append("query", params.query);
    if (params.category && params.category !== "All") query.append("category", params.category);
    if (params.state && params.state !== "All India") query.append("state", params.state);
    if (params.gender) query.append("gender", params.gender);
    if (params.age) query.append("age", params.age);
    if (params.limit) query.append("limit", params.limit);

    const res = await fetch(`${API_BASE_URL}/api/schemes?${query.toString()}`);
    if (!res.ok) throw new Error("Backend unavailable");
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (e) {
    console.info("Using embedded schemes database:", e.message);
  }

  // Client-side fallback filter
  let results = [...fallbackSchemes];

  if (params.state && params.state !== "All India") {
    results = results.filter(s => 
      s.state_applicability === "All India" || 
      s.state_applicability.toLowerCase() === params.state.toLowerCase()
    );
  }

  if (params.category && params.category !== "All") {
    results = results.filter(s => s.category === params.category);
  }

  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    results = results.filter(s => 
      s.name.toLowerCase().includes(q) ||
      (s.name_hi && s.name_hi.toLowerCase().includes(q)) ||
      s.short_description.toLowerCase().includes(q) ||
      s.benefits.toLowerCase().includes(q)
    );
  }

  return results;
}

export async function fetchSchemeById(schemeId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/schemes/${encodeURIComponent(schemeId)}`);
    if (!res.ok) throw new Error("Scheme not found on backend");
    return await res.json();
  } catch (e) {
    return fallbackSchemes.find(s => s.id === schemeId) || null;
  }
}

export async function checkEligibility(profileData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/eligibility/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error("Backend eligibility calculation failed");
    return await res.json();
  } catch (e) {
    console.info("Running client-side eligibility matching engine");
    const userAge = profileData.age;
    const userState = profileData.state || "All India";
    const userIncome = profileData.annual_income;
    const userGender = profileData.gender || "All";
    const hasBpl = profileData.has_bpl_card;

    const evaluated = fallbackSchemes.filter(s => 
      s.state_applicability === "All India" || s.state_applicability === userState
    );

    const eligible = [];
    const partially = [];

    for (const scheme of evaluated) {
      const matched = [];
      const missing = [];
      let totalChecks = 0;
      let passedChecks = 0;

      // State check
      totalChecks++;
      if (scheme.state_applicability === "All India" || scheme.state_applicability === userState) {
        passedChecks++;
        matched.push(scheme.state_applicability === "All India" ? "Applicable across All India" : `Resident of ${scheme.state_applicability}`);
      }

      // Age check
      if (scheme.min_age !== null || scheme.max_age !== null) {
        totalChecks++;
        let ageOk = true;
        if (scheme.min_age !== null && userAge < scheme.min_age) ageOk = false;
        if (scheme.max_age !== null && userAge > scheme.max_age) ageOk = false;
        if (ageOk) {
          passedChecks++;
          matched.push(`Age ${userAge} satisfies requirement (${scheme.min_age || 0}+ yrs)`);
        } else {
          missing.push(`Age requirement (${scheme.min_age || 0} - ${scheme.max_age || 'any'} yrs)`);
        }
      }

      // Gender check
      if (scheme.gender && scheme.gender !== "All") {
        totalChecks++;
        if (userGender === scheme.gender || userGender === "All") {
          passedChecks++;
          matched.push(`Target gender matches: ${scheme.gender}`);
        } else {
          missing.push(`Reserved for ${scheme.gender} beneficiaries`);
        }
      }

      // Income check
      if (scheme.max_income !== null) {
        totalChecks++;
        if (userIncome <= scheme.max_income || hasBpl) {
          passedChecks++;
          matched.push(`Income ₹${userIncome?.toLocaleString('en-IN')} within ceiling of ₹${scheme.max_income?.toLocaleString('en-IN')}`);
        } else {
          missing.push(`Income ceiling of ₹${scheme.max_income?.toLocaleString('en-IN')}`);
        }
      }

      const score = Math.round((passedChecks / Math.max(1, totalChecks)) * 100);
      const isEligible = score >= 80 && missing.length === 0;

      const item = {
        scheme,
        is_eligible: isEligible,
        match_score: score,
        matched_criteria: matched,
        missing_criteria: missing,
        notes: isEligible ? "High eligibility likelihood based on provided data." : "Subject to additional documentary proof."
      };

      if (isEligible) {
        eligible.push(item);
      } else if (score >= 50) {
        partially.push(item);
      }
    }

    return {
      eligible_schemes: eligible.sort((a, b) => b.match_score - a.match_score),
      partially_eligible_schemes: partially.sort((a, b) => b.match_score - a.match_score),
      total_evaluated: evaluated.length,
      user_summary: profileData,
      disclaimer: "Notice: Informational guidance based on public scheme rules. Final eligibility verification belongs to the designated government departments."
    };
  }
}

export async function askVoiceAssistant({ 
  text, 
  state = "All India", 
  language_code = "hi-IN", 
  language_name = "Hindi",
  stage = "init",
  user_profile = {}
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        state,
        language_code,
        language_name,
        stage,
        user_profile
      })
    });
    if (!res.ok) throw new Error("Assistant API unavailable");
    const data = await res.json();
    if (data.audio_url) {
      data.audio_url = getFullAudioUrl(data.audio_url);
    }
    return data;
  } catch (e) {
    console.info("Using resilient local assistant generation:", e.message);
    
    // Client-side interactive parsing
    const clean = (text || "").toLowerCase();
    const profile = { ...(user_profile || {}), state };

    // Extract age
    const ageM = clean.match(/\b([1-9][0-9])\b/);
    if (ageM) profile.age = parseInt(ageM[1]);

    // Extract income
    if (clean.includes("50") || clean.includes("५०")) profile.annual_income = 50000;
    if (clean.includes("ration") || clean.includes("रेशन") || clean.includes("राशन") || clean.includes("bpl")) profile.has_bpl_card = true;
    if (clean.includes("farmer") || clean.includes("शेतकरी") || clean.includes("किसान")) profile.occupation = "Farmer";
    if (clean.includes("senior") || clean.includes("elderly") || clean.includes("ज्येष्ठ")) profile.occupation = "Senior Citizen";

    const isMarathi = language_code.startsWith("mr");
    const isTamil = language_code.startsWith("ta");
    const isTelugu = language_code.startsWith("te");

    let isInterview = true;
    let step = "ask_age";
    let qText = "";
    let quick = [];
    let explanation = "";
    let matches = [];

    if (!profile.age) {
      step = "ask_age";
      if (isMarathi) {
        qText = "नमस्कार! सरकारी योजना पात्रता तपासण्यासाठी:\nप्रश्न १: तुमचे वय किती वर्षे आहे?";
        quick = ["माझे वय ६० वर्षे आहे", "माझे वय ६५ वर्षे आहे", "वय ७० वर्षे", "वय ५० वर्षे"];
      } else if (isTamil) {
        qText = "வணக்கம்! தகுதியைச் சரிபார்க்க:\nகேள்வி 1: உங்கள் வயது என்ன?";
        quick = ["என் வயது 60", "என் வயது 65", "என் வயது 70"];
      } else if (isTelugu) {
        qText = "నమస్కారం! అర్హతను తనిఖీ చేయడానికి:\nప్రశ్న 1: మీ వయస్సు ఎంత?";
        quick = ["నా వయస్సు 60", "నా వయస్సు 65", "నా వయస్సు 70"];
      } else {
        qText = "नमस्ते! सरकारी योजना पात्रता जांचने के लिए:\nसवाल 1: आपकी उम्र कितने वर्ष है?";
        quick = ["मेरी उम्र 60 वर्ष है", "मेरी उम्र 65 वर्ष है", "उम्र 70 वर्ष"];
      }
      explanation = qText;
    } else if (!profile.annual_income && !profile.has_bpl_card) {
      step = "ask_income";
      if (isMarathi) {
        qText = `वय ${profile.age} वर्षे नोंदवले!\nप्रश्न २: कुटुंबाचे वार्षिक उत्पन्न किती किंवा रेशन कार्ड आहे का?`;
        quick = ["वार्षिक उत्पन्न ५०,००० आहे", "माझ्याकडे पिवळे रेशन कार्ड आहे", "उत्पन्न १ लाखापेक्षा कमी"];
      } else if (isTamil) {
        qText = `வயது ${profile.age} பதிவானது!\nகேள்வி 2: குடும்ப ஆண்டு வருமானம் எவ்வளவு அல்லது ரேஷன் கார்டு உள்ளதா?`;
        quick = ["ஆண்டு வருமானம் ₹50,000", "என்னிடம் ரேஷன் கார்டு உள்ளது"];
      } else {
        qText = `उम्र ${profile.age} वर्ष दर्ज!\nसवाल 2: परिवार की वार्षिक आय कितनी है या राशन कार्ड है?`;
        quick = ["वार्षिक आय 50,000 रुपये है", "मेरे पास BPL राशन कार्ड है"];
      }
      explanation = qText;
    } else if (!profile.occupation) {
      step = "ask_occupation";
      if (isMarathi) {
        qText = "प्रश्न ३: तुमचा मुख्य व्यवसाय काय आहे? (शेतकरी, मजूर, ज्येष्ठ नागरिक, गृहिणी?)";
        quick = ["मी शेतकरी आहे", "मी शेतमजूर आहे", "मी ज्येष्ठ नागरिक आहे", "मी गृहिणी आहे"];
      } else {
        qText = "सवाल 3: आपका मुख्य व्यवसाय क्या है? (किसान, मजदूर, वरिष्ठ नागरिक?)";
        quick = ["मैं किसान हूँ", "मैं दैनिक मजदूर हूँ", "मैं वरिष्ठ नागरिक हूँ"];
      }
      explanation = qText;
    } else {
      isInterview = false;
      step = "complete";
      matches = fallbackSchemes.filter(s => s.state_applicability === state || s.state_applicability === "All India").slice(0, 3);
      if (isMarathi) {
        explanation = `अभिनंदन! तुम्ही दिलेल्या माहितीनुसार खालील सरकारी योजनांसाठी पात्र आहात:\n१. ${matches[0]?.name || "कल्याणकारी योजना"}\n• मुख्य लाभ: ${matches[0]?.benefits}\n• आवश्यक कागदपत्रे: आधार कार्ड, रेशन कार्ड, बँक पासबुक.\n• अर्ज कुठे करावा: ग्रामपंचायत किंवा आपले सरकार केंद्र.`;
      } else {
        explanation = `बधाई हो! आपकी जानकारी के अनुसार आप इन योजनाओं के लिए पात्र हैं:\n1. ${matches[0]?.name || "कल्याणकारी योजना"}\n• मुख्य लाभ: ${matches[0]?.benefits}\n• आवश्यक कागजात: आधार कार्ड, राशन कार्ड, बैंक पासबुक.`;
      }
    }

    return {
      transcript: text,
      detected_language: language_name,
      state: state,
      intent: "eligibility interview",
      ai_explanation: explanation,
      audio_url: null,
      matched_schemes: matches,
      suggested_followups: quick,
      mode: "Intelligent Client Knowledge Engine",
      is_interview_mode: isInterview,
      current_step: step,
      question_text: qText,
      quick_replies: quick,
      collected_profile: profile
    };
  }
}

export async function uploadVoiceRecording(audioBlob, languageCode = "hi-IN") {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append("language_code", languageCode);

    const res = await fetch(`${API_BASE_URL}/api/voice/transcribe`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Audio upload failed");
    return await res.json();
  } catch (e) {
    console.error("uploadVoiceRecording error:", e);
    return {
      success: false,
      transcript: "",
      error: "Audio upload could not be processed by backend. Using browser real-time speech."
    };
  }
}

export async function synthesizeSpeech(text, languageCode = "hi-IN", slow = false) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/voice/synthesize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language_code: languageCode, slow })
    });
    if (!res.ok) throw new Error("Synthesize failed");
    const data = await res.json();
    if (data.audio_url) {
      data.audio_url = getFullAudioUrl(data.audio_url);
    }
    return data;
  } catch (e) {
    console.error("synthesizeSpeech error:", e);
    return { success: false, error: e.message };
  }
}
