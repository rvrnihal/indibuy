# IndiBuy - Database Schema Documentation

## Collections/Tables Overview

This document outlines the complete database schema for the IndiBuy platform.

## 1. Users Collection

Stores user information for all user types (buyers, vendors, admins, delivery partners).

**Fields:**
- `firstName` (String) - Required
- `lastName` (String) - Required
- `email` (String) - Unique, Required
- `password` (String) - Hashed
- `phone` (String) - Optional, validated
- `avatar` (Object) - Profile image
- `role` (String) - Enum: 'buyer', 'vendor', 'admin', 'delivery_partner'
- `isEmailVerified` (Boolean)
- `preferences` (Object) - Dark mode, language, currency, notifications
- `socialLogin` (Object) - Google, Facebook IDs
- `addresses` (Array of ObjectId) - Reference to Address collection
- `wallet` (Object) - Balance and transactions
- `referralCode` (String) - Unique referral code
- `timestamps` - createdAt, updatedAt

## 2. Products Collection

Stores product information for the catalog.

**Fields:**
- `name` (String) - Required, unique
- `slug` (String) - SEO friendly URL
- `description` (String) - Detailed description
- `category` (ObjectId) - Reference to Category
- `brand` (String) - Brand name
- `vendor` (ObjectId) - Reference to Vendor
- `price` (Object) - Original, discounted, currency, GST
- `ratings` (Object) - Average, count, breakdown (1-5 stars)
- `images` (Array) - Product images with public IDs
- `specifications` (Object) - Material, dimensions, weight, color
- `stock` (Object) - Quantity, SKU, low stock threshold
- `warranty` (Object) - Period, unit, description
- `shipping` (Object) - Weight, dimensions, cost
- `documents` (Array) - PDFs, manuals
- `videos` (Array) - Product video URLs
- `status` (String) - Enum: 'draft', 'active', 'inactive', 'discontinued'
- `moq` (Number) - Minimum Order Quantity
- `bulkPricing` (Array) - Volume discounts
- `tags` (Array) - Search tags

## 3. Orders Collection

Stores order information.

**Fields:**
- `orderNumber` (String) - Unique order ID
- `buyer` (ObjectId) - Reference to User
- `items` (Array) - Ordered products with quantity, price, status
- `shippingAddress` (Object) - Complete shipping details
- `billingAddress` (Object) - Complete billing details
- `pricing` (Object) - Subtotal, discount, shipping, GST, total
- `payment` (Object) - Method, transaction ID, status, receipt
- `invoice` (Object) - Invoice details and URL
- `delivery` (Object) - Partner, tracking, OTP, location
- `status` (String) - Enum: 'pending', 'confirmed', 'shipped', 'delivered', etc.
- `timeline` (Array) - Status history with timestamps
- `refund` (Object) - Refund request and status

## 4. Categories Collection

Stores product categories in a hierarchical structure.

**Fields:**
- `name` (String) - Unique category name
- `slug` (String) - SEO friendly URL
- `description` (String) - Category description
- `image` (Object) - Category image
- `icon` (String) - Icon or emoji
- `parent` (ObjectId) - Parent category (for subcategories)
- `children` (Array of ObjectId) - Subcategories
- `isActive` (Boolean) - Active status

## 5. Vendors Collection

Stores vendor/supplier information.

**Fields:**
- `user` (ObjectId) - Reference to User
- `storeName` (String) - Unique store name
- `storeSlug` (String) - SEO friendly URL
- `storeLogo` (Object) - Logo image
- `storeBanner` (Object) - Banner image
- `businessLicense` (Object) - Number, expiry, document
- `gstNumber` (String) - Unique GST number
- `panNumber` (String) - Unique PAN number
- `bankDetails` (Object) - Account information
- `businessAddress` (Object) - Complete business address
- `verificationStatus` (String) - Enum: 'pending', 'approved', 'rejected', 'suspended'
- `ratings` (Object) - Average and count
- `products` (Array of ObjectId) - References to Products
- `analytics` (Object) - Revenue data and performance
- `wallet` (Object) - Balance and transactions
- `subscriptionPlan` (String) - Enum: 'free', 'basic', 'premium', 'enterprise'

## 6. Reviews Collection

Stores product and vendor reviews.

**Fields:**
- `product` (ObjectId) - Reference to Product
- `vendor` (ObjectId) - Reference to Vendor
- `order` (ObjectId) - Reference to Order
- `reviewer` (ObjectId) - Reference to User
- `rating` (Number) - 1-5 stars
- `title` (String) - Review title
- `comment` (String) - Review content
- `images` (Array) - Review images/videos
- `isVerifiedPurchase` (Boolean)
- `helpful` (Number) - Helpful count
- `unhelpful` (Number) - Unhelpful count
- `responses` (Array) - Vendor responses
- `status` (String) - Enum: 'pending', 'approved', 'rejected'

## 7. Cart Collection

Stores user shopping carts.

**Fields:**
- `user` (ObjectId) - Reference to User, Unique
- `items` (Array) - Product items with quantity and pricing
- `couponCode` (String) - Applied coupon
- `discountAmount` (Number)
- `totalPrice` (Number)

## 8. Wishlist Collection

Stores user wishlists.

**Fields:**
- `user` (ObjectId) - Reference to User, Unique
- `items` (Array) - Products with prices at the time

## 9. Address Collection

Stores user addresses.

**Fields:**
- `user` (ObjectId) - Reference to User
- `firstName` (String)
- `lastName` (String)
- `email` (String)
- `phone` (String)
- `companyName` (String) - Optional
- `addressLine1` (String)
- `addressLine2` (String)
- `city` (String)
- `state` (String)
- `pinCode` (String)
- `country` (String)
- `addressType` (String) - 'home', 'office', 'warehouse'
- `isDefault` (Boolean)
- `location` (Object) - Latitude, longitude

