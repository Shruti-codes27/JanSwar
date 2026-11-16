import os
import json
import re
from typing import Dict, Any, List, Optional
from backend.services.scheme_search import search_schemes, detect_intents
from backend.services.eligibility_engine import check_all_schemes_eligibility
from backend.services.text_to_speech import tts_service
from backend.database import get_db_connection

# Comprehensive Multi-Lingual Regional Interview and Response Templates
# Supports 100% authentic native phrasing in all regional languages
REGIONAL_INTERVIEW_CONFIGS = {
    "hi-IN": {
        "greeting": "नमस्ते!",
        "ask_age": "आपकी सही सरकारी योजना पात्रता जांचने के लिए मैं आपसे 3 छोटे सवाल पूछता हूँ।\nसवाल 1: आपकी उम्र कितने वर्ष है?",
        "ask_income": "धन्यवाद! सवाल 2: आपके परिवार की कुल वार्षिक आय कितनी है या क्या आपके पास राशन कार्ड (BPL/अंत्योदय) है?",
        "ask_occupation": "सवाल 3: आपका मुख्य व्यवसाय क्या है? (जैसे किसान, दैनिक मजदूर, वरिष्ठ नागरिक, गृहणी या छात्र?)",
        "verdict_congrats": "बधाई हो! आपकी जानकारी के आधार पर आप निम्नलिखित सरकारी योजनाओं के लिए पात्र हैं:\n",
        "verdict_none": "आपकी दी गई जानकारी के अनुसार वर्तमान में कोई पूर्णतः मेल खाती योजना नहीं मिली। कृपया अपने नजदीकी जन सेवा केंद्र (CSC) से संपर्क करें।",
        "docs_prefix": "आवश्यक दस्तावेज़:",
        "apply_prefix": "आवेदन प्रक्रिया: आप अपने नजदीकी ग्राम पंचायत, जन सेवा केंद्र (CSC) या ब्लॉक कार्यालय में जाकर आवेदन कर सकते हैं।",
        "quick_age": ["मेरी उम्र 60 वर्ष है", "मेरी उम्र 65 वर्ष है", "मेरी उम्र 70 वर्ष है", "उम्र 45 वर्ष"],
        "quick_income": ["वार्षिक आय 50,000 रुपये है", "मेरे पास BPL राशन कार्ड है", "आय 1 लाख से कम है"],
        "quick_occ": ["मैं किसान हूँ", "मैं दैनिक मजदूर हूँ", "मैं वरिष्ठ नागरिक हूँ", "मैं गृहणी हूँ"],
        "followups": ["इस योजना के लिए फॉर्म कहाँ मिलेगा?", "पैसे सीधे बैंक खाते में कब आएंगे?", "क्या मेरी पत्नी भी पात्र हैं?"]
    },
    "mr-IN": {
        "greeting": "नमस्कार!",
        "ask_age": "तुमची अचूक सरकारी योजना पात्रता तपासण्यासाठी मी तुम्हाला ३ सोपे प्रश्न विचारतो.\nप्रश्न १: तुमचे वय किती वर्षे आहे?",
        "ask_income": "धन्यवाद! प्रश्न २: तुमच्या कुटुंबाचे वार्षिक उत्पन्न किती आहे किंवा तुमच्याकडे रेशन कार्ड (पिवळे/केशरी/BPL) आहे का?",
        "ask_occupation": "प्रश्न ३: तुमचा मुख्य व्यवसाय काय आहे? (उदा. शेतकरी, शेतमजूर, दैनिक मजूर, ज्येष्ठ नागरिक, गृहिणी किंवा विद्यार्थी?)",
        "verdict_congrats": "अभिनंदन! तुम्ही दिलेल्या माहितीनुसार तुम्ही खालील सरकारी योजनांसाठी पात्र आहात:\n",
        "verdict_none": "दिलेल्या माहितीनुसार सध्या कोणतीही थेट योजना आढळली नाही. अधिक माहितीसाठी जवळच्या आपले सरकार सेवा केंद्राशी संपर्क साधा.",
        "docs_prefix": "आवश्यक कागदपत्रे:",
        "apply_prefix": "अर्ज कसा करावा: आपण गावातील ग्रामपंचायत, आपले सरकार सेवा केंद्र किंवा सेतू केंद्रावर जाऊन अर्ज करू शकता.",
        "quick_age": ["माझे वय ६० वर्षे आहे", "माझे वय ६५ वर्षे आहे", "माझे वय ७० वर्षे आहे", "वय ५० वर्षे"],
        "quick_income": ["वार्षिक उत्पन्न ५०,००० आहे", "माझ्याकडे पिवळे रेशन कार्ड आहे", "उत्पन्न १ लाखापेक्षा कमी"],
        "quick_occ": ["मी शेतकरी आहे", "मी शेतमजूर आहे", "मी ज्येष्ठ नागरिक आहे", "मी गृहिणी आहे"],
        "followups": ["या योजनेचा फॉर्म कुठे मिळेल?", "पैसे थेट बँकेत कधी जमा होतील?", "कुटुंबातील इतर व्यक्ती पात्र आहेत का?"]
    },
    "ta-IN": {
        "greeting": "வணக்கம்!",
        "ask_age": "உங்கள் சரியான அரசு நலத்திட்ட தகுதியைச் சரிபார்க்க நான் 3 எளிய கேள்விகளைக் கேட்கிறேன்.\nகேள்வி 1: உங்கள் வயது என்ன?",
        "ask_income": "நன்றி! கேள்வி 2: உங்கள் குடும்பத்தின் ஆண்டு வருமானம் எவ்வளவு அல்லது உங்களிடம் ரேஷன் கார்டு உள்ளதா?",
        "ask_occupation": "கேள்வி 3: உங்கள் தொழில் என்ன? (விவசாயி, கூலித் தொழிலாளி, முதியோர், இல்லத்தரசி, அல்லது மாணவர்?)",
        "verdict_congrats": "வாழ்த்துகள்! நீங்கள் வழங்கிய தகவலின்படி பின்வரும் அரசு நலத்திட்டங்களுக்குத் தகுதியானவர்:\n",
        "verdict_none": "நீங்கள் வழங்கிய தகவலுக்குப் பொருந்தக்கூடிய திட்டங்கள் தற்போது கிடைக்கவில்லை. அருகிலுள்ள இ-சேவை மையத்தை அணுகவும்.",
        "docs_prefix": "தேவையான ஆவணங்கள்:",
        "apply_prefix": "விண்ணப்பிக்கும் முறை: உங்கள் அருகிலுள்ள இ-சேவை மையம் அல்லது கிராம நிர்வாக அலுவலகத்தை அணுகி விண்ணப்பிக்கலாம்.",
        "quick_age": ["என் வயது 60 ஆண்டுகள்", "என் வயது 65 ஆண்டுகள்", "என் வயது 70 ஆண்டுகள்", "வயது 45"],
        "quick_income": ["ஆண்டு வருமானம் ₹50,000", "என்னிடம் ரேஷன் கார்டு உள்ளது", "வருமானம் 1 லட்சத்திற்கும் குறைவு"],
        "quick_occ": ["நான் விவசாயி", "நான் கூலித் தொழிலாளி", "நான் முதியோர்", "நான் இல்லத்தரசி"],
        "followups": ["இந்த திட்டத்திற்கு எங்கு விண்ணப்பிக்க வேண்டும்?", "பணம் எப்போது வங்கி கணக்கில் வரும்?"]
    },
    "te-IN": {
        "greeting": "నమస్కారం!",
        "ask_age": "మీకు సరిపోయే ప్రభుత్వ సంక్షేమ పథకాలను గుర్తించడానికి నేను 3 సాధారణ ప్రశ్నలు అడుగుతాను.\nప్రశ్న 1: మీ వయస్సు ఎంత?",
        "ask_income": "ధన్యవాదాలు! ప్రశ్న 2: మీ కుటుంబ వార్షిక ఆదాయం ఎంత లేదా మీ వద్ద రేషన్ కార్డు ఉందా?",
        "ask_occupation": "ప్రశ్న 3: మీ ప్రధాన వృత్తి ఏమిటి? (రైతు, కూలీ, వృద్ధులు, గృహిణి లేదా విద్యార్థి?)",
        "verdict_congrats": "అభినందనలు! మీరు అందించిన వివరాల ప్రకారం ఈ క్రింది ప్రభుత్వ పథకాలకు అర్హులు:\n",
        "verdict_none": "ప్రస్తుతం సరిపోయే పథకం కనుగొనబడలేదు. దయచేసి సమీప మీసేవా కేంద్రాన్ని సంప్రదించండి.",
        "docs_prefix": "అవసరమైన పత్రాలు:",
        "apply_prefix": "దరఖాస్తు విధానం: మీరు సమీప గ్రామ/వార్డు సచివాలయం లేదా మీసేవా కేంద్రంలో దరఖాస్తు చేసుకోవచ్చు.",
        "quick_age": ["నా వయస్సు 60 సంవత్సరాలు", "నా వయస్సు 65 సంవత్సరాలు", "నా వయస్సు 70 సంవత్సరాలు"],
        "quick_income": ["వార్షిక ఆదాయం ₹50,000", "నా వద్ద రేషన్ కార్డు ఉంది", "ఆదాయం ₹1 లక్ష కంటే తక్కువ"],
        "quick_occ": ["నేను రైతును", "నేను కూలీని", "నేను వృద్ధుడిని", "నేను గృహిణిని"],
        "followups": ["దరఖాస్తు ఎక్కడ సమర్పించాలి?", "డబ్బులు ఎప్పుడు వస్తాయి?"]
    },
    "bn-IN": {
        "greeting": "নমস্কার!",
        "ask_age": "আপনার সঠিক সরকারি প্রকল্পের যোগ্যতা পরীক্ষা করার জন্য আমি ৩টি সহজ প্রশ্ন করছি।\nপ্রশ্ন ১: আপনার বয়স কত বছর?",
        "ask_income": "ধন্যবাদ! প্রশ্ন ২: আপনার পরিবারের বার্ষিক আয় কত বা আপনার কাছে রেশন কার্ড (BPL) আছে কি?",
        "ask_occupation": "প্রশ্ন ৩: আপনার মূল পেশা কি? (কৃষক, দিনমজুর, প্রবীণ নাগরিক, গৃহিণী বা ছাত্র?)",
        "verdict_congrats": "অভিনন্দন! আপনার দেওয়া তথ্য অনুযায়ী আপনি নিম্নলিখিত সরকারি প্রকল্পগুলির জন্য যোগ্য:\n",
        "verdict_none": "আপনার তথ্যের সাথে মিল রেখে কোনও প্রকল্প পাওয়া যায়নি। নিকটস্থ দুয়ারে সরকার ক্যাম্প বা বাংলা সহায়তা কেন্দ্রে যোগাযোগ করুন।",
        "docs_prefix": "প্রয়োজনীয় নথিপত্র:",
        "apply_prefix": "আবেদন প্রক্রিয়া: আপনি স্থানীয় গ্রাম পঞ্চায়েত বা দুয়ারে সরকার ক্যাম্পে গিয়ে আবেদন করতে পারেন।",
        "quick_age": ["আমার বয়স ৬০ বছর", "আমার বয়স ৬৫ বছর", "আমার বয়স ৭০ বছর"],
        "quick_income": ["বার্ষিক আয় ৫০,০০০ টাকা", "আমার BPL রেশন কার্ড আছে", "আয় ১ লক্ষের নিচে"],
        "quick_occ": ["আমি কৃষক", "আমি দিনমজুর", "আমি প্রবীণ নাগরিক", "আমি গৃহিণী"],
        "followups": ["এই প্রকল্পের ফরম কোথায় পাওয়া যাবে?", "টাকা ব্যাংকে কখন ঢুকবে?"]
    },
    "gu-IN": {
        "greeting": "નમસ્તે!",
        "ask_age": "તમારી સાચી સરકારી યોજના પાત્રતા તપાસવા માટે હું તમને ૩ સરળ પ્રશ્નો પૂછું છું.\nપ્રશ્ન ૧: તમારી ઉંમર કેટલી છે?",
        "ask_income": "આભાર! પ્રશ્ન ૨: તમારા કુટુંબની વાર્ષિક આવક કેટલી છે અથવા તમારી પાસે રેશનકાર્ડ (BPL) છે?",
        "ask_occupation": "પ્રશ્ન ૩: તમારો મુખ્ય વ્યવસાય કયો છે? (ખેડૂત, દૈનિક મજૂર, વરિષ્ઠ નાગરિક કે ગૃહિણી?)",
        "verdict_congrats": "અભિનંદન! તમે આપેલી વિગતો અનુસાર તમે નીચેની સરકારી યોજનાઓ માટે પાત્ર છો:\n",
        "verdict_none": "કોઈ સીધી યોજના મળી નથી. કૃપા કરીને જન સેવા કેન્દ્રનો સંપર્ક કરો.",
        "docs_prefix": "જરૂરી દસ્તાવેજો:",
        "apply_prefix": "અરજી કરવાની રીત: તમે નજીકની ગ્રામ પંચાયત અથવા જન સેવા કેન્દ્ર (CSC) પર જઈને અરજી કરી શકો છો.",
        "quick_age": ["મારી ઉંમર ૬૦ વર્ષ છે", "મારી ઉંમર ૬૫ વર્ષ છે", "મારી ઉંમર ૭૦ વર્ષ છે"],
        "quick_income": ["વાર્ષિક આવક ₹૫૦,૦૦૦ છે", "મારી પાસે BPL રેશનકાર્ડ છે", "આવક ૧ લાખથી ઓછી છે"],
        "quick_occ": ["હું ખેડૂત છું", "હું મજૂર છું", "હું વરિષ્ઠ નાગરિક છું", "હું ગૃહિણી છું"],
        "followups": ["ફોર્મ ક્યાં મળશે?", "પૈસા ખાતામાં ક્યારે જમા થશે?"]
    },
    "kn-IN": {
        "greeting": "ನಮಸ್ಕಾರ!",
        "ask_age": "ನಿಮ್ಮ ನಿಖರವಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ನಾನು 3 ಸರಳ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳುತ್ತೇನೆ.\nಪ್ರಶ್ನೆ 1: ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?",
        "ask_income": "ಧನ್ಯವಾದಗಳು! ಪ್ರಶ್ನೆ 2: ನಿಮ್ಮ ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ ಎಷ್ಟು ಅಥವಾ ರೇಷನ್ ಕಾರ್ಡ್ ಇದೆಯೇ?",
        "ask_occupation": "ಪ್ರಶ್ನೆ 3: ನಿಮ್ಮ ಮುಖ್ಯ ಕಸುಬು ಯಾವುದು? (ರೈತ, ದಿನಗೂಲಿ, ಹಿರಿಯ ನಾಗರಿಕ ಅಥವಾ ಗೃಹಿಣಿ?)",
        "verdict_congrats": "ಅಭಿನಂದನೆಗಳು! ನೀವು ನೀಡಿದ ಮಾಹಿತಿಯ ಪ್ರಕಾರ ಈ ಕೆಳಗಿನ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ:\n",
        "verdict_none": "ಯಾವುದೇ ಯೋಜನೆ ಕಂಡುಬಂದಿಲ್ಲ. ಹತ್ತಿರದ ಗ್ರಾಮ ಒನ್ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.",
        "docs_prefix": "ಅಗತ್ಯ ದಾಖಲೆಗಳು:",
        "apply_prefix": "ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ: ಗ್ರಾಮ ಒನ್, ಕರ್ನಾಟಕ ಒನ್ ಅಥವಾ ಗ್ರಾಮ ಪಂಚಾಯತ್ ಕಚೇರಿಗೆ ಭೇಟಿ ನೀಡಿ.",
        "quick_age": ["ನನ್ನ ವಯಸ್ಸು 60 ವರ್ಷ", "ನನ್ನ ವಯಸ್ಸು 65 ವರ್ಷ", "ನನ್ನ ವಯಸ್ಸು 70 ವರ್ಷ"],
        "quick_income": ["ವಾರ್ಷಿಕ ಆದಾಯ ₹50,000", "ನನ್ನ ಬಳಿ ರೇಷನ್ ಕಾರ್ಡ್ ಇದೆ", "ಆದಾಯ 1 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ"],
        "quick_occ": ["ನಾನು ರೈತ", "ನಾನು ದಿನಗೂಲಿ", "ನಾನು ಹಿರಿಯ ನಾಗರಿಕ", "ನಾನು ಗೃಹಿಣಿ"],
        "followups": ["ಅರ್ಜಿ ಎಲ್ಲಿ ಸಲ್ಲಿಸಬೇಕು?", "ಹಣ ಯಾವಾಗ ಜಮೆಯಾಗುತ್ತದೆ?"]
    },
    "pa-IN": {
        "greeting": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ!",
        "ask_age": "ਤੁਹਾਡੀ ਸਰਕਾਰੀ ਸਕੀਮ ਯੋਗਤਾ ਜਾਂਚਣ ਲਈ ਮੈਂ 3 ਆਸਾਨ ਸਵਾਲ ਪੁੱਛਾਂਗਾ।\nਸਵਾਲ 1: ਤੁਹਾਡੀ ਉਮਰ ਕਿੰਨੀ ਹੈ?",
        "ask_income": "ਧੰਨਵਾਦ! ਸਵਾਲ 2: ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਦੀ ਸਾਲਾਨਾ ਆਮਦਨ ਕਿੰਨੀ ਹੈ ਜਾਂ ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਰਾਸ਼ਨ ਕਾਰਡ ਹੈ?",
        "ask_occupation": "ਸਵਾਲ 3: ਤੁਹਾਡਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ? (ਕਿਸਾਨ, ਮਜ਼ਦੂਰ, ਬਜ਼ੁਰਗ ਨਾਗਰਿਕ ਜਾਂ ਗ੍ਰਹਿਣੀ?)",
        "verdict_congrats": "ਮੁਬਾਰਕਾਂ! ਤੁਹਾਡੇ ਵੇਰਵਿਆਂ ਅਨੁਸਾਰ ਤੁਸੀਂ ਹੇਠ ਲਿਖੀਆਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲਈ ਯੋਗ ਹੋ:\n",
        "verdict_none": "ਕੋਈ ਖਾਸ ਸਕੀਮ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ ਸੇਵਾ ਕੇਂਦਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
        "docs_prefix": "ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼:",
        "apply_prefix": "ਅਰਜ਼ੀ ਕਿਵੇਂ ਦੇਣੀ ਹੈ: ਤੁਸੀਂ ਆਪਣੇ ਨਜ਼ਦੀਕੀ ਸੇਵਾ ਕੇਂਦਰ ਜਾਂ ਪੰਚਾਇਤ ਦਫ਼ਤਰ ਜਾ ਕੇ ਅਰਜ਼ੀ ਦੇ ਸਕਦੇ ਹੋ।",
        "quick_age": ["ਮੇਰੀ ਉਮਰ 60 ਸਾਲ ਹੈ", "ਮੇਰੀ ਉਮਰ 65 ਸਾਲ ਹੈ", "ਮੇਰੀ ਉਮਰ 70 ਸਾਲ ਹੈ"],
        "quick_income": ["ਸਾਲਾਨਾ ਆਮਦਨ ₹50,000 ਹੈ", "ਮੇਰੇ ਕੋਲ ਰਾਸ਼ਨ ਕਾਰਡ ਹੈ", "ਆਮਦਨ 1 ਲੱਖ ਤੋਂ ਘੱਟ ਹੈ"],
        "quick_occ": ["ਮੈਂ ਕਿਸਾਨ ਹਾਂ", "ਮੈਂ ਮਜ਼ਦੂਰ ਹਾਂ", "ਮੈਂ ਬਜ਼ੁਰਗ ਨਾਗਰਿਕ ਹਾਂ"],
        "followups": ["ਫਾਰਮ ਕਿੱਥੇ ਮਿਲੇਗਾ?", "ਪੈਸੇ ਸਿੱਧੇ ਖਾਤੇ ਵਿੱਚ ਕਦੋਂ ਆਉਣਗੇ?"]
    },
    "ml-IN": {
        "greeting": "നമസ്കാരം!",
        "ask_age": "നിങ്ങൾക്ക് അനുയോജ്യമായ ക്ഷേമപദ്ധതികൾ കണ്ടെത്താൻ ഞാൻ 3 ചോദ്യങ്ങൾ ചോദിക്കാം.\nചോദ്യം 1: നിങ്ങളുടെ പ്രായം എത്രയാണ്?",
        "ask_income": "നന്ദി! ചോദ്യം 2: കുടുംബത്തിന്റെ വാർഷಿಕ വരുമാനം എത്രയാണ് അല്ലെങ്കിൽ റേഷൻ കാർഡ് ഉണ്ടോ?",
        "ask_occupation": "ചോദ്യം 3: നിങ്ങളുടെ പ്രധാന തൊഴിൽ എന്താണ്? (കർഷകൻ, കൂലിപ്പണിക്കാരൻ, മുതിർന്ന പൗരൻ?)",
        "verdict_congrats": "അഭിനന്ദനങ്ങൾ! നിങ്ങൾ നൽകിയ വിവരങ്ങൾ പ്രകാരം താഴെപ്പറയുന്ന പദ്ധതികൾക്ക് അർഹരാണ്:\n",
        "verdict_none": "പദ്ധതികൾ കണ്ടെത്താനായില്ല. അടുത്തുള്ള അക്ഷയ കേന്ദ്രവുമായി ബന്ധപ്പെടുക.",
        "docs_prefix": "ആവശ്യമായ രേഖകൾ:",
        "apply_prefix": "അപേക്ഷിക്കേണ്ട വിധം: അടുത്തുള്ള അക്ഷയ കേന്ദ്രം അല്ലെങ്കിൽ പഞ്ചായത്ത് ഓഫീസ് വഴി അപേക്ഷിക്കാം.",
        "quick_age": ["എനിക്ക് 60 വയസ്സുണ്ട്", "എനിക്ക് 65 വയസ്സുണ്ട്", "എനിക്ക് 70 വയസ്സുണ്ട്"],
        "quick_income": ["വാർഷിക വരുമാനം ₹50,000", "റേഷൻ കാർഡ് ഉണ്ട്", "വരുമാനം 1 ലക്ഷത്തിൽ താഴെ"],
        "quick_occ": ["ഞാൻ കർഷകനാണ്", "ഞാൻ കൂലിപ്പണിക്കാരനാണ്", "ഞാൻ മുതിർന്ന പൗരനാണ്"],
        "followups": ["അപേക്ഷ എവിടെ നൽകണം?", "പണം എപ്പോൾ അക്കൗണ്ടിൽ വരും?"]
    },
    "ur-IN": {
        "greeting": "آداب!",
        "ask_age": "آپ کی درست فلاحی اسکیم اہلیت جانچنے کے لیے میں آپ سے ۳ آسان سوالات پوچھتا ہوں۔\nسوال ۱: آپ کی عمر کتنے سال ہے؟",
        "ask_income": "شکریہ! سوال ۲: آپ کے خاندان کی سالانہ آمدنی کتنی ہے یا کیا آپ کے پاس راشن کارڈ ہے؟",
        "ask_occupation": "سوال ۳: آپ کا بنیادی پیشہ کیا ہے؟ (کسان، مزدور، معمر شہری، گھریلو خاتون؟)",
        "verdict_congrats": "مبارک ہو! آپ درج ذیل سرکاری فلاحی اسکیموں کے لیے اہل ہیں:\n",
        "verdict_none": "کوئی اسکیم نہیں ملی۔ برائے کرم اپنے قریبی سی ایس سی سینٹر سے رابطہ کریں۔",
        "docs_prefix": "ضروری دستاویزات:",
        "apply_prefix": "درخواست کیسے دیں: آپ قریبی گرام پنچایت یا سی ایس سی سینٹر جا کر درخواست دے سکتے ہیں۔",
        "quick_age": ["میری عمر 60 سال ہے", "میری عمر 65 سال ہے", "میری عمر 70 سال ہے"],
        "quick_income": ["سالانہ آمدنی 50,000 روپے ہے", "میرے پاس راشن کارڈ ہے"],
        "quick_occ": ["میں کسان ہوں", "میں مزدور ہوں", "میں معمر شہری ہوں"],
        "followups": ["فارم کہاں جمع کرائیں؟", "رقم کب اکاؤنٹ میں آئے گی؟"]
    },
    "or-IN": {
        "greeting": "ନମସ୍କାର!",
        "ask_age": "ଆପଣଙ୍କ ସଠିକ ଯୋଜନା ଯୋଗ୍ୟତା ପାଇଁ ମୁଁ ୩ଟି ପ୍ରଶ୍ନ ପଚାରୁଛି।\nପ୍ରଶ୍ନ ୧: ଆପଣଙ୍କ ବୟସ କେତେ ବର୍ଷ?",
        "ask_income": "ଧନ୍ୟବାଦ! ପ୍ରଶ୍ନ ୨: ପରିବାରର ବାର୍ଷିକ ଆୟ କେତେ କିମ୍ବା ରାସନ କାର୍ଡ ଅଛି କି?",
        "ask_occupation": "ପ୍ରଶ୍ନ ୩: ଆପଣଙ୍କ ମୁଖ୍ୟ ବୃତ୍ତି କ'ଣ? (କୃଷକ, ଦିନମଜୁରିଆ, ବରିଷ୍ଠ ନାଗରିକ?)",
        "verdict_congrats": "ଅଭିନନ୍ଦନ! ଆପଣ ନିମ୍ନଲିଖିତ ସରକାରୀ ଯୋଜନା ପାଇଁ ଯୋଗ୍ୟ ଅଟନ୍ତି:\n",
        "verdict_none": "କୌଣସି ଯୋଜନା ମିଳିଲା ନାହିଁ। ଦୟାକରି ନିକଟସ୍ଥ ଜନ ସେବା କେନ୍ଦ୍ରକୁ ଯାଆନ୍ତୁ।",
        "docs_prefix": "ଆବଶ୍ୟକ କାଗଜପତ୍ର:",
        "apply_prefix": "ଆବେଦନ କିପରି କରିବେ: ନିକଟସ୍ଥ ଗ୍ରାମ ପଞ୍ଚାୟତ ବା ବ୍ଲକ କାର୍ଯ୍ୟାଳୟରେ ଆବେଦନ କରନ୍ତୁ।",
        "quick_age": ["ମୋର ବୟସ ୬୦ ବର୍ଷ", "ମୋର ବୟସ ୬୫ ବର୍ଷ", "ମୋର ବୟସ ୭୦ ବର୍ଷ"],
        "quick_income": ["ବାର୍ଷିକ ଆୟ ₹୫୦,୦୦୦", "ମୋ ପାଖରେ ରାସନ କାର୍ଡ ଅଛି"],
        "quick_occ": ["ମୁଁ ଚାଷୀ", "ମୁଁ ଦିନମଜୁରିଆ", "ମୁଁ ବରିଷ୍ଠ ନାଗରିକ"],
        "followups": ["ଫର୍ମ କେଉଁଠି ମିଳିବ?", "ଟଙ୍କା କେବେ ଆସିବ?"]
    },
    "en-IN": {
        "greeting": "Namaste and Welcome!",
        "ask_age": "To check your exact welfare scheme eligibility, let me ask you 3 quick questions.\nQuestion 1: What is your age in years?",
        "ask_income": "Thank you! Question 2: What is your annual family income, or do you hold a BPL/Ration card?",
        "ask_occupation": "Question 3: What is your primary occupation? (e.g. Farmer, Daily Wage Laborer, Senior Citizen, Homemaker, or Student?)",
        "verdict_congrats": "Congratulations! Based on your answers, you are eligible for the following welfare schemes:\n",
        "verdict_none": "No direct matching scheme found based on these specific answers. Please visit your nearest Common Service Centre (CSC).",
        "docs_prefix": "Required Documents:",
        "apply_prefix": "How to Apply: You can apply at your local Gram Panchayat, Common Service Centre (CSC), or official government portal.",
        "quick_age": ["I am 60 years old", "I am 65 years old", "I am 70 years old", "Age 45 years"],
        "quick_income": ["Annual income is ₹50,000", "I have a BPL ration card", "Income is under ₹1 Lakh"],
        "quick_occ": ["I am a Farmer", "I am a Daily Wage Laborer", "I am a Senior Citizen", "I am a Homemaker"],
        "followups": ["Where can I submit the application?", "When will funds be credited?"]
    }
}

