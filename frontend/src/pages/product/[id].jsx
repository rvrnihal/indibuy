import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaStar, FaShoppingCart, FaTruck, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { allProducts } from '../../utils/products';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const product = allProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Link href="/products">
              <span className="text-blue-600 hover:text-blue-700 font-semibold">Back to Products</span>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleCheckout = () => {
    // Redirect to checkout with product details
    router.push({
      pathname: '/checkout',
      query: {
        productId: product.id,
        quantity: quantity,
        amount: product.price * quantity
      }
    });
  };

  return (
    <>
      <Head>
        <title>{product.name} - IndiBuy</title>
        <meta name="description" content={product.description} />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/products">
                <span className="hover:text-gray-900 cursor-pointer">Products</span>
              </Link>
              <span>/</span>
              <Link href={`/category/${product.category}`}>
                <span className="hover:text-gray-900 cursor-pointer">{product.category}</span>
              </Link>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg overflow-hidden shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </motion.div>

              {/* Product Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg p-6 shadow"
              >
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {/* Vendor */}
                <p className="text-gray-600 mb-4">by <span className="font-semibold">{product.vendor}</span></p>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={18}
                        fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ₹{product.price.toLocaleString()}
                  </div>
                  <p className="text-green-600 font-semibold">✓ In Stock</p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 mb-3">{product.longDescription}</p>
                </div>

                {/* Specifications */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-gray-600 capitalize">{key}</p>
                        <p className="font-semibold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-6 pb-6 border-b space-y-3">
                  <div className="flex items-center gap-3">
                    <FaTruck className="text-blue-600" size={20} />
                    <span>Delivery in {product.delivery}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="text-blue-600" size={20} />
                    <span>Authentic & Certified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-blue-600" size={20} />
                    <span>Verified Seller</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Quantity (MOQ: {product.moq})
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(product.moq, quantity - 1))}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                      className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                    <span className="text-gray-600 text-sm ml-4">
                      Total: ₹{(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    Buy Now
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleAddToCart}
                    className={`w-full border-2 py-3 rounded-lg font-bold transition ${
                      isAdded
                        ? 'border-green-600 text-green-600 bg-green-50'
                        : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {isAdded ? '✓ Added to Cart' : 'Add to Cart'}
                  </motion.button>
                </div>

                {/* Payment Options */}
                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-3">Payment Options:</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">💳 Credit Card</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">🏦 Bank Transfer</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">📱 UPI</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">🏪 COD</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Related Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts
                  .filter(p => p.category === product.category && p.id !== product.id)
                  .slice(0, 3)
                  .map(p => (
                    <Link key={p.id} href={`/product/${p.id}`}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{p.name}</h3>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">
                              ₹{p.price.toLocaleString()}
                            </span>
                            <span className="text-yellow-400">★ {p.rating}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
}
