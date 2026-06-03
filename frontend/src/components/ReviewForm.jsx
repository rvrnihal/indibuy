import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { useReview } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';

export default function ReviewForm({ productId, onReviewAdded }) {
  const { user } = useAuth();
  const { addReview } = useReview();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-blue-700 font-medium">
          Please <a href="/login" className="underline font-bold">login</a> to write a review
        </p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!title.trim() || !text.trim()) {
      alert('Please fill in title and review');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addReview(productId, {
        rating,
        title,
        text,
        author: user.name || user.email.split('@')[0],
        verified: true
      });
      setRating(0);
      setTitle('');
      setText('');
      setIsSubmitting(false);
      if (onReviewAdded) onReviewAdded();
    }, 500);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-6 border border-gray-200"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-6">Write a Review</h3>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.2 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition"
            >
              <FaStar
                size={32}
                className={
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }
              />
            </motion.button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </p>
        )}
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Review Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your review in a title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Review Text */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience with this product..."
          rows="5"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
        <p className="text-sm text-gray-500 mt-2">{text.length}/500 characters</p>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        disabled={isSubmitting}
        type="submit"
        className={`w-full py-3 rounded-lg font-bold transition ${
          isSubmitting
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? 'Posting Review...' : 'Post Review'}
      </motion.button>
    </motion.form>
  );
}
