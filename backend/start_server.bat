@echo off
REM Start the server
venv\Scripts\python.exe -m uvicorn main:socket_app --reload --port 8000
