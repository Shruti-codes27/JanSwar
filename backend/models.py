from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class SchemeBase(BaseModel):
    id: str
    name: str
    name_hi: Optional[str] = None
    category: str
    state_applicability: str
    short_description: str
    benefits: str
    eligible_beneficiaries: str
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    gender: str = "All"
    income_criteria: Optional[str] = None
    occupation_criteria: List[str] = []
    max_income: Optional[float] = None
    required_documents: List[str] = []
    application_info: Optional[str] = None
    official_website: Optional[str] = None
    verified: bool = True
    last_verified_date: Optional[str] = None

class SchemeFilterParams(BaseModel):
    query: Optional[str] = None
    category: Optional[str] = None
    state: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None

class EligibilityCheckRequest(BaseModel):
    age: Optional[int] = Field(None, ge=0, le=120, description="Age of applicant")
    gender: Optional[str] = Field("All", description="Male, Female, Other, or All")
    state: Optional[str] = Field("All India", description="State of residence")
    annual_income: Optional[float] = Field(None, ge=0, description="Annual family income in INR")
    occupation: Optional[str] = Field(None, description="Primary occupation (Farmer, Laborer, Student, etc.)")
    category: Optional[str] = Field(None, description="Scheme category of interest")
    is_disabled: Optional[bool] = Field(False, description="Whether person has disability")
    has_bpl_card: Optional[bool] = Field(False, description="Whether household has BPL / Ration card")

class EligibilityResultItem(BaseModel):
    scheme: SchemeBase
    is_eligible: bool
    match_score: int # percentage 0 - 100
    matched_criteria: List[str]
    missing_criteria: List[str]
    notes: str

class EligibilityCheckResponse(BaseModel):
    eligible_schemes: List[EligibilityResultItem]
    partially_eligible_schemes: List[EligibilityResultItem]
    total_evaluated: int
    user_summary: Dict[str, Any]
    disclaimer: str

class VoiceQueryRequest(BaseModel):
    text: Optional[str] = None
    state: Optional[str] = "All India"
    language_code: Optional[str] = "hi-IN"
    language_name: Optional[str] = "Hindi"
    stage: Optional[str] = "init"
    user_profile: Optional[Dict[str, Any]] = None

class VoiceAssistantResponse(BaseModel):
    transcript: str
    detected_language: str
    state: str
    intent: str
    ai_explanation: str
    audio_url: Optional[str] = None
    matched_schemes: List[SchemeBase] = []
    suggested_followups: List[str] = []
    mode: str = "Live Interactive Multi-Lingual Assistant"
    # Conversational interactive interview fields
    is_interview_mode: bool = False
    current_step: Optional[str] = None # "ask_age", "ask_income", "ask_occupation", "complete"
    question_text: Optional[str] = None
    quick_replies: List[str] = []
    collected_profile: Dict[str, Any] = {}
