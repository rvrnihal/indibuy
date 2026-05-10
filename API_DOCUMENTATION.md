# IndiBuy Professional API Documentation

## Base URL
```
https://yourdomain.com/api
```

## Authentication
All authenticated endpoints require Bearer token in header:
```
Authorization: Bearer {token}
```

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Products](#products)
3. [Orders](#orders)
4. [Errors](#errors)

---

## Authentication

### POST /auth.php?action=register
Register a new user

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful",
  "data": {
    "user_id": 1,
    "email": "john@example.com",
    "token": "abc123xyz789...",
    "token_type": "Bearer",
    "expires_in": 86400
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "234.56ms"
}
```

**Validation Rules:**
- Name: min 3 characters
- Email: valid email format
- Password: min 8 characters
- Phone: 10 digits

---

### POST /auth.php?action=login
Authenticate user

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "token": "abc123xyz789...",
    "token_type": "Bearer",
    "expires_in": 86400
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "145.23ms"
}
```

---

### POST /auth.php?action=verify-2fa
Verify 2FA code

**Request:**
```json
{
  "code": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "2FA verification successful",
  "data": {
    "token": "abc123xyz789...",
    "token_type": "Bearer",
    "expires_in": 86400
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "89.12ms"
}
```

---

### GET /auth.php?action=profile
Get authenticated user profile

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "created_at": "2026-05-01T10:30:00Z"
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "98.45ms"
}
```

---

## Products

### GET /products.php?action=list
List products with filtering

**Query Parameters:**
```
page=1                    # Page number (default: 1)
limit=20                  # Items per page (default: 20)
category=5                # Category ID
search=cement             # Search query
sort=popularity           # popularity|price_low|price_high|rating|newest|discount
min_price=100             # Minimum price
max_price=5000            # Maximum price
in_stock=1                # 1 for in stock only (default: 1)
```

**Example Request:**
```
GET /products.php?action=list?category=5&sort=rating&page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Cement Bag 50kg",
      "description": "Premium Portland cement",
      "price": 350.00,
      "final_price": 315.00,
      "discount_percentage": 10,
      "savings": 35.00,
      "rating": 4.5,
      "review_count": 125,
      "stock_quantity": 500,
      "image_url": "https://cdn.example.com/product1.jpg"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 250,
    "total_pages": 13,
    "has_next": true,
    "has_prev": false
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "234.12ms"
}
```

---

### GET /products.php?action=search
Search products with autocomplete

**Query Parameters:**
```
q=cement                  # Search query (min 2 chars)
```

**Example Request:**
```
GET /products.php?action=search?q=cement%20bag
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Search results",
  "data": [
    {
      "id": 1,
      "name": "Cement Bag 50kg",
      "price": 350.00,
      "image_url": "https://cdn.example.com/product1.jpg",
      "category_id": 5
    },
    {
      "id": 2,
      "name": "Cement Bag 25kg",
      "price": 180.00,
      "image_url": "https://cdn.example.com/product2.jpg",
      "category_id": 5
    }
  ],
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "67.89ms"
}
```

---

### GET /products.php?action=detail
Get product details with reviews

**Query Parameters:**
```
id=1                      # Product ID (required)
```

**Example Request:**
```
GET /products.php?action=detail?id=1
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product detail retrieved",
  "data": {
    "id": 1,
    "name": "Cement Bag 50kg",
    "description": "Premium Portland cement for construction",
    "price": 350.00,
    "rating": 4.5,
    "review_count": 125,
    "stock_quantity": 500,
    "category_id": 5,
    "seller_id": 10,
    "specifications": {
      "Weight": "50kg",
      "Type": "Portland",
      "Grade": "53"
    },
    "reviews": [
      {
        "id": 1,
        "user_name": "Contractor A",
        "rating": 5,
        "comment": "Excellent quality",
        "created_at": "2026-05-08T10:30:00Z"
      }
    ]
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "145.67ms"
}
```

---

### GET /products.php?action=compare
Compare multiple products

**Query Parameters:**
```
ids=1,2,3                 # Comma-separated product IDs (max 5)
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Comparison data",
  "data": [
    {
      "id": 1,
      "name": "Cement 50kg",
      "price": 350.00,
      "rating": 4.5,
      "specifications": {}
    },
    {
      "id": 2,
      "name": "Cement 25kg",
      "price": 180.00,
      "rating": 4.3,
      "specifications": {}
    }
  ],
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "156.34ms"
}
```

---

### GET /products.php?action=trending
Get trending products

**Query Parameters:**
```
days=7                    # Number of days (default: 7)
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Trending products",
  "data": [
    {
      "id": 1,
      "name": "Cement Bag 50kg",
      "price": 350.00,
      "rating": 4.5,
      "image_url": "https://cdn.example.com/product1.jpg",
      "sales_count": 1250
    }
  ],
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "234.56ms"
}
```

---

## Orders

### POST /orders.php?action=create
Create a new order

**Headers Required:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "user_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 5
    },
    {
      "product_id": 2,
      "quantity": 2
    }
  ],
  "shipping_address": "123 Main Street, City, State 12345",
  "payment_method": "credit_card"
}
```

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "order_id": 123,
    "order_number": "ORD-20260510120000-ABC123",
    "total_amount": 1250.00,
    "status": "pending",
    "created_at": "2026-05-10T12:00:00Z"
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "567.89ms"
}
```

---

### GET /orders.php?action=list
List user orders

**Query Parameters:**
```
user_id=1                 # User ID (required)
page=1                    # Page number
limit=20                  # Items per page
```

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 123,
      "order_number": "ORD-20260510120000-ABC123",
      "total_amount": 1250.00,
      "status": "processing",
      "created_at": "2026-05-10T12:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 15,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "234.12ms"
}
```

