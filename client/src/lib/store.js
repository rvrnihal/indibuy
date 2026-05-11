import { create } from 'zustand';
import { apiClient } from './api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  // Initialize auth on app load
  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        set({ token, isAuthenticated: true });
        apiClient.setToken(token);
      }
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.login({ email, password });
      const token = response.token;
      localStorage.setItem('authToken', token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      apiClient.setToken(token);
      set({ user: response.data, token, isAuthenticated: true });
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Register
  register: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.register(userData);
      const token = response.token;
      localStorage.setItem('authToken', token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      apiClient.setToken(token);
      set({ user: response.data, token, isAuthenticated: true });
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    apiClient.setToken(null);
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Get profile
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getProfile();
      set({ user: response.data });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.updateProfile(profileData);
      set({ user: response.data });
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  isLoading: false,

  // Fetch cart
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getCart();
      set({
        items: response.data.items || [],
        total: response.data.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Add to cart
  addToCart: async (productId, quantity) => {
    try {
      const response = await apiClient.addToCart(productId, quantity);
      set({
        items: response.data.items || [],
        total: response.data.total || 0,
      });
      return response;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  },

  // Update cart item
  updateCartItem: async (productId, quantity) => {
    try {
      const response = await apiClient.updateCartItem(productId, quantity);
      set({
        items: response.data.items || [],
        total: response.data.total || 0,
      });
      return response;
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    try {
      const response = await apiClient.removeFromCart(productId);
      set({
        items: response.data.items || [],
        total: response.data.total || 0,
      });
      return response;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  },

  // Clear cart
  clearCart: () => {
    set({ items: [], total: 0 });
  },
}));

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  // Fetch notifications
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getNotifications();
      const unreadCount = response.data.filter(n => !n.read).length;
      set({
        notifications: response.data || [],
        unreadCount,
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Mark as read
  markAsRead: async (id) => {
    try {
      await apiClient.markNotificationAsRead(id);
      const notifications = get().notifications.map(n =>
        n._id === id ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter(n => !n.read).length;
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  // Add notification
  addNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  // Clear notifications
  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));

export const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  filters: {
    search: '',
    category: '',
    priceRange: [0, 100000],
    sortBy: 'newest',
  },

  // Fetch products
  fetchProducts: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getProducts(params);
      set({ products: response.data || [] });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch single product
  fetchProduct: async (id) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getProduct(id);
      set({ selectedProduct: response.data });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Search products
  searchProducts: async (query) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.searchProducts(query);
      set({ products: response.data || [] });
      return response.data;
    } catch (error) {
      console.error('Failed to search products:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Get trending products
  fetchTrendingProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getTrendingProducts();
      set({ products: response.data || [] });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trending products:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Set filters
  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  // Clear selected product
  clearSelected: () => {
    set({ selectedProduct: null });
  },
}));

export const useOrderStore = create((set, get) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,

  // Fetch orders
  fetchOrders: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getOrders(params);
      set({ orders: response.data || [] });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch single order
  fetchOrder: async (id) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getOrder(id);
      set({ selectedOrder: response.data });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Create order
  createOrder: async (orderData) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.createOrder(orderData);
      set(state => ({
        orders: [response.data, ...state.orders],
      }));
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Cancel order
  cancelOrder: async (id) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.cancelOrder(id);
      set(state => ({
        orders: state.orders.map(o => o._id === id ? response.data : o),
      }));
      return response.data;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
