# 🐳 DOCKER DEPLOYMENT - COMPLETE GUIDE

## ✅ DOCKER ALREADY CONFIGURED

Your IndiBuy project comes with:
- ✅ Dockerfile (PHP 8.1 + Apache)
- ✅ docker-compose.yml (Web + MySQL)
- ✅ All dependencies included
- ✅ Production-ready configuration

---

## 📋 PREREQUISITES

### Windows/Mac/Linux:
1. **Docker Desktop** installed
2. **Docker Compose** (included with Desktop)
3. **Terminal/PowerShell** access

### Download Docker:
```
https://www.docker.com/products/docker-desktop
```

---

## 🚀 DEPLOYMENT - 5 STEPS

### STEP 1: Install Docker Desktop

1. Download from: https://www.docker.com/products/docker-desktop
2. Run installer
3. Restart computer
4. Open PowerShell/Terminal
5. Verify:
```powershell
docker --version
docker-compose --version
```

Both should show version numbers ✅

---

### STEP 2: Navigate to Project

```powershell
cd C:\Users\dell\OneDrive\Desktop\indibuy-main
```

---

### STEP 3: Create .env File

Create `.env` file in project root:

```env
# Database
DB_USER=root
DB_PASS=indibuy_secure_password_123
DB_NAME=paymentdb

# Application
APP_ENV=production
ENCRYPTION_KEY=your-random-32-character-key-here
JWT_SECRET=your-random-jwt-secret-here
```

---

### STEP 4: Build & Start Containers

**Build the Docker images:**
```powershell
docker-compose build
```

**Start the containers:**
```powershell
docker-compose up -d
```

**Wait 10 seconds for MySQL to start**

---

### STEP 5: Initialize Database

**Run migrations:**
```powershell
docker-compose exec web php utils/DatabaseMigration.php migrate
```

**Verify migrations:**
```powershell
docker-compose exec web php utils/DatabaseMigration.php status
```

Should show: ✓ All migrations completed

---

## ✅ YOUR APP IS LIVE!

**Access via browser:**
```
http://localhost/
```

---

## 📊 WHAT'S RUNNING

### Web Container
- Apache 2.4
- PHP 8.1
- Port: 80
- Access: http://localhost

### Database Container
- MySQL 8.0
- Port: 3306
- Credentials: root / indibuy_secure_password_123

---

## 🧪 TEST YOUR DEPLOYMENT

### Test in Browser:
```
Home:        http://localhost/home.html
Products:    http://localhost/api/products.php?action=list
Admin:       http://localhost/admin/dashboard.php
Setup:       http://localhost/setup.php
Status:      http://localhost/status
```

### Test with PowerShell:

**Check status:**
```powershell
Invoke-WebRequest http://localhost/status
```

**Test products API:**
```powershell
Invoke-WebRequest http://localhost/api/products.php?action=list
```

**Test registration:**
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "TestPass123!"
    phone = "9876543210"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost/api/auth.php?action=register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## 🔧 USEFUL COMMANDS

### View Logs:
```powershell
# Web server logs
docker-compose logs web

# Database logs
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f web
```

### Access Container Shell:
```powershell
# Web container bash
docker-compose exec web bash

# MySQL console
docker-compose exec db mysql -u root -p paymentdb
```

### Stop Containers:
```powershell
docker-compose stop
```

### Start Again:
```powershell
docker-compose start
```

### Remove Everything:
```powershell
docker-compose down -v
```

---

## 📁 DOCKER STRUCTURE

```
indibuy-main/
├── Dockerfile          (PHP 8.1 + Apache config)
├── docker-compose.yml  (Web + MySQL services)
├── .env               (Your secrets - DON'T COMMIT)
├── config.php         (Reads from environment)
├── api/               (API endpoints)
├── static/            (Frontend files)
├── admin/             (Admin dashboard)
└── utils/             (Utility classes)
```

---

## 🔒 PRODUCTION DEPLOYMENT

### Using Docker Hub:

**1. Create Docker Hub account:**
```
https://hub.docker.com/
```

**2. Build and tag image:**
```powershell
docker build -t yourusername/indibuy:latest .
docker push yourusername/indibuy:latest
```

**3. Deploy on cloud (AWS, DigitalOcean, etc):**
```bash
docker pull yourusername/indibuy:latest
docker-compose -f docker-compose.prod.yml up -d
```

### Using Docker Registries:

- **AWS ECR** - Private registry on Amazon
- **Google Container Registry** - Google Cloud
- **Azure Container Registry** - Microsoft Azure
- **Docker Hub** - Free public registry

---

## 🚨 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Port 80 already in use" | Change port in docker-compose.yml: `"8080:80"` |
| "Container exits" | Check logs: `docker-compose logs web` |
| "Database connection failed" | Wait 10s for MySQL to start |
| "Permission denied" | Run PowerShell as Administrator |
| "Docker not found" | Restart Docker Desktop |

---

## 🔄 DEVELOPMENT WORKFLOW

### During Development:

**1. Make code changes**

**2. Restart web container:**
```powershell
docker-compose restart web
```

**3. Check changes:**
```
http://localhost/
```

**No rebuild needed** - files auto-sync via volumes!

### For Database Changes:

**1. Update schema**

**2. Run migrations:**
```powershell
docker-compose exec web php utils/DatabaseMigration.php migrate
```

### When Done:

```powershell
docker-compose down
```

---

## 📊 CONTAINER MANAGEMENT

### List running containers:
```powershell
docker ps
```

### List all containers:
```powershell
docker ps -a
```

### View container resource usage:
```powershell
docker stats
```

### Get container IP:
```powershell
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' indibuy-main-web-1
```

---

## 💾 DATABASE BACKUP & RESTORE

### Backup Database:
```powershell
docker-compose exec db mysqldump -u root -pindibuy_secure_password_123 paymentdb > backup.sql
```

### Restore Database:
```powershell
docker-compose exec db mysql -u root -pindibuy_secure_password_123 paymentdb < backup.sql
```

---

## 🔐 SECURITY BEST PRACTICES

✅ **Production:**
- Use strong passwords
- Enable HTTPS (reverse proxy)
- Don't expose ports unnecessarily
- Use secrets management
- Regular backups

✅ **Keep Updated:**
- Update PHP version regularly
- Update MySQL version
- Update base Docker images

✅ **Logging:**
- Monitor container logs
- Setup centralized logging
- Alert on errors

---

## 📈 SCALING

### Add More Containers:

Update `docker-compose.yml`:
```yaml
services:
  web_1:
    # First web container
  web_2:
    # Second web container
  db:
    # Database
```

### Use Orchestration:

For production:
- **Kubernetes** - Full orchestration
- **Docker Swarm** - Simpler than K8s
- **Amazon ECS** - AWS native
- **Google Cloud Run** - Serverless

---

## 🎯 DOCKER DEPLOYMENT COMPLETE

Your IndiBuy is now running in Docker!

### Next Steps:

1. ✅ Run locally with `docker-compose up`
2. ✅ Test all 15 test cases
3. ✅ Push to Docker Hub
4. ✅ Deploy to cloud platform

---

## 📞 DOCKER RESOURCES

- **Docs:** https://docs.docker.com
- **Hub:** https://hub.docker.com
- **Tutorial:** https://docker.com/get-started

---

## 🚀 QUICK REFERENCE

```powershell
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec web php utils/DatabaseMigration.php migrate

# View logs
docker-compose logs -f web

# Stop
docker-compose stop

# Remove all
docker-compose down -v
```

---

**Your IndiBuy Docker setup is production-ready!** 🎉