---

### GET /orders.php?action=detail
Get order details

**Query Parameters:**
```
id=123                    # Order ID (required)
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order detail",
  "data": {
    "id": 123,
    "order_number": "ORD-20260510120000-ABC123",
    "user_id": 1,
    "total_amount": 1250.00,
    "tax_amount": 225.00,
    "status": "processing",
    "payment_method": "credit_card",
    "payment_status": "completed",
    "items": [
      {
        "product_id": 1,
        "quantity": 5,
        "price": 350.00,
        "line_total": 1750.00
      }
    ]
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "145.23ms"
}
```

---

### GET /orders.php?action=track
Track order status

**Query Parameters:**
```
id=123                    # Order ID (required)
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Tracking information",
  "data": {
    "order_number": "ORD-20260510120000-ABC123",
    "status": "shipped",
    "tracking_number": "TRK123456789",
    "carrier": "FedEx"
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "98.56ms"
}
```

---

### POST /orders.php?action=bulk-quote
Generate bulk quote

**Request:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 100
    },
    {
      "product_id": 2,
      "quantity": 50
    }
  ],
  "email": "buyer@company.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Bulk quote generated",
  "data": {
    "quote_number": "Q-20260510120000",
    "valid_until": "2026-06-09T12:00:00Z",
    "items": [
      {
        "product_id": 1,
        "product_name": "Cement Bag 50kg",
        "quantity": 100,
        "unit_price": 350.00,
        "line_total": 35000.00
      }
    ],
    "total": 52500.00
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "345.67ms"
}
```

---

## Errors

### Error Response Format

**400 Bad Request:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Valid email is required",
    "password": "Password must be at least 8 characters"
  },
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "12.34ms"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid credentials",
  "errors": null,
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "45.67ms"
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests",
  "errors": null,
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "5.23ms"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error",
  "errors": null,
  "timestamp": "2026-05-10T12:00:00Z",
  "executionTime": "234.56ms"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limited |
| 500 | Server Error - Internal error |

---

## Rate Limiting

- **Limit:** 100 requests per minute per IP
- **Headers:**
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 95`
  - `X-RateLimit-Reset: 1620000060`

---

## Examples

### Using cURL

```bash
# Register
curl -X POST https://yourdomain.com/api/auth.php?action=register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Pass123!",
    "phone": "9876543210"
  }'

# Login
curl -X POST https://yourdomain.com/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Pass123!"
  }'

# Get user profile
curl -H "Authorization: Bearer {token}" \
  https://yourdomain.com/api/auth.php?action=profile

# List products
curl "https://yourdomain.com/api/products.php?action=list&category=5&sort=rating"
```

### Using JavaScript

```javascript
// Register
const response = await fetch('/api/auth.php?action=register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Pass123!',
    phone: '9876543210'
  })
});

const data = await response.json();
console.log(data);
```

---

**API Version:** 2.0  
**Last Updated:** May 10, 2026  
**Status:** Production Ready

