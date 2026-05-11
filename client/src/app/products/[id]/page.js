'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaShare, FaShoppingCart, FaTruck, FaShieldAlt, FaExchangeAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.data);
        setRelatedProducts(data.data.relatedProducts || []);
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      toast.error('Failed to load product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleAddToWishlist = () => {
    toast.success('Added to wishlist');
  };

  const handleRequestQuotation = () => {
    toast.info('Quotation request sent to vendor');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="inline-block animate-spin">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Product not found</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">IndiBuy</Link>
          <div className="flex gap-2 text-sm mt-2 text-gray-600 dark:text-gray-400">
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <span>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-200 dark:bg-gray-800 rounded-lg h-96 flex items-center justify-center"
          >
            <p className="text-gray-500">Product Image</p>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-2 dark:text-white">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < 4 ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">(128 reviews)</span>
                <span className="text-green-600 font-semibold">In Stock</span>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-blue-600">₹{product.finalPrice}</span>
                {product.price > product.finalPrice && (
                  <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
                )}
                <span className="text-lg font-semibold text-green-600">
                  {Math.round(((product.price - product.finalPrice) / product.price) * 100)}% OFF
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Including all taxes and shipping</p>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description || 'High-quality industrial product with premium specifications.'}
            </p>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-white">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-lg"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center outline-none dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-lg"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.quantity} items available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleAddToWishlist}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <FaHeart className="inline mr-2" /> Wishlist
                </button>
                <button
                  onClick={handleRequestQuotation}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Request Quotation
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FaTruck className="text-blue-600" />
                <span className="dark:text-gray-300">Free shipping on orders above ₹500</span>
              </div>
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-blue-600" />
                <span className="dark:text-gray-300">30-day returns guaranteed</span>
              </div>
              <div className="flex items-center gap-3">
                <FaExchangeAlt className="text-blue-600" />
                <span className="dark:text-gray-300">Easy exchange policy</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vendor Information */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Seller Information</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold dark:text-white">{product.vendor?.businessName || 'Verified Seller'}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < 4 ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">(4.5/5 from 2.5K reviews)</span>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
              Contact Seller
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex border-b dark:border-gray-700 mb-6">
            {['details', 'specifications', 'reviews', 'qa'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={activeTab}
            className="space-y-4"
          >
            {activeTab === 'details' && (
              <div className="space-y-3 dark:text-gray-300">
                <p><strong>Product Code:</strong> {product.sku}</p>
                <p><strong>Category:</strong> {product.category?.name}</p>
                <p><strong>Warranty:</strong> 1 Year</p>
                <p><strong>Return Period:</strong> 30 Days</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-3 dark:text-gray-300">
                <p className="font-semibold mb-2">Key Specifications</p>
                <ul className="space-y-1 text-sm">
                  <li>• Premium quality material</li>
                  <li>• Industrial grade construction</li>
                  <li>• Long-lasting durability</li>
                  <li>• Certified and tested</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="border-b dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div>
                          <p className="font-semibold dark:text-white">User {i}</p>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, j) => (
                              <FaStar key={j} className="text-yellow-400 text-xs" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 weeks ago</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">Excellent quality product. Highly recommended!</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No questions yet</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                  Ask a Question
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map(relProduct => (
                <motion.div
                  key={relProduct._id}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  <Link href={`/products/${relProduct._id}`}>
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-4">
                      <h3 className="font-bold dark:text-white truncate">{relProduct.name}</h3>
                      <p className="text-blue-600 font-bold mt-2">₹{relProduct.finalPrice}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
