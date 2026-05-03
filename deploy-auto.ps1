#!/usr/bin/env pwsh
# IndiBuy Automated Deployment Script for Railway
# Windows PowerShell version
# Usage: .\deploy-auto.ps1

$ErrorActionPreference = "Stop"
$ProjectRoot = Get-Location
$LogFile = "$ProjectRoot\deployment.log"

# Colors for output
function Write-Status { 
    param([string]$msg)
    Write-Host "[SUCCESS] $msg" -ForegroundColor Green
}
function Write-Info { 
    param([string]$msg)
    Write-Host "[INFO] $msg" -ForegroundColor Cyan
}
function Write-Warn { 
    param([string]$msg)
    Write-Host "[WARNING] $msg" -ForegroundColor Yellow
}
function Write-ErrorMsg { 
    param([string]$msg)
    Write-Host "[ERROR] $msg" -ForegroundColor Red
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

function Test-FileExists {
    param([string]$Path)
    return Test-Path -Path $Path -PathType Leaf
}

# ============================================================================
# REQUIREMENTS CHECK
# ============================================================================

Write-Host "`n========== CHECKING REQUIREMENTS ==========" -ForegroundColor Magenta

# Check Git
if (-not (Test-Command git)) {
    Write-ErrorMsg "Git not found! Please install from https://git-scm.com/download/win"
    exit 1
}
Write-Status "Git is installed"

# Check files
if (-not (Test-FileExists "config.php")) {
    Write-ErrorMsg "config.php not found! Are you in the project directory?"
    exit 1
}
Write-Status "Project files found"

# Check .env
if (-not (Test-FileExists ".env")) {
    Write-Warn ".env not found. Creating from .env.example..."
    if (Test-FileExists ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Status ".env created"
    }
}

# ============================================================================
# INTERACTIVE SETUP
# ============================================================================

Write-Host "`n========== INTERACTIVE SETUP ==========" -ForegroundColor Magenta

$GitHubUsername = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrWhiteSpace($GitHubUsername)) {
    Write-ErrorMsg "GitHub username required!"
    exit 1
}
Write-Status "GitHub username: $GitHubUsername"

$GitHubEmail = Read-Host "Enter your GitHub email"
if ([string]::IsNullOrWhiteSpace($GitHubEmail)) {
    Write-ErrorMsg "GitHub email required!"
    exit 1
}
Write-Status "GitHub email: $GitHubEmail"

$RepoName = "indibuy-main"

# ============================================================================
# GIT SETUP
# ============================================================================

Write-Host "`n========== GIT SETUP ==========" -ForegroundColor Magenta

Write-Info "Configuring Git..."
git config --global user.name $GitHubUsername | Out-Null
git config --global user.email $GitHubEmail | Out-Null
Write-Status "Git configured"

# Initialize repo if needed
if (-not (Test-Path ".git")) {
    Write-Info "Initializing Git repository..."
    git init
    Write-Status "Git repository initialized"
} else {
    Write-Info "Git repository already initialized"
}

# Create .gitignore if not exists
if (-not (Test-Path ".gitignore")) {
    Write-Info "Creating .gitignore..."
    @"
# Environment
.env
.env.local

# Logs
logs/
*.log

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Temporary
tmp/
temp/

# Dependencies
node_modules/
vendor/
"@ | Out-File ".gitignore" -Encoding UTF8
    Write-Status ".gitignore created"
}

# Stage and commit
Write-Info "Staging files..."
git add . | Out-Null
Write-Status "Files staged"

Write-Info "Creating initial commit..."
$commitMessage = "IndiBuy v2.0 - Production ready deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$commitResult = git commit -m $commitMessage 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Status "Commit created"
} else {
    Write-Info "No new changes to commit"
}

# ============================================================================
# GITHUB REMOTE
# ============================================================================

Write-Host "`n========== GITHUB REMOTE ==========" -ForegroundColor Magenta

$remoteUrl = git config --get remote.origin.url 2>$null

if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
    $remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"
    Write-Info "Setting GitHub remote..."
    git remote add origin $remoteUrl 2>$null
    Write-Status "Remote configured: $remoteUrl"
} else {
    Write-Info "Remote already configured: $remoteUrl"
}

# ============================================================================
# DEPLOYMENT
# ============================================================================

Write-Host "`n========== PUSHING TO GITHUB ==========" -ForegroundColor Magenta

Write-Info "Pushing code to GitHub..."
$pushOutput = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0 -or $pushOutput -match "master|main") {
    Write-Status "Code pushed successfully!"
} else {
    Write-Info "Checking available branches..."
    git branch -a
    $branch = Read-Host "Enter branch name to push (main/master)"
    git push -u origin $branch 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMsg "Git push failed!"
        exit 1
    }
    Write-Status "Code pushed successfully!"
}

# ============================================================================
# SUCCESS
# ============================================================================

Write-Host "`n========== DEPLOYMENT COMPLETE ==========" -ForegroundColor Green

$repoUrl = "https://github.com/$GitHubUsername/$RepoName"

Write-Host "`n"
Write-Host "Your GitHub Repository:" -ForegroundColor Green
Write-Host $repoUrl -ForegroundColor Yellow
Write-Host "`n"

Write-Host "Next Steps:" -ForegroundColor Green
Write-Host "1. Go to https://railway.app" -ForegroundColor Cyan
Write-Host "2. Click 'Start New Project'" -ForegroundColor Cyan
Write-Host "3. Select 'Deploy from GitHub repo'" -ForegroundColor Cyan
Write-Host "4. Select your repository: $RepoName" -ForegroundColor Cyan
Write-Host "5. Railway will auto-deploy!" -ForegroundColor Cyan
Write-Host "`n"

Write-Status "Ready for Railway deployment!"

