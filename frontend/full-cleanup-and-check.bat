@echo off
REM Complete cleanup and check script

cd /d c:\Users\dell\OneDrive\Desktop\indibuy\frontend

echo ==================================================
echo   INDIBUY - COMPLETE CLEANUP AND CHECK
echo ==================================================

echo.
echo Step 1: Checking Node version...
node -v

echo.
echo Step 2: Checking NPM version...
npm -v

echo.
echo Step 3: Removing old builds and caches...
if exist ".next" rmdir /s /q .next
if exist ".vercel" rmdir /s /q .vercel
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache
if exist ".eslintcache" del .eslintcache
echo   - Cleaned

echo.
echo Step 4: Installing dependencies with legacy peer deps...
echo   This may take 2-3 minutes...
npm install --legacy-peer-deps --verbose

if errorlevel 1 (
    echo.
    echo ERROR: npm install failed
    echo Try running: npm cache clean --force
    pause
    exit /b 1
)

echo.
echo Step 5: Linting code...
npm run lint --max-warnings 50

echo.
echo Step 6: Starting dev server...
echo   Server should start on http://localhost:3000
echo   If it doesn't, check:
echo   - Port 3000 is not in use
echo   - Node.js version is v14+
echo   - Antivirus not blocking Node.js
echo.

npm run dev

pause
