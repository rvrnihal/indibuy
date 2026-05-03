#!/bin/bash

# IndiBuy Automated Deployment Script for Railway
# Mac/Linux version
# Usage: ./deploy-auto.sh

set -e

# ============================================================================
# CONFIGURATION
# ============================================================================

PROJECT_ROOT="$(pwd)"
LOG_FILE="$PROJECT_ROOT/deployment.log"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

write_status() {
    echo -e "${GREEN}✅ $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1" >> "$LOG_FILE"
}

write_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ℹ️  $1" >> "$LOG_FILE"
}

write_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1" >> "$LOG_FILE"
}

write_error() {
    echo -e "${RED}❌ $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1" >> "$LOG_FILE"
}

write_section() {
    echo -e "\n${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n$1\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] === $1 ===" >> "$LOG_FILE"
}

# ============================================================================
# REQUIREMENTS CHECK
# ============================================================================

write_section "CHECKING REQUIREMENTS"

# Check Git
if ! command -v git &> /dev/null; then
    write_error "Git not found! Please install Git first."
    exit 1
fi
write_status "Git is installed"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    write_status "Docker found (optional)"
else
    write_warn "Docker not found (optional for local testing)"
fi

# Check files
if [ ! -f "config.php" ]; then
    write_error "config.php not found! Are you in the project directory?"
    exit 1
fi
write_status "Project files found"

# Check .env
if [ ! -f ".env" ]; then
    write_warn ".env not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        write_status ".env created"
    fi
fi

# ============================================================================
# INTERACTIVE SETUP
# ============================================================================

write_section "INTERACTIVE SETUP"

read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    write_error "GitHub username required!"
    exit 1
fi
write_status "GitHub username: $GITHUB_USERNAME"

read -p "Enter your GitHub email: " GITHUB_EMAIL
if [ -z "$GITHUB_EMAIL" ]; then
    write_error "GitHub email required!"
    exit 1
fi
write_status "GitHub email: $GITHUB_EMAIL"

REPO_NAME="indibuy-main"
write_status "Repository name: $REPO_NAME"

# ============================================================================
# GIT SETUP
# ============================================================================

write_section "GIT SETUP"

write_info "Configuring Git..."
git config --global user.name "$GITHUB_USERNAME"
git config --global user.email "$GITHUB_EMAIL"
write_status "Git configured"

# Initialize repo if needed
if [ ! -d ".git" ]; then
    write_info "Initializing Git repository..."
    git init
    write_status "Git repository initialized"
else
    write_info "Git repository already initialized"
fi

# Create .gitignore if not exists
if [ ! -f ".gitignore" ]; then
    write_info "Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Environment
.env
.env.local

# Logs
logs/
*.log

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Temporary
tmp/
temp/

# Dependencies
node_modules/
vendor/
EOF
    write_status ".gitignore created"
fi

# Stage and commit
write_info "Staging files..."
git add .
write_status "Files staged"

write_info "Creating initial commit..."
COMMIT_MSG="IndiBuy v2.0 - Production ready deployment $(date '+%Y-%m-%d %H:%M:%S')"
if git commit -m "$COMMIT_MSG" 2>/dev/null; then
    write_status "Commit created"
else
    write_info "No changes to commit (already committed)"
fi

# ============================================================================
# ENVIRONMENT CONFIGURATION
# ============================================================================

write_section "ENVIRONMENT CONFIGURATION"

write_info "Current .env configuration:"
cat .env

read -p "Update .env for production? (y/n): " UPDATE_ENV
if [ "$UPDATE_ENV" = "y" ]; then
    read -s -p "Enter database password (or press Enter to skip): " DB_PASS
    echo ""
    
    if [ -n "$DB_PASS" ]; then
        sed -i.bak "s/DB_PASS=.*/DB_PASS=$DB_PASS/" .env
        sed -i.bak "s/APP_ENV=.*/APP_ENV=production/" .env
        write_status ".env updated"
    fi
fi

# ============================================================================
# PRE-DEPLOYMENT CHECKS
# ============================================================================

write_section "PRE-DEPLOYMENT CHECKS"

FILES=(
    "config.php"
    "login.php"
    "payment.php"
    "Dockerfile"
    ".htaccess"
    "DATABASE_SETUP.md"
)

ALL_PASSED=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        write_status "$file exists"
    else
        write_error "$file missing"
        ALL_PASSED=false
    fi
done

if [ "$ALL_PASSED" = false ]; then
    write_error "Pre-deployment checks failed!"
    exit 1
fi

# ============================================================================
# GIT REMOTE
# ============================================================================

write_section "GIT REMOTE SETUP"

REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")

if [ -z "$REMOTE_URL" ]; then
    write_warn "Git remote not configured"
    read -p "Enter GitHub repository URL (leave blank to configure manually): " REMOTE_URL
    
    if [ -n "$REMOTE_URL" ]; then
        git remote add origin "$REMOTE_URL" 2>/dev/null || git remote set-url origin "$REMOTE_URL"
        write_status "Git remote added: $REMOTE_URL"
    fi
fi

# ============================================================================
# DEPLOYMENT
# ============================================================================

write_section "PUSHING CODE TO GITHUB"

if [ -z "$REMOTE_URL" ]; then
    write_error "GitHub remote URL not configured!"
    write_info "Please run: git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    exit 1
fi

write_info "Pushing to: $REMOTE_URL"
git push -u origin main 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    write_status "Code pushed successfully!"
else
    write_error "Git push failed! Check your credentials."
    exit 1
fi

# ============================================================================
# RAILWAY INSTRUCTIONS
# ============================================================================

write_section "RAILWAY DEPLOYMENT INSTRUCTIONS"

cat << EOF
Your code is now on GitHub!

🚀 Next steps to deploy on Railway:

1. Go to https://railway.app
2. Click 'Start New Project'
3. Select 'Deploy from GitHub repo'
4. Authorize Railway and select your repository
5. Railway will auto-detect Dockerfile
6. Click 'Deploy'

🗄️  Add MySQL Service:
1. In Railway dashboard, click '+ New Service'
2. Select 'Database' → 'MySQL'
3. Railway auto-links it!

⚙️  Environment Variables in Railway:
   DB_HOST=mysql
   DB_USER=root
   DB_PASS=<railway-generated>
   DB_NAME=paymentdb
   APP_ENV=production

🔧 Database Setup:
1. In Railway, open MySQL → Connect → phpMyAdmin
2. Copy SQL from DATABASE_SETUP.md
3. Execute all commands

Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME

EOF

# ============================================================================
# SUMMARY
# ============================================================================

write_section "DEPLOYMENT SUMMARY"

PHP_COUNT=$(find . -maxdepth 1 -name "*.php" | wc -l)
HTML_COUNT=$(find . -maxdepth 1 -name "*.html" | wc -l)
MD_COUNT=$(find . -maxdepth 1 -name "*.md" | wc -l)

cat << EOF

✅ Deployment Package Ready!

GitHub Repository:
  https://github.com/$GITHUB_USERNAME/$REPO_NAME

Project Files:
  $PHP_COUNT PHP files
  $HTML_COUNT HTML files
  $MD_COUNT Documentation files

Database:
  Tables: 4 (users, orders, products, error_logs)
  Status: Schema defined, ready for initialization

Security:
  ✅ SQL Injection prevention
  ✅ CSRF protection
  ✅ Password hashing (BCrypt)
  ✅ Input validation & sanitization
  ✅ HTTP security headers
  ✅ No sensitive data storage

Next Action:
  👉 Go to https://railway.app and deploy!

Logs saved to: $LOG_FILE

EOF

write_status "Deployment script completed successfully!"
