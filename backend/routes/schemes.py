from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from backend.services.scheme_search import search_schemes, get_scheme_by_id, get_all_categories
from backend.models import SchemeBase

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])

@router.get("", response_model=List[SchemeBase])
def list_schemes(
    query: Optional[str] = Query(None, description="Search keyword"),
    category: Optional[str] = Query(None, description="Filter by category"),
    state: Optional[str] = Query(None, description="Filter by state (e.g. Maharashtra, Uttar Pradesh)"),
    gender: Optional[str] = Query(None, description="Filter by gender"),
    age: Optional[int] = Query(None, description="Filter by applicant age"),
    limit: int = Query(50, ge=1, le=100)
):
    """
    Retrieve government schemes with optional state, category, keyword, and demographic filters.
    """
    return search_schemes(
        query=query,
        category=category,
        state=state,
        gender=gender,
        age=age,
        limit=limit
    )

@router.get("/categories", response_model=List[str])
def list_categories():
    """Retrieve all available scheme categories."""
    return get_all_categories()

@router.get("/{scheme_id}", response_model=SchemeBase)
def get_scheme(scheme_id: str):
    """Retrieve complete details for a single scheme by ID."""
    scheme = get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Government scheme not found")
    return scheme
