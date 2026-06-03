# IndiBuy Backend - Installation & Setup Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Server](#running-the-server)
5. [API Documentation](#api-documentation)
6. [Database](#database)
7. [Authentication](#authentication)
8. [Project Structure](#project-structure)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **MongoDB**: 5.0 or higher (local or cloud)
- **Redis**: 6.0 or higher (optional, for caching)
- **Git**: For cloning the repository

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/indibuy.git
cd indibuy/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env
```

### 4. Configure Environment Variables

Edit `.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/indibuy
DATABASE_NAME=indibuy

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=30d

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payments
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=your_stripe_secret

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

---

## Running the Server

### Development Mode

```bash
npm run dev
```

This will start the server with hot-reloading using Nodemon.

**Expected Output:**
```
╔═══════════════════════════════════════╗
║     IndiBuy Backend Server Started    ║
║     Environment: development          ║
║     Port: 5000                        ║
║     Time: 2024-01-15T10:30:00.000Z    ║
╚═══════════════════════════════════════╝
```

### Production Mode

```bash
npm start
```

---

## Configuration

### Database Configuration

**MongoDB Local:**
```
MONGODB_URI=mongodb://localhost:27017/indibuy
```

**MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/indibuy?retryWrites=true&w=majority
```

### JWT Configuration

Generate secure JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Email Configuration

**Using Gmail:**
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in `.env`

**Using SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_sendgrid_key
```

### Payment Gateway Setup

#### Razorpay
1. Go to https://razorpay.com
2. Sign up for an account
3. Get API keys from dashboard
4. Add keys to `.env`

#### Stripe
1. Go to https://stripe.com
2. Create account and get API keys
3. Add secret key to `.env`

---

## API Documentation

Complete API documentation is available in [../docs/API.md](../docs/API.md)

### Quick API Test

```bash
# Test server health
curl http://localhost:5000/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "phone": "+919876543210",
    "role": "buyer"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

---

## Database

### MongoDB Setup

#### Local Installation

**Ubuntu/Debian:**
```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongo --version
```

#### Cloud Setup (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and cluster
3. Add IP to whitelist
4. Create database user
5. Get connection string
6. Use in `.env` file

### Database Initialization

```bash
# Create initial indexes and seed data
node scripts/initDatabase.js
```

### Backup and Restore

```bash
# Backup
mongodump --uri "mongodb://localhost:27017/indibuy" --out ./backup

# Restore
mongorestore --uri "mongodb://localhost:27017/indibuy" ./backup/indibuy
```

---

## Authentication

### JWT Token Flow

1. User registers/logs in
2. Server generates JWT token
3. Client stores token
4. Client sends token in `Authorization` header for protected routes
5. Server verifies token

### Token Structure

```javascript
{
  "sub": "user_id",
  "iat": 1642248000,
  "exp": 1650024000,
  "role": "buyer"
}
```

### Refresh Token

Tokens expire after 7 days. Use refresh token to get new token:

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

---

## Project Structure

```
backend/
├── src/
│   ├── server.js                 # Main server file
│   ├── routes/                   # API route definitions
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── vendors.js
│   │   └── ...
│   ├── controllers/              # Request handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── ...
│   ├── models/                   # Database models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── ...
│   ├── middleware/               # Express middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── services/                 # Business logic
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── ...
│   ├── config/                   # Configuration files
│   │   ├── database.js
│   │   └── constants.js
│   └── utils/                    # Helper functions
│       ├── logger.js
│       ├── validators.js
│       └── ...
├── logs/                         # Application logs
├── tests/                        # Test files
├── scripts/                      # Utility scripts
├── .env.example                  # Environment template
├── .gitignore
├── package.json
└── README.md
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check connection string in .env
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### JWT Token Invalid

- Check `JWT_SECRET` in `.env`
- Verify token format in Authorization header
- Check token expiration time

### CORS Error

- Check `CORS_ORIGIN` in `.env`
- Verify frontend URL matches
- Check browser console for detailed error

### Memory Leak

```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 src/server.js
```

---

## Testing

Run tests:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:coverage
```

---

## Linting

```bash
npm run lint
npm run lint:fix
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NODE_ENV | Yes | development | Environment mode |
| PORT | No | 5000 | Server port |
| MONGODB_URI | Yes | - | MongoDB connection string |
| JWT_SECRET | Yes | - | JWT secret key |
| GOOGLE_CLIENT_ID | No | - | Google OAuth ID |
| RAZORPAY_KEY_ID | No | - | Razorpay API key |
| STRIPE_SECRET_KEY | No | - | Stripe secret key |
| CLOUDINARY_CLOUD_NAME | No | - | Cloudinary cloud name |
| SMTP_HOST | No | - | Email SMTP host |

---

## Security Best Practices

1. **Never commit .env file**
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Enable HTTPS in production**
4. **Implement rate limiting**
5. **Validate all inputs**
6. **Use helmet for security headers**
7. **Keep dependencies updated**
8. **Enable CORS only for trusted origins**

---

## Performance Tips

1. Use indexes on frequently queried fields
2. Implement caching with Redis
3. Use connection pooling
4. Enable gzip compression
5. Optimize database queries
6. Use CDN for static files
7. Implement pagination
8. Monitor application performance

---

## Support & Resources

- **GitHub Issues**: Report bugs and request features
- **API Docs**: See [../docs/API.md](../docs/API.md)
- **Database Schema**: See [../docs/DATABASE.md](../docs/DATABASE.md)
- **Deployment Guide**: See [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)

---

## License

Proprietary - IndiBuy Platform

