// Master dataset of Indian States, UTs, Languages, and Sample Inquiries

export const ALL_INDIAN_STATES = [
  {
    code: "UP",
    name: "Uttar Pradesh",
    native: "उत्तर प्रदेश",
    primaryLang: "hi-IN",
    languages: [
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "bho", name: "Bhojpuri", native: "भोजपुरी", isDialect: true },
      { code: "ur-IN", name: "Urdu", native: "اردو" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "मुझे वृद्धावस्था पेंशन के नियम बताएं",
      "कन्या सुमंगला योजना में कितने पैसे मिलते हैं?",
      "किसान कर्ज माफी या पीएम किसान की स्थिति क्या है?"
    ]
  },
  {
    code: "MH",
    name: "Maharashtra",
    native: "महाराष्ट्र",
    primaryLang: "mr-IN",
    languages: [
      { code: "mr-IN", name: "Marathi", native: "मराठी" },
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "संजय गांधी निराधार योजनेची माहिती द्या",
      "लाडकी बहीण योजनेसाठी काय कागदपत्रे लागतात?",
      "ज्येष्ठ नागरिकांसाठी मोफत आरोग्य विमा योजना कोणती आहे?"
    ]
  },
  {
    code: "BR",
    name: "Bihar",
    native: "बिहार",
    primaryLang: "hi-IN",
    languages: [
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "bho", name: "Bhojpuri", native: "भोजपुरी", isDialect: true },
      { code: "mai-IN", name: "Maithili", native: "मैथिली" },
      { code: "ur-IN", name: "Urdu", native: "اردو" }
    ],
    sampleQueries: [
      "मुख्यमंत्री वृद्धजन पेंशन योजना कैसे मिलेगी?",
      "स्टूडेंट क्रेडिट कार्ड योजना में 4 लाख का लोन कैसे लें?",
      "कन्या उत्थान योजना का लाभ कैसे मिलेगा?"
    ]
  },
  {
    code: "WB",
    name: "West Bengal",
    native: "পশ্চিমবঙ্গ",
    primaryLang: "bn-IN",
    languages: [
      { code: "bn-IN", name: "Bengali", native: "বাংলা" },
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "কন্যাশ্রী প্রকল্পের টাকা কীভাবে পাব?",
      "কৃষক বন্ধু যোজনায় বার্ষিক কত টাকা পাওয়া যায়?",
      "বার্ধক্য পেনশনের জন্য কী কী কাগজ লাগবে?"
    ]
  },
  {
    code: "MP",
    name: "Madhya Pradesh",
    native: "मध्य प्रदेश",
    primaryLang: "hi-IN",
    languages: [
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "लाड़ली बहना योजना में 1250 रुपये प्रतिमाह कैसे मिलेंगे?",
      "संबल योजना के क्या लाभ हैं?",
      "वृद्धावस्था पेंशन का फॉर्म कहाँ जमा होता है?"
    ]
  },
  {
    code: "TN",
    name: "Tamil Nadu",
    native: "தமிழ்நாடு",
    primaryLang: "ta-IN",
    languages: [
      { code: "ta-IN", name: "Tamil", native: "தமிழ்" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "கலைஞர் மகளிர் உரிமை திட்டத்திற்கு விண்ணப்பிப்பது எப்படி?",
      "புதுமைப் பெண் திட்டத்தின் மூலம் மாதத்திற்கு ₹1000 பெறுவது எப்படி?",
      "முதியோர் ஓய்வூதியத்திற்கு தகுதிகள் என்ன?"
    ]
  },
  {
    code: "KA",
    name: "Karnataka",
    native: "ಕರ್ನಾಟಕ",
    primaryLang: "kn-IN",
    languages: [
      { code: "kn-IN", name: "Kannada", native: "ಕನ್ನಡ" },
      { code: "en-IN", name: "English", native: "English" },
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" }
    ],
    sampleQueries: [
      "ಗೃಹ ಲಕ್ಷ್ಮಿ ಯೋಜನೆಯ ₹2000 ಹಣ ಪಡೆಯುವುದು ಹೇಗೆ?",
      "ಯುವ ನಿಧಿ ಯೋಜನೆಗೆ ಯಾರು ಅರ್ಹರು?",
      "ಹಿರಿಯ ನಾಗರಿಕರ ಪಿಂಚಣಿ ವಿವರ ತಿಳಿಸಿ"
    ]
  },
  {
    code: "GJ",
    name: "Gujarat",
    native: "ગુજરાત",
    primaryLang: "gu-IN",
    languages: [
      { code: "gu-IN", name: "Gujarati", native: "ગુજરાતી" },
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "નિરાધાર વૃદ્ધ પેન્શન યોજનાની વિગતો આપો",
      "મુખ્યમંત્રી અમૃતમ (MA) કાર્ડ યોજના કેવી રીતે મેળવવી?",
      "ખેડૂત સહાય યોજના વિશે જણાવો"
    ]
  },
  {
    code: "RJ",
    name: "Rajasthan",
    native: "राजस्थान",
    primaryLang: "hi-IN",
    languages: [
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "mwr", name: "Rajasthani", native: "राजस्थानी", isDialect: true },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "चिरंजीवी स्वास्थ्य बीमा योजना में 25 लाख का इलाज कैसे मिलेगा?",
      "बुजुर्गों के लिए सामाजिक सुरक्षा पेंशन योजना क्या है?",
      "पीएम किसान सम्मान निधि में ई-केवाईसी कैसे करें?"
    ]
  },
  {
    code: "AP",
    name: "Andhra Pradesh",
    native: "ఆంధ్రప్రదేశ్",
    primaryLang: "te-IN",
    languages: [
      { code: "te-IN", name: "Telugu", native: "తెలుగు" },
      { code: "en-IN", name: "English", native: "English" },
      { code: "ur-IN", name: "Urdu", native: "اردو" }
    ],
    sampleQueries: [
      "వైఎస్సార్ పెన్షన్ కానుక అర్హతలు ఏమిటి?",
      "రైతు భరోసా పథకం ద్వారా ఎంత సహాయం అందుతుంది?",
      "ఆరోగ్యశ్రీ కార్డు ద్వారా ఉచిత వైద్యం ఎలా పొందాలి?"
    ]
  },
  {
    code: "TG",
    name: "Telangana",
    native: "తెలంగాణ",
    primaryLang: "te-IN",
    languages: [
      { code: "te-IN", name: "Telugu", native: "తెలుగు" },
      { code: "ur-IN", name: "Urdu", native: "اردو" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "రైతు బంధు పథకం పెట్టుబడి సాయం ఎప్పుడు వస్తుంది?",
      "ఆసరా పెన్షన్ కోసం ఏయే పత్రాలు కావాలి?",
      "మహಾಲక్ష్మి పథకం ఉచిత బస్సు ప్రయాణ నియమాలు ఏమిటి?"
    ]
  },
  {
    code: "PB",
    name: "Punjab",
    native: "ਪੰਜਾਬ",
    primaryLang: "pa-IN",
    languages: [
      { code: "pa-IN", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਯੋਜਨਾ ਪੰਜਾਬ ਦੇ ਨਿਯਮ ਕੀ ਹਨ?",
      "ਸਰਬੱਤ ਸਿਹਤ ਬੀਮਾ ਯੋਜਨਾ ਵਿੱਚ ਮੁਫ਼ਤ ਇਲਾਜ ਕਿਵੇਂ ਮਿਲੇਗਾ?",
      "ਕਿਸਾਨਾਂ ਲਈ ਖੇਤੀ ਕਰਜ਼ਾ ਰਾਹਤ ਸਕੀਮ ਕੀ ਹੈ?"
    ]
  },
  {
    code: "HR",
    name: "Haryana",
    native: "हरियाणा",
    primaryLang: "hi-IN",
    languages: [
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "bgc", name: "Haryanvi", native: "हरियाणवी", isDialect: true },
      { code: "pa-IN", name: "Punjabi", native: "ਪੰਜਾਬੀ" }
    ],
    sampleQueries: [
      "हरियाणा में 3000 रुपये वृद्धावस्था पेंशन कैसे मिलेगी?",
      "परिवार पहचान पत्र (PPP) से पेंशन कैसे बनती है?",
      "चिरायु हरियाणा स्वास्थ्य योजना की जानकारी दें"
    ]
  },
  {
    code: "OD",
    name: "Odisha",
    native: "ଓଡ଼ିଶା",
    primaryLang: "or-IN",
    languages: [
      { code: "or-IN", name: "Odia", native: "ଓଡ଼ିଆ" },
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "ମଧୁ ବାବୁ ପେନସନ ଯୋଜନା ବିଷୟରେ ଜଣାନ୍ତୁ",
      "ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନାରେ କାର୍ଡ଼ କିପରି ମିଳିବ?",
      "କାଳିଆ (KALIA) ଯୋଜନାରେ କୃଷକ କିପରି ସହାୟତା ପାଇବେ?"
    ]
  },
  {
    code: "KL",
    name: "Kerala",
    native: "കേരളം",
    primaryLang: "ml-IN",
    languages: [
      { code: "ml-IN", name: "Malayalam", native: "മലയാളം" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "സാമൂഹ്യ സുരക്ഷാ പെൻഷൻ എങ്ങനെ ലഭിക്കും?",
      "കാരുണ്യ ആരോഗ്യ സുരക്ഷാ പദ്ധതിയുടെ ആനുകൂല്യങ്ങൾ എന്തൊക്കെയാണ്?",
      "കർഷക ക്ഷേമ പെൻഷൻ വിവരങ്ങൾ നൽകുക"
    ]
  },
  {
    code: "AS",
    name: "Assam",
    native: "অসম",
    primaryLang: "as-IN",
    languages: [
      { code: "as-IN", name: "Assamese", native: "অসমীয়া" },
      { code: "bn-IN", name: "Bengali", native: "বাংলা" },
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "অৰুণোদয় আঁচনিৰ ধন কেনেকৈ পাব পাৰি?",
      "অসম বৃদ্ধ পেঞ্চনৰ নিয়ম কি?",
      "আয়ুষ্মান অসম কাৰ্ডৰ সুবিধা কেনেকৈ লব লাগে?"
    ]
  },
  {
    code: "JH",
    name: "Jharkhand",
    native: "झारखंड",
    primaryLang: "hi-IN",
    languages: [
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "sat-IN", name: "Santali", native: "संथाली" },
      { code: "bho", name: "Bhojpuri", native: "भोजपुरी", isDialect: true },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "सर्वजन पेंशन योजना झारखंड के तहत 1000 रुपये कैसे मिलते हैं?",
      "मंईयां सम्मान योजना का लाभ महिलाओं को कैसे मिलेगा?",
      "बिरसा हरित ग्राम योजना क्या है?"
    ]
  },
  {
    code: "CG",
    name: "Chhattisgarh",
    native: "छत्तीसगढ़",
    primaryLang: "hi-IN",
    languages: [
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "hne", name: "Chhattisgarhi", native: "छत्तीसगढ़ी", isDialect: true }
    ],
    sampleQueries: [
      "महतारी वंदन योजना में हर महीने 1000 रुपये कैसे मिलेंगे?",
      "राजीव गांधी किसान न्याय योजना की जानकारी दें",
      "वृद्धावस्था पेंशन के लिए आय प्रमाण पत्र जरूरी है क्या?"
    ]
  },
  {
    code: "UT",
    name: "Uttarakhand",
    native: "उत्तराखंड",
    primaryLang: "hi-IN",
    languages: [
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "उत्तराखंड वृद्धावस्था पेंशन योजना के क्या नियम हैं?",
      "अटल आयुष्मान उत्तराखंड योजना में 5 लाख का कार्ड कैसे बनवाएं?",
      "गौरा देवी कन्या धन योजना क्या है?"
    ]
  },
  {
    code: "HP",
    name: "Himachal Pradesh",
    native: "हिमाचल प्रदेश",
    primaryLang: "hi-IN",
    languages: [
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "इंदिरा गांधी प्यारी बहना सुख सम्मान निधि योजना क्या है?",
      "हिमकेयर (HIMCARE) स्वास्थ्य योजना में पंजीकरण कैसे करें?",
      "बुजुर्गों के लिए सामाजिक सुरक्षा पेंशन कैसे मिलेगी?"
    ]
  },
  {
    code: "GA",
    name: "Goa",
    native: "गोंय",
    primaryLang: "kok-IN",
    languages: [
      { code: "kok-IN", name: "Konkani", native: "कोंकणी" },
      { code: "mr-IN", name: "Marathi", native: "मराठी" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "दयानंद सामाजिक सुरक्षा योजनेची माहिती द्या",
      "गृह आधार योजनेचा लाभ कसा मिळवावा?",
      "दीनदयाळ स्वास्थ्य सेवा योजनेचे कार्ड कसे काढावे?"
    ]
  },
  {
    code: "DL",
    name: "Delhi (NCT)",
    native: "दिल्ली",
    primaryLang: "hi-IN",
    languages: [
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "en-IN", name: "English", native: "English" },
      { code: "pa-IN", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
      { code: "ur-IN", name: "Urdu", native: "اردو" }
    ],
    sampleQueries: [
      "दिल्ली वृद्धावस्था पेंशन योजना 2000 रुपये कैसे मिलेगी?",
      "महिला सम्मान योजना की पात्रता क्या है?",
      "मुफ्त बस यात्रा योजना और राशन कार्ड कैसे बनवाएं?"
    ]
  },
  {
    code: "JK",
    name: "Jammu & Kashmir",
    native: "جموں و کشمیر",
    primaryLang: "ur-IN",
    languages: [
      { code: "ks-IN", name: "Kashmiri", native: "کٲشُر" },
      { code: "doi-IN", name: "Dogri", native: "डोगरी" },
      { code: "ur-IN", name: "Urdu", native: "اردو" },
      { code: "hi-IN", name: "Hindi", native: "हिन्दी" },
      { code: "en-IN", name: "English", native: "English" }
    ],
    sampleQueries: [
      "آئی جی این او اے پی ایس اولڈ ایج پنشن کی معلومات فراہم کریں۔",
      "صحت آیوشمان بھارت گولڈن کارڈ کیسے بنوائیں؟",
      "لاڈلی بیٹی اسکیم کی شرائط کیا ہیں؟"
    ]
  }
];

