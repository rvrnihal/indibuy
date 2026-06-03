import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('indibuy_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    setLoading(false);
  }, []);

  const register = (email, name, phone, password) => {
    try {
      // Check if user already exists
      const allUsers = JSON.parse(localStorage.getItem('indibuy_users') || '{}');
      if (allUsers[email]) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: 'user-' + Date.now(),
        email,
        name,
        phone,
        password: btoa(password), // Basic encoding (not secure - for demo only)
        wishlist: [],
        addresses: [],
        orderHistory: [],
        createdAt: new Date().toISOString()
      };

      allUsers[email] = newUser;
      localStorage.setItem('indibuy_users', JSON.stringify(allUsers));

      // Log in the user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('indibuy_user', JSON.stringify(userWithoutPassword));
      setError(null);

      return { success: true, user: userWithoutPassword };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const login = (email, password) => {
    try {
      const allUsers = JSON.parse(localStorage.getItem('indibuy_users') || '{}');
      const userRecord = allUsers[email];

      if (!userRecord) {
        throw new Error('User not found');
      }

      if (userRecord.password !== btoa(password)) {
        throw new Error('Invalid password');
      }

      const { password: _, ...userWithoutPassword } = userRecord;
      setUser(userWithoutPassword);
      localStorage.setItem('indibuy_user', JSON.stringify(userWithoutPassword));
      setError(null);

      return { success: true, user: userWithoutPassword };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('indibuy_user');
    setError(null);
  };

  const updateProfile = (updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('indibuy_user', JSON.stringify(updatedUser));

      // Update in users database
      const allUsers = JSON.parse(localStorage.getItem('indibuy_users') || '{}');
      allUsers[user.email] = { ...allUsers[user.email], ...updatedUser };
      localStorage.setItem('indibuy_users', JSON.stringify(allUsers));

      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const addAddress = (address) => {
    if (!user) return { success: false, error: 'No user logged in' };

    const addressWithId = {
      id: 'addr-' + Date.now(),
      ...address,
      createdAt: new Date().toISOString()
    };

    const updatedAddresses = [...(user.addresses || []), addressWithId];
    updateProfile({ addresses: updatedAddresses });

    return { success: true, address: addressWithId };
  };

  const removeAddress = (addressId) => {
    if (!user) return { success: false, error: 'No user logged in' };

    const updatedAddresses = user.addresses.filter(a => a.id !== addressId);
    updateProfile({ addresses: updatedAddresses });

    return { success: true };
  };

  const addOrder = (order) => {
    if (!user) return { success: false, error: 'No user logged in' };

    const updatedOrderHistory = [...(user.orderHistory || []), order.orderId];
    updateProfile({ orderHistory: updatedOrderHistory });

    // Store order details
    const orders = JSON.parse(localStorage.getItem('indibuy_orders') || '{}');
    orders[order.orderId] = order;
    localStorage.setItem('indibuy_orders', JSON.stringify(orders));

    return { success: true, order };
  };

  const getOrder = (orderId) => {
    const orders = JSON.parse(localStorage.getItem('indibuy_orders') || '{}');
    return orders[orderId] || null;
  };

  const getAllOrders = () => {
    if (!user) return [];
    const orders = JSON.parse(localStorage.getItem('indibuy_orders') || '{}');
    return user.orderHistory.map(orderId => orders[orderId]).filter(Boolean);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        addOrder,
        getOrder,
        getAllOrders,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
