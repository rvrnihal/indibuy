# IndiBuy - Modern B2B E-Commerce Platform

![IndiBuy Platform](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-Proprietary-blue)
![Node](https://img.shields.io/badge/Node-18+-green)
![React](https://img.shields.io/badge/React-18.2+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green)

🔗 Live Demo: **[https://indibuy.vercel.app](https://indibuy.vercel.app)**

A comprehensive, production-ready full-stack B2B e-commerce platform designed for industrial and construction products. Built with cutting-edge technologies and inspired by leading platforms like Amazon, Flipkart, Alibaba, and IndiaMART.


## 🎯 Overview

IndiBuy connects manufacturers, suppliers, contractors, retailers, and industrial buyers on a unified platform. It features advanced capabilities for managing complex B2B transactions including bulk ordering, quotations, vendor management, and multi-role operations.

### Key Features

✅ **Multi-Role System**: Buyer, Vendor, Admin, Delivery Partner  
✅ **Advanced Search**: Full-text search with filters and aggregations  
✅ **Bulk Ordering**: MOQ support and volume-based pricing  
✅ **Quotation System**: Request and compare quotations  
✅ **Payment Integration**: Razorpay and Stripe support  
✅ **Analytics Dashboard**: Real-time business insights  
✅ **Vendor Management**: Commission tracking and verification  
✅ **Delivery Management**: Partner assignment and tracking  
✅ **Responsive Design**: Mobile-first UI for all devices  
✅ **Dark/Light Mode**: Theme customization  
✅ **SEO Optimized**: Built-in SEO capabilities  
✅ **Real-time Features**: Socket.io for notifications  
✅ **Scalable Architecture**: Cloud-native design  

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14.0+
- **UI Library**: React 18.2+
- **Styling**: Tailwind CSS 3.3
- **Components**: ShadCN UI 0.8
- **Animations**: Framer Motion 10.16
- **State Management**: Zustand 4.4, React Query 5.0
- **Forms**: React Hook Form 7.5
- **Validation**: Zod 3.22
- **HTTP Client**: Axios 1.6

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: MongoDB 5.0+
- **ODM**: Mongoose 7.0
- **Authentication**: JWT + Passport.js 0.7
- **Payments**: Razorpay 2.9.2, Stripe 14.0
- **Cloud Storage**: Cloudinary SDK
- **Email**: Nodemailer 6.9
- **Real-time**: Socket.io 4.5
- **Security**: Helmet, CORS
- **Logging**: Winston 3.10, Morgan 1.10
- **Caching**: Redis 4.0+

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx
- **CDN**: Cloudinary
- **Monitoring**: Winston Logging

---

## 📁 Project Structure

```
indibuy/
├── frontend/                     # Next.js frontend application
│   ├── src/
│   │   ├── pages/              # Next.js pages and routes
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # React Context API
│   │   ├── utils/              # Utility functions
│   │   ├── styles/             # Global styles
│   │   └── public/             # Static assets
│   ├── .env.example            # Environment template
│   ├── next.config.js          # Next.js configuration
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── package.json            # Dependencies
│   └── README.md               # Frontend documentation
│
├── backend/                      # Express.js backend application
│   ├── src/
│   │   ├── models/             # MongoDB schemas (15 models)
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Express middleware
│   │   ├── config/             # Configuration files
│   │   ├── utils/              # Helper functions
│   │   ├── server.js           # Express server
│   │   └── index.js            # Entry point
│   ├── logs/                   # Application logs
│   ├── tests/                  # Test files
│   ├── scripts/                # Utility scripts
│   ├── .env.example            # Environment template
│   ├── package.json            # Dependencies
│   └── README.md               # Backend documentation
│
├── docs/                        # Comprehensive documentation
│   ├── API.md                  # API endpoints (40+ documented)
│   ├── DATABASE.md             # Database schema
│   ├── DEPLOYMENT.md           # Deployment guide
│   ├── ARCHITECTURE.md         # System architecture
│   └── SECURITY.md             # Security guidelines
│
├── docker-compose.yml          # Docker Compose configuration
├── Dockerfile.frontend         # Frontend Docker image
├── Dockerfile.backend          # Backend Docker image
├── .gitignore                  # Git ignore rules
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # License information
└── README.md                   # This file
│   │   ├── middleware/ # Express middleware
│   │   ├── services/  # Business logic
│   │   ├── config/    # Configuration
│   │   └── utils/     # Helper functions
│   ├── package.json
│   └── .env.example
├── docs/               # Documentation
├── docker-compose.yml  # Docker setup
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+
- **UI Library**: React 18+
- **Styling**: Tailwind CSS + Framer Motion
- **Component Library**: ShadCN UI
- **State Management**: Context API + Redux (optional)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Primary) / PostgreSQL (Optional)
- **Authentication**: JWT + Passport.js
- **Payments**: Razorpay + Stripe SDKs
- **Cloud Storage**: Cloudinary / AWS S3
- **Real-time**: Socket.io

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions ready
- **Hosting**: AWS/DigitalOcean ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (or PostgreSQL)
- npm or yarn
- Docker (optional)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```

### Docker Compose

```bash
docker-compose up
```

## 📖 Documentation

- [Frontend README](./frontend/README.md) - Frontend setup and architecture
- [Backend README](./backend/README.md) - Backend API documentation
- [Database Schema](./docs/DATABASE.md) - Complete database design
- [API Documentation](./docs/API.md) - Detailed API endpoints
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [Security Guide](./docs/SECURITY.md) - Security best practices

## 🔑 Key Features Implemented

### 1. User Authentication
- Email/password login & signup
- Google OAuth integration
- Email verification
- Password reset
- Multi-role support (Buyer, Vendor, Admin, Delivery Partner)
- JWT token management

### 2. Product Management
- Comprehensive product catalog
- Advanced filtering & search
- Product recommendations (AI)
- 360° product preview
- PDF brochure support
- Stock management

### 3. Vendor Management
- Vendor onboarding & verification
- Store customization
- Inventory management
- Analytics dashboard
- Order management
- Commission tracking

### 4. E-Commerce Features
- Shopping cart with persistent storage
- Wishlist functionality
- Quotation system
- Bulk order management
- Price comparison
- Product comparison

### 5. Payment Integration
- Razorpay integration
- Stripe integration
- Cash on Delivery (COD)
- Payment history
- Invoice generation
- Refund management

### 6. Order Management
- Order tracking (real-time)
- Multi-status workflow
- Delivery partner assignment
- Live GPS tracking
- OTP verification

### 7. Admin Dashboard
- User management
- Vendor approval system
- Product moderation
- Analytics & reports
- Banner management
- Coupon management
- Support ticket system

### 8. Vendor Dashboard
- Sales analytics
- Order management
- Revenue tracking
- Customer messages
- Inventory management
- Performance metrics

### 9. AI Features
- Product recommendations
- Smart search suggestions
- AI chatbot
- Demand forecasting
- Invoice scanner

### 10. Notification System
- Email notifications
- SMS alerts (Twilio ready)
- Push notifications
- In-app notifications
- Event-based triggers

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation & sanitization
- XSS & CSRF protection
- SQL injection prevention
- Rate limiting
- Secure password hashing (bcrypt)
- Environment variable management

## 📊 Database Schema

Complete database design for:
- Users & Profiles
- Products & Categories
- Orders & Order Items
- Payments & Transactions
- Reviews & Ratings
- Vendors & Store Info
- Coupons & Discounts
- Support Tickets
- Quotations
- Inventory
- Notifications

## 🚀 Deployment

### Production Checklist
- [ ] Set all environment variables
- [ ] Configure database (MongoDB Atlas / RDS)
- [ ] Set up payment gateways (Razorpay/Stripe)
- [ ] Configure cloud storage (Cloudinary/S3)
- [ ] Set up SSL certificates
- [ ] Enable CORS properly
- [ ] Configure CDN
- [ ] Set up monitoring & logging
- [ ] Enable rate limiting
- [ ] Configure backup strategy

### Deployment Options
1. **AWS** - EC2 + RDS + S3 + CloudFront
2. **DigitalOcean** - Droplets + Managed Database
3. **Railway** - One-click deployment
4. **Vercel** (Frontend) + Heroku/Railway (Backend)

## 📱 Mobile App Ready

Backend APIs are designed to support:
- Native iOS/Android apps
- React Native mobile clients
- Flutter applications
- Progressive Web App (PWA)

## 🤝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/verify` - Verify token

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Product details
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (Vendor)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - User orders
- `GET /api/orders/:id` - Order details
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/:id/tracking` - Live tracking

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Payment history

### Vendors
- `GET /api/vendors` - List vendors
- `GET /api/vendors/:id` - Vendor details
- `POST /api/vendors` - Vendor registration
- `GET /api/vendors/analytics` - Vendor analytics

### Analytics
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/analytics/users` - User analytics

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

## 📝 License

Proprietary - IndiBuy Platform

## 🤝 Support

For support, email: support@indibuy.com

## 📞 Contact

- Website: https://indibuy.com
- Email: hello@indibuy.com
- Support: support@indibuy.com

---

**Built with ❤️ for Indian Industries**
