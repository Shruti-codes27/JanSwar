import sqlite3
import json
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "data" / "janswar.db"
SCHEMES_JSON_PATH = BASE_DIR / "data" / "schemes.json"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(force_reseed: bool = True):
    """Create database tables and seed schemes from schemes.json."""
    os.makedirs(DB_PATH.parent, exist_ok=True)
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create schemes table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS schemes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            name_hi TEXT,
            category TEXT NOT NULL,
            state_applicability TEXT NOT NULL,
            short_description TEXT NOT NULL,
            benefits TEXT NOT NULL,
            eligible_beneficiaries TEXT NOT NULL,
            min_age INTEGER,
            max_age INTEGER,
            gender TEXT DEFAULT 'All',
            income_criteria TEXT,
            occupation_criteria TEXT,
            max_income REAL,
            required_documents TEXT,
            application_info TEXT,
            official_website TEXT,
            verified INTEGER DEFAULT 1,
            last_verified_date TEXT
        )
    """)

    # Create voice logs / query history table (anonymous, privacy-preserving)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS voice_interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            state TEXT,
            language TEXT,
            user_transcript TEXT,
            detected_intent TEXT,
            matched_scheme_ids TEXT,
            response_text TEXT
        )
    """)

    conn.commit()

    # Upsert all schemes from JSON
    if SCHEMES_JSON_PATH.exists():
        with open(SCHEMES_JSON_PATH, "r", encoding="utf-8") as f:
            schemes_data = json.load(f)

        for s in schemes_data:
            cursor.execute("""
                INSERT OR REPLACE INTO schemes (
                    id, name, name_hi, category, state_applicability,
                    short_description, benefits, eligible_beneficiaries,
                    min_age, max_age, gender, income_criteria,
                    occupation_criteria, max_income, required_documents,
                    application_info, official_website, verified, last_verified_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                s.get("id"),
                s.get("name"),
                s.get("name_hi"),
                s.get("category"),
                s.get("state_applicability", "All India"),
                s.get("short_description"),
                s.get("benefits"),
                s.get("eligible_beneficiaries"),
                s.get("min_age"),
                s.get("max_age"),
                s.get("gender", "All"),
                s.get("income_criteria"),
                json.dumps(s.get("occupation_criteria", ["Any"]), ensure_ascii=False),
                s.get("max_income"),
                json.dumps(s.get("required_documents", []), ensure_ascii=False),
                s.get("application_info"),
                s.get("official_website"),
                1 if s.get("verified", True) else 0,
                s.get("last_verified_date")
            ))
        conn.commit()
        print(f"Successfully synchronized {len(schemes_data)} schemes into SQLite database.")

    conn.close()

if __name__ == "__main__":
    init_db(force_reseed=True)
