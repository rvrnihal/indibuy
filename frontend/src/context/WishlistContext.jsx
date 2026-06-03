import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Initialize from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('indibuy_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to parse saved wishlist:', e);
      }
    }
    setLoading(false);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('indibuy_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist(prevWishlist => {
      if (prevWishlist.find(item => item.id === product.id)) {
        return prevWishlist;
      }
      return [
        ...prevWishlist,
        {
          ...product,
          addedAt: new Date().toISOString()
        }
      ];
    });
    return { success: true };
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
    return { success: true };
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      return removeFromWishlist(product.id);
    } else {
      return addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('indibuy_wishlist');
    return { success: true };
  };

  const getWishlistCount = () => wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistCount,
        isEmpty: wishlist.length === 0
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
