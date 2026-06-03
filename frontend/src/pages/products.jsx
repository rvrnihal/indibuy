import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { allProducts, getPlaceholderImage, getUniqueCategories } from '../utils/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Products() {
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 500000],
    rating: 0,
    search: ''
  });
  const [view, setView] = useState('grid');
  const [addedItems, setAddedItems] = useState({});

  const products = allProducts;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    setAddedItems(prev => ({
      ...prev,
      [product.id]: true
    }));
    setTimeout(() => {
      setAddedItems(prev => ({
        ...prev,
        [product.id]: false
      }));
    }, 2000);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const router = useRouter();
  const { vendor } = router.query;

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    const matchCategory = !filters.category || product.category === filters.category;
    const matchRating = product.rating >= filters.rating;
    const matchVendor = !vendor || product.vendor === vendor;
    return matchSearch && matchPrice && matchCategory && matchRating && matchVendor;
  });

  return (
    <>
      <Head>
        <title>Products - IndiBuy</title>
        <meta name="description" content="Browse thousands of industrial products" />
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
              <h1 className="text-4xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-2">Explore our wide range of industrial products</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:sticky lg:top-24 h-fit"
              >
                <div className="bg-white rounded-lg p-6 shadow">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">All Categories</option>
                      <option value="Steel & Iron">Steel & Iron</option>
                      <option value="Machinery">Machinery</option>
                      <option value="Tools">Tools</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Construction">Construction</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹0</span>
                        <span>₹{filters.priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Rating
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="0">All Ratings</option>
                      <option value="4">4★ & up</option>
                      <option value="3">3★ & up</option>
                      <option value="2">2★ & up</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={() => setFilters({
                      category: '',
                      priceRange: [0, 500000],
                      rating: 0,
                      search: ''
                    })}
                    className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                {/* View Controls */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    Showing <span className="font-semibold">{filteredProducts.length}</span> products
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setView('grid')}
                      className={`p-2 rounded ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                        <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setView('list')}
                      className={`p-2 rounded ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Products */}
                {filteredProducts.length > 0 ? (
                  <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden relative"
                      >
                        {/* Wishlist Button */}
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleWishlist(product)}
                          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
                        >
                          {isInWishlist(product.id) ? (
                            <FaHeart size={18} className="text-red-500" />
                          ) : (
                            <FaRegHeart size={18} className="text-gray-600" />
                          )}
                        </motion.button>

                        <Link href={`/product/${product.id}`}>
                          {/* Image */}
                          <div className="relative h-48 overflow-hidden bg-gray-200">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-110 transition"
                            />
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white font-bold">Out of Stock</span>
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">{product.vendor}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i}>
                                    {i < Math.floor(product.rating) ? '★' : '☆'}
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                ({product.reviews})
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between pt-3 border-t">
                              <span className="text-xl font-bold text-gray-900">
                                ₹{product.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </Link>

                        {/* Add to Cart Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className={`w-full py-2 px-4 font-semibold transition flex items-center justify-center gap-2 ${
                            addedItems[product.id]
                              ? 'bg-green-500 text-white'
                              : product.inStock
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          <FaShoppingCart size={16} />
                          {addedItems[product.id] ? '✓ Added!' : 'Add to Cart'}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <p className="text-gray-600 text-lg">No products found</p>
                    <button
                      onClick={() => setFilters({
                        category: '',
                        priceRange: [0, 500000],
                        rating: 0,
                        search: ''
                      })}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Clear filters and try again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