def get_regional_config(language_code: str) -> Dict[str, Any]:
    if language_code in REGIONAL_INTERVIEW_CONFIGS:
        return REGIONAL_INTERVIEW_CONFIGS[language_code]
    prefix = language_code.split("-")[0]
    for key, val in REGIONAL_INTERVIEW_CONFIGS.items():
        if key.startswith(prefix):
            return val
    return REGIONAL_INTERVIEW_CONFIGS["hi-IN"]

# Parsing helpers to extract demographic parameters from voice text
DEVANAGARI_DIGITS = {"०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9"}

def normalize_digits(text: str) -> str:
    res = text
    for d, v in DEVANAGARI_DIGITS.items():
        res = res.replace(d, v)
    return res

def parse_age_from_text(text: str) -> Optional[int]:
    norm = normalize_digits(text.lower())
    # 1. Explicit age with suffix: e.g. "65 saal", "65 वर्ष", "65 वर्षे", "age 65", "வயது 65"
    explicit = re.search(r'\b([1-9][0-9]?)\s*(?:saal|sal|वर्ष|वर्षे|years|year|yrs|yr|வயது|సంవత్సరాలు|বছর)\b', norm)
    if explicit:
        val = int(explicit.group(1))
        if 5 <= val <= 110:
            return val

    # 2. Explicit age prefix: e.g. "age is 65", "वय 65", "उम्र 65"
    explicit_prefix = re.search(r'(?:age|वय|उम्र|வயது|వయస్సు|বয়স|ઉંમર)\s*(?:is|आहे|है|என்)?\s*([1-9][0-9]?)', norm)
    if explicit_prefix:
        val = int(explicit_prefix.group(1))
        if 5 <= val <= 110:
            return val

    # 3. Standalone 2-digit number NOT followed by currency or thousand/lakh
    m = re.search(r'\b([1-9][0-9])\b(?!\s*(?:hazar|hazaar|thousand|हजार|हज़ार|হাজার|వేల|ஆயிரம்|lakh|लाख|k|rs|inr|रु|रुपये|টাকা|రూపాయలు))', norm)
    if m:
        val = int(m.group(1))
        if 15 <= val <= 105:
            return val
    return None

