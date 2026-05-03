# IndiBuy Deployment Guide - Railway

## 🚀 RAILWAY DEPLOYMENT (Easiest - 5 Minutes)

### Step 1: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "IndiBuy project upgrade v2.0"

# Create on GitHub.com
# 1. Go to https://github.com/new
# 2. Create repository: "indibuy-main"
# 3. Push your code:
git remote add origin https://github.com/yourusername/indibuy-main.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Railway

1. **Go to Railway.app**
   - Visit: https://railway.app
   - Click "Start New Project"
   - Select "Deploy from GitHub"

2. **Connect GitHub Account**
   - Authorize Railway to access your repos
   - Select "indibuy-main" repository

3. **Configure Environment**
   - Railway will detect Dockerfile automatically
   - Add environment variables:
     ```
     DB_HOST=mysql
     DB_USER=root
     DB_PASS=your_secure_password
     DB_NAME=paymentdb
     APP_ENV=production
     CSRF_TOKEN_LENGTH=32
     ```

4. **Add MySQL Service**
   - Click "Add Service" → "Database" → "MySQL"
   - Railway links it automatically
   - Database credentials auto-configured

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your URL: `https://yourproject.railway.app`

### Step 3: Run Database Setup

Once deployed:

```bash
# SSH into Railway container
railway shell

# Run database setup
mysql -u root -p$DB_PASS paymentdb < /var/www/html/DATABASE_SETUP.sql
```

**Or use phpMyAdmin:**
1. Railway dashboard → MySQL service
2. Click "Connect" → "phpMyAdmin"
3. Paste SQL commands from DATABASE_SETUP.md

---

## 🐳 DOCKER LOCAL TESTING (Before Deploying)

### Quick Start

```bash
# Build and run containers
docker-compose up --build

# Access the app
# Frontend: http://localhost
# Database: localhost:3306
```

### Initialize Database

```bash
# In another terminal
docker-compose exec db mysql -u root -proot paymentdb

# Paste SQL from DATABASE_SETUP.md
```

---

## 🔧 ALTERNATIVE: RENDER.COM

### Step 1: Connect GitHub
- Visit: https://render.com
- Click "New +" → "Web Service"
- Select your GitHub repo

### Step 2: Configure
```
Build Command: (leave empty)
Start Command: apache2-foreground
Environment: Add same as Railway
```

### Step 3: Add PostgreSQL
- Click "New +" → "PostgreSQL"
- Link to web service
- Update DB credentials

### Step 4: Deploy
- Click "Create Web Service"
- Done! URL generated automatically

---

## 💰 PRICING COMPARISON

| Platform | Tier | Cost | Best For |
|----------|------|------|----------|
| **Railway** | Starter | $5-20/month | Easy, Fast |
| **Render** | Free | Free | Testing |
| **Heroku** | Eco | $7/month | Professional |
| **DigitalOcean** | Droplet | $5+/month | Control |

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] Domain connected (optional)
- [ ] SSL certificate active (auto with Railway/Render)
- [ ] Database initialized with schema
- [ ] Environment variables configured
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test payment flow
- [ ] Error logs accessible
- [ ] Backups configured
- [ ] Monitoring enabled

---

## 🔐 POST-DEPLOYMENT SECURITY

### Update Environment
```
APP_ENV=production
HTTPS enforcement (automatic)
Database backups enabled
Error logging to file
```

### Monitor
- Check error logs: `logs/errors.log`
- Monitor database: phpMyAdmin dashboard
- Track user activity: `error_logs` table

### Backup Strategy
```bash
# Automated daily backups
# Railway: Built-in
# Render: Configure in dashboard
```

---

## 🆘 TROUBLESHOOTING

### Database Connection Failed
```
Check:
✅ DB_HOST is correct (railway_mysql_1 or similar)
✅ DB credentials match environment
✅ MySQL service is running
✅ Database exists
```

### Port Already in Use
```bash
docker-compose down
docker-compose up
```

### Permission Denied
```bash
chmod 755 logs/
chmod 644 *.php *.html
```

### SSL Certificate Issues
- Railway/Render handle automatically
- Force HTTPS in `.htaccess`

---

## 📚 USEFUL COMMANDS

```bash
# View logs
docker-compose logs web

# View database logs
docker-compose logs db

# Stop containers
docker-compose down

# Rebuild
docker-compose up --build

# Execute command in container
docker-compose exec web command
```

---

## 🎯 NEXT STEPS

1. Push to GitHub
2. Connect to Railway/Render
3. Configure environment variables
4. Initialize database
5. Test all features
6. Monitor logs
7. Configure custom domain (optional)
8. Set up monitoring alerts

---

**Happy Deploying! 🚀**
