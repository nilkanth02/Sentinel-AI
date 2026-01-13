@echo off
echo Running SentinelAI Tests...
echo.
cd /d "%~dp0"
python -m pytest -v --tb=short
pause

