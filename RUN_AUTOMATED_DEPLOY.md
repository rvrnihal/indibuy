# 🚀 AUTOMATED DEPLOYMENT SCRIPTS

## What's New

Two powerful automation scripts are now available:

```
📁 Automation Scripts:
├── deploy-auto.ps1    ✅ Windows PowerShell (full automation)
└── deploy-auto.sh     ✅ Mac/Linux Bash (full automation)
```

These scripts handle everything automatically:
- ✅ Git configuration
- ✅ Repository initialization
- ✅ Environment setup
- ✅ Code pushing to GitHub
- ✅ Deployment instructions

---

## 🟢 WINDOWS USERS - Run This Now

### Option A: PowerShell (Recommended)

```powershell
# Open PowerShell in your project directory
cd "C:\Users\dell\OneDrive\Desktop\indibuy-main"

# Run the automation script
.\deploy-auto.ps1

# The script will:
# 1. Ask for your GitHub username
# 2. Ask for your GitHub email
# 3. Initialize Git repo
# 4. Create .env file
# 5. Commit all files
# 6. Configure remote
# 7. Push to GitHub
# 8. Show deployment instructions
```

### Option B: Batch File (Simpler)

```batch
cd "C:\Users\dell\OneDrive\Desktop\indibuy-main"
deploy.bat
```

---

## 🍎 MAC USERS - Run This Now

```bash
cd ~/projects/indibuy-main

# Make script executable
chmod +x deploy-auto.sh

# Run automation
./deploy-auto.sh

# The script will:
# 1. Ask for your GitHub username
# 2. Ask for your GitHub email
# 3. Initialize Git repo
# 4. Create .env file
# 5. Commit all files
# 6. Configure remote
# 7. Push to GitHub
# 8. Show deployment instructions
```

---

## 🐧 LINUX USERS - Run This Now

```bash
cd ~/indibuy-main

# Make script executable
chmod +x deploy-auto.sh

# Run automation
./deploy-auto.sh

# Follow prompts...
```

---

## ⚡ WHAT THE SCRIPTS DO (Step-by-Step)

### Phase 1: Requirements Check (Automatic)
```
✅ Checks if Git is installed
✅ Verifies project files exist
✅ Confirms .env file
```

### Phase 2: Interactive Setup (Prompts You)
```
? Enter your GitHub username: john_doe
? Enter your GitHub email: john@example.com
```

### Phase 3: Git Configuration (Automatic)
```
✅ Configures Git user
✅ Initializes repository
✅ Creates .gitignore
```

### Phase 4: Environment Setup (Interactive)
```
? Update .env for production? (y/n)
  - Allows you to set database password
  - Configures for production environment
```

### Phase 5: Pre-Deployment Checks (Automatic)
```
✅ config.php exists
✅ login.php exists
✅ payment.php exists
✅ Dockerfile exists
✅ .htaccess exists
✅ DATABASE_SETUP.md exists
```

### Phase 6: Git Push (Automatic)
```
✅ Stages all files
✅ Creates commit
✅ Pushes to GitHub
```

### Phase 7: Instructions (Display)
```
Shows Railway deployment steps
Shows database setup instructions
Shows next actions
```

---

## 📋 BEFORE RUNNING THE SCRIPT

**Checklist:**

- [ ] **Git installed**
  - Check: `git --version`
  - If not: Download from https://git-scm.com

- [ ] **GitHub account created**
  - Create at https://github.com/signup (free)
  - Have username ready

- [ ] **GitHub email**
  - Use same email as GitHub account

- [ ] **In correct directory**
  - Windows: `C:\Users\dell\OneDrive\Desktop\indibuy-main`
  - Mac/Linux: `~/projects/indibuy-main` or wherever you cloned it

---

## 🎯 STEP-BY-STEP EXECUTION

### For Windows (PowerShell):

```powershell
# 1. Open PowerShell
# Press Windows + R, type: powershell, press Enter

# 2. Navigate to project
cd "C:\Users\dell\OneDrive\Desktop\indibuy-main"

# 3. Check if script exists
ls deploy-auto.ps1

# 4. Run script
.\deploy-auto.ps1

# 5. Answer prompts as they appear
# ℹ️  Enter your GitHub username: [your-username]
# ℹ️  Enter your GitHub email: [your@email.com]

# 6. Watch it work!
# The script will output status messages

# 7. At the end, go to Railway
# Follow the instructions shown
```

