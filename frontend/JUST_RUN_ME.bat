@echo off
REM =====================================================
REM INDIBUY FRONTEND - ABSOLUTE MINIMAL STARTUP
REM =====================================================
REM This script does the absolute minimum to start the server
REM Just: clear cache, install dependencies, run dev

cd /d c:\Users\dell\OneDrive\Desktop\indibuy\frontend

if "%1"=="clean" (
    echo Removing .next build cache...
    rmdir /s /q .next 2>nul
    echo Cache cleared. Run again without 'clean' parameter.
    pause
    exit /b 0
)

echo.
echo ============================================
echo    INDIBUY - STARTING DEV SERVER
echo ============================================
echo.

echo [1/2] Checking if .next cache exists...
if exist ".next" (
    echo   Found .next folder, removing old cache...
    rmdir /s /q .next 2>nul
)

echo.
echo [2/2] Starting server with: npm run dev
echo        Server should appear in 5-10 seconds
echo        Then open: http://localhost:3000
echo.
echo Waiting for server to start...
echo.

call npm run dev

REM If we get here, dev server exited
echo.
echo Server stopped. Check messages above for errors.
pause
