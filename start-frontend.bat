@echo off
echo Starting Agri Link Frontend...
echo.

REM Navigate to the project directory
cd /d "Agri link"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Start the development server
echo.
echo Starting React development server...
echo The app will open in your browser at http://localhost:5173 or similar
echo.
call npm run dev

pause
