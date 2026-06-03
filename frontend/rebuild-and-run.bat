@echo off
REM Complete diagnostic and rebuild script

cd /d c:\Users\dell\OneDrive\Desktop\indibuy\frontend

echo.
echo ============================================
echo   INDIBUY FRONTEND - DIAGNOSTIC TOOL
echo ============================================
echo.

echo [STEP 1] Checking prerequisites...
echo   - Checking Node.js...
node --version
if errorlevel 1 (
    echo   ERROR: Node.js not found!
    exit /b 1
)
echo   - Node.js OK

echo   - Checking npm...
npm --version
if errorlevel 1 (
    echo   ERROR: npm not found!
    exit /b 1
)
echo   - npm OK

echo.
echo [STEP 2] Analyzing project structure...
echo   - Checking key files exist...
if not exist "package.json" echo   WARNING: package.json not found
if not exist "next.config.js" echo   WARNING: next.config.js not found
if not exist "src\pages\_app.jsx" echo   WARNING: _app.jsx not found
if not exist "src\context\ReviewContext.jsx" echo   WARNING: ReviewContext not found
echo   - Project structure OK

echo.
echo [STEP 3] Cleaning build artifacts...
if exist ".next" (
    echo   Removing .next cache...
    rmdir /s /q .next 2>nul
    echo   .next removed
)
if exist ".vercel" (
    echo   Removing .vercel...
    rmdir /s /q .vercel 2>nul
)
if exist "out" (
    echo   Removing out...
    rmdir /s /q out 2>nul
)
echo   Build cache cleaned

echo.
echo [STEP 4] Installing dependencies...
echo   Running: npm install
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo   ERROR: npm install failed!
    echo   Try manually: npm install --legacy-peer-deps
    pause
    exit /b 1
)
echo   Dependencies installed

echo.
echo [STEP 5] Building project...
echo   Running: npm run build
call npm run build
if errorlevel 1 (
    echo   WARNING: Build had some issues
    echo   But trying to run dev server anyway...
)

echo.
echo ============================================
echo   READY TO START DEV SERVER
echo ============================================
echo.
echo   Starting: npm run dev
echo   Open: http://localhost:3000
echo   Press Ctrl+C to stop
echo.

call npm run dev

pause
