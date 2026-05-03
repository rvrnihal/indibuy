# 🚀 Quick Start Guide

## For Developers Working with the Upgraded IndiBuy Project

### Prerequisites
- PHP 7.4+ (recommended 8.0+)
- MySQL 5.7+ or MariaDB 10.3+
- Apache with mod_rewrite enabled
- Basic knowledge of HTML, CSS, PHP, JavaScript

---

## Local Development Setup (5 minutes)

### Step 1: Clone/Download Project
```bash
# Or download from GitHub/archive
cd ~/projects
# Extract files or clone repository
```

### Step 2: Set Up Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env (optional for local development)
# Default values should work locally
```

### Step 3: Create Database
```bash
# Start MySQL
mysql -u root

# Run setup commands from DATABASE_SETUP.md
# Copy and paste all SQL commands
```

### Step 4: Start Local Server
```bash
# Using PHP built-in server
cd /path/to/indibuy
php -S localhost:8000

# Then visit: http://localhost:8000
```

Or use XAMPP/WAMP/MAMP if preferred.

---

## File Structure Overview

```
indibuy-main/
├── config.php                    # Centralized configuration
├── login.php                     # Authentication
├── payment.php                   # Payment processing
├── home.html                     # Homepage
├── product.html                  # Product listing
├── addtocart.html               # Shopping cart
├── about.html                   # About page
├── payment.css                  # Payment styling
├── addtocart.css               # Cart styling
├── login.css                   # Login styling
├── product.css                 # Product styling
├── style.css                   # Global styling
├── style1.css                  # Alternative styling
├── script.js                   # Global JS (improved)
├── script1.js                  # Alternative JS
├── addtocart.js                # Cart JS (improved)
├── .env.example                # Environment template
├── .htaccess                   # Apache configuration (NEW)
├── log-error.php               # Error logging (NEW)
├── DATABASE_SETUP.md           # Database schema (NEW)
├── DEPLOYMENT_GUIDE.md         # Production guide (NEW)
├── UPGRADE_SUMMARY.md          # What changed (NEW)
└── logs/                       # Error logs directory (create manually)
```

---

## Common Tasks

### Add New Product
1. Insert product into `products` table:
```php
INSERT INTO products (name, description, price, category)
VALUES ('Product Name', 'Description', 999.99, 'Category');
```

2. Update HTML product listing

### Test Payment Flow
1. Register new user at login.html
2. Browse products at product.html
3. Add items to cart with addtocart.html
4. Proceed to payment with valid payment token

### Check Error Logs
```bash
# View recent errors
tail -f logs/errors.log

# Or query database
SELECT * FROM error_logs ORDER BY created_at DESC LIMIT 10;
```

### Debug SQL Queries
```php
// Add to config.php temporarily
error_log("Query: " . $stmt->query);
```

---

## Debugging Tips

### Enable Debug Mode
Update `.env`:
```
APP_ENV=development
```

### Check CSRF Token Issues
```php
// In config.php, after session_start()
error_log("CSRF Token: " . $_SESSION['csrf_token']);
```

### Database Connection Test
```php
<?php
require 'config.php';
$conn = getDBConnection();
echo "Connected successfully!";
$conn->close();
?>
```

### JavaScript Console
- Open browser DevTools (F12)
- Go to Console tab
- Check for errors
- Use `apiCall()` for testing APIs

---

## Security Reminders

### Before Deploying:
- [ ] Update `.env` with production credentials
- [ ] Create `logs/` directory
- [ ] Set proper file permissions
- [ ] Enable HTTPS in `.htaccess`
- [ ] Test all forms for validation
- [ ] Test payment gateway integration

### Development Best Practices:
- Never commit `.env` file
- Don't use hardcoded credentials
- Always validate user input
- Always verify CSRF tokens
- Use parameterized queries

---

## API Endpoints

### Authentication
```
POST /login.php
{
  "csrf_token": "token",
  "action": "login|register",
  "logemail": "user@example.com",
  "logpass": "password",
  "logname": "Full Name"  // For register only
}
```

### Payment
```
POST /payment.php
{
  "csrf_token": "token",
  "name": "Full Name",
  "email": "user@example.com",
  "address": "Street Address",
  "city": "City",
  "state": "State",
  "zip": "12345",
  "paymentToken": "stripe_token_or_razorpay_token"
}
```

### Error Logging
```
POST /log-error.php
{
  "message": "Error message",
  "stack": "Stack trace",
  "url": "Current URL"
}
```

---

## Useful Commands

### Database Backup
```bash
mysqldump -u root -p paymentdb > backup.sql
```

### Database Restore
```bash
mysql -u root -p paymentdb < backup.sql
```

### Check PHP Version
```bash
php --version
```

### Check MySQL Connection
```php
php -r "echo new mysqli('localhost', 'root', '', 'paymentdb') ? 'OK' : 'ERROR';"
```

---

## Troubleshooting

### "Database connection failed"
- Check `.env` credentials
- Verify MySQL is running
- Check database name is correct

### "CSRF token validation failed"
- Ensure session is started
- Check form includes csrf_token hidden field
- Clear browser cookies and try again

### "404 Not Found"
- Check file path in `.env`
- Verify mod_rewrite is enabled
- Check `.htaccess` is in correct directory

### Cart not persisting
- Check browser allows localStorage
- Check DevTools > Application > LocalStorage
- Try in different browser

### Permission denied errors
```bash
chmod 755 logs/
chmod 644 *.php *.html
```

---

## Performance Tips

1. **Enable Caching**
   - Browser caching via `.htaccess` (already enabled)
   - Database query caching

2. **Optimize Images**
   - Use WebP format
   - Compress images
   - Use appropriate dimensions

3. **Minify Assets**
   - Minify CSS and JavaScript
   - Use online tools or build tools

4. **Database Optimization**
   - Indexes are already set up
   - Monitor slow queries
   - Archive old logs

---

## Next Steps

1. **Read the Docs**
   - DATABASE_SETUP.md - Database schema
   - DEPLOYMENT_GUIDE.md - Production setup
   - UPGRADE_SUMMARY.md - What changed

2. **Local Testing**
   - Register user account
   - Browse products
   - Add to cart
   - Test payment flow

3. **Customize**
   - Update branding
   - Add your products
   - Integrate payment gateway
   - Customize styling

4. **Deploy**
   - Follow DEPLOYMENT_GUIDE.md
   - Set up production .env
   - Configure SSL/HTTPS
   - Set up monitoring

---

## Support Resources

- PHP Documentation: https://www.php.net/docs.php
- MySQL Documentation: https://dev.mysql.com/doc/
- MDN Web Docs: https://developer.mozilla.org/
- Bootstrap 5: https://getbootstrap.com/docs/5.0/

---

**Happy Development! 🎉**

Need help? Check the error logs or review the improved code comments.
