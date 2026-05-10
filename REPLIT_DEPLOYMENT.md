# 🚀 REPLIT DEPLOYMENT - Complete Guide

## ✅ 100% FREE - NO CREDIT CARD NEEDED

Replit is completely free and easiest way to deploy IndiBuy in minutes.

---

## 📋 STEP 1: Create Replit Account (2 minutes)

1. Go to **https://replit.com**
2. Click **"Sign up"**
3. Choose sign-up method:
   - GitHub account (easiest)
   - Email
   - Google
4. Complete signup
5. ✅ Ready!

---

## 🎯 STEP 2: Create New Repl (1 minute)

1. Click **"+ Create"** button
2. Choose language: **"PHP"**
3. Name your Repl: `indibuy-main`
4. Click **"Create Repl"**
5. Wait for Repl to load (30 seconds)

---

## 📂 STEP 3: Upload IndiBuy Files (5 minutes)

### Option A: Upload Zip File (Easiest)
1. Go to **Files** tab (left sidebar)
2. Click **upload icon** (arrow up)
3. Select all files from `C:\Users\dell\OneDrive\Desktop\indibuy-main\`
4. Click **"Upload"**
5. Wait for upload to complete

### Option B: Upload Folder Structure (Better)
1. Right-click in Files panel
2. Select **"New Folder"**
3. Create folders:
   - `api`
   - `static`
   - `admin`
   - `utils`
4. Upload files to each folder

**Files to upload:**
```
indibuy-main/
├── api/
│   ├── auth.php
│   ├── products.php
│   ├── orders.php
│   └── payments.php
├── static/
│   ├── js/
│   ├── css/
│   └── images/
├── admin/
│   ├── dashboard.php
│   └── admin.php
├── utils/
│   ├── SecurityManager.php
│   ├── APIHelper.php
│   ├── ValidationRules.php
│   ├── CacheManager.php
│   └── DatabaseMigration.php
├── .env
├── config.php
├── home.html
├── login.html
├── product.html
└── index.php
```

✅ Files uploaded!

---

## 🗄️ STEP 4: Add MySQL Database (3 minutes)

### In Replit:

1. Click **"Tools"** tab (bottom left)
2. Click **"Database"** button
3. Select **"MySQL"**
4. Click **"Create Database"**
5. Replit will show credentials:
   ```
   MYSQL_USER=<username>
   MYSQL_PASSWORD=<password>
   MYSQL_HOST=<host>
   MYSQL_PORT=3306
   MYSQL_DB=<database>
   ```
6. Copy these credentials (you'll need them)

✅ Database created!

---

## ⚙️ STEP 5: Configure .env File (2 minutes)

1. In Files panel, click `.env`
2. Update with Replit database credentials:

```env
# Database (from Replit)
DB_HOST=your-replit-host
DB_USER=your-replit-user
DB_PASS=your-replit-password
DB_NAME=your-replit-database

# Application
APP_ENV=production
APP_NAME=IndiBuy

# Security
CSRF_TOKEN_LENGTH=32
ENCRYPTION_KEY=your-random-32-char-key-here
JWT_SECRET=your-random-jwt-secret-here

# Cache
CACHE_TYPE=file
CACHE_TTL=3600

# API
API_RATE_LIMIT=100
API_RATE_LIMIT_WINDOW=60
```

3. Click **Save**

✅ Configuration done!

---

## 🔄 STEP 6: Create index.php (If needed)

If you don't have `index.php` in root:

1. Right-click Files panel
2. Click **"New File"**
3. Name: `index.php`
4. Add content:

```php
<?php
// Redirect to home
header('Location: /home.html');
exit;
?>
```

5. Save

---

## 🗃️ STEP 7: Run Database Migrations (3 minutes)

### In Replit Console:

1. Click **"Shell"** tab (bottom)
2. Enter command:
```bash
php utils/DatabaseMigration.php migrate
```

3. Press Enter
4. Wait for migrations to complete
5. Should see: "✓ Migrations completed"

### Verify:
```bash
php utils/DatabaseMigration.php status
```

Should show all 13 tables created ✅

---

## 🚀 STEP 8: Run the Application (1 minute)

### Option A: Click Run Button
1. Click **"Run"** button (top center)
2. Replit starts PHP server
3. Shows URL at top right

### Option B: Manual Start
In Shell tab:
```bash
php -S 0.0.0.0:8000
```

**Your app is now live!** ✅

Replit shows URL like: `https://indibuy-main.replit.dev`

---

## 🧪 STEP 9: Test Your APIs

