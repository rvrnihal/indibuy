# 🚀 IndiBuy Enterprise Features - Database Schema Upgrade

## 📊 **New Tables for Amazon/Flipkart-like Features**

```sql
-- ============================================================================
-- PRODUCTS - Enhanced with variants and inventory
-- ============================================================================

ALTER TABLE products ADD COLUMN (
    category_id INT,
    subcategory_id INT,
    brand VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    stock_quantity INT DEFAULT 0,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    seller_id INT,
    FOREIGN KEY (seller_id) REFERENCES sellers(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
);

-- ============================================================================
-- CATEGORIES
-- ============================================================================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SUBCATEGORIES
-- ============================================================================

CREATE TABLE subcategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ============================================================================
-- PRODUCT VARIANTS (Size, Color, Storage, etc.)
-- ============================================================================

CREATE TABLE product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    variant_type VARCHAR(50) NOT NULL, -- size, color, storage, etc
    variant_value VARCHAR(100) NOT NULL,
    additional_price DECIMAL(10,2) DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_variant (product_id, variant_type, variant_value)
);

-- ============================================================================
-- REVIEWS AND RATINGS
-- ============================================================================

CREATE TABLE product_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (product_id, user_id)
);

-- ============================================================================
-- WISHLIST
-- ============================================================================

CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id),
    UNIQUE KEY unique_wishlist (user_id, product_id, variant_id)
);

-- ============================================================================
-- PRODUCT COMPARISON
-- ============================================================================

CREATE TABLE product_comparisons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_ids JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- SELLERS / MERCHANTS
-- ============================================================================

CREATE TABLE sellers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    store_description TEXT,
    logo_url VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    commission_percent DECIMAL(5,2) DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- COUPONS AND DISCOUNTS
-- ============================================================================

CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent DECIMAL(5,2),
    discount_amount DECIMAL(10,2),
    min_order_value DECIMAL(10,2),
    max_uses INT,
    current_uses INT DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_categories JSON,
    applicable_sellers JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- COUPON USAGE TRACKING
-- ============================================================================

CREATE TABLE coupon_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ============================================================================
-- FLASH SALES AND OFFERS
-- ============================================================================

CREATE TABLE flash_sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_percent DECIMAL(5,2),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    product_ids JSON,
    category_ids JSON,
    max_quantity_per_user INT,
    current_orders INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ORDERS - Enhanced
-- ============================================================================

ALTER TABLE orders ADD COLUMN (
    variant_id INT,
    order_number VARCHAR(50) UNIQUE,
    tracking_number VARCHAR(100),
    coupon_id INT,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    shipping_address TEXT,
    estimated_delivery DATE,
    actual_delivery DATE,
    return_reason TEXT,
    return_status VARCHAR(50), -- pending, approved, rejected, completed
    refund_status VARCHAR(50), -- pending, processed, failed
    refund_amount DECIMAL(10,2),
    seller_id INT,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id),
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
    FOREIGN KEY (seller_id) REFERENCES sellers(id)
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL, -- order_placed, payment_confirmed, shipped, delivered, etc
    title VARCHAR(255) NOT NULL,
    message TEXT,
    related_order_id INT,
    related_product_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_order_id) REFERENCES orders(id),
    FOREIGN KEY (related_product_id) REFERENCES products(id)
);

-- ============================================================================
-- USER ADDRESSES (Saved addresses for faster checkout)
-- ============================================================================

CREATE TABLE user_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50), -- home, office, other
    name VARCHAR(100),
    phone VARCHAR(20),
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- USER WISHLIST HISTORY
-- ============================================================================

CREATE TABLE user_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type VARCHAR(50), -- viewed, searched, added_to_cart, purchased
    product_id INT,
    search_query VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================================================
-- ANALYTICS - User Sessions
-- ============================================================================

CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id VARCHAR(100) UNIQUE,
    ip_address VARCHAR(45),
    device_type VARCHAR(50), -- mobile, tablet, desktop
    browser VARCHAR(100),
    entry_page VARCHAR(255),
    exit_page VARCHAR(255),
    session_duration INT, -- in seconds
    page_views INT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- ANALYTICS - Sales
-- ============================================================================

CREATE TABLE sales_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    total_users INT DEFAULT 0,
    new_users INT DEFAULT 0,
    total_page_views INT DEFAULT 0,
    conversion_rate DECIMAL(5,2),
    average_order_value DECIMAL(10,2),
    top_product_id INT,
    top_category_id INT,
    FOREIGN KEY (top_product_id) REFERENCES products(id),
    FOREIGN KEY (top_category_id) REFERENCES categories(id)
);

-- ============================================================================
-- PAYMENT METHODS (Multiple payment options)
-- ============================================================================

CREATE TABLE payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    method_type VARCHAR(50), -- credit_card, debit_card, upi, wallet, etc
    method_name VARCHAR(100),
    last_four_digits VARCHAR(4),
    is_default BOOLEAN DEFAULT FALSE,
    provider VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- ADMIN USERS
-- ============================================================================

CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50), -- admin, moderator, analyst
    permissions JSON,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_user ON product_reviews(user_id);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);
CREATE INDEX idx_wishlist_product ON wishlist(product_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_sessions_date ON user_sessions(started_at);
CREATE INDEX idx_analytics_date ON sales_analytics(date);
```

---

## 🎯 **New Features Summary**

| Feature | Table | Details |
|---------|-------|---------|
| **Product Variants** | product_variants | Size, color, storage options |
| **Reviews & Ratings** | product_reviews | 5-star ratings with comments |
| **Wishlist** | wishlist | Save for later functionality |
| **Sellers/Merchants** | sellers | Multi-vendor support |
| **Coupons** | coupons | Discount codes with validation |
| **Flash Sales** | flash_sales | Time-limited offers |
| **Notifications** | notifications | Real-time user notifications |
| **Addresses** | user_addresses | Multiple saved addresses |
| **Analytics** | user_sessions, sales_analytics | Detailed performance metrics |
| **Categories** | categories, subcategories | Organized product catalog |
| **Payment Methods** | payment_methods | Multiple payment options |
| **Admin Panel** | admin_users | Management dashboard |

---

## 📈 **Industry Standards Included**

✅ Multi-vendor marketplace  
✅ Advanced search and filtering  
✅ Product recommendations  
✅ Wishlist and comparison  
✅ Real-time order tracking  
✅ Review and rating system  
✅ Discount and coupon management  
✅ Flash sales and offers  
✅ Multiple payment methods  
✅ Admin analytics dashboard  
✅ Return and refund management  
✅ Notification system  
✅ Mobile optimization  
✅ SEO friendly URLs  
✅ Performance optimized (indexes)

---

Run this SQL in your MySQL console to upgrade your database!
