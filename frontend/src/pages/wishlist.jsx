import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'framer-motion';
import { FaTrash, FaHeart, FaShoppingCart } from 'react-icons/fa';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <Layout>
        <Head>
          <title>Wishlist - IndiBuy</title>
          <meta name="description" content="Your wishlist" />
        </Head>

        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-600 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Add products to your wishlist to save them for later</p>
            <Link href="/products">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Wishlist - IndiBuy</title>
        <meta name="description" content="Your wishlist items" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Clear All
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600">Product Image</span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">SKU: {item.productId}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-green-600 font-bold text-xl">₹{item.price.toLocaleString()}</p>
                      <span className="text-xs text-gray-500">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mb-3">Min Order: {item.minOrder} units</p>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <FaShoppingCart /> Add to Cart
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFromWishlist(item.productId)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg"
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
