@echo off
echo ============================================================
echo Starting JanSwar Backend (FastAPI Server on Port 8000)...
echo ============================================================
cd /d "%~dp0"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
