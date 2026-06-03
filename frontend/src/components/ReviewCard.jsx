import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaThumbsUp, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useReview } from '../context/ReviewContext';

export default function ReviewCard({ review, onDelete }) {
  const { user } = useAuth();
  const { markHelpful } = useReview();
  const [helpfulCount, setHelpfulCount] = React.useState(review.helpful || 0);
  const [isAuthor, setIsAuthor] = React.useState(false);

  React.useEffect(() => {
    setIsAuthor(user && user.name === review.author);
  }, [user, review.author]);

  const handleHelpful = () => {
    markHelpful(review.id);
    setHelpfulCount(prev => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={16}
                  className={i < review.rating ? '' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700">
              {review.rating}.0 / 5.0
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{review.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-600">
              by <span className="font-semibold">{review.author}</span>
            </p>
            {review.verified && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
        {isAuthor && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => onDelete && onDelete(review.id)}
            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
          >
            <FaTrash size={16} />
          </motion.button>
        )}
      </div>

      <p className="text-gray-700 mb-4">{review.text}</p>

      <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
        <p>
          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleHelpful}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold transition"
        >
          <FaThumbsUp size={14} /> Helpful ({helpfulCount})
        </motion.button>
      </div>
    </motion.div>
  );
}