export const ALL_LANGUAGES_LIST = [
  { code: "hi-IN", name: "Hindi", native: "हिन्दी", region: "North/Central India" },
  { code: "en-IN", name: "English", native: "English", region: "Pan-India" },
  { code: "mr-IN", name: "Marathi", native: "मराठी", region: "Maharashtra" },
  { code: "bn-IN", name: "Bengali", native: "বাংলা", region: "West Bengal, Tripura, Assam" },
  { code: "te-IN", name: "Telugu", native: "తెలుగు", region: "Andhra Pradesh, Telangana" },
  { code: "ta-IN", name: "Tamil", native: "தமிழ்", region: "Tamil Nadu, Puducherry" },
  { code: "gu-IN", name: "Gujarati", native: "ગુજરાતી", region: "Gujarat" },
  { code: "kn-IN", name: "Kannada", native: "ಕನ್ನಡ", region: "Karnataka" },
  { code: "ml-IN", name: "Malayalam", native: "മലയാളം", region: "Kerala, Lakshadweep" },
  { code: "pa-IN", name: "Punjabi", native: "ਪੰਜਾਬੀ", region: "Punjab, Chandigarh, Delhi" },
  { code: "or-IN", name: "Odia", native: "ଓଡ଼ିଆ", region: "Odisha" },
  { code: "as-IN", name: "Assamese", native: "অসমীয়া", region: "Assam" },
  { code: "ur-IN", name: "Urdu", native: "اردو", region: "Pan-India" },
  { code: "mai-IN", name: "Maithili", native: "मैथिली", region: "Bihar, Jharkhand" },
  { code: "kok-IN", name: "Konkani", native: "कोंकणी", region: "Goa, coastal Maharashtra" },
  { code: "sat-IN", name: "Santali", native: "संथाली", region: "Jharkhand, Odisha, Bengal" },
  { code: "ks-IN", name: "Kashmiri", native: "کٲشُر", region: "Jammu & Kashmir" },
  { code: "ne-IN", name: "Nepali", native: "नेपाली", region: "Sikkim, West Bengal" },
  { code: "bho", name: "Bhojpuri", native: "भोजपुरी", region: "UP, Bihar, Jharkhand", isDialect: true },
  { code: "bgc", name: "Haryanvi", native: "हरियाणवी", region: "Haryana", isDialect: true },
  { code: "mwr", name: "Rajasthani", native: "राजस्थानी", region: "Rajasthan", isDialect: true },
  { code: "hne", name: "Chhattisgarhi", native: "छत्तीसगढ़ी", region: "Chhattisgarh", isDialect: true }
];

