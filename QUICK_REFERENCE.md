# 🚀 IndiBuy Enterprise - Quick Reference Guide

## 📱 Quick Start - 5 Minutes

### 1. Initialize Managers (in your HTML)
```html
<script src="/features.js"></script>

<script>
// All managers are ready to use immediately
productManager.listProducts();
wishlistManager.getItems();
orderManager.getOrders();
couponManager.validateCoupon('CODE', 5000);
notificationManager.getUnreadCount();
profileManager.getProfile();
</script>
```

### 2. Common Tasks

#### Search & Filter Products
```javascript
// Search by category
await productManager.listProducts(category=1);

// Search by keyword
await productManager.listProducts(search='iPhone');

// Sort by rating
await productManager.listProducts(sort='rating');

// Price range
await productManager.listProducts(minPrice=1000, maxPrice=50000);
```

#### Create an Order
```javascript
const order = await orderManager.createOrder(
    productId = 123,
    quantity = 1,
    variantId = 5,     // optional
    couponCode = 'SAVE10',
    address = '123 Main St, Mumbai'
);
console.log(order.order_number); // ORD-20240503120000-1234
```

#### Validate Coupon
```javascript
const result = await couponManager.validateCoupon('SUMMER20', 5000);
if (result.success) {
    console.log('Discount: ₹' + result.discount_amount);
    console.log('Final Total: ₹' + result.final_total);
}
```

#### Track Order
```javascript
const tracking = await orderManager.trackOrder(101);
console.log(tracking.status);      // 'shipped'
console.log(tracking.tracking_number); // 'TRACK12345'
console.log(tracking.estimated_delivery); // '2024-05-08'
```

#### Add Product Review
```javascript
await productManager.addReview(
    productId = 123,
    rating = 5,
    title = 'Excellent!',
    comment = 'Great quality and fast delivery'
);
```

---

## 📊 API Reference - By Feature

### 🛍️ PRODUCTS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products.php?action=list` | List all products with filters |
| GET | `/products.php?action=get&id=1` | Get product details |
| POST | `/products.php?action=add_review` | Add product review |
| POST | `/products.php?action=wishlist_add` | Add to wishlist |
| GET | `/products.php?action=wishlist_get` | Get wishlist items |
| GET | `/products.php?action=categories` | Get all categories |
| GET | `/products.php?action=search` | Search products |

### 📦 ORDERS

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders.php?action=create` | Create new order |
| GET | `/orders.php?action=list` | Get user's orders |
| GET | `/orders.php?action=get&id=1` | Get order details |
| GET | `/orders.php?action=track&id=1` | Track order |
| POST | `/orders.php?action=request_return` | Request return |

### 💰 COUPONS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/coupons.php?action=validate` | Validate coupon code |
| GET | `/coupons.php?action=available` | Get available coupons |
| GET | `/coupons.php?action=flash_sales` | Get active flash sales |

### 🔔 NOTIFICATIONS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications.php?action=list` | Get notifications |
| POST | `/notifications.php?action=mark_read` | Mark as read |
| GET | `/notifications.php?action=count` | Get unread count |

### 👤 PROFILE

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile.php?action=profile` | Get user profile |
| POST | `/profile.php?action=update` | Update profile |
| POST | `/profile.php?action=add_address` | Add saved address |
| POST | `/profile.php?action=delete_address` | Delete address |
| POST | `/profile.php?action=add_payment` | Add payment method |
| POST | `/profile.php?action=change_password` | Change password |

### 📊 ADMIN

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin.php?action=stats` | Get dashboard stats |
| GET | `/admin.php?action=top_products` | Get top selling products |
| GET | `/admin.php?action=recent_orders` | Get recent orders |
| GET | `/admin.php?action=revenue_chart` | Get revenue data |
| GET | `/admin.php?action=coupons` | Get all coupons |
| POST | `/admin.php?action=create_coupon` | Create new coupon |
| POST | `/admin.php?action=update_order` | Update order status |

---

## 💡 Common Scenarios

### Scenario 1: Customer Shopping
```javascript
// Browse products
const products = await productManager.listProducts();

// View product details
const product = await productManager.getProductDetails(123);

// Add to wishlist
await wishlistManager.add(123);

// Add review
await productManager.addReview(123, 5, 'Great!', 'Loved it');

// Create order
const order = await orderManager.createOrder(123, 1, null, 'SAVE10');

// Get notifications
const notif = await notificationManager.getNotifications();
```

### Scenario 2: Order Tracking
```javascript
// Get all user orders
const orders = await orderManager.getOrders('all');

// Get specific order
const order = await orderManager.getOrders('shipped');

// Track order
const tracking = await orderManager.trackOrder(101);

// Request return
await orderManager.requestReturn(101, 'Item damaged');
```

### Scenario 3: Coupon Management
```javascript
// Get available coupons
const coupons = await couponManager.getAvailableCoupons();

// Validate coupon
const valid = await couponManager.validateCoupon('SAVE10', 5000);

// Get flash sales
const sales = await couponManager.getFlashSales();
```

### Scenario 4: Admin Operations
```javascript
// Get stats
const stats = await adminManager.getDashboardStats('month');

// Get top products
const top = await adminManager.getTopProducts(10);

// Create coupon
const coupon = await adminManager.createCoupon({
    code: 'SUMMER20',
    discount_percent: 20,
    max_uses: 100,
    valid_to: '2024-08-31'
});
```

---

## 🔄 Data Flow

