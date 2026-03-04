@echo off
echo Starting Real-Time Soil Analysis Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Install dependencies if needed
echo Checking and installing dependencies...
pip install -q flask flask-cors tensorflow pillow opencv-python numpy

REM Start the Flask server
echo.
echo Starting Flask server on http://localhost:5000
echo Keep this window open to run the application
echo.
python flask_application.py

pause