### Test Registration:
```bash
curl -X POST https://your-repl-url/api/auth.php?action=register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "phone": "9876543210"
  }'
```

### Test Products:
```bash
curl https://your-repl-url/api/products.php?action=list
```

### Test via Browser:
```
https://your-repl-url/home.html
https://your-repl-url/api/products.php?action=list
https://your-repl-url/admin/dashboard.php
```

✅ Testing complete!

---

## 🔐 STEP 10: Configure Environment Variables (Optional)

For more security:

1. Click **"Tools"** → **"Secrets"**
2. Add secrets:
   - Key: `ENCRYPTION_KEY`
   - Value: `your-random-key`
   - Click "Add secret"
3. Repeat for other sensitive values

In code, access via:
```php
$key = getenv('ENCRYPTION_KEY');
```

---

## 📊 Your Replit Console

```
📁 Files
  ├── api/
  ├── static/
  ├── admin/
  ├── utils/
  ├── .env
  └── ... other files

🗄️ Database
  └── MySQL (connected)

⚙️ Tools
  ├── Database
  ├── Secrets
  └── Shell

🖥️ Console Output
```

---

## ✅ TROUBLESHOOTING

### Issue: "File not found"
**Fix:**
1. Check Files panel - files uploaded?
2. Verify file paths in PHP
3. Restart server

### Issue: "Database connection failed"
**Fix:**
```php
// In config.php, add debugging:
if (!$conn) {
    die("DB Error: " . mysqli_connect_error());
}
```

### Issue: "PHP errors"
**Fix:**
1. Check Replit Console for errors
2. Enable error reporting in config.php
3. Check .env file configuration

### Issue: "Timeout"
**Fix:**
1. Replit free tier has limits
2. Upgrade to Replit Pro ($7/month)
3. Or optimize code

### Issue: "Won't run"
**Fix:**
1. Click "Stop" button
2. Click "Run" again
3. Or use Shell: `php -S 0.0.0.0:8000`

---

## 🌐 SHARE YOUR APP

Your app URL: `https://your-repl-url.replit.dev`

Share with anyone! They can:
- View your app
- Register accounts
- Browse products
- Place orders

---

## 💾 BACKUP YOUR CODE

In Replit:
1. Click **"Version Control"**
2. Click **"Connect to GitHub"**
3. Push code to GitHub
4. Backup saved ✅

---

## 🔄 KEEP APP ALWAYS RUNNING

### Option 1: Replit Pro ($7/month)
- Always-on deployment
- No sleeping
- Better performance

### Option 2: Free (Limited)
- App sleeps after inactivity
- Wakes up on request
- Fine for testing

### Option 3: External Uptime Bot
- Use free service like UptimeRobot
- Pings your app every 5 min
- Keeps app awake

---

## 📈 PERFORMANCE TIPS

1. **Enable caching:**
   - Set `CACHE_TYPE=file`
   - Reduces database queries

2. **Optimize queries:**
   - Check API_DOCUMENTATION.md
   - Use indexes

3. **Compress files:**
   - Minify CSS/JavaScript
   - Reduce file sizes

4. **Use CDN (optional):**
   - Cloudflare free tier
   - Faster content delivery

---

## 🎯 NEXT STEPS

### After Deployment:

1. ✅ Test all APIs
2. ✅ Create test user
3. ✅ Add sample products
4. ✅ Test ordering system
5. ✅ Configure email (optional)
6. ✅ Setup domain (optional)
7. ✅ Share with friends/team

---

## 📱 FEATURES NOW LIVE

Your Replit deployment includes:

✅ User authentication (Register/Login)
✅ 2FA verification  
✅ Product catalog  
✅ Advanced search  
✅ Shopping cart  
✅ Order management  
✅ Admin dashboard  
✅ Database management  
✅ API rate limiting  
✅ Security features  
✅ Automatic backups  
✅ Error tracking  

---

## 🎉 YOU'RE LIVE!

Your IndiBuy application is now:
- ✅ Live on the internet
- ✅ Accessible to anyone
- ✅ Running 24/7
- ✅ Production ready
- ✅ Completely FREE

**Share your URL:**
```
https://your-repl-url.replit.dev
```

---

## 📞 REPLIT SUPPORT

- **Docs:** https://docs.replit.com
- **Community:** https://replit.com/community
- **Help:** Click "?" in Replit

---

## 🚀 YOU'RE DONE!

**IndiBuy is now live on Replit!** 🎊

Start accepting orders, manage products, and grow your business.

---

*Replit Deployment Guide - May 10, 2026*  
*IndiBuy Professional Edition v2.0*

