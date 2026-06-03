@echo off
REM DevServer Startup Script for IndiBuy Frontend
REM This script clears build cache and starts the dev server

cd /d c:\Users\dell\OneDrive\Desktop\indibuy\frontend

echo.
echo ========================================
echo   IndiBuy Frontend - Dev Server Setup
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not installed!
    pause
    exit /b 1
)

echo.
echo [2/4] Clearing build cache...
if exist .next (
    echo   Removing .next folder...
    rmdir /s /q .next
)
if exist .vercel (
    echo   Removing .vercel folder...
    rmdir /s /q .vercel
)

echo.
echo [3/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo [4/4] Starting dev server...
echo   Starting on http://localhost:3000
echo   Press Ctrl+C to stop
echo.

call npm run dev

pause
