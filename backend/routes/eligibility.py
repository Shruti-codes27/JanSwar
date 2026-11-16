from fastapi import APIRouter
from backend.models import EligibilityCheckRequest, EligibilityCheckResponse
from backend.services.eligibility_engine import check_all_schemes_eligibility

router = APIRouter(prefix="/api/eligibility", tags=["Eligibility"])

@router.post("/check", response_model=EligibilityCheckResponse)
def check_eligibility(payload: EligibilityCheckRequest):
    """
    Check basic citizen eligibility against all government welfare schemes
    based on age, state, income, occupation, and family profile.
    """
    profile_dict = payload.model_dump()
    result = check_all_schemes_eligibility(profile_dict)
    return result