## 10. Coupon Collection

Stores discount coupons.

**Fields:**
- `code` (String) - Unique coupon code
- `description` (String)
- `discountType` (String) - 'percentage' or 'fixed'
- `discountValue` (Number)
- `minOrderAmount` (Number)
- `maxDiscount` (Number)
- `applicableCategories` (Array of ObjectId)
- `applicableProducts` (Array of ObjectId)
- `usageLimit` (Object) - Total uses, per-user uses
- `validity` (Object) - Start date, end date, active status

## 11. Payments Collection

Stores payment records.

**Fields:**
- `order` (ObjectId) - Reference to Order
- `user` (ObjectId) - Reference to User
- `amount` (Number)
- `paymentMethod` (String) - 'razorpay', 'stripe', 'cod', etc.
- `transactionId` (String) - Unique transaction ID
- `razorpayOrderId` (String)
- `razorpayPaymentId` (String)
- `razorpaySignature` (String)
- `stripePaymentIntentId` (String)
- `status` (String) - 'pending', 'completed', 'failed', 'refunded'
- `receipt` (Object) - Receipt image/PDF

## 12. Notifications Collection

Stores user notifications.

**Fields:**
- `recipient` (ObjectId) - Reference to User
- `type` (String) - Enum: 'order', 'payment', 'delivery', 'promotion', 'system'
- `title` (String)
- `message` (String)
- `channel` (Object) - Email, SMS, Push, In-app booleans
- `status` (String) - 'sent', 'delivered', 'read', 'failed'
- `isRead` (Boolean)
- `relatedEntity` (Object) - Link to entity (Order, Product, etc.)

## 13. Support Tickets Collection

Stores customer support tickets.

**Fields:**
- `ticketNumber` (String) - Unique ticket ID
- `user` (ObjectId) - Reference to User
- `order` (ObjectId) - Related order (optional)
- `category` (String) - Enum: 'order', 'payment', 'delivery', 'product', 'vendor', 'account'
- `subject` (String)
- `description` (String)
- `priority` (String) - 'low', 'medium', 'high', 'urgent'
- `status` (String) - 'open', 'in_progress', 'waiting_customer', 'resolved', 'closed'
- `assignedTo` (ObjectId) - Reference to Admin User
- `messages` (Array) - Conversation thread
- `resolution` (Object) - Resolved notes and timestamp

## 14. DeliveryPartner Collection

Stores delivery partner information.

**Fields:**
- `user` (ObjectId) - Reference to User
- `partnerName` (String)
- `partnerType` (String) - 'individual' or 'company'
- `licenseNumber` (String) - Unique license
- `vehicleDetails` (Object) - Type, capacity, registration
- `insurance` (Object) - Policy details
- `verificationStatus` (String) - 'pending', 'verified', 'rejected', 'suspended'
- `operatingAreas` (Array) - Cities and PIN codes served
- `ratings` (Object) - Average and count
- `activeOrders` (Array of ObjectId)
- `completedDeliveries` (Number)
- `totalEarnings` (Number)
- `bankDetails` (Object) - For payouts
- `location` (Object) - Current latitude, longitude

## 15. Quotation Collection

Stores bulk quotation requests.

**Fields:**
- `quotationNumber` (String) - Unique ID
- `buyer` (ObjectId) - Reference to User
- `vendor` (ObjectId) - Reference to Vendor
- `items` (Array) - Products with quantities
- `description` (String)
- `deliveryAddress` (Object)
- `deliveryRequired` (Boolean)
- `estimatedDelivery` (Date)
- `pricing` (Object) - Subtotal, shipping, GST, total
- `status` (String) - 'draft', 'sent', 'accepted', 'rejected', 'expired'
- `validUntil` (Date)
- `conversation` (Array) - Message thread

## Indexes

Key indexes for performance:

```javascript
// Products
db.products.createIndex({ name: "text", description: "text" });
db.products.createIndex({ category: 1, status: 1 });
db.products.createIndex({ vendor: 1, status: 1 });

// Orders
db.orders.createIndex({ buyer: 1, createdAt: -1 });
db.orders.createIndex({ orderNumber: 1 });
db.orders.createIndex({ status: 1 });

// Notifications
db.notifications.createIndex({ recipient: 1, isRead: 1, createdAt: -1 });

// Users
db.users.createIndex({ email: 1 });
db.users.createIndex({ role: 1 });

// Reviews
db.reviews.createIndex({ product: 1, rating: 1 });
db.reviews.createIndex({ reviewer: 1 });
```

## Relationships Summary

```
User (1) ---- (Many) Orders
User (1) ---- (1) Cart
User (1) ---- (1) Wishlist
User (1) ---- (Many) Addresses
User (1) ---- (1) Vendor
User (1) ---- (1) DeliveryPartner
User (1) ---- (Many) Notifications
User (1) ---- (Many) Reviews
User (1) ---- (Many) SupportTickets

Vendor (1) ---- (Many) Products
Vendor (1) ---- (Many) Orders (through OrderItems)

Product (1) ---- (Many) Orders
Product (1) ---- (Many) Reviews
Product (Many) ---- (1) Category

Order (1) ---- (Many) OrderItems
Order (1) ---- (1) Payment
Order (1) ---- (1) Delivery
Order (1) ---- (Many) Refunds
```

## Data Validation

- Email: Must be unique and valid
- Phone: Indian format (+91 XXXXX XXXXX)
- GST: 15 character unique code
- PAN: 10 character unique code
- PIN Code: 6 digits for India
- Prices: Must be positive numbers
- Ratings: 1-5 scale
- Order quantities: Minimum 1
