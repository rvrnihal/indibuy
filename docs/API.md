# IndiBuy - API Documentation

## Base URL

```
Production: https://api.indibuy.com/api
Development: http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Authentication APIs

### 1. Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "StrongPass123!",
  "phone": "+919876543210",
  "role": "buyer",
  "businessName": "ABC Corp (if vendor)",
  "gstNumber": "27ABCDE1234H1Z0 (if vendor)"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "60d5ec49c1234567890abc12",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "buyer"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "60d5ec49c1234567890abc12",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "buyer"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 3. Verify Email

**Endpoint:** `POST /auth/verify-email`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### 4. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### 5. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123!"
}
```

### 6. Google OAuth

**Endpoint:** `POST /auth/google`

**Request Body:**
```json
{
  "googleToken": "google_access_token_here"
}
```

---

## Product APIs

### 1. Get All Products

**Endpoint:** `GET /products`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `category` - Category ID
- `vendor` - Vendor ID
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search keyword
- `rating` - Minimum rating (1-5)
- `sort` - Sort field (e.g., -price, name)

**Example:**
```
GET /products?page=1&limit=20&category=electronics&sort=-createdAt
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49c1234567890abc12",
      "name": "Industrial Steel Beam",
      "price": {
        "original": 5000,
        "discounted": 4500,
        "currency": "INR"
      },
      "ratings": {
        "average": 4.5,
        "count": 120
      },
      "vendor": {
        "_id": "60d5ec49c1234567890abc13",
        "storeName": "Steel Corp"
      },
      "stock": {
        "quantity": 100
      }
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 20,
    "pages": 25
  }
}
```

### 2. Get Product Details

**Endpoint:** `GET /products/:productId`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abc12",
    "name": "Industrial Steel Beam",
    "description": "High quality steel beams for construction",
    "price": {
      "original": 5000,
      "discounted": 4500,
      "currency": "INR",
      "gst": 18
    },
    "images": [
      {
        "url": "https://res.cloudinary.com/...",
        "alt": "Product image 1"
      }
    ],
    "specifications": {
      "material": "Stainless Steel",
      "dimensions": {
        "length": 10,
        "width": 5,
        "height": 2
      }
    },
    "stock": {
      "quantity": 100,
      "sku": "SB-001"
    },
    "reviews": [],
    "ratings": {
      "average": 4.5,
      "count": 120
    }
  }
}
```

### 3. Create Product (Vendor Only)

**Endpoint:** `POST /products`

**Authorization Required:** Yes (Vendor role)

**Request Body:**
```json
{
  "name": "Industrial Steel Beam",
  "description": "High quality steel beams for construction",
  "category": "60d5ec49c1234567890abc12",
  "price": {
    "original": 5000,
    "discounted": 4500,
    "currency": "INR"
  },
  "gst": {
    "rate": 18
  },
  "images": ["image_url_1", "image_url_2"],
  "stock": {
    "quantity": 100,
    "sku": "SB-001"
  },
  "specifications": {
    "material": "Stainless Steel",
    "dimensions": {
      "length": 10,
      "width": 5
    }
  }
}
```

### 4. Update Product (Vendor Only)

**Endpoint:** `PUT /products/:productId`

**Authorization Required:** Yes

**Request Body:** Same as Create Product

### 5. Delete Product (Vendor Only)

**Endpoint:** `DELETE /products/:productId`

**Authorization Required:** Yes

### 6. Search Products

**Endpoint:** `GET /products/search`

**Query Parameters:**
- `q` - Search query
- `limit` (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Industrial Steel Beam",
      "price": 5000,
      "rating": 4.5
    }
  ]
}
```

---

## Order APIs

### 1. Create Order

**Endpoint:** `POST /orders`

**Authorization Required:** Yes

**Request Body:**
```json
{
  "items": [
    {
      "product": "60d5ec49c1234567890abc12",
      "quantity": 5,
      "price": 4500
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "addressLine1": "123 Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400001",
    "country": "India"
  },
  "paymentMethod": "razorpay",
  "couponCode": "WELCOME10"
}
```

### 2. Get User Orders

**Endpoint:** `GET /orders`

**Authorization Required:** Yes

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` - Filter by status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49c1234567890abc12",
      "orderNumber": "ORD-2024-001",
      "status": "delivered",
      "total": 22500,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Get Order Details

**Endpoint:** `GET /orders/:orderId`

**Authorization Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abc12",
    "orderNumber": "ORD-2024-001",
    "items": [...],
    "pricing": {
      "subtotal": 22500,
      "shipping": 500,
      "gst": 3630,
      "total": 26630
    },
    "payment": {
      "method": "razorpay",
      "status": "completed"
    },
    "delivery": {
      "status": "delivered",
      "tracking": {...}
    }
  }
}
```

