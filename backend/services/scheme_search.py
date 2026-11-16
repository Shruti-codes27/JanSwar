import json
import re
from typing import List, Optional, Dict, Any
from backend.database import get_db_connection
from backend.models import SchemeBase

# Multi-lingual intent keyword mappings
INTENT_KEYWORDS = {
    "pension": [
        "pension", "old age", "vridha", "budhapa", "budhape", "senior", "elderly", "60", "retirement",
        "पेंशन", "वृद्धा", "बुढ़ापा", "बुजुर्ग", "महतारी", "वृद्धजन",
        "पेन्शन", "म्हातारपण", "वृद्ध",
        "పెన్షన్", "వృద్ధాప్య", "ముసలి",
        "பென்ஷன்", "முதியோர்", "ஓய்வூதியம்",
        "পেনশন", "বার্ধক্য", "বয়স্ক",
        "પેન્શન", "વૃદ્ધ", "ઘડપણ",
        "ವೃದ್ಧಾಪ್ಯ ವೇತನ", "ಪಿಂಚಣಿ",
        "പെൻഷൻ", "വൃദ്ധ",
        "ਪੈਨਸ਼ਨ", "ਬੁਢਾਪਾ"
    ],
    "farmers": [
        "kisan", "farmer", "agriculture", "fasal", "crop", "land", "tractor", "seed", "fertilizer", "khad", "pmkisan",
        "किसान", "खेती", "कृषि", "फसल", "जमीन", "खाद", "बीज",
        "शेतकरी", "शेती", "पीक", "जमीन",
        "రైతు", "వ్యవసాయం", "పంట", "భూమి",
        "விவசாயி", "விவசாயம்", "பயிர்",
        "কৃষক", "চাষী", "কৃষি", "জমি",
        "ખેડૂત", "ખેતી", "જમીન", "પાક",
        "ರೈತ", "ಕೃಷಿ", "ಬೆಳೆ",
        "കർഷകൻ", "കൃഷി",
        "ਕਿਸਾਨ", "ਖੇਤੀ"
    ],
    "health": [
        "health", "hospital", "ayushman", "treatment", "medicine", "doctor", "illness", "bimar", "bima", "card", "medical",
        "स्वास्थ्य", "इलाज", "अस्पताल", "दवा", "आयुष्मान", "बीमार", "बीमारी", "डॉक्टर",
        "आरोग्य", "दवाखाना", "रुग्णालय", "उपचार",
        "ఆరోగ్య", "ఆసుపత్రి", "చికిత్స", "మందులు",
        "மருத்துவம்", "மருத்துவமனை", "சிகிச்சை",
        "স্বাস্থ্য", "চিকিৎসা", "হাসপাতাল", "ওষুধ",
        "આરોગ્ય", "હોસ્પિટલ", "દવા", "સારવાર",
        "ಆರೋಗ್ಯ", "ಆಸ್ಪತ್ರೆ", "ಚಿಕಿತ್ಸೆ",
        "ആരോഗ്യം", "ആശുപത്രി", "ചികിത്സ",
        "ਸਿਹਤ", "ਹਸਪਤਾਲ", "ਇਲਾਜ"
    ],
    "women": [
        "women", "mahila", "lady", "girl", "mother", "maternity", "pregnant", "ladli", "sister", "bahin", "kanya", "beti", "widow",
        "महिला", "औरत", "माता", "गर्भवती", "बेटी", "कन्या", "लाडली", "विधवा", "बहन", "गृह",
        "महिला", "स्त्री", "आई", "लाडकी", "बहीण", "मुलगी", "विधवा",
        "మహిళ", "స్త్రీ", "తల్లి", "ఆడపడుచు", "విధవ",
        "பெண்", "மகளிர்", "தாய்", "விதவை",
        "মহিলা", "নারী", "মেয়ে", "কন্যা", "বিধবা",
        "મહિલા", "સ્ત્રી", "માતા", "દીકરી", "વિધવા",
        "ಮಹಿಳೆ", "ಹೆಣ್ಣು", "ತಾಯಿ", "ವಿಧವೆ",
        "സ്ത്രീ", "വനിത", "അമ്മ", "വിധവ",
        "ਮਹਿਲਾ", "ਔਰਤ", "ਧੀ", "ਮਾਂ"
    ],
    "housing": [
        "house", "home", "housing", "awas", "makaan", "ghar", "pucca", "roof", "kutcha", "toilet",
        "आवास", "मकान", "घर", "छत", "झोपड़ी", "शौचालय",
        "घर", "आवास", "पक्के घर", "शौचालय",
        "ఇల్లు", "గృహ", "ఆవాస్",
        "வீடு", "குடியிருப்பு",
        "বাড়ি", "ঘর", "আবাস",
        "ઘર", "મકાન", "આવાસ",
        "ಮನೆ", "ವಸತಿ",
        "വീട്", "പാർപ്പിടം",
        "ਘਰ", "ਮਕਾਨ"
    ],
    "students": [
        "student", "education", "scholarship", "school", "college", "study", "fee", "books", "vidyarthi", "padhai", "degrees",
        "छात्र", "छात्रा", "विद्यार्थी", "पढ़ाई", "छात्रवृत्ति", "स्कूल", "कॉलेज", "फीस", "किताब",
        "विद्यार्थी", "शिक्षण", "शिष्यवृत्ती", "शाळा", "कॉलेज",
        "విద్యార్థి", "చదువు", "స్కాలర్‌షిప్", "బడి", "కళాశాల",
        "மாணவர்", "கல்வி", "படிப்பு", "உதவித்தொகை",
        "ছাত্র", "ছাত্রী", "পড়াশোনা", "বৃত্তি", "স্কুল", "কলেজ",
        "વિદ્યાર્થી", "શિક્ષણ", "શિષ્યવૃત્તિ", "શાળા",
        "ವಿದ್ಯಾರ್ಥಿ", "ಶಿಕ್ಷಣ", "ವಿದ್ಯಾರ್ಥಿವೇತನ",
        "വിദ്യാർത്ഥി", "പഠനം", "സ്കോളർഷിപ്പ്",
        "ਵਿਦਿਆਰਥੀ", "ਪੜ੍ਹਾਈ", "ਵਜ਼ੀਫ਼ਾ"
    ],
    "employment": [
        "job", "work", "employment", "nrega", "mgnrega", "daily wage", "labor", "mazdoor", "unemployment", "stipend", "vishwakarma", "artisan", "business", "loan", "mudra",
        "रोजगार", "काम", "नौकरी", "मजदूरी", "मनरेगा", "लोन", "कर्ज", "व्यापार", "दुकान", "मुद्रा", "कारीगर", "विश्वकर्मा",
        "रोजगार", "काम", "मजुरी", "कर्ज", "व्यवसाय", "विश्वकर्मा",
        "ఉపాధి", "పని", "కూలీ", "రుణం", "వ్యాపారం",
        "வேலை", "தொழில்", "உழைப்பு", "கடன்",
        "কাজ", "কর্মসংস্থান", "মজুরি", "ঋণ", "ব্যবসা",
        "રોજગાર", "કામ", "મજૂરી", "લોન", "ધંધો",
        "ಉದ್ಯೋಗ", "ಕೆಲಸ", "ಸಾಲ", "ವ್ಯಾಪಾರ",
        "തൊഴിൽ", "ജോലി", "കൂലി", "വായ്പ",
        "ਰੁਜ਼ਗਾਰ", "ਕੰਮ", "ਦਿਹਾੜੀ", "ਕਰਜ਼ਾ"
    ]
}

