# 🚀 QUICK DEPLOYMENT GUIDE

## ⚡ 5-MINUTE DEPLOYMENT (Choose One)

### Option 1: Replit (EASIEST)
```
1. Go to https://replit.com
2. Click "New Repl" → Choose PHP
3. Upload indibuy-main folder
4. Add MySQL database (Tools → Database)
5. Update .env with DB credentials
6. Shell: php utils/DatabaseMigration.php migrate
7. Click "Run"
✅ DONE - Your app is live!
```

### Option 2: Railway
```
1. Push to GitHub
2. Go to https://railway.app
3. Deploy from GitHub repo
4. Add environment variables
5. Railway auto-provisions MySQL
✅ DONE - Your app is live!
```

### Option 3: Local Testing
```
1. Install XAMPP or WAMP
2. Copy project to htdocs
3. Create database in phpMyAdmin
4. Update .env file
5. Run migrations: php utils/DatabaseMigration.php migrate
6. Access via http://localhost/indibuy-main
✅ DONE - Test locally!
```

---

## ✅ Deployment Checklist

### Before Deployment:

```bash
# 1. Run setup checker
php setup.php

# 2. Check database connection
php -r "require 'config.php'; echo 'DB Connected!'"

# 3. Run migrations
php utils/DatabaseMigration.php migrate

# 4. Verify migrations
php utils/DatabaseMigration.php status
```

### Files Changed for Easy Deployment:

✅ **config.php** - Better error handling, auto-creates /logs
✅ **setup.php** - Deployment checker script
✅ **index.php** - Request routing and entry point
✅ **.htaccess** - Apache configuration (existing)
✅ **.env.example** - Configuration template

---

## 🔧 Testing the Deployment

```bash
# Test API health
curl http://your-url/status

# Test products API
curl http://your-url/api/products.php?action=list

# Test registration
curl -X POST http://your-url/api/auth.php?action=register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Pass123!","phone":"9876543210"}'
```

---

## 📋 Environment Variables Setup

For Replit:
```
Tools → Secrets → Add each variable
- DB_HOST (from MySQL service)
- DB_USER (from MySQL service)
- DB_PASS (from MySQL service)
- DB_NAME (from MySQL service)
- APP_ENV=production
- ENCRYPTION_KEY (generate random 32 chars)
- JWT_SECRET (generate random key)
```

For Railway:
```
Project Settings → Variables
Add all from .env.example
Railway provides DB credentials automatically
```

---

## 🚨 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Database connection failed" | Run setup.php, check .env file |
| "File not found" | Run migrations: php utils/DatabaseMigration.php migrate |
| "404 errors" | Check if mod_rewrite is enabled (Apache) |
| "Permission denied" | Check folder permissions, /logs should be writable |

---

## 📊 Deployment Files

All files optimized for easy deployment:

✅ **setup.php** - Checks everything before deploying
✅ **config.php** - Auto-creates needed directories
✅ **index.php** - Centralized routing
✅ **api/*.php** - All APIs ready
✅ **.htaccess** - Production-ready config

---

## ✨ Key Improvements Made:

1. **Auto-creates /logs** - No manual directory setup needed
2. **Better errors** - Clear messages during deployment
3. **Setup checker** - Validates everything before going live
4. **Entry point** - index.php handles routing
5. **Environment handling** - Reads from .env and system env vars
6. **Connection pooling** - Caches database connection
7. **Better error logging** - Helps debug issues

---

## 🎯 Next Step

1. Run: `php setup.php`
2. Fix any issues shown
3. Deploy to Replit/Railway
4. Test with provided cURL commands
5. ✅ You're live!

---

## 📞 Need Help?

- See END_TO_END_TESTING.md for testing guide
- See IMPLEMENTATION_GUIDE.md for full setup
- See API_DOCUMENTATION.md for API details

---

**Everything is ready for deployment!** 🚀