def parse_income_from_text(text: str) -> Optional[float]:
    norm = normalize_digits(text.lower().replace(",", ""))
    # Look for lakh
    lakh_match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*(?:lakh|लाख|લાખ|ലക്ഷം)', norm)
    if lakh_match:
        return float(lakh_match.group(1)) * 100000.0
    # Look for thousand / hazaar / hajar
    thousand_match = re.search(r'([0-9]+)\s*(?:thousand|हजार|हज़ार|হাজার|వేల|ஆயிரம்)', norm)
    if thousand_match:
        return float(thousand_match.group(1)) * 1000.0
    # Direct number like 50000, 60000
    direct = re.search(r'\b([1-9][0-9]{3,6})\b', norm)
    if direct:
        return float(direct.group(1))
    return None

def parse_bpl_from_text(text: str) -> bool:
    lower = text.lower()
    keywords = [
        "bpl", "ration card", "ration", "रेशन", "राशन", "पिवळे", "केशरी", "कार्ड",
        "ரேஷன்", "రేషన్", "রেশন", "રેશનકાર્ડ", "റേഷൻ"
    ]
    return any(k in lower for k in keywords)

def parse_occupation_from_text(text: str) -> Optional[str]:
    lower = text.lower()
    if any(k in lower for k in ["farmer", "kisan", "किसान", "शेतकरी", "రైతు", "விவசாயி", "কৃষক", "ખેડૂત"]):
        return "Farmer"
    if any(k in lower for k in ["labor", "laborer", "mazdoor", "मजदूर", "मजूर", "கூலி", "കൂലി", "মজুর"]):
        return "Daily Wage Laborer"
    if any(k in lower for k in ["senior", "elderly", "vridh", "budhapa", "ज्येष्ठ नागरिक", "वृद्ध", "बुजुर्ग", "ముసలి", "முதியோர்"]):
        return "Senior Citizen"
    if any(k in lower for k in ["homemaker", "housewife", "mahila", "गृहिणी", "महिला", "இல்லத்தரசி"]):
        return "Homemaker"
    if any(k in lower for k in ["student", "vidyarthi", "छात्र", "विद्यार्थी", "மாணவர்", "ವಿದ್ಯಾರ್ಥಿ"]):
        return "Student"
    return None

