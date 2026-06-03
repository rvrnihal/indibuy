import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaHeart, FaRegHeart, FaTimes } from 'react-icons/fa';
import { allProducts } from '../utils/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function SearchPage() {
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500000,
    minRating: 0,
    inStock: false,
    sortBy: 'relevant'
  });
  const [results, setResults] = useState([]);
  const [addedItems, setAddedItems] = useState({});

  const categories = ['All', ...new Set(allProducts.map(p => p.category))];
  const vendors = ['All', ...new Set(allProducts.map(p => p.vendor))];

  useEffect(() => {
    filterAndSearch();
  }, [query, filters]);

  const filterAndSearch = () => {
    let filtered = allProducts.filter(product => {
      const matchQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                        product.description?.toLowerCase().includes(query.toLowerCase());
      const matchPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
      const matchRating = product.rating >= filters.minRating;
      const matchStock = !filters.inStock || product.inStock;
      
      return matchQuery && matchPrice && matchRating && matchStock;
    });

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      default:
        break;
    }

    setResults(filtered);
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

  const handleReset = () => {
    setQuery('');
    setFilters({
      minPrice: 0,
      maxPrice: 500000,
      minRating: 0,
      inStock: false,
      sortBy: 'relevant'
    });
  };

  return (
    <>
      <Head>
        <title>Search Products - IndiBuy</title>
        <meta name="description" content="Search and filter industrial products on IndiBuy" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900">Search Products</h1>
              <p className="text-gray-600 mt-2">Find exactly what you're looking for</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-lg p-6 shadow sticky top-24 h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                    {(query || filters.minPrice > 0 || filters.maxPrice < 500000 || filters.minRating > 0 || filters.inStock) && (
                      <button
                        onClick={handleReset}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Sort */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="relevant">Most Relevant</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">Price Range</label>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-600">Min: ₹{filters.minPrice.toLocaleString()}</label>
                          <input
                            type="range"
                            min="0"
                            max="500000"
                            step="1000"
                            value={filters.minPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Max: ₹{filters.maxPrice.toLocaleString()}</label>
                          <input
                            type="range"
                            min="0"
                            max="500000"
                            step="1000"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
                      <select
                        value={filters.minRating}
                        onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="0">All Ratings</option>
                        <option value="3">3★ and up</option>
                        <option value="4">4★ and up</option>
                        <option value="5">5★ only</option>
                      </select>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="inStock"
                        checked={filters.inStock}
                        onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Search Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-3"
              >
                {/* Search Box */}
                <div className="mb-8 relative">
                  <FaSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                  />
                </div>

                {/* Results Header */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found <span className="font-bold text-gray-900">{results.length}</span> product{results.length !== 1 ? 's' : ''}
                    {query && <span> for "{query}"</span>}
                  </p>
                </div>

                {/* Results Grid */}
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden relative"
                      >
                        {/* Wishlist Button */}
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          onClick={() => toggleWishlist(product)}
                          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md"
                        >
                          {isInWishlist(product.id) ? (
                            <FaHeart size={16} className="text-red-500" />
                          ) : (
                            <FaRegHeart size={16} className="text-gray-600" />
                          )}
                        </motion.button>

                        <Link href={`/product/${product.id}`}>
                          <div className="relative h-40 bg-gray-200">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{product.vendor}</p>
                            <div className="flex items-center gap-1 mb-2">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm font-semibold">{product.rating}</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                          </div>
                        </Link>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
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
                          <FaShoppingCart size={14} />
                          {addedItems[product.id] ? '✓ Added!' : 'Add'}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg p-12 text-center"
                  >
                    <FaSearch size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
