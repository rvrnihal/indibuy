@echo off
REM IndiBuy - Deploy to Railway Script (Windows)
REM Usage: deploy.bat

setlocal enabledelayedexpansion

echo.
echo 🚀 IndiBuy Deployment Script
echo ==============================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo Initializing Git repository...
    git init
)

REM Check if .env exists
if not exist ".env" (
    echo Error: .env file not found!
    echo.
    echo Please create .env file with:
    echo   DB_HOST=mysql
    echo   DB_USER=root
    echo   DB_PASS=yourpassword
    echo   DB_NAME=paymentdb
    echo   APP_ENV=production
    pause
    exit /b 1
)

REM Stage files
echo Staging files...
git add .
git add -u

REM Commit
echo Creating commit...
git commit -m "IndiBuy deployment %date% %time%" 2>nul || echo No changes to commit

REM Ask for remote
echo.
echo Setup GitHub repository
echo 1. Create repository at https://github.com/new
echo 2. Copy the HTTPS URL
echo.
set /p GITHUB_REPO="Enter your GitHub repository URL: "

if "!GITHUB_REPO!"=="" (
    echo Error: Repository URL required
    pause
    exit /b 1
)

REM Add remote and push
echo.
echo Pushing to GitHub...
git remote add origin "!GITHUB_REPO!" 2>nul || git remote set-url origin "!GITHUB_REPO!"
git branch -M main
git push -u origin main

echo.
echo ✓ Pushed to GitHub
echo.
echo Next Steps:
echo 1. Visit https://railway.app
echo 2. Click 'Start New Project'
echo 3. Select 'Deploy from GitHub'
echo 4. Choose your 'indibuy-main' repository
echo 5. Add MySQL database service
echo 6. Set environment variables (see RAILWAY_DEPLOYMENT.md)
echo 7. Click 'Deploy'
echo.
echo 🎉 Your app will be live in 2-3 minutes!
echo.
echo Database Setup:
echo 1. Go to Railway dashboard
echo 2. Open MySQL service → 'Connect'
echo 3. Use phpMyAdmin or run SQL from DATABASE_SETUP.md
echo.
pause