### For Mac/Linux (Bash):

```bash
# 1. Open Terminal

# 2. Navigate to project
cd ~/projects/indibuy-main

# 3. Make script executable
chmod +x deploy-auto.sh

# 4. Check if script exists
ls deploy-auto.sh

# 5. Run script
./deploy-auto.sh

# 6. Answer prompts as they appear
# Enter your GitHub username: [your-username]
# Enter your GitHub email: [your@email.com]

# 7. Watch it work!

# 8. At the end, go to Railway
# Follow the instructions shown
```

---

## 📊 EXECUTION TIMELINE

```
Script Start
    ↓
Requirements Check (5 sec) ✅
    ↓
Interactive Setup (30 sec) ⏱️
    ↓
Git Configuration (5 sec) ✅
    ↓
Environment Setup (30 sec) ⏱️
    ↓
Pre-Deployment Checks (2 sec) ✅
    ↓
Git Push (30-60 sec) ⏱️
    ↓
Show Instructions (5 sec) ✅
    ↓
Total: ~2-3 minutes
```

---

## ✨ SCRIPT FEATURES

### Error Handling
- Checks for missing files
- Validates Git installation
- Confirms GitHub credentials
- Rolls back on failure

### Logging
- Creates `deployment.log` file
- Tracks all actions
- Useful for troubleshooting

### Color-Coded Output
- 🟢 Green = Success
- 🔵 Blue = Information
- 🟡 Yellow = Warning
- 🔴 Red = Error
- 🟣 Purple = Section headers

### User-Friendly
- Clear prompts
- Helpful error messages
- Step-by-step status
- Final summary

---

## 🆘 TROUBLESHOOTING

### Issue: "Script is disabled"
**Windows PowerShell Only:**
```powershell
# Run this once:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run the script
.\deploy-auto.ps1
```

### Issue: "Git not found"
**Solution:**
1. Install Git: https://git-scm.com/download/win (Windows)
2. Restart PowerShell
3. Run script again

### Issue: "Permission denied"
**Mac/Linux:**
```bash
chmod +x deploy-auto.sh
./deploy-auto.sh
```

### Issue: "Already exists error"
```bash
# If Git remote already exists:
git remote set-url origin https://github.com/username/indibuy-main.git
```

---

## 🔐 SECURITY NOTES

### What's Safe
✅ Script doesn't store passwords  
✅ GitHub credentials required (secure)  
✅ .env file not committed (safe)  
✅ All sensitive files ignored  

### What to Do
1. Keep .env file local only
2. Never commit passwords
3. Use strong database password
4. Don't share .env file

---

## 📁 OUTPUT FILES

After running the script:

```
Created/Updated:
✅ .git/                    - Git repository
✅ .gitignore               - Git exclusions
✅ deployment.log           - Script log file
✅ GitHub repo (if new)     - On github.com

Ready for:
✅ Railway deployment
✅ Docker deployment
✅ Traditional hosting
```

---

## 🎉 AFTER SCRIPT COMPLETES

### Next Action:
1. Check your GitHub repo was created
2. Copy the repo URL
3. Go to https://railway.app
4. Deploy from GitHub
5. Add MySQL database
6. Initialize schema
7. Your app is LIVE! 🚀

---

## 📞 SCRIPT OPTIONS (Advanced)

### Windows PowerShell (Named Parameters):

```powershell
.\deploy-auto.ps1 `
    -GitHubUsername "john_doe" `
    -GitHubEmail "john@example.com" `
    -RepoName "indibuy-main" `
    -DryRun:$false
```

### Mac/Linux (Environment Variables):

```bash
# Just run normally:
./deploy-auto.sh

# Or configure GitHub first:
git config --global user.name "john_doe"
git config --global user.email "john@example.com"
./deploy-auto.sh
```

---

## ✅ SUCCESS INDICATORS

When script completes successfully, you'll see:

✅ Green checkmarks throughout  
✅ "Deployment script completed successfully!"  
✅ GitHub repository link displayed  
✅ Railway deployment instructions shown  
✅ `deployment.log` file created  

---

## 🚀 READY TO DEPLOY?

**Choose your platform:**

**Windows:**
```powershell
.\deploy-auto.ps1
```

**Mac/Linux:**
```bash
./deploy-auto.sh
```

**Go!** 🎊

---

*Automated deployment scripts ready to use!*
*Your IndiBuy app will be on GitHub in 2-3 minutes.*