export const SCHEME_CATEGORIES = [
  { id: "All", name: "All Schemes", icon: "LayoutGrid", desc: "View all national & state welfare schemes" },
  { id: "Senior Citizens", name: "Senior Citizens", icon: "HeartHandshake", desc: "Pensions, social security, elder healthcare" },
  { id: "Women Empowerment", name: "Women Empowerment", icon: "Sparkles", desc: "Financial independence, maternal support, gas subsidy" },
  { id: "Girl Child Welfare", name: "Girl Child Welfare", icon: "Baby", desc: "Sukanya Samriddhi, education grants, protection" },
  { id: "Farmers", name: "Farmers & Agriculture", icon: "Sprout", desc: "PM-KISAN, crop insurance, fertilizer support" },
  { id: "Students", name: "Students & Youth", icon: "GraduationCap", desc: "Scholarships, skill allowances, laptops, student loans" },
  { id: "Health and Healthcare", name: "Health & Healthcare", icon: "Activity", desc: "Ayushman Bharat, free hospital treatments, medicines" },
  { id: "Financial Assistance", name: "Financial Assistance", icon: "Banknote", desc: "PM Mudra loans, PM Vishwakarma craft grants" },
  { id: "Rural Development", name: "Rural Development", icon: "Home", desc: "PM Awas Yojana houses, MGNREGA employment" }
];
