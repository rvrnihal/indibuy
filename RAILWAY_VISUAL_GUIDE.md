# 🚀 RAILWAY DEPLOYMENT - STEP-BY-STEP VISUAL GUIDE

## OVERVIEW

This guide will deploy your IndiBuy app in **5 minutes** using Railway.

---

## PHASE 1: GITHUB SETUP (2 Minutes)

### Step 1.1: Create GitHub Account
```
Website: https://github.com/signup
Fill: Email, Password, Username
Click: Create account
Verify: Check your email
```

### Step 1.2: Initialize Local Git

**Windows (PowerShell):**
```powershell
cd C:\Users\dell\OneDrive\Desktop\indibuy-main
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git init
git add .
git commit -m "IndiBuy initial commit"
```

**Mac/Linux:**
```bash
cd ~/projects/indibuy-main
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git init
git add .
git commit -m "IndiBuy initial commit"
```

### Step 1.3: Create Repository on GitHub

**Process:**
1. Go to: https://github.com/new
2. Fill in:
   - Repository name: `indibuy-main`
   - Description: "Industrial E-commerce Platform"
   - Choose: Public (for easy deployment)
3. Click: "Create repository"
4. Copy the HTTPS URL (looks like: `https://github.com/yourname/indibuy-main.git`)

### Step 1.4: Push Code to GitHub

**Windows:**
```powershell
git remote add origin https://github.com/YOUR_USERNAME/indibuy-main.git
git branch -M main
git push -u origin main
```

**Mac/Linux:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/indibuy-main.git
git branch -M main
git push -u origin main
```

**Expected Output:**
```
Enumerating objects: 50, done.
Counting objects: 100% (50/50), done.
...
To https://github.com/yourname/indibuy-main.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **GitHub Done!**

---

## PHASE 2: RAILWAY SETUP (3 Minutes)

### Step 2.1: Create Railway Account

**Process:**
1. Go to: https://railway.app
2. Click: "Start New Project"
3. Sign up with GitHub or email
4. Authorize Railway to access GitHub

### Step 2.2: Deploy from GitHub

**Process:**
1. Click: "+ New Project"
2. Select: "Deploy from GitHub repo"
3. Click: "Authorize & Connect"
4. Select your GitHub account
5. Choose: `indibuy-main` repository
6. Click: "Deploy"

**What Happens:**
```
Railway detects Dockerfile
    ↓
Builds Docker image
    ↓
Starts web container
    ↓
Assigns public URL
    ↓
App is LIVE! ✅
```

### Step 2.3: Add MySQL Database

**Process:**
1. In Railway dashboard
2. Click: "+ New Service"
3. Select: "Database" (dropdown)
4. Choose: "MySQL"
5. Railway auto-links to web service ✨

**What Happens:**
```
MySQL container starts
    ↓
Credentials generated
    ↓
Database "paymentdb" created
    ↓
Web service auto-configured
    ↓
Connection ready! ✅
```

### Step 2.4: Configure Environment Variables

**Process:**
1. Click: "Web Service" in dashboard
2. Go to: "Variables" tab
3. Add these variables:

```
DB_HOST=mysql
DB_USER=root
DB_PASS=<copy from MySQL service>
DB_NAME=paymentdb
APP_ENV=production
CSRF_TOKEN_LENGTH=32
```

**How to find DB_PASS:**
1. Click: "MySQL" service
2. Click: "Variables" tab
3. Copy: Value of `MYSQLPASSWORD`
4. Paste into: DB_PASS

### Step 2.5: Trigger Deploy

**Process:**
1. Click: "Web Service"
2. Go to: "Deployments" tab
3. Click: "Redeploy" (with new variables)

**Wait:** 2-3 minutes for deployment

**Your URL will look like:**
```
https://indibuy-abc123.railway.app
```

✅ **Railway Done!**

---

## PHASE 3: DATABASE SETUP (1 Minute)

### Step 3.1: Access Database

**Process:**
1. Go to Railway dashboard
2. Click: "MySQL" service
3. Click: "Connect" tab
4. Choose: "phpMyAdmin" link
5. Opens in new tab

### Step 3.2: Initialize Database Schema

**In phpMyAdmin:**
1. Click: Database dropdown (left)
2. Select: `paymentdb`
3. Click: "SQL" tab
4. Copy-paste SQL from: `DATABASE_SETUP.md`
5. Click: "Go" button

**What Gets Created:**
```sql
✅ users table
✅ orders table  
✅ products table
✅ error_logs table
✅ Indexes & relationships
```

### Step 3.3: Verify Tables

**Check:**
1. Left sidebar → paymentdb
2. Should see 4 tables
3. Expand "users" → should show columns

✅ **Database Done!**

---

## PHASE 4: TESTING (1 Minute)

### Step 4.1: Test Application

**Process:**
1. Go to: `https://indibuy-abc123.railway.app`
2. Should see: IndiBuy homepage
3. Click: Login link

