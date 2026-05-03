#!/bin/bash

# IndiBuy - Deploy to Railway Script
# Usage: ./deploy.sh

set -e

echo "🚀 IndiBuy Deployment Script"
echo "=============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    git init
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create .env file with:"
    echo "  DB_HOST=mysql"
    echo "  DB_USER=root"
    echo "  DB_PASS=yourpassword"
    echo "  DB_NAME=paymentdb"
    echo "  APP_ENV=production"
    exit 1
fi

# Stage files
echo -e "${YELLOW}Staging files...${NC}"
git add .
git add -u

# Commit
echo -e "${YELLOW}Creating commit...${NC}"
git commit -m "IndiBuy deployment $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

# Ask for remote
echo -e "${YELLOW}Setup GitHub repository${NC}"
echo "1. Create repository at https://github.com/new"
echo "2. Copy the HTTPS URL"
read -p "Enter your GitHub repository URL: " GITHUB_REPO

if [ -z "$GITHUB_REPO" ]; then
    echo -e "${RED}Error: Repository URL required${NC}"
    exit 1
fi

# Add remote and push
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git remote add origin "$GITHUB_REPO" 2>/dev/null || git remote set-url origin "$GITHUB_REPO"
git branch -M main
git push -u origin main

echo -e "${GREEN}✓ Pushed to GitHub${NC}"
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "1. Visit https://railway.app"
echo "2. Click 'Start New Project'"
echo "3. Select 'Deploy from GitHub'"
echo "4. Choose your 'indibuy-main' repository"
echo "5. Add MySQL database service"
echo "6. Set environment variables (see RAILWAY_DEPLOYMENT.md)"
echo "7. Click 'Deploy'"
echo ""
echo "🎉 Your app will be live in 2-3 minutes!"
echo ""
echo "Database Setup:"
echo "1. Go to Railway dashboard"
echo "2. Open MySQL service → 'Connect'"
echo "3. Use phpMyAdmin or run SQL from DATABASE_SETUP.md"
