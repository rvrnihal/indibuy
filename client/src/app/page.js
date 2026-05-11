'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaBox, FaTruck, FaUsers, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=8`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?limit=6`)
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      if (productsData.success) setProducts(productsData.data || []);
      if (categoriesData.success) setCategories(categoriesData.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${searchQuery}`;
    }
  };

  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  const stats = [
    { icon: FaBox, label: '50K+ Products', value: '50,000' },
    { icon: FaUsers, label: 'Trusted Vendors', value: '2,500+' },
    { icon: FaTruck, label: 'Orders Shipped', value: '1M+' },
    { icon: FaStar, label: 'Customer Rating', value: '4.8/5' }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Factory Owner',
      comment: 'IndiBuy has transformed our procurement process. Amazing quality products!',
      rating: 5
    },
    {
      name: 'Priya Singh',
      role: 'Contractor',
      comment: 'Best prices and fastest delivery. Highly recommended!',
      rating: 5
    },
    {
      name: 'Amit Patel',
      role: 'Distributor',
      comment: 'Excellent vendor network. Perfect for bulk orders.',
      rating: 4.5
    }
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">IndiBuy</Link>
          <div className="hidden md:flex gap-6">
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <Link href="/vendors" className="hover:text-blue-600">Vendors</Link>
            <Link href="/about" className="hover:text-blue-600">About</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Industrial & Construction Marketplace
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Connect with 50,000+ verified suppliers. Find everything you need for your business.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2 bg-white rounded-lg p-2 shadow-lg">
              <input
                type="text"
                placeholder="Search products, categories, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 outline-none text-gray-800"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-semibold"
              >
                <FaSearch className="inline mr-2" /> Search
              </button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products?category=steel" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Steel & Iron</Link>
            <Link href="/products?category=electrical" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Electrical</Link>
            <Link href="/products?category=machinery" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Machinery</Link>
            <Link href="/products?category=construction" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Construction</Link>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <motion.div
                  key={cat._id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center shadow hover:shadow-lg transition cursor-pointer"
                >
                  <Link href={`/products?category=${cat._id}`}>
                    <h3 className="font-semibold dark:text-white">{cat.name}</h3>
                  </Link>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">Loading categories...</p>
            )}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 dark:text-white">Trending Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition overflow-hidden"
                >
                  <Link href={`/products/${product._id}`}>
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-4">
                      <h3 className="font-bold dark:text-white truncate">{product.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Demo Product</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-bold">₹{product.finalPrice || 0}</span>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span className="text-sm dark:text-gray-400 ml-1">4.5</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">Loading products...</p>
            )}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center shadow"
                >
                  <Icon className="text-4xl text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold dark:text-white">{stat.value}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow hover:shadow-lg transition"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">"{testimonial.comment}"</p>
                <div>
                  <h4 className="font-bold dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-blue-600 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6 text-blue-100">Get the latest deals, new products, and industry updates.</p>
          <form onSubmit={handleNewsletterSignup} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded text-gray-800"
              />
              <button
                type="submit"
                className="bg-blue-800 hover:bg-blue-900 px-6 py-3 rounded font-semibold"
              >
                Subscribe
              </button>
            </div>
          </form>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <FaBox className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2 dark:text-white">Wide Selection</h3>
              <p className="text-gray-600 dark:text-gray-400">50,000+ industrial products</p>
            </div>
            <div className="text-center">
              <FaTruck className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2 dark:text-white">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">Express shipping available</p>
            </div>
            <div className="text-center">
              <FaStar className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2 dark:text-white">Quality Verified</h3>
              <p className="text-gray-600 dark:text-gray-400">Certified vendors only</p>
            </div>
            <div className="text-center">
              <FaUsers className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2 dark:text-white">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-400">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">About IndiBuy</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Policies</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                <li><Link href="/return" className="hover:text-white">Return Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Follow Us</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 IndiBuy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
