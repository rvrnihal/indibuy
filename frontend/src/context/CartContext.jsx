import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('indibuy_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart:', e);
      }
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('indibuy_cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity,
          addedAt: new Date().toISOString()
        }
      ];
    });

    return { success: true };
  };

  const removeItem = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    return { success: true };
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      return removeItem(productId);
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );

    return { success: true };
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('indibuy_cart');
    return { success: true };
  };

  const getCartSummary = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.length;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate estimated delivery (longest delivery among all items)
    const maxDelivery = cart.length > 0 
      ? Math.max(...cart.map(item => {
          const days = parseInt(item.delivery?.split('-')[0]) || 3;
          return days;
        }))
      : 0;

    return {
      itemCount,
      totalItems,
      subtotal,
      tax: Math.round(subtotal * 0.18), // 18% GST
      total: subtotal + Math.round(subtotal * 0.18),
      estimatedDelivery: maxDelivery,
      items: cart
    };
  };

  const validateMOQ = () => {
    const issues = [];
    cart.forEach(item => {
      if (item.quantity < item.moq) {
        issues.push({
          productId: item.id,
          productName: item.name,
          minRequired: item.moq,
          currentQuantity: item.quantity
        });
      }
    });
    return issues;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartSummary,
        validateMOQ,
        isEmpty: cart.length === 0,
        itemCount: cart.length
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
