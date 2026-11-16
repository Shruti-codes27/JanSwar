from typing import List, Dict, Any, Optional
from backend.services.scheme_search import search_schemes

def evaluate_scheme_eligibility(scheme: Dict[str, Any], user_profile: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluate user profile against a specific scheme's rules.
    Returns match_score, matched_criteria, missing_criteria, and notes.
    """
    matched = []
    missing = []
    total_checks = 0
    passed_checks = 0

    user_age = user_profile.get("age")
    user_gender = user_profile.get("gender", "All")
    user_state = user_profile.get("state", "All India")
    user_income = user_profile.get("annual_income")
    user_occ = (user_profile.get("occupation") or "").lower().strip()
    is_disabled = user_profile.get("is_disabled", False)
    has_bpl = user_profile.get("has_bpl_card", False)

    # 1. State check
    scheme_state = scheme.get("state_applicability", "All India")
    total_checks += 1
    if scheme_state == "All India":
        passed_checks += 1
        matched.append("Applicable across All India.")
    elif user_state and user_state.lower() != "all india" and scheme_state.lower() == user_state.lower():
        passed_checks += 1
        matched.append(f"Resident requirement matches your state: {scheme_state}.")
    else:
        missing.append(f"Scheme is designated specifically for residents of {scheme_state}.")

    # 2. Age check
    min_age = scheme.get("min_age")
    max_age = scheme.get("max_age")
    if min_age is not None or max_age is not None:
        total_checks += 1
        if user_age is not None:
            age_valid = True
            if min_age is not None and user_age < min_age:
                age_valid = False
                missing.append(f"Applicant age ({user_age} yrs) is below minimum required age of {min_age} yrs.")
            if max_age is not None and user_age > max_age:
                age_valid = False
                missing.append(f"Applicant age ({user_age} yrs) exceeds maximum limit of {max_age} yrs.")
            
            if age_valid:
                passed_checks += 1
                matched.append(f"Age {user_age} years satisfies age criteria (Eligible: {min_age or 0} - {max_age or 'any'} yrs).")
        else:
            missing.append(f"Age criteria ({min_age or 0} - {max_age or 'any'} yrs) needs to be verified.")

    # 3. Gender check
    scheme_gender = scheme.get("gender", "All")
    if scheme_gender != "All":
        total_checks += 1
        if user_gender and user_gender.lower() == scheme_gender.lower():
            passed_checks += 1
            matched.append(f"Target beneficiary gender matches: {scheme_gender}.")
        else:
            missing.append(f"Scheme is reserved exclusively for {scheme_gender} beneficiaries.")

    # 4. Income check
    max_income = scheme.get("max_income")
    if max_income is not None:
        total_checks += 1
        if user_income is not None:
            if user_income <= max_income:
                passed_checks += 1
                matched.append(f"Annual income ₹{user_income:,.0f} is within ceiling limit of ₹{max_income:,.0f}.")
            else:
                missing.append(f"Annual income ₹{user_income:,.0f} exceeds maximum ceiling of ₹{max_income:,.0f}.")
        else:
            # Check if user has BPL card as proxy
            if has_bpl:
                passed_checks += 1
                matched.append("BPL Card holder status satisfies low-income criteria.")
            else:
                missing.append(f"Income ceiling verification required (maximum ₹{max_income:,.0f}/year or BPL card).")

    # 5. Occupation check
    scheme_occs = [o.lower() for o in scheme.get("occupation_criteria", ["Any"])]
    if "any" not in scheme_occs and scheme_occs:
        total_checks += 1
        if user_occ:
            match_found = any(occ in user_occ or user_occ in occ for occ in scheme_occs)
            if match_found:
                passed_checks += 1
                matched.append(f"Occupation matches target group: {user_profile.get('occupation')}.")
            else:
                missing.append(f"Targeted at: {', '.join(scheme.get('occupation_criteria', []))}.")
        else:
            missing.append(f"Occupation requirement: {', '.join(scheme.get('occupation_criteria', []))}.")

    # 6. Disability check for disability-focused schemes
    if "disabled" in scheme.get("name", "").lower() or "adip" in scheme.get("id", "").lower():
        total_checks += 1
        if is_disabled:
            passed_checks += 1
            matched.append("Benchmark disability certificate (40%+ required) reported.")
        else:
            missing.append("Requires recognized benchmark disability certificate (UDID card).")

    # Compute match score
    match_score = int((passed_checks / max(1, total_checks)) * 100)
    is_eligible = (match_score >= 80) and (len(missing) == 0 or (len(missing) == 1 and user_age is not None and "verified" in missing[0]))

    notes = ""
    if is_eligible:
        notes = "High eligibility likelihood! Prepare the required documents and apply via the official portal or local CSC / Panchayat office."
    elif match_score >= 50:
        notes = "Potentially eligible subject to documentary proof of income, residence, or caste category."
    else:
        notes = "Does not currently meet primary scheme criteria based on the details provided."

    return {
        "scheme": scheme,
        "is_eligible": is_eligible,
        "match_score": match_score,
        "matched_criteria": matched,
        "missing_criteria": missing,
        "notes": notes
    }

def check_all_schemes_eligibility(user_profile: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluate user profile across all relevant schemes in the database.
    """
    user_state = user_profile.get("state", "All India")
    schemes = search_schemes(state=user_state, limit=100)

    eligible = []
    partially_eligible = []

    for s in schemes:
        eval_result = evaluate_scheme_eligibility(s, user_profile)
        if eval_result["is_eligible"]:
            eligible.append(eval_result)
        elif eval_result["match_score"] >= 45:
            partially_eligible.append(eval_result)

    # Sort by match score descending
    eligible.sort(key=lambda x: x["match_score"], reverse=True)
    partially_eligible.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "eligible_schemes": eligible,
        "partially_eligible_schemes": partially_eligible,
        "total_evaluated": len(schemes),
        "user_summary": user_profile,
        "disclaimer": "Notice: This automated tool provides informational guidance based on public scheme rules. Final eligibility verification and benefit sanctioning are subject to official government guidelines and scrutiny by the designated authorities."
    }
