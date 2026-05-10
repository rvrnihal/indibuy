# 🚀 DEPLOY INDIBUY TO REPLIT - STEP BY STEP

## ✅ 100% FREE - NO CREDIT CARD NEEDED

---

## 📋 STEP 1: Go to Replit (1 minute)

1. Open browser: **https://replit.com**
2. Click **"Sign up"** (top right)
3. Choose sign-up:
   - ✅ **GitHub** (easiest - use your GitHub account)
   - Email
   - Google
4. Complete signup
5. ✅ Done - You're in!

---

## 🎯 STEP 2: Create New Repl (2 minutes)

1. Click **"+ Create"** button (top left)
2. Choose **"PHP"** from language list
3. Name: `indibuy-main`
4. Click **"Create Repl"**
5. Wait 30 seconds to load
6. ✅ Repl created!

---

## 📂 STEP 3: Import from GitHub (3 minutes)

### Option A: Import Repository (EASIEST)

1. Click **"..."** menu (top right)
2. Select **"Version Control"** → **"Connect to GitHub"**
3. Find and select: `rvrnihal/indibuy-main`
4. Click **"Import"**
5. Replit downloads all files
6. ✅ Files imported!

### Option B: Upload Zip File

1. Go to: https://github.com/rvrnihal/indibuy-main
2. Click **"Code"** → **"Download ZIP"**
3. Extract zip file
4. In Replit, click upload icon
5. Drag the extracted folder
6. ✅ Files uploaded!

---

## 🗄️ STEP 4: Add MySQL Database (3 minutes)

1. Click **"Tools"** button (bottom left)
2. Select **"Database"**
3. Click **"MySQL"**
4. Click **"Create Database"**
5. Replit shows credentials:
   ```
   MYSQL_USER = (username)
   MYSQL_PASSWORD = (password)
   MYSQL_HOST = (host)
   MYSQL_PORT = 3306
   MYSQL_DB = (database)
   ```
6. **Copy these** (you need them for .env)
7. ✅ Database created!

---

## ⚙️ STEP 5: Configure .env File (3 minutes)

1. In Files panel (left), find `.env` file
2. Click to open it
3. Replace with Replit credentials:

```env
# Database (paste Replit credentials here)
DB_HOST=<your-replit-mysql-host>
DB_USER=<your-replit-mysql-user>
DB_PASS=<your-replit-mysql-password>
DB_NAME=<your-replit-mysql-database>

# Application
APP_ENV=production
APP_NAME=IndiBuy

# Security
CSRF_TOKEN_LENGTH=32
ENCRYPTION_KEY=indibuy-production-key-2026
JWT_SECRET=indibuy-jwt-secret-2026

# Cache
CACHE_TYPE=file
CACHE_TTL=3600
```

4. Click **"Save"**
5. ✅ Configuration done!

---

## 🔄 STEP 6: Run Database Migrations (3 minutes)

1. Click **"Shell"** tab (bottom)
2. Type command:
```bash
php utils/DatabaseMigration.php migrate
```

3. Press **Enter**
4. Wait 30 seconds
5. Should see: ✓ All migrations completed
6. Verify with:
```bash
php utils/DatabaseMigration.php status
```

7. ✅ Database ready!

---

## 🚀 STEP 7: Start the Server (1 minute)

### Option A: Click "Run" Button (EASIEST)
1. Click large **"Run"** button (top center)
2. Replit starts PHP server automatically
3. Shows URL at top right

### Option B: Manual Start in Shell
```bash
php -S 0.0.0.0:8000
```

**Your app is live!** ✅

Replit shows: `https://indibuy-main.replit.dev` (or similar)

---

## 🧪 STEP 8: Test the Application (2 minutes)

### Test in Browser:

1. **Home Page:**
   ```
   https://your-repl-url/home.html
   ```

2. **Product List API:**
   ```
   https://your-repl-url/api/products.php?action=list
   ```

3. **Admin Dashboard:**
   ```
   https://your-repl-url/admin/dashboard.php
   ```

### Test User Registration:

```bash
# In Shell, test with curl:
curl -X POST https://your-repl-url/api/auth.php?action=register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "phone": "9876543210"
  }'
```

✅ Everything working!

---

## 📊 WHAT YOU NOW HAVE:

✅ **Live IndiBuy store** on internet  
✅ **MySQL database** auto-configured  
✅ **All APIs working** (auth, products, orders)  
✅ **Admin dashboard** functional  
✅ **User authentication** 2FA ready  
✅ **Completely free** (no payment ever)  
✅ **Shareable URL** for team/customers  

---

## 🔗 YOUR LIVE APP URL:

```
https://indibuy-main.replit.dev
```

Share this link with anyone!

---

## 🎯 NEXT STEPS:

### 1. Test Features
- [ ] Register as user
- [ ] Login
- [ ] Browse products
- [ ] Add to cart
- [ ] Create order
- [ ] Admin access

### 2. Customize
- [ ] Add your products to database
- [ ] Update company logo
- [ ] Customize colors in CSS
- [ ] Add payment gateway (Razorpay)

### 3. Go Live
- [ ] Add custom domain (optional)
- [ ] Setup email notifications
- [ ] Configure payment processing
- [ ] Promote to customers

---

## ⚠️ TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| **Files not showing** | Click refresh, or upload again |
| **Database connection error** | Check .env file has correct credentials |
| **PHP errors** | Check Shell tab for error messages |
| **App won't start** | Stop and Run again, or restart in Shell |
| **Timeout issues** | Upgrade to Replit Pro ($7/month) for always-on |

---

## 💾 KEEP YOUR CODE BACKED UP

In Replit:
1. Click **"Version Control"** (bottom)
2. Click **"Connect to GitHub"**
3. Your code auto-syncs to GitHub
4. ✅ Backup secured!

---

## 🎉 CONGRATULATIONS!

**IndiBuy is now LIVE!** 🚀

Your professional e-commerce platform is:
- ✅ Running 24/7
- ✅ Accessible worldwide
- ✅ Fully functional
- ✅ Ready for customers
- ✅ Completely FREE

---

## 📞 NEED HELP?

- **Replit Docs:** https://docs.replit.com
- **IndiBuy Guides:** See other .md files in repo
- **API Reference:** See API_DOCUMENTATION.md

---

**YOU'RE DONE!** Share your URL and start accepting orders! 🎊