### Product Browsing Flow
```
User Opens Homepage
    ↓
productManager.listProducts()
    ↓
Fetch /products.php?action=list
    ↓
Backend filters & sorts
    ↓
Return products JSON
    ↓
renderProducts() displays results
    ↓
User clicks product
    ↓
productManager.getProductDetails(id)
    ↓
Display variants, reviews, seller info
```

### Order Creation Flow
```
User adds to cart
    ↓
User proceeds to checkout
    ↓
profileManager.getProfile() - Load saved addresses
    ↓
couponManager.validateCoupon() - Apply discount
    ↓
orderManager.createOrder()
    ↓
Backend creates order, updates stock
    ↓
notificationManager displays "Order confirmed"
    ↓
Order sent to notifications table
    ↓
Admin dashboard updates automatically
```

### Notification Flow
```
Order status changes (admin)
    ↓
Admin updates via /admin.php?action=update_order
    ↓
Backend creates notification record
    ↓
Frontend polls /notifications.php?action=count
    ↓
Badge updates in real-time
    ↓
notificationManager.displayNotification() shows message
```

---

## 🔗 Database Relationships

```
users
├── orders (1 to many)
├── product_reviews (1 to many)
├── wishlist (1 to many)
├── user_addresses (1 to many)
├── payment_methods (1 to many)
├── notifications (1 to many)
└── admin_users (1 to many)

products
├── product_variants (1 to many)
├── product_reviews (1 to many)
├── wishlist (1 to many)
├── orders (1 to many)
└── categories (many to 1)

sellers
├── products (1 to many)
└── orders (1 to many)

categories
├── products (1 to many)
└── subcategories (1 to many)

coupons
├── orders (1 to many)
└── coupon_usage (1 to many)

flash_sales
└── orders (1 to many)
```

---

## 📋 Response Formats

### Success Response
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description here"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* items */ ],
  "page": 1,
  "limit": 20,
  "total": 150
}
```

---

## 🎨 Frontend Integration

### Example: Product Listing Page
```html
<div id="products-container" class="product-grid"></div>

<script>
// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    productManager.listProducts();
});

// Add filter listeners
document.getElementById('category-filter').addEventListener('change', (e) => {
    productManager.listProducts(category=e.target.value);
});

document.getElementById('sort-dropdown').addEventListener('change', (e) => {
    productManager.listProducts(sort=e.target.value);
});
</script>
```

### Example: Order Tracking Page
```html
<div id="orders-container"></div>

<script>
async function loadOrders() {
    const orders = await orderManager.getOrders();
    
    document.getElementById('orders-container').innerHTML = 
        orders.map(order => `
            <div class="order-card">
                <h3>${order.order_number}</h3>
                <p>Status: ${order.status}</p>
                <p>Tracking: ${order.tracking_number}</p>
                <button onclick="trackOrder(${order.id})">Track</button>
            </div>
        `).join('');
}

async function trackOrder(orderId) {
    const tracking = await orderManager.trackOrder(orderId);
    alert(`Status: ${tracking.status}\nETA: ${tracking.estimated_delivery}`);
}

loadOrders();
</script>
```

---

## ⚙️ Configuration

### Enable All Features
```php
// In config.php, ensure:
define('FEATURES_ENABLED', true);
define('MULTI_VENDOR', true);
define('NOTIFICATIONS_ENABLED', true);
define('ADMIN_PANEL', true);
```

### Customize Discounts
```php
// In admin.php
define('MAX_DISCOUNT_PERCENT', 90);
define('MIN_ORDER_FOR_COUPON', 100);
define('SELLER_COMMISSION_DEFAULT', 5); // percent
```

---

## 🧪 Testing

### Test Products API
```bash
curl "http://localhost:8000/products.php?action=list&category=1&sort=rating"
```

### Test Orders API
```bash
curl -X POST "http://localhost:8000/orders.php?action=create" \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":1}'
```

### Test Coupons API
```bash
curl "http://localhost:8000/coupons.php?action=validate&code=SAVE10&total=5000"
```

### Test Admin API
```bash
curl "http://localhost:8000/admin.php?action=stats&period=month"
```

---

## 🐛 Debugging

### Enable Error Logging
```php
// In config.php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

### Check Logs
```bash
# Server errors
tail -f /var/log/apache2/error.log

# Database errors
tail -f /var/log/mysql/error.log

# App logs
tail -f logs/error.log
```

### Console Debugging
```javascript
// Enable verbose logging
localStorage.setItem('debug', 'true');

// Check localStorage
console.log(localStorage.getItem('wishlist'));
console.log(localStorage.getItem('cart'));
```

---

## 📱 Mobile Responsive

The APIs are mobile-ready. Use responsive design:

```css
/* Mobile-first approach */
@media (max-width: 768px) {
    .product-grid {
        grid-template-columns: 1fr;
    }
    
    .order-card {
        padding: 10px;
    }
}
```

---

## 🔒 Security Checklist

- [x] All inputs sanitized
- [x] SQL injection prevented (prepared statements)
- [x] CSRF protection enabled
- [x] Passwords hashed (BCrypt)
- [x] Security headers set
- [x] Error messages don't expose internals
- [x] Session cookies HTTPOnly/Secure

---

## 🚀 Ready to Deploy!

Your IndiBuy enterprise platform is **production-ready**:

```bash
# Push to GitHub
git add .
git commit -m "IndiBuy 2.0 - Enterprise Features"
git push origin main

# Deploy to Railway
# Go to https://railway.app
# Select your GitHub repo
# Click Deploy
# Done! 🎉
```

---

**Need help?** Check `ENTERPRISE_FEATURES.md` for detailed documentation.

**Version:** 2.0 Enterprise Edition  
**Last Updated:** May 3, 2026  
**Status:** ✅ Production Ready
