import React, { createContext, useContext, useState, useEffect } from 'react';

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedReviews = localStorage.getItem('indibuy_reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error('Failed to parse saved reviews:', e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('indibuy_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (productId, review) => {
    const newReview = {
      id: Date.now(),
      productId,
      ...review,
      createdAt: new Date().toISOString(),
      helpful: 0
    };
    setReviews(prev => [newReview, ...prev]);
    return newReview;
  };

  const getProductReviews = (productId) => {
    return reviews.filter(review => review.productId === productId);
  };

  const getProductRating = (productId) => {
    const productReviews = reviews.filter(review => review.productId === productId);
    if (productReviews.length === 0) return 0;
    const avgRating = productReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / productReviews.length;
    return parseFloat(avgRating.toFixed(1));
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
    return { success: true };
  };

  const updateReview = (reviewId, updates) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId ? { ...review, ...updates, updatedAt: new Date().toISOString() } : review
      )
    );
    return { success: true };
  };

  const markHelpful = (reviewId) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId ? { ...review, helpful: (review.helpful || 0) + 1 } : review
      )
    );
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        loading,
        addReview,
        getProductReviews,
        getProductRating,
        deleteReview,
        updateReview,
        markHelpful
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within ReviewProvider');
  }
  return context;
}
