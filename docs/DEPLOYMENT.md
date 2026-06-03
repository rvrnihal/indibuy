# IndiBuy - Deployment Guide

## Table of Contents

1. [Production Deployment](#production-deployment)
2. [Docker Deployment](#docker-deployment)
3. [Environment Setup](#environment-setup)
4. [Database Setup](#database-setup)
5. [SSL/TLS Configuration](#ssltls-configuration)
6. [Monitoring & Logging](#monitoring--logging)
7. [Backup & Recovery](#backup--recovery)
8. [Scaling Considerations](#scaling-considerations)

---

## Production Deployment

### Prerequisites

- Node.js 18+ LTS
- MongoDB 5.0+
- Redis 6.0+
- Docker & Docker Compose (optional)
- PM2 or similar process manager
- Nginx or Apache as reverse proxy

### Step 1: Server Setup

**On your production server:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Redis
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Step 2: Clone & Setup Project

```bash
# Clone repository
git clone https://github.com/yourusername/indibuy.git
cd indibuy

# Setup backend
cd backend
npm install --production

# Create .env file
cp .env.example .env

# Update .env with production values
# Edit .env with your production credentials
```

### Step 3: Configure Environment Variables

**backend/.env (Production)**

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/indibuy
DATABASE_NAME=indibuy
JWT_SECRET=your_super_secret_production_key_change_this
FRONTEND_URL=https://indibuy.com
REDIS_URL=redis://localhost:6379

# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_sendgrid_key

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security
CORS_ORIGIN=https://indibuy.com,https://www.indibuy.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Start Backend with PM2

```bash
# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'indibuy-backend',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_memory_restart: '1G'
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 5: Setup Frontend

```bash
cd frontend
npm install --production

# Build Next.js
npm run build

# Start with PM2
pm2 start "npm start" --name "indibuy-frontend"
pm2 save
```

### Step 6: Nginx Configuration

**Create /etc/nginx/sites-available/indibuy**

```nginx
server {
    listen 80;
    server_name indibuy.com www.indibuy.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name indibuy.com www.indibuy.com;
    
    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/indibuy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/indibuy.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable the site:**

```bash
sudo ln -s /etc/nginx/sites-available/indibuy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d indibuy.com -d www.indibuy.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## Docker Deployment

### Docker Compose Setup

**docker-compose.yml**

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: indibuy-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    restart: always
    networks:
      - indibuy-network

  redis:
    image: redis:7-alpine
    container_name: indibuy-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: always
    networks:
      - indibuy-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: indibuy-backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/indibuy
      REDIS_URL: redis://redis:6379
    depends_on:
      - mongodb
      - redis
    restart: always
    networks:
      - indibuy-network
    volumes:
      - ./backend/.env:/app/.env

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: indibuy-frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://localhost:5000
    depends_on:
      - backend
    restart: always
    networks:
      - indibuy-network

  nginx:
    image: nginx:alpine
    container_name: indibuy-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: always
    networks:
      - indibuy-network

volumes:
  mongodb_data:
  redis_data:

networks:
  indibuy-network:
    driver: bridge
```

**Run with Docker Compose:**

```bash
docker-compose up -d
docker-compose logs -f
```

---

## Database Setup

### MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and cluster
3. Add IP address to whitelist
4. Create database user
5. Get connection string
6. Use in `MONGODB_URI` environment variable

### Local MongoDB Backup

```bash
# Backup
mongodump --uri "mongodb://user:pass@localhost:27017/indibuy" --out ./backup

# Restore
mongorestore --uri "mongodb://user:pass@localhost:27017/indibuy" ./backup
```

---

## Monitoring & Logging

### PM2 Monitoring

```bash
# View logs
pm2 logs

# Monitor resources
pm2 monit

# Get detailed info
pm2 info indibuy-backend
```

### Application Logging

Use Winston for centralized logging:

---

## Automated CI (GitHub Actions)

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` which builds the `frontend` and `backend`, runs basic checks, then builds and pushes Docker images to GitHub Container Registry (GHCR).

Required secret:
- `CR_PAT` — a GitHub Personal Access Token with `write:packages` and `repo` scopes. Add it in the repository Settings → Secrets & variables → Actions.

How it works:
- On push to `main` (or `master`) the workflow will:
  - run tests in `backend`
  - build the Next.js `frontend`
  - login to `ghcr.io` using `${{ secrets.CR_PAT }}`
  - build and push `indibuy-backend` and `indibuy-frontend` images tagged with the commit SHA

Triggering manually:
You can start the workflow from the Actions tab, or via the `workflow_dispatch` event. To trigger from CLI with the GitHub CLI:

```bash
# trigger a run (after committing and pushing changes)
gh workflow run CI -R yourusername/indibuy
```

After images are pushed you can deploy them to your server or cloud provider (Render, Railway, Kubernetes, Docker Swarm, etc.). The workflow does not automatically start a cloud deployment because providers require different APIs and secrets; I can add a provider-specific deploy step if you tell me which one you use.


```javascript
// logs/logger.js
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'indibuy-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

---

## Backup & Recovery

### Automated Backups

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/indibuy"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE"

mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --uri "$MONGODB_URI" --out $BACKUP_FILE

# Backup uploaded files (if using local storage)
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" /var/www/indibuy/uploads

# Keep only last 30 backups
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
EOF

chmod +x backup.sh

# Schedule with cron (daily at 2 AM)
0 2 * * * /path/to/backup.sh
```

---

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancing**: Use Nginx load balancer
2. **Database Replication**: MongoDB replica sets
3. **Caching**: Redis cluster
4. **CDN**: Cloudflare for static content

### Vertical Scaling

1. Increase server RAM
2. Optimize database indexes
3. Enable connection pooling
4. Cache frequently accessed data

### Performance Optimization

```javascript
// Enable compression
app.use(compression());

// Use CDN for static files
// Implement caching headers
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));

// Database connection pooling
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5
});
```

---

## Health Checks

Add health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    mongodb: db.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB URI
   - Verify IP whitelist
   - Check firewall rules

2. **Out of Memory**
   - Increase node memory: `node --max-old-space-size=4096`
   - Check for memory leaks
   - Enable garbage collection

3. **SSL Certificate Error**
   - Renew certificate: `sudo certbot renew --force-renewal`
   - Check certificate expiry: `sudo certbot certificates`

4. **Rate Limiting Issues**
   - Adjust rate limit settings
   - Check reverse proxy configuration