### 4. Update Order Status

**Endpoint:** `PUT /orders/:orderId/status`

**Authorization Required:** Yes (Vendor/Admin)

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789"
}
```

### 5. Track Order

**Endpoint:** `GET /orders/:orderId/tracking`

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "out_for_delivery",
    "location": {
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "estimatedDelivery": "2024-01-20T18:00:00Z",
    "partner": {
      "name": "John Driver",
      "phone": "+919876543210",
      "vehicle": "Two Wheeler"
    }
  }
}
```

---

## Payment APIs

### 1. Initiate Payment

**Endpoint:** `POST /payments/initiate`

**Authorization Required:** Yes

**Request Body:**
```json
{
  "orderId": "60d5ec49c1234567890abc12",
  "amount": 26630,
  "paymentMethod": "razorpay"
}
```

**Response:**
```json
{
  "success": true,
  "razorpayOrderId": "order_1234567890abcdef",
  "amount": 26630,
  "currency": "INR"
}
```

### 2. Verify Payment

**Endpoint:** `POST /payments/verify`

**Authorization Required:** Yes

**Request Body:**
```json
{
  "razorpayOrderId": "order_1234567890abcdef",
  "razorpayPaymentId": "pay_1234567890abcdef",
  "razorpaySignature": "signature_here"
}
```

### 3. Get Payment History

**Endpoint:** `GET /payments/history`

**Authorization Required:** Yes

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

---

## Cart APIs

### 1. Add to Cart

**Endpoint:** `POST /cart/add`

**Authorization Required:** Yes

**Request Body:**
```json
{
  "product": "60d5ec49c1234567890abc12",
  "quantity": 5
}
```

### 2. Get Cart

**Endpoint:** `GET /cart`

**Authorization Required:** Yes

### 3. Update Cart Item

**Endpoint:** `PUT /cart/update`

**Request Body:**
```json
{
  "productId": "60d5ec49c1234567890abc12",
  "quantity": 10
}
```

### 4. Remove from Cart

**Endpoint:** `DELETE /cart/remove/:productId`

**Authorization Required:** Yes

### 5. Clear Cart

**Endpoint:** `DELETE /cart/clear`

**Authorization Required:** Yes

---

## Wishlist APIs

### 1. Add to Wishlist

**Endpoint:** `POST /wishlist/add`

**Authorization Required:** Yes

**Request Body:**
```json
{
  "product": "60d5ec49c1234567890abc12"
}
```

### 2. Get Wishlist

**Endpoint:** `GET /wishlist`

**Authorization Required:** Yes

### 3. Remove from Wishlist

**Endpoint:** `DELETE /wishlist/remove/:productId`

---

## Review APIs

### 1. Create Review

**Endpoint:** `POST /reviews`

**Authorization Required:** Yes

**Request Body:**
```json
{
  "product": "60d5ec49c1234567890abc12",
  "order": "60d5ec49c1234567890abc13",
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Great quality and fast delivery"
}
```

### 2. Get Product Reviews

**Endpoint:** `GET /reviews/product/:productId`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `sort` - Sort by 'helpful', 'rating', 'recent'

### 3. Update Review

**Endpoint:** `PUT /reviews/:reviewId`

**Authorization Required:** Yes

### 4. Delete Review

**Endpoint:** `DELETE /reviews/:reviewId`

---

## Vendor APIs

### 1. Get Vendors

**Endpoint:** `GET /vendors`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` - Search by vendor name

### 2. Get Vendor Details

**Endpoint:** `GET /vendors/:vendorId`

### 3. Register as Vendor

**Endpoint:** `POST /vendors/register`

**Authorization Required:** Yes (User role)

**Request Body:**
```json
{
  "storeName": "Steel Industries",
  "gstNumber": "27ABCDE1234H1Z0",
  "panNumber": "ABCDE1234F",
  "businessAddress": {
    "addressLine1": "123 Industrial Area",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400001"
  }
}
```

### 4. Get Vendor Analytics

**Endpoint:** `GET /vendors/analytics`

**Authorization Required:** Yes (Vendor)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 50000,
    "totalOrders": 25,
    "totalRevenue": 500000,
    "monthlyRevenue": [...],
    "topProducts": [...],
    "ratings": {
      "average": 4.7,
      "count": 120
    }
  }
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Invalid input",
  "errors": {
    "email": "Email is required"
  }
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Header**: `X-RateLimit-Remaining`

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Pagination

Most list endpoints support pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 20,
    "pages": 25
  }
}
```

---

## Sorting

Sort endpoints support sorting:

**Query Parameter:**
- `sort` - Field name with optional `-` prefix for descending

**Examples:**
- `sort=name` - Ascending by name
- `sort=-price` - Descending by price
- `sort=-createdAt` - Newest first

