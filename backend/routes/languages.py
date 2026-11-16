from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter(prefix="/api/geo", tags=["States and Languages"])

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "states_languages.json"

@router.get("/states")
def get_states_and_languages():
    """
    Return all Indian states and Union Territories along with their
    primary languages and all regional spoken languages and dialects.
    """
    if DATA_PATH.exists():
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("states", [])
    return []

@router.get("/languages")
def get_all_languages():
    """
    Return all official 8th Schedule Indian languages and regional dialects.
    """
    if DATA_PATH.exists():
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("all_languages", [])
    return []
