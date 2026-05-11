'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch, FaStar, FaThLarge, FaThList, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    priceRange: [0, 100000],
    sortBy: 'newest',
    rating: 0,
    inStock: false,
    page: 1,
    limit: 12
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: filters.limit,
        page: filters.page,
        sort: filters.sortBy,
        search: filters.search,
        ...(filters.category && { category: filters.category }),
        ...(filters.rating && { minRating: filters.rating })
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.data || []);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', e.target.search.value);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600 mb-4 block">IndiBuy</Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              name="search"
              defaultValue={filters.search}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              <FaSearch className="inline mr-2" /> Search
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
              <h2 className="text-lg font-bold dark:text-white">Filters</h2>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" className="mr-2" onChange={() => handleFilterChange('priceRange', [0, 10000])} />
                    <span className="text-sm dark:text-gray-400">₹0 - ₹10,000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" className="mr-2" onChange={() => handleFilterChange('priceRange', [10000, 50000])} />
                    <span className="text-sm dark:text-gray-400">₹10,000 - ₹50,000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" className="mr-2" onChange={() => handleFilterChange('priceRange', [50000, 100000])} />
                    <span className="text-sm dark:text-gray-400">₹50,000 - ₹1,00,000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" className="mr-2" onChange={() => handleFilterChange('priceRange', [100000, 999999])} />
                    <span className="text-sm dark:text-gray-400">₹1,00,000+</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        className="mr-2"
                        onChange={() => handleFilterChange('rating', rating)}
                      />
                      <span className="text-sm dark:text-gray-400">
                        {[...Array(rating)].map((_, i) => (
                          <FaStar key={i} className="inline text-yellow-400 text-xs" />
                        ))}
                        {' '}& up
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <h3 className="font-semibold mb-3 dark:text-white">Availability</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm dark:text-gray-400">In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({ search: '', category: '', priceRange: [0, 100000], sortBy: 'newest', rating: 0, inStock: false, page: 1, limit: 12 })}
                className="w-full text-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden flex items-center gap-2 text-blue-600"
                >
                  <FaFilter /> Filters
                </button>

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none dark:bg-gray-700 dark:text-white"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <FaThList />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">
                  <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No products found</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                  >
                    <Link href={`/products/${product._id}`} className={viewMode === 'list' ? 'flex gap-4 p-4' : 'block'}>
                      {/* Image */}
                      <div className={`${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'w-full h-48'} bg-gray-200 dark:bg-gray-700`}></div>

                      {/* Content */}
                      <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
                        <h3 className="font-bold dark:text-white truncate">{product.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                          Demo Product
                        </p>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < 4 ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">(128 reviews)</span>
                        </div>

                        <div className={`flex justify-between items-center ${viewMode === 'list' ? 'flex-col items-start gap-3' : ''}`}>
                          <span className="text-blue-600 font-bold text-lg">₹{product.finalPrice || 0}</span>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(3)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleFilterChange('page', filters.page + i)}
                    className={`px-4 py-2 border rounded-lg ${filters.page === filters.page + i ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {filters.page + i}
                  </button>
                ))}
                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
