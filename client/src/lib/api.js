const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth Endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Product Endpoints
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? '?' + query : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  async searchProducts(query) {
    return this.request(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async getTrendingProducts() {
    return this.request('/products/trending');
  }

  // Order Endpoints
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/orders${query ? '?' + query : ''}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel`, { method: 'POST' });
  }

  // Cart Endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(productId) {
    return this.request(`/cart/${productId}`, { method: 'DELETE' });
  }

  // Payment Endpoints
  async processPayment(paymentData) {
    return this.request('/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async verifyPayment(paymentId) {
    return this.request(`/payments/verify/${paymentId}`);
  }

  // Review Endpoints
  async getProductReviews(productId) {
    return this.request(`/reviews/product/${productId}`);
  }

  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Notification Endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, { method: 'POST' });
  }
}

export const apiClient = new APIClient();