def detect_intents(text: str) -> List[str]:
    """Detect categories/intents from user query text."""
    if not text:
        return []
    lower_text = text.lower()
    matched_intents = []

    for intent, keywords in INTENT_KEYWORDS.items():
        for kw in keywords:
            # Case-insensitive substring match
            if kw in lower_text:
                matched_intents.append(intent)
                break
    return matched_intents

def row_to_scheme_dict(row) -> Dict[str, Any]:
    """Convert an SQLite Row to a dictionary with parsed JSON fields."""
    d = dict(row)
    try:
        d["occupation_criteria"] = json.loads(d.get("occupation_criteria") or "[]")
    except Exception:
        d["occupation_criteria"] = ["Any"]
    try:
        d["required_documents"] = json.loads(d.get("required_documents") or "[]")
    except Exception:
        d["required_documents"] = []
    d["verified"] = bool(d.get("verified", 1))
    return d

def search_schemes(
    query: Optional[str] = None,
    category: Optional[str] = None,
    state: Optional[str] = None,
    gender: Optional[str] = None,
    age: Optional[int] = None,
    limit: int = 50
) -> List[Dict[str, Any]]:
    """
    Search schemes with state prioritization, category, keyword, and demographic filters.
    If user is in e.g. 'Maharashtra', returns schemes for 'Maharashtra' and 'All India'.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    conditions = []
    params = []

    # State filter: Return schemes matching selected state OR applicable to All India
    if state and state.strip() and state.lower() != "all india":
        conditions.append("(state_applicability = ? OR state_applicability = 'All India')")
        params.append(state.strip())

    # Category filter
    if category and category.strip() and category.lower() != "all":
        conditions.append("category = ?")
        params.append(category.strip())

    # Gender filter (Female schemes open only to females; All opens to everyone)
    if gender and gender.lower() in ["male", "men"]:
        conditions.append("(gender = 'All' OR gender = 'Male')")
    elif gender and gender.lower() in ["female", "women"]:
        conditions.append("(gender = 'All' OR gender = 'Female')")

    # Age filter
    if age is not None:
        conditions.append("(min_age IS NULL OR min_age <= ?)")
        params.append(age)
        conditions.append("(max_age IS NULL OR max_age >= ?)")
        params.append(age)

    # Keyword Query filter
    if query and query.strip():
        q = f"%{query.strip()}%"
        conditions.append("""(
            name LIKE ? OR
            name_hi LIKE ? OR
            category LIKE ? OR
            short_description LIKE ? OR
            benefits LIKE ? OR
            eligible_beneficiaries LIKE ?
        )""")
        params.extend([q, q, q, q, q, q])

    where_clause = ""
    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    # Sort state-specific schemes first, then national schemes
    sql = f"""
        SELECT * FROM schemes
        {where_clause}
        ORDER BY 
            CASE WHEN state_applicability != 'All India' THEN 0 ELSE 1 END,
            name ASC
        LIMIT ?
    """
    params.append(limit)

    cursor.execute(sql, params)
    rows = cursor.fetchall()
    conn.close()

    return [row_to_scheme_dict(r) for r in rows]

def get_scheme_by_id(scheme_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM schemes WHERE id = ?", (scheme_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return row_to_scheme_dict(row)
    return None

def get_all_categories() -> List[str]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT category FROM schemes ORDER BY category ASC")
    rows = cursor.fetchall()
    conn.close()
    return [r[0] for r in rows if r[0]]
