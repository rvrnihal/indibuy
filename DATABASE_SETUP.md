# Database Setup Guide

## Database Schema

Run the following SQL commands to set up your database:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS paymentdb;
USE paymentdb;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create orders table (NO credit card storage!)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    payment_token VARCHAR(500) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Create products table (for inventory management)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 0,
    category VARCHAR(100),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create error log table
CREATE TABLE IF NOT EXISTS error_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    error_message TEXT NOT NULL,
    error_trace TEXT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## Environment Variables

Create a `.env` file in your project root:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=paymentdb
APP_ENV=development
CSRF_TOKEN_LENGTH=32
```

For production, update `APP_ENV=production` and secure your database credentials.

## Payment Gateway Integration

This system now supports external payment gateways:

### Razorpay (Recommended for India)
1. Sign up at https://razorpay.com
2. Get your API keys
3. Use the payment token in the form

### Stripe
1. Sign up at https://stripe.com
2. Get your publishable key
3. Use Stripe.js for tokenization

### PayPal
1. Sign up at https://developer.paypal.com
2. Integrate PayPal Checkout

**DO NOT store credit card data directly.** Always use tokenization.

## Security Checklist

- [x] SQL Injection prevention (Prepared statements)
- [x] CSRF protection (Token verification)
- [x] Password hashing (BCrypt)
- [x] Input validation and sanitization
- [x] No credit card storage
- [x] HTTP security headers
- [x] Session cookie security
- [ ] HTTPS enforcement (Uncomment in .htaccess for production)
- [ ] Rate limiting
- [ ] Two-factor authentication (Future)

## Logs Directory

Create a `logs/` directory for error logging:

```bash
mkdir logs
chmod 755 logs
```
