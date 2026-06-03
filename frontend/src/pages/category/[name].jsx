import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { allProducts, getProductsByCategory } from '../../utils/products';


export default function CategoryPage() {
  const router = useRouter();
  const { name } = router.query;
  const [sortBy, setSortBy] = useState('popular');

  if (!name) return null;

  const categoryProducts = getProductsByCategory(name);

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <>
      <Head>
        <title>{name} Products - IndiBuy</title>
        <meta name="description" content={`Browse ${name} products on IndiBuy`} />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Link href="/products">
                <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">← Back to Products</span>
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mt-4">{name}</h1>
              <p className="text-gray-600 mt-2">
                Showing {sortedProducts.length} products in {name}
              </p>
            </motion.div>

            {/* Sort Bar */}
            <div className="mb-6 flex justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                  >
                    {/* Image */}
                    <Link href={`/product/${product.id}`}>
                      <div className="relative h-48 bg-gray-200 overflow-hidden group cursor-pointer">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold">Out of Stock</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {product.moq > 1 ? `MOQ: ${product.moq}` : 'In Stock'}
                        </div>
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="p-4">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Vendor */}
                      <p className="text-xs text-gray-500 mb-2">by {product.vendor}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              size={14}
                              fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <Link href={`/product/${product.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            <FaShoppingCart size={16} />
                          </motion.button>
                        </Link>
                      </div>

                      {/* Delivery */}
                      <p className="text-xs text-green-600 mt-2">✓ Delivery in {product.delivery}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