### Step 4.2: Test Registration

**Test Case 1:**
```
1. Click "Sign Up" tab
2. Fill form:
   - Name: John Test
   - Email: test@example.com
   - Password: Test@123456
3. Click "Submit"
4. Should see: "Registration successful!"
```

### Step 4.3: Test Login

**Test Case 2:**
```
1. Click "Log In" tab
2. Fill form:
   - Email: test@example.com
   - Password: Test@123456
3. Click "Submit"
4. Should see: "Login successful!"
5. Should redirect to home
```

### Step 4.4: Test Cart

**Test Case 3:**
```
1. Go to: Products page
2. Click "Add to Cart"
3. Refresh page (F5)
4. Cart should still be there ✅
```

### Step 4.5: Check Logs

**View Errors:**
1. Railway dashboard
2. Web Service → Logs
3. Should see: "PHP Server Started"
4. No red error messages

✅ **Testing Done!**

---

## 🎉 DEPLOYMENT COMPLETE!

Your IndiBuy app is now **LIVE** at:
```
https://indibuy-abc123.railway.app
```

### What You Got:
✅ Live website  
✅ MySQL database  
✅ SSL certificate (HTTPS)  
✅ Auto-scaling  
✅ Monitoring  
✅ Backups  
✅ Error logs  

### What's Next:
1. **Custom Domain** (optional)
   - Go to Railway settings
   - Add your domain
   - Update DNS records

2. **Monitoring**
   - Check logs regularly
   - Monitor error_logs table
   - Review user feedback

3. **Scale**
   - If traffic increases
   - Railway auto-scales
   - Or upgrade plan

---

## 📋 QUICK REFERENCE

### URLs
```
App: https://indibuy-abc123.railway.app
GitHub: https://github.com/yourname/indibuy-main
Railway: https://railway.app/dashboard
```

### Database Access
```
Host: mysql
Username: root
Password: (from Railway variables)
Database: paymentdb
```

### Common Commands

**View Logs:**
```bash
# In Railway dashboard
Web Service → Logs
```

**Restart App:**
```bash
# In Railway dashboard
Web Service → Redeploy
```

**SSH into Container:**
```bash
# In Railway dashboard
Web Service → Connect → Railway CLI
railway shell
```

---

## 🆘 COMMON ISSUES & FIXES

### Issue: "Cannot connect to database"
**Fix:**
1. Check DB_HOST = "mysql" (not "localhost")
2. Verify DB_PASS matches
3. Ensure MySQL service is running
4. Redeploy web service

### Issue: "503 Service Unavailable"
**Fix:**
1. Check Railway logs
2. Verify all variables set
3. Restart web service
4. Wait 2 minutes

### Issue: "Application Error"
**Fix:**
1. Check PHP errors in logs
2. Verify database initialized
3. Check .env file exists
4. View error_logs table

### Issue: "Database does not exist"
**Fix:**
1. Go to phpMyAdmin
2. Run DATABASE_SETUP.md SQL
3. Verify tables created
4. Restart web service

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] GitHub account created
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] App deployed on Railway
- [ ] MySQL database added
- [ ] Environment variables set
- [ ] Database initialized
- [ ] Registration tested
- [ ] Login tested
- [ ] Cart tested
- [ ] No errors in logs
- [ ] App is LIVE ✅

---

## 🎓 TROUBLESHOOTING GUIDE

### If Something Goes Wrong:

**Step 1: Check Logs**
```
Railway Dashboard → Web Service → Logs
Look for red text or ERROR messages
```

**Step 2: Verify Variables**
```
Railway Dashboard → Web Service → Variables
Ensure all 6 variables are set correctly
```

**Step 3: Restart Service**
```
Railway Dashboard → Web Service → Redeploy
Wait 3 minutes for restart
```

**Step 4: Check Database**
```
Railway → MySQL → Connect → phpMyAdmin
Verify tables exist and have data
```

**Step 5: Review .env**
```
Check local .env file for correct values
Variables should match Railway settings
```

---

## 📞 GETTING HELP

**Resources:**
- Railway Docs: https://docs.railway.app
- Railway Support: https://railway.app/support
- GitHub Docs: https://docs.github.com
- IndiBuy Docs: See README.md and guides

**Check These First:**
1. DEPLOY_NOW.md (overview)
2. RAILWAY_DEPLOYMENT.md (detailed)
3. DATABASE_SETUP.md (database)
4. QUICKSTART.md (local setup)

---

## 🚀 YOU'RE READY!

**Timeline:**
- GitHub setup: 2 minutes
- Railway deploy: 3 minutes
- Database setup: 1 minute
- Testing: 1 minute
- **Total: 7 minutes** ⏱️

**Next Step:** Start at PHASE 1 above! 

---

**Happy Deploying! 🎉**

*Your IndiBuy app will be production-ready in under 10 minutes!*
