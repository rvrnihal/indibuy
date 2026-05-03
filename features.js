/**
 * IndiBuy Enterprise Frontend - Advanced Features
 * Includes: Product search, wishlists, orders, coupons, notifications
 */

// ============================================================================
// PRODUCT MANAGEMENT
// ============================================================================

class ProductManager {
    constructor() {
        this.currentPage = 1;
        this.filters = {};
    }

    // List products with advanced filters
    async listProducts(category = null, search = null, sort = 'popularity', minPrice = 0, maxPrice = 999999) {
        try {
            const params = new URLSearchParams({
                action: 'list',
                page: this.currentPage,
                limit: 20,
                sort: sort
            });

            if (category) params.append('category', category);
            if (search) params.append('search', search);
            params.append('min_price', minPrice);
            params.append('max_price', maxPrice);

            const response = await fetch(`/products.php?${params}`);
            const data = await response.json();

            if (data.success) {
                this.renderProducts(data.data);
                return data;
            } else {
                console.error('Failed to load products:', data.message);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.logErrorToServer('ProductManager.listProducts', error);
        }
    }

    // Get product details with variants and reviews
    async getProductDetails(productId) {
        try {
            const response = await fetch(`/products.php?action=get&id=${productId}`);
            const data = await response.json();

            if (data.success) {
                return data;
            } else {
                console.error('Failed to load product:', data.message);
            }
        } catch (error) {
            console.error('Error loading product details:', error);
            this.logErrorToServer('ProductManager.getProductDetails', error);
        }
    }

    // Add product review
    async addReview(productId, rating, title, comment) {
        try {
            const response = await fetch('/products.php?action=add_review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, rating, title, comment })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding review:', error);
            this.logErrorToServer('ProductManager.addReview', error);
        }
    }

    // Render products to DOM
    renderProducts(products) {
        const container = document.getElementById('products-container');
        if (!container) return;

        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image_url || '/default-product.png'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="seller">By ${product.seller_name || 'IndiBuy'}</p>
                <div class="rating">
                    <span class="stars">${this.renderStars(product.rating)}</span>
                    <span class="reviews">${product.review_count || 0} reviews</span>
                </div>
                <p class="price">₹${product.price.toLocaleString()}</p>
                <div class="discount" ${product.discount_percent ? '' : 'style="display:none"'}>
                    ${product.discount_percent}% OFF
                </div>
                <button onclick="productManager.addToCart(${product.id})">Add to Cart</button>
                <button onclick="wishlistManager.add(${product.id})" class="wishlist-btn">♡</button>
            </div>
        `).join('');
    }

    renderStars(rating) {
        const stars = Math.round(rating || 0);
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    }

    logErrorToServer(functionName, error) {
        fetch('/log-error.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `${functionName}: ${error.message}`,
                stack: error.stack,
                url: window.location.href
            })
        });
    }
}

// ============================================================================
// WISHLIST MANAGER
// ============================================================================

class WishlistManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('wishlist') || '[]');
    }

    async add(productId, variantId = null) {
        try {
            const response = await fetch('/products.php?action=wishlist_add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, variantId })
            });

            const data = await response.json();
            if (data.success) {
                this.items.push({ productId, variantId });
                localStorage.setItem('wishlist', JSON.stringify(this.items));
                alert('Added to wishlist!');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    }

    async remove(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    }

    async getItems() {
        try {
            const response = await fetch('/products.php?action=wishlist_get');
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    }
}

// ============================================================================
// ORDER MANAGER
// ============================================================================

class OrderManager {
    async createOrder(productId, quantity, variantId = null, couponCode = null, address = '') {
        try {
            const response = await fetch('/orders.php?action=create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    quantity,
                    variantId,
                    coupon_code: couponCode,
                    shipping_address: address,
                    payment_method: 'credit_card'
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }

    async getOrders(status = 'all') {
        try {
            const response = await fetch(`/orders.php?action=list&status=${status}`);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    async trackOrder(orderId) {
        try {
            const response = await fetch(`/orders.php?action=track&id=${orderId}`);
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error tracking order:', error);
        }
    }

    async requestReturn(orderId, reason) {
        try {
            const response = await fetch('/orders.php?action=request_return', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: orderId, reason })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error requesting return:', error);
        }
    }
}

// ============================================================================
// COUPON MANAGER
// ============================================================================

class CouponManager {
    async validateCoupon(code, total) {
        try {
            const response = await fetch(`/coupons.php?action=validate&code=${code}&total=${total}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error validating coupon:', error);
        }
    }

    async getFlashSales() {
        try {
            const response = await fetch('/coupons.php?action=flash_sales');
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error fetching flash sales:', error);
        }
    }

    async getAvailableCoupons() {
        try {
            const response = await fetch('/coupons.php?action=available');
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    }
}

// ============================================================================
// NOTIFICATION MANAGER
// ============================================================================

class NotificationManager {
    async getNotifications(unreadOnly = false) {
        try {
            const response = await fetch(`/notifications.php?action=list&unread=${unreadOnly ? 1 : 0}`);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    async getUnreadCount() {
        try {
            const response = await fetch('/notifications.php?action=count');
            const data = await response.json();
            return data.success ? data.count : 0;
        } catch (error) {
            console.error('Error getting notification count:', error);
        }
    }

    async markAsRead(notificationId = null) {
        try {
            const response = await fetch('/notifications.php?action=mark_read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: notificationId })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    displayNotification(title, message, type = 'info') {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification notification-${type}`;
        notificationDiv.innerHTML = `
            <strong>${title}</strong>
            <p>${message}</p>
        `;
        document.body.appendChild(notificationDiv);

        setTimeout(() => notificationDiv.remove(), 5000);
    }
}

// ============================================================================
// USER PROFILE MANAGER
// ============================================================================

class ProfileManager {
    async getProfile() {
        try {
            const response = await fetch('/profile.php?action=profile');
            const data = await response.json();
            return data.success ? data : null;
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    async addAddress(addressData) {
        try {
            const response = await fetch('/profile.php?action=add_address', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding address:', error);
        }
    }

    async addPaymentMethod(methodData) {
        try {
            const response = await fetch('/profile.php?action=add_payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(methodData)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding payment method:', error);
        }
    }

    async changePassword(currentPassword, newPassword, confirmPassword) {
        try {
            const response = await fetch('/profile.php?action=change_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error changing password:', error);
        }
    }
}

// ============================================================================
// INITIALIZE MANAGERS
// ============================================================================

const productManager = new ProductManager();
const wishlistManager = new WishlistManager();
const orderManager = new OrderManager();
const couponManager = new CouponManager();
const notificationManager = new NotificationManager();
const profileManager = new ProfileManager();

// Auto-update notification count
setInterval(() => {
    notificationManager.getUnreadCount().then(count => {
        const badge = document.getElementById('notification-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    });
}, 30000); // Check every 30 seconds

console.log('✅ IndiBuy Enterprise Features loaded successfully!');
