import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProductPagination({ products, pageSize = 8 }) {
  const [displayCount, setDisplayCount] = useState(pageSize);

  const visibleProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + pageSize, products.length));
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {visibleProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4 border rounded p-3 hover:shadow transition"
          >
            <img src={product.image} alt={product.name} className="w-28 h-20 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <div className="text-sm text-gray-600 line-clamp-2">{product.description}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                <div className="text-sm text-gray-600">
                  Rating: {product.rating} ⭐ ({product.reviews} reviews)
                </div>
              </div>
              <div className="text-xs text-green-600 mt-1">✓ Delivery in {product.delivery}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Load More ({displayCount} of {products.length})
          </button>
        </motion.div>
      )}

      {displayCount >= products.length && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-gray-600 text-sm"
        >
          Showing all {products.length} products
        </motion.div>
      )}
    </div>
  );
}
