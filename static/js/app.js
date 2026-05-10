/**
 * app.js - Professional Frontend Application Framework
 * Features: API abstraction, State management, Error handling, PWA ready
 */

class API {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('auth_token');
    }

    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new APIError(data.message, response.status, data.errors);
            }

            return data;
        } catch (error) {
            if (error instanceof APIError) throw error;
            throw new APIError('Network error', 0);
        }
    }

    // Product endpoints
    products = {
        list: (params) => this.request('/products.php?action=list', { 
            method: 'GET',
            body: new URLSearchParams(params)
        }),
        search: (query) => this.request(`/products.php?action=search&q=${encodeURIComponent(query)}`),
        detail: (id) => this.request(`/products.php?action=detail&id=${id}`),
        compare: (ids) => this.request(`/products.php?action=compare&ids=${ids.join(',')}`),
        trending: (days = 7) => this.request(`/products.php?action=trending&days=${days}`),
        similar: (id) => this.request(`/products.php?action=similar&id=${id}`)
    };

    // Auth endpoints
    auth = {
        register: (data) => this.request('/auth.php?action=register', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        login: (email, password) => this.request('/auth.php?action=login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }),
        logout: () => this.request('/auth.php?action=logout', { method: 'POST' }),
        profile: () => this.request('/auth.php?action=profile')
    };

    // Order endpoints
    orders = {
        create: (data) => this.request('/orders.php?action=create', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        list: (userId, page = 1) => this.request(`/orders.php?action=list&user_id=${userId}&page=${page}`),
        detail: (id) => this.request(`/orders.php?action=detail&id=${id}`),
        track: (id) => this.request(`/orders.php?action=track&id=${id}`),
        invoice: (id) => this.request(`/orders.php?action=invoice&id=${id}`),
        bulkQuote: (data) => this.request('/orders.php?action=bulk-quote', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        analytics: (userId) => this.request(`/orders.php?action=analytics&user_id=${userId}`)
    };
}

class APIError extends Error {
    constructor(message, status, errors = null) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

/**
 * State Management
 */
class Store {
    constructor() {
        this.state = {
            user: null,
            cart: [],
            wishlist: [],
            filters: {},
            notifications: []
        };
        this.listeners = [];
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Cart methods
    addToCart(product, quantity = 1) {
        const existing = this.state.cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.state.cart.push({ ...product, quantity });
        }
        this.notify();
        this.saveCart();
    }

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.notify();
        this.saveCart();
    }

    updateCartQuantity(productId, quantity) {
        const item = this.state.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.notify();
            this.saveCart();
        }
    }

    getCartTotal() {
        return this.state.cart.reduce((total, item) => {
            const price = item.discount_percentage 
                ? item.price * (1 - item.discount_percentage / 100)
                : item.price;
            return total + (price * item.quantity);
        }, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        if (saved) {
            this.state.cart = JSON.parse(saved);
        }
    }

    // Wishlist methods
    addToWishlist(product) {
        if (!this.state.wishlist.find(item => item.id === product.id)) {
            this.state.wishlist.push(product);
            this.notify();
        }
    }

    removeFromWishlist(productId) {
        this.state.wishlist = this.state.wishlist.filter(item => item.id !== productId);
        this.notify();
    }
}

/**
 * UI Components
 */
class ProductCard {
    constructor(product) {
        this.product = product;
    }

    render() {
        const discount = this.product.discount_percentage ? 
            `<span class="discount-badge">-${this.product.discount_percentage}%</span>` : '';
        
        const finalPrice = this.product.discount_percentage 
            ? this.product.price * (1 - this.product.discount_percentage / 100)
            : this.product.price;

        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${this.product.image_url}" alt="${this.product.name}">
                    ${discount}
                </div>
                <div class="product-info">
                    <h3>${this.product.name}</h3>
                    <p class="description">${this.product.description.substring(0, 100)}...</p>
                    <div class="rating">
                        <span class="stars">${'★'.repeat(Math.round(this.product.rating))}</span>
                        <span class="count">(${this.product.review_count})</span>
                    </div>
                    <div class="pricing">
                        <span class="final-price">₹${finalPrice.toFixed(2)}</span>
                        ${this.product.discount_percentage ? 
                            `<span class="original-price">₹${this.product.price.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="actions">
                        <button class="btn-primary add-to-cart" data-id="${this.product.id}">
                            Add to Cart
                        </button>
                        <button class="btn-secondary wishlist" data-id="${this.product.id}">
                            <i class="icon-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Notification System
 */
class NotificationManager {
    static success(message, duration = 3000) {
        this.show('success', message, duration);
    }

    static error(message, duration = 3000) {
        this.show('error', message, duration);
    }

    static info(message, duration = 3000) {
        this.show('info', message, duration);
    }

    static show(type, message, duration) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

/**
 * Initialize Application
 */
class App {
    constructor() {
        this.api = new API();
        this.store = new Store();
        this.init();
    }

    async init() {
        this.store.loadCart();
        this.setupEventListeners();
        
        // Check if user is logged in
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const profile = await this.api.auth.profile();
                this.store.setState({ user: profile.data });
            } catch (error) {
                localStorage.removeItem('auth_token');
            }
        }

        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js');
        }
    }

    setupEventListeners() {
        // Add to cart
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = e.target.dataset.id;
                this.addToCart(productId);
            }
        });

        // Wishlist
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('wishlist')) {
                const productId = e.target.dataset.id;
                this.toggleWishlist(productId);
            }
        });
    }

    async addToCart(productId) {
        try {
            const product = await this.api.products.detail(productId);
            this.store.addToCart(product.data);
            NotificationManager.success('Added to cart');
        } catch (error) {
            NotificationManager.error(error.message);
        }
    }

    toggleWishlist(productId) {
        // Implementation for wishlist toggle
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
