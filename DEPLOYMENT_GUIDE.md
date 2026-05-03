# 🚀 IndiBuy Deployment Guide

## Pre-Deployment Checklist

### Security
- [ ] Create `.env` file with production credentials
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Enable HTTPS in `.htaccess` (uncomment HTTPS redirect)
- [ ] Set strong database password
- [ ] Configure SSL certificate
- [ ] Enable security headers in `.htaccess` (already included)
- [ ] Set up CORS headers if needed
- [ ] Create `logs/` directory with restricted permissions

### Database
- [ ] Run database setup scripts from `DATABASE_SETUP.md`
- [ ] Create database backups
- [ ] Verify all tables are created
- [ ] Create database user with limited privileges (not root)
- [ ] Test database connection

### Performance
- [ ] Enable gzip compression (in `.htaccess`)
- [ ] Set appropriate cache expiration headers
- [ ] Minimize CSS and JavaScript files
- [ ] Optimize images (use WebP format)
- [ ] Use CDN for static assets
- [ ] Enable database query caching

### Code Quality
- [ ] Run `dart fix` on all Dart files (if applicable)
- [ ] Validate all HTML files
- [ ] Check for console errors
- [ ] Test on multiple browsers
- [ ] Test responsive design on mobile devices

## Deployment Steps

### Step 1: Prepare Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with production values
nano .env  # or your preferred editor

# Create logs directory
mkdir -p logs
chmod 755 logs
chmod 777 logs  # If web server needs write access
```

### Step 2: Database Setup
```bash
# Connect to MySQL
mysql -u root -p

# Run the SQL commands from DATABASE_SETUP.md
```

### Step 3: Upload Files
```bash
# Using FTP/SFTP (ensure .env is NOT uploaded to public repo)
# Upload all files except: .env, logs/*, .git/

# Or using Git:
git push production main
```

### Step 4: Set File Permissions
```bash
# Set correct permissions
chmod 644 *.php *.html *.css *.js
chmod 755 logs/
chmod 600 .env
chmod 600 .htaccess  # Optional
```

### Step 5: Verify Installation
- [ ] Test login functionality
- [ ] Test registration
- [ ] Test payment flow
- [ ] Check cart persistence
- [ ] Verify error logging works
- [ ] Check security headers with online tools

## Production Best Practices

### Server Configuration

#### Apache
```apache
# Enable required modules
a2enmod rewrite
a2enmod headers
a2enmod deflate
a2enmod expires

# Restart Apache
systemctl restart apache2
```

#### Nginx (Alternative)
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security Headers
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Frame-Options "SAMEORIGIN";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Root directory
    root /var/www/indibuy;
    
    # PHP configuration
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }
}
```

### Monitoring & Logging
```bash
# Monitor error logs
tail -f logs/errors.log

# Monitor database errors
mysqldumpslow /var/log/mysql/slow.log

# Check application logs
tail -f logs/application.log
```

### Backup Strategy
```bash
# Daily database backup
0 2 * * * /usr/bin/mysqldump -u user -p'password' paymentdb > /backups/db-$(date +\%Y\%m\%d).sql

# Weekly file backup
0 3 * * 0 tar -czf /backups/files-$(date +\%Y\%m\%d).tar.gz /var/www/indibuy
```

### SSL/TLS Configuration
```bash
# Get free SSL certificate with Let's Encrypt
certbot certonly --webroot -w /var/www/indibuy -d yourdomain.com

# Auto-renewal
0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring & Maintenance

### Performance Monitoring
- Set up Google Analytics
- Monitor database query performance
- Check server CPU and memory usage
- Monitor error rates

### Security Monitoring
- Set up intrusion detection (fail2ban)
- Monitor failed login attempts
- Review error logs regularly
- Enable Web Application Firewall (WAF)

### Regular Updates
- Keep PHP updated
- Update MySQL/MariaDB
- Update dependencies
- Review and apply security patches

## Troubleshooting

### Database Connection Issues
```php
// Check connection in config.php
echo "Database: " . DB_HOST . " | User: " . DB_USER;
```

### Session Issues
```php
// Verify session.save_path is writable
php -r "echo ini_get('session.save_path');"
```

### Permission Errors
```bash
# Fix PHP file permissions
find /var/www/indibuy -type f -name "*.php" -exec chmod 644 {} \;
find /var/www/indibuy -type d -exec chmod 755 {} \;
```

### HTTPS Redirect Not Working
- Verify Apache rewrite module is enabled
- Check .htaccess is in correct directory
- Verify SSL certificate is valid
- Check browser cache

## Performance Optimization

### Frontend
- Minify CSS and JavaScript
- Use lazy loading for images
- Implement service worker for offline support
- Use WebP images with fallbacks

### Backend
- Enable query caching
- Use database indexes (already in schema)
- Implement API rate limiting
- Use output buffering

### Caching Strategy
```php
// Add to config.php
header('Cache-Control: public, max-age=3600');
```

## Security Hardening

### Additional Measures
1. Implement rate limiting on login/payment endpoints
2. Add two-factor authentication (2FA)
3. Use WAF (ModSecurity)
4. Implement DDoS protection (Cloudflare)
5. Set up security monitoring alerts
6. Perform regular security audits
7. Use OWASP Top 10 checklist

## Support & Documentation

- Database Schema: See `DATABASE_SETUP.md`
- Feature Overview: See `README.md`
- Security Notes: See this file
- API Endpoints: (Create if applicable)

---

**Last Updated:** 2026
**Version:** 2.0
