@echo off
REM Minimal startup - just clear .next and run dev
cd /d c:\Users\dell\OneDrive\Desktop\indibuy\frontend
echo Clearing .next cache...
rmdir /s /q .next 2>nul
echo Starting server...
npm run dev