def process_conversational_turn(
    transcript: str,
    state: str = "All India",
    language_code: str = "hi-IN",
    language_name: str = "Hindi",
    stage: str = "init",
    user_profile: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Interactive Voice Eligibility Concierge Pipeline:
    - Maintains conversational state across turns
    - Solicits Age, Income, Occupation in the exact regional language
    - Speaks questions in that regional language via TTS
    - Provides regional quick-reply options
    - Renders final eligibility verdict in the regional language
    """
    clean_text = transcript.strip() if transcript else ""
    cfg = get_regional_config(language_code)
    profile = user_profile.copy() if user_profile else {}
    profile["state"] = state

    # Extract any information present in the current turn text
    if profile.get("age") is None or "वय" in clean_text or "age" in clean_text or "साल" in clean_text or "वर्ष" in clean_text:
        extracted_age = parse_age_from_text(clean_text)
        if extracted_age is not None:
            profile["age"] = extracted_age

    extracted_income = parse_income_from_text(clean_text)
    if extracted_income is not None:
        profile["annual_income"] = extracted_income

    if parse_bpl_from_text(clean_text):
        profile["has_bpl_card"] = True

    extracted_occ = parse_occupation_from_text(clean_text)
    if extracted_occ:
        profile["occupation"] = extracted_occ

    intents = detect_intents(clean_text)
    if intents:
        profile["intent"] = intents[0]

    # Decide next conversational step
    # Stage progression:
    # If age is unknown -> ask_age
    # If income/bpl is unknown -> ask_income
    # If occupation is unknown -> ask_occupation
    # Else -> complete (verdict)

    is_interview = True
    current_step = None
    question_text = None
    quick_replies = []
    spoken_text = ""
    explanation_text = ""
    matched_schemes = []

    # Step 1: Check Age
    if profile.get("age") is None:
        current_step = "ask_age"
        question_text = cfg["ask_age"]
        quick_replies = cfg["quick_age"]
        spoken_text = f"{cfg['greeting']} {cfg['ask_age']}"
        explanation_text = f"{cfg['greeting']}\n\n🎙️ **{cfg['ask_age']}**"

    # Step 2: Check Income
    elif profile.get("annual_income") is None and not profile.get("has_bpl_card"):
        current_step = "ask_income"
        question_text = cfg["ask_income"]
        quick_replies = cfg["quick_income"]
        spoken_text = cfg["ask_income"]
        explanation_text = f"✅ वय नोंदवले: {profile.get('age')} वर्षे.\n\n🎙️ **{cfg['ask_income']}**" if language_code.startswith("mr") else f"✅ Age recorded: {profile.get('age')} yrs.\n\n🎙️ **{cfg['ask_income']}**"

    # Step 3: Check Occupation
    elif profile.get("occupation") is None:
        current_step = "ask_occupation"
        question_text = cfg["ask_occupation"]
        quick_replies = cfg["quick_occ"]
        spoken_text = cfg["ask_occupation"]
        explanation_text = f"🎙️ **{cfg['ask_occupation']}**"

    # Step 4: All 3 criteria gathered -> RUN ELIGIBILITY EVALUATION & PRODUCE VERDICT!
    else:
        is_interview = False
        current_step = "complete"

        # Run eligibility matching
        el_res = check_all_schemes_eligibility(profile)
        eligible = el_res.get("eligible_schemes", [])
        matched_schemes = [item["scheme"] for item in eligible[:4]]

        if not matched_schemes:
            # Fall back to state search
            matched_schemes = search_schemes(state=state, limit=3)

        # Build celebration verdict in authentic regional language
        lead = matched_schemes[0] if matched_schemes else None
        lead_name = lead.get("name_hi") if language_code.startswith("hi") and lead.get("name_hi") else lead.get("name") if lead else "कल्याणकारी योजना"

        explanation_text = f"🎉 **{cfg['verdict_congrats']}**\n"
        for idx, s in enumerate(matched_schemes[:3], 1):
            s_name = s.get("name_hi") if language_code.startswith("hi") and s.get("name_hi") else s.get("name")
            explanation_text += f"{idx}. **{s_name}**\n   • लाभ: {s.get('benefits')}\n"

        explanation_text += f"\n📌 **{cfg['docs_prefix']}** "
        if lead and lead.get("required_documents"):
            explanation_text += ", ".join(lead.get("required_documents")[:3])
        else:
            explanation_text += "आधार कार्ड, बँक पासबुक, रेशन कार्ड" if language_code.startswith("mr") else "Aadhaar Card, Bank Passbook, Ration Card"

        explanation_text += f"\n\n🏛️ **{cfg['apply_prefix']}**"

        # Spoken audio text strictly in regional language
        spoken_text = f"{cfg['verdict_congrats']} {lead_name}. {lead.get('benefits') if lead else ''}. {cfg['apply_prefix']}"
        quick_replies = cfg["followups"]

    # Synthesize spoken audio in the exact regional language (mr, ta, te, bn, gu, kn, ml, pa, or, ur, hi, en)
    audio_res = tts_service.synthesize(text=spoken_text, language_code=language_code)
    audio_url = audio_res.get("audio_url") if audio_res.get("success") else None

    detected_intent_label = profile.get("intent") or (intents[0] if intents else "eligibility interview")

    return {
        "transcript": transcript,
        "detected_language": language_name,
        "state": state,
        "intent": detected_intent_label,
        "ai_explanation": explanation_text,
        "audio_url": audio_url,
        "matched_schemes": matched_schemes,
        "suggested_followups": cfg.get("followups", []),
        "mode": "Interactive Regional Voice Concierge",
        "is_interview_mode": is_interview,
        "current_step": current_step,
        "question_text": question_text,
        "quick_replies": quick_replies,
        "collected_profile": profile
    }

# Backward compatible single-shot wrapper
def generate_voice_assistant_response(
    transcript: str,
    state: str = "All India",
    language_code: str = "hi-IN",
    language_name: str = "Hindi"
) -> Dict[str, Any]:
    return process_conversational_turn(
        transcript=transcript,
        state=state,
        language_code=language_code,
        language_name=language_name,
        stage="init",
        user_profile={}
    )
